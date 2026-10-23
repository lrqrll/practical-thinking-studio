'use strict';
// Pure, immutable-edit workbook core. No DOM, storage, network, eval or Function.
// This is a deliberately small formula subset, not Excel compatibility or an editor.
// Records contain only the documented JSON fields; styles never change raw inputs.
const NexusSpreadsheet = (() => {
  const LIMITS = Object.freeze({sheets: 20, rows: 1000, columns: 100, cells: 20000, input: 2048, formula: 512, text: 32768, steps: 20000, depth: 64});
  const FORMATS = new Set(['general', 'number', 'currency', 'percent']);
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  class FormulaError extends Error { constructor(code) { super(code); this.code = code; } }
  const fail = code => { throw new FormulaError(code); };

  // Reject accessors, hidden/symbol fields and custom prototypes, including on cells.
  function record(value, fields, optional = false) {
    if (!value || typeof value !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
    const keys = Reflect.ownKeys(value);
    return (optional || keys.length === fields.length) && keys.every(key => {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      return fields.includes(key) && descriptor.enumerable && own(descriptor, 'value');
    }) && (optional || fields.every(key => own(value, key)));
  }
  function list(value) {
    if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) return false;
    const keys = Reflect.ownKeys(value);
    return keys.length === value.length + 1 && keys.every(key => key === 'length' ||
      (/^(0|[1-9]\d*)$/.test(key) && Number(key) < value.length && Object.getOwnPropertyDescriptor(value, key).enumerable && own(Object.getOwnPropertyDescriptor(value, key), 'value')));
  }
  function columnName(index) {
    if (!Number.isInteger(index) || index < 0 || index >= LIMITS.columns) throw Error('欄超出範圍');
    let result = '';
    for (let n = index + 1; n; n = Math.floor((n - 1) / 26)) result = String.fromCharCode(65 + (n - 1) % 26) + result;
    return result;
  }
  function address(value) {
    if (typeof value !== 'string') return null;
    const match = /^\$?([A-Z]{1,3})\$?([1-9]\d{0,3})$/i.exec(value);
    if (!match) return null;
    let column = 0;
    for (const c of match[1].toUpperCase()) column = column * 26 + c.charCodeAt(0) - 64;
    const row = Number(match[2]) - 1;
    return column <= LIMITS.columns && row < LIMITS.rows ? {row, column: column - 1, key: `${columnName(column - 1)}${row + 1}`} : null;
  }
  function validName(name) {
    return typeof name === 'string' && name.trim() === name && name.length > 0 && name.length <= 31 &&
      !/[\[\]:*?/\\!\x00-\x1f\x7f]/.test(name) && !name.startsWith("'") && !name.endsWith("'");
  }
  function create() {
    return {version: 1, activeSheet: 'sheet-1', sheets: [{id: 'sheet-1', name: '工作表1', rows: 100, columns: 26, cells: {}}]};
  }
  function valid(book) {
    try {
      if (!record(book, ['version', 'activeSheet', 'sheets']) || book.version !== 1 || typeof book.activeSheet !== 'string' ||
          !list(book.sheets) || !book.sheets.length || book.sheets.length > LIMITS.sheets) return false;
      const ids = new Set(), names = new Set(); let total = 0;
      for (const sheet of book.sheets) {
        if (!record(sheet, ['id', 'name', 'rows', 'columns', 'cells']) || typeof sheet.id !== 'string' ||
            !/^[a-zA-Z0-9-]{1,64}$/.test(sheet.id) || ids.has(sheet.id) || !validName(sheet.name) || names.has(sheet.name.toLowerCase())) return false;
        ids.add(sheet.id); names.add(sheet.name.toLowerCase());
        if (!Number.isInteger(sheet.rows) || sheet.rows < 1 || sheet.rows > LIMITS.rows ||
            !Number.isInteger(sheet.columns) || sheet.columns < 1 || sheet.columns > LIMITS.columns) return false;
        if (!sheet.cells || typeof sheet.cells !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(sheet.cells))) return false;
        for (const key of Reflect.ownKeys(sheet.cells)) {
          const descriptor = Object.getOwnPropertyDescriptor(sheet.cells, key), at = address(key);
          if (++total > LIMITS.cells || !descriptor.enumerable || !own(descriptor, 'value') || !at || at.key !== key ||
              at.row >= sheet.rows || at.column >= sheet.columns) return false;
          const cell = descriptor.value;
          if (!record(cell, ['input', 'format', 'bold', 'italic']) || typeof cell.input !== 'string' || cell.input.length > LIMITS.input ||
              !FORMATS.has(cell.format) || typeof cell.bold !== 'boolean' || typeof cell.italic !== 'boolean') return false;
        }
      }
      return ids.has(book.activeSheet);
    } catch { return false; }
  }
  function requireBook(book) { if (!valid(book)) throw Error('無效或超出限制的試算表'); }
  function copyBook(book) {
    // Copy only validated schema fields into this realm; no shared records, inherited
    // serialization hooks or dependence on structuredClone's prototype behavior.
    return {version:book.version, activeSheet:book.activeSheet, sheets:book.sheets.map(sheet => ({
      id:sheet.id, name:sheet.name, rows:sheet.rows, columns:sheet.columns,
      cells:Object.fromEntries(Object.entries(sheet.cells).map(([key, cell]) => [key, {
        input:cell.input, format:cell.format, bold:cell.bold, italic:cell.italic
      }]))
    }))};
  }
  function setCell(book, sheetId, key, input, style = {}) {
    requireBook(book);
    const at = address(key), sheet = book.sheets.find(s => s.id === sheetId);
    if (!sheet || !at || at.row >= sheet.rows || at.column >= sheet.columns || typeof input !== 'string' || input.length > LIMITS.input ||
        !record(style, ['format', 'bold', 'italic'], true) || (own(style, 'format') && !FORMATS.has(style.format)) ||
        (own(style, 'bold') && typeof style.bold !== 'boolean') || (own(style, 'italic') && typeof style.italic !== 'boolean')) throw Error('無效的儲存格');
    const result = copyBook(book), target = result.sheets.find(s => s.id === sheetId);
    const previous = own(target.cells, at.key) ? target.cells[at.key] : {format: 'general', bold: false, italic: false};
    target.cells[at.key] = {input, format: own(style, 'format') ? style.format : previous.format,
      bold: own(style, 'bold') ? style.bold : previous.bold, italic: own(style, 'italic') ? style.italic : previous.italic};
    if (!input && target.cells[at.key].format === 'general' && !target.cells[at.key].bold && !target.cells[at.key].italic) delete target.cells[at.key];
    requireBook(result); return result;
  }
  function addSheet(book, id, name) {
    requireBook(book);
    const result = copyBook(book);
    result.sheets.push({id, name, rows: 100, columns: 26, cells: {}}); result.activeSheet = id;
    requireBook(result); return result;
  }

  // Grammar: literals, A1/$A$1 refs, Sheet!A1 or 'O''Brien'!A1, rectangular
  // Sheet!A1:B2 ranges (Unicode identifiers; quote spaces/punctuation), + - * / ^ & = <> < > <= >=, parentheses and commas.
  // Unary signs bind before power; power is left associative, then * /, + -, &,
  // comparisons. SUM/AVERAGE/MIN/MAX/COUNT include only numeric values; IF takes
  // three arguments and evaluates only its chosen branch (numeric/boolean condition).
  // Names and unsupported functions are #NAME?; no named ranges, arrays or 3D refs.
  function parse(formula) {
    if (formula.length > LIMITS.formula) fail('#LIMIT!');
    const source = formula.slice(1), tokens = []; let offset = 0;
    const pattern = /\s*(?:((?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)|("(?:[^"]|"")*")|('(?:[^']|'')*')|(\$?[\p{L}_][\p{L}\p{M}\p{N}_.$]*)|(<=|>=|<>|[+\-*/^(),:!&=<>]))/uy;
    while (offset < source.length) {
      if (!source.slice(offset).trim()) break;
      pattern.lastIndex = offset; const match = pattern.exec(source);
      if (!match) fail('#ERROR!');
      tokens.push(match[1] ? {kind:'number', value:Number(match[1])} : match[2] ? {kind:'string', value:match[2].slice(1,-1).replace(/""/g,'"')} :
        match[3] ? {kind:'sheet', value:match[3].slice(1,-1).replace(/''/g,"'")} : match[4] ? {kind:'word', value:match[4]} : {kind:match[5], value:match[5]});
      offset = pattern.lastIndex;
    }
    let position = 0;
    const peek = kind => tokens[position]?.kind === kind;
    const take = kind => { if (!peek(kind)) fail('#ERROR!'); return tokens[position++]; };
    const reference = value => {
      const result = address(value);
      if (!result) fail(/^\$?[A-Za-z]+\$?\d+$/.test(value) ? '#REF!' : '#NAME?');
      return result;
    };
    function primary(depth) {
      if (peek('+') || peek('-')) { const op = tokens[position++].kind; return {op:'unary', sign:op, value:expression(6, depth + 1)}; }
      if (peek('(')) { position++; const node = expression(0, depth + 1); take(')'); return node; }
      if (peek('number') || peek('string')) return {op:'literal', value:tokens[position++].value};
      if (!peek('word') && !peek('sheet')) fail('#ERROR!');
      const first = tokens[position++];
      if (peek('(') && first.kind === 'word') {
        position++; const args = [];
        if (!peek(')')) {
          args.push(expression(0, depth + 1));
          while (peek(',')) { position++; args.push(expression(0, depth + 1)); }
        }
        take(')'); return {op:'call', name:first.value.toUpperCase(), args};
      }
      if (first.kind === 'word' && /^(TRUE|FALSE)$/i.test(first.value) && !peek('!')) return {op:'literal', value:first.value.toUpperCase() === 'TRUE'};
      let sheet = null, ref = first.value;
      if (peek('!')) { position++; sheet = ref; ref = take('word').value; }
      else if (first.kind === 'sheet') fail('#ERROR!');
      const start = reference(ref);
      if (peek(':')) { position++; const end = reference(take('word').value); return {op:'range', sheet, start, end}; }
      return {op:'ref', sheet, key:start.key};
    }
    const precedence = {'=':1,'<>':1,'<':1,'>':1,'<=':1,'>=':1,'&':2,'+':3,'-':3,'*':4,'/':4,'^':5};
    function expression(minimum, depth = 1) {
      if (depth > LIMITS.depth) fail('#LIMIT!');
      let left = primary(depth);
      while (own(precedence, tokens[position]?.kind) && precedence[tokens[position].kind] >= minimum) {
        const op = tokens[position++].kind, level = precedence[op];
        left = {op:'binary', sign:op, left, right:expression(level + 1, depth + 1)};
      }
      return left;
    }
    const result = expression(0); if (position !== tokens.length) fail('#ERROR!'); return result;
  }
  function calculate(inputBook) {
    requireBook(inputBook);
    // Sessions own a snapshot: caller mutation or later immutable edits cannot leave
    // a partly cached session mixing values from different workbook revisions.
    const book = copyBook(inputBook), cache = new Map(), visiting = new Set(), parsed = new Map();
    let steps = 0, depth = 0;
    const tick = () => { if (++steps > LIMITS.steps) fail('#LIMIT!'); };
    const enter = () => { tick(); if (depth >= LIMITS.depth) fail('#LIMIT!'); depth++; };
    const number = value => {
      if (Array.isArray(value)) fail('#VALUE!');
      if (value === '' || value === null) return 0;
      if (typeof value === 'number') return value;
      if (typeof value === 'boolean') return Number(value);
      if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value);
      fail('#VALUE!');
    };
    const scalar = value => { if (Array.isArray(value)) fail('#VALUE!'); return value; };
    const finite = value => { if (typeof value === 'number' && !Number.isFinite(value)) fail('#NUM!'); return value; };
    function findSheet(node, current) {
      const sheet = node.sheet === null ? current : book.sheets.find(s => s.name.toLowerCase() === node.sheet.toLowerCase());
      if (!sheet) fail('#REF!'); return sheet;
    }
    function evaluate(node, sheet) {
      enter();
      try {
        if (node.op === 'literal') return finite(node.value);
        if (node.op === 'ref') return cell(findSheet(node, sheet), node.key);
        if (node.op === 'range') {
          const target = findSheet(node, sheet), values = [];
          const bottom = Math.max(node.start.row, node.end.row), right = Math.max(node.start.column, node.end.column);
          if (bottom >= target.rows || right >= target.columns) fail('#REF!');
          for (let r = Math.min(node.start.row, node.end.row); r <= bottom; r++) {
            for (let c = Math.min(node.start.column, node.end.column); c <= right; c++) { tick(); values.push(cell(target, `${columnName(c)}${r+1}`)); }
          }
          return values;
        }
        if (node.op === 'unary') return finite(number(evaluate(node.value, sheet)) * (node.sign === '-' ? -1 : 1));
        if (node.op === 'binary') {
          const left = scalar(evaluate(node.left, sheet)), right = scalar(evaluate(node.right, sheet));
          if (node.sign === '&') {
            const a = String(left), b = String(right);
            if (a.length + b.length > LIMITS.text) fail('#LIMIT!');
            return a + b;
          }
          if (['=','<>','<','>','<=','>='].includes(node.sign)) {
            const a = typeof left === 'string' ? left.toLowerCase() : left, b = typeof right === 'string' ? right.toLowerCase() : right;
            return ({'=':a === b,'<>':a !== b,'<':a < b,'>':a > b,'<=':a <= b,'>=':a >= b})[node.sign];
          }
          const a = number(left), b = number(right);
          if (node.sign === '/' && b === 0) fail('#DIV/0!');
          return finite(node.sign === '+' ? a+b : node.sign === '-' ? a-b : node.sign === '*' ? a*b : node.sign === '/' ? a/b : a**b);
        }
        if (node.op === 'call') {
          if (node.name === 'IF') {
            if (node.args.length !== 3) fail('#VALUE!');
            const condition = number(evaluate(node.args[0], sheet));
            return evaluate(node.args[condition !== 0 ? 1 : 2], sheet);
          }
          if (!['SUM','AVERAGE','MIN','MAX','COUNT'].includes(node.name)) fail('#NAME?');
          const values = node.args.flatMap(arg => { const value = evaluate(arg, sheet); return Array.isArray(value) ? value : [value]; });
          const numbers = values.filter(value => typeof value === 'number');
          if (node.name === 'COUNT') return numbers.length;
          if (node.name === 'AVERAGE' && !numbers.length) fail('#DIV/0!');
          return finite(node.name === 'SUM' ? numbers.reduce((a,b)=>a+b,0) : node.name === 'AVERAGE' ? numbers.reduce((a,b)=>a+b,0)/numbers.length :
            !numbers.length ? 0 : node.name === 'MIN' ? Math.min(...numbers) : Math.max(...numbers));
        }
        fail('#ERROR!');
      } finally { depth--; }
    }
    function cell(sheet, key) {
      enter();
      const identity = `${sheet.id}:${key}`; let added = false;
      try {
        const at = address(key);
        if (!at || at.row >= sheet.rows || at.column >= sheet.columns) fail('#REF!');
        if (cache.has(identity)) { const result = cache.get(identity); if (result instanceof FormulaError) throw result; return result; }
        if (visiting.has(identity)) fail('#CYCLE!');
        visiting.add(identity); added = true;
        const raw = own(sheet.cells, key) ? sheet.cells[key].input : '';
        let result;
        if (raw.startsWith('=')) {
          if (!parsed.has(raw)) parsed.set(raw, parse(raw));
          result = scalar(evaluate(parsed.get(raw), sheet));
        } else if (raw.startsWith("'")) result = raw.slice(1);
        else result = raw.trim() && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw.trim()) ? finite(Number(raw)) : raw;
        cache.set(identity, result); return result;
      } catch (error) {
        if (!(error instanceof FormulaError)) throw error;
        // Depth/step/text limits depend on the current request's budget. They must
        // never poison an otherwise affordable independent read of a dependency.
        if (error.code !== '#LIMIT!') cache.set(identity, error);
        throw error;
      } finally { if (added) visiting.delete(identity); depth--; }
    }
    return Object.freeze({get(sheetId, key) {
      const sheet = book.sheets.find(s => s.id === sheetId), at = address(key);
      if (!sheet || !at || at.row >= sheet.rows || at.column >= sheet.columns) return {value:null, error:'#REF!'};
      steps = 0;
      try { return {value:cell(sheet, at.key), error:null}; }
      catch (error) { if (!(error instanceof FormulaError)) throw error; return {value:null, error:error.code}; }
    }});
  }
  return Object.freeze({LIMITS, create, valid, address, columnName, setCell, addSheet, calculate});
})();
if (typeof module !== 'undefined' && module.exports) module.exports = NexusSpreadsheet;
