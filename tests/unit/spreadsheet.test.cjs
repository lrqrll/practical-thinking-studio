'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const sheet = require('../../spreadsheet-model.js');
const FIRST = 'sheet-1';
const entry = input => ({input, format:'general', bold:false, italic:false});
const put = (book, key, input, style, id = FIRST) => sheet.setCell(book, id, key, input, style);
function workbook(cells = {}) {
  const book = sheet.create();
  for (const [key, input] of Object.entries(cells)) book.sheets[0].cells[key] = entry(input);
  return book;
}
const result = (book, key, id = FIRST) => sheet.calculate(book).get(id, key);
const value = (book, key, expected, id = FIRST) => assert.deepEqual(result(book, key, id), {value:expected, error:null});
const error = (book, key, expected, id = FIRST) => assert.deepEqual(result(book, key, id), {value:null, error:expected});

test('blank workbooks are independent valid JSON records', () => {
  const first = sheet.create(), second = sheet.create();
  assert.equal(sheet.valid(first), true);
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first);
  first.sheets[0].cells.A1 = entry('changed');
  assert.deepEqual(second.sheets[0].cells, {});
  value(second, 'A1', '');
  assert.equal(Object.isFrozen(sheet), true);
  assert.equal(Object.isFrozen(sheet.LIMITS), true);
});

test('column and address boundaries normalize references without coercing objects', () => {
  for (const [index, name] of [[0,'A'], [25,'Z'], [26,'AA'], [99,'CV']]) assert.equal(sheet.columnName(index), name);
  assert.deepEqual(sheet.address('$cv$1000'), {row:999, column:99, key:'CV1000'});
  assert.deepEqual(sheet.address('a1'), {row:0, column:0, key:'A1'});
  for (const invalid of [-1, 100, 0.5, NaN, '0']) assert.throws(() => sheet.columnName(invalid));
  for (const invalid of ['CW1', 'A1001', 'A0', 'A01', 'AAAA1', ' A1', 'A1 ', '', null, 1, Symbol('A1'), {toString() {throw Error('coercion');}}]) {
    assert.equal(sheet.address(invalid), null);
  }
});

test('immutable edits preserve independent sheets, workbooks and JSON roundtrips', () => {
  const original = put(sheet.create(), 'A1', '12');
  const withSheet = sheet.addSheet(original, 'sales', 'Sales');
  const edited = put(withSheet, 'A1', '99', undefined, 'sales');
  assert.equal(original.sheets.length, 1);
  assert.equal(withSheet.activeSheet, 'sales');
  value(withSheet, 'A1', '', 'sales');
  value(edited, 'A1', 12);
  value(edited, 'A1', 99, 'sales');
  const restored = JSON.parse(JSON.stringify(edited));
  assert.equal(sheet.valid(restored), true);
  assert.deepEqual(restored, edited);
  restored.sheets[0].cells.A1.input = 'mutated';
  edited.sheets[1].cells.A1.input = 'changed';
  value(original, 'A1', 12);
  value(edited, 'A1', 12);
  value(withSheet, 'A1', '', 'sales');
});

test('styles have explicit defaults, preserve omitted fields and retain styled blank cells', () => {
  let book = put(sheet.create(), '$a$1', '12');
  assert.deepEqual(book.sheets[0].cells.A1, entry('12'));
  for (const format of ['general','number','currency','percent']) {
    book = put(book, 'A1', '=1/4', {format, bold:true});
    assert.equal(book.sheets[0].cells.A1.format, format);
    value(book, 'A1', 0.25);
  }
  book = put(book, 'A1', '', {italic:true});
  assert.deepEqual(book.sheets[0].cells.A1, {input:'', format:'percent', bold:true, italic:true});
  book = put(book, 'A1', '', {format:'general', bold:false, italic:false});
  assert.equal(Object.hasOwn(book.sheets[0].cells, 'A1'), false);
  for (const style of [null, [], {format:'date'}, {bold:1}, {italic:null}, {format:undefined}, {color:'red'}, new Date()]) {
    assert.throws(() => put(book, 'A1', 'x', style));
  }
  const accessor = Object.defineProperty({}, 'bold', {enumerable:true, get() {throw Error('must not execute');}});
  assert.throws(() => put(book, 'A1', 'x', accessor), /無效/);
});

test('sheet names and IDs are validated, unique and bounded', () => {
  const book = sheet.addSheet(sheet.create(), 'abc-123', "O'Brien");
  assert.equal(sheet.valid(book), true);
  for (const id of ['', 'bad id', '_id', 'x'.repeat(65), FIRST, null, 1]) assert.throws(() => sheet.addSheet(book, id, 'New'));
  for (const name of ['', ' leading', 'trailing ', "'quoted", "quoted'", 'a'.repeat(32), 'a/b', 'a\\b', 'a:b', 'a!b', 'a?b', 'a*b', '[a]', 'a\n', 'a\x7f', null, 3, "o'BRIEN"]) {
    assert.throws(() => sheet.addSheet(book, 'new', name));
  }
  let full = sheet.create();
  for (let i = 1; i < sheet.LIMITS.sheets; i++) full = sheet.addSheet(full, `s-${i}`, `S ${i}`);
  assert.equal(sheet.valid(full), true);
  assert.throws(() => sheet.addSheet(full, 'extra', 'Extra'));
});

test('validation rejects unknown fields, accessors, nonplain records and malformed arrays', () => {
  const invalid = [null, {}, [], new Date(), {...sheet.create(), extra:true}];
  const mutate = fn => {const book = workbook({A1:'1'}); fn(book); invalid.push(book);};
  mutate(b => {b.activeSheet = 'missing';});
  mutate(b => {b.version = 2;});
  mutate(b => {b.sheets[0].extra = true;});
  mutate(b => {b.sheets[0].cells.A1.extra = true;});
  mutate(b => {b.sheets[0].cells.A1 = Object.assign(new Date(), entry('1'));});
  mutate(b => {b.sheets[0].cells = [];});
  mutate(b => {b.sheets[0].cells.a1 = b.sheets[0].cells.A1;});
  mutate(b => {b.sheets[0].cells['$A$1'] = entry('1');});
  mutate(b => {b.sheets[0].cells.A1.input = 1;});
  mutate(b => {b.sheets[0].cells.A1.format = 'unknown';});
  mutate(b => {b.sheets[0].cells.A1.bold = 'true';});
  mutate(b => {b.sheets[0].cells.A1.italic = null;});
  mutate(b => {b.sheets[0].cells.A1 = ['1'];});
  mutate(b => {Object.setPrototypeOf(b.sheets[0].cells.A1, {custom:true});});
  mutate(b => {b.sheets.extra = true;});
  mutate(b => {b.sheets.length = 2;});
  mutate(b => {b.sheets[0].cells[Symbol('cell')] = entry('1');});
  mutate(b => {Object.defineProperty(b, 'hidden', {value:true});});
  let reads = 0;
  mutate(b => {Object.defineProperty(b.sheets[0].cells.A1, 'input', {enumerable:true, get() {reads++; return '1';}});});
  mutate(b => {Object.defineProperty(b.sheets[0].cells, 'B1', {enumerable:true, get() {reads++; return entry('1');}});});
  mutate(b => {Object.defineProperty(b.sheets[0], 'name', {enumerable:true, get() {reads++; return 'Sheet';}});});
  for (const book of invalid) {
    assert.equal(sheet.valid(book), false);
    assert.throws(() => sheet.calculate(book), /無效/);
  }
  assert.equal(reads, 0);
});

test('dimensions, sparse cell totals and input lengths enforce workbook limits', () => {
  for (const [field, values] of [['rows', [0,1001,1.5,'2']], ['columns', [0,101,1.5,'2']]]) {
    for (const bad of values) {const book = sheet.create(); book.sheets[0][field] = bad; assert.equal(sheet.valid(book), false);}
  }
  let book = sheet.create();
  book.sheets[0].rows = 1000; book.sheets[0].columns = 100;
  book = put(book, 'CV1000', 'x'.repeat(sheet.LIMITS.input));
  assert.equal(sheet.valid(book), true);
  assert.throws(() => put(book, 'A1', 'x'.repeat(sheet.LIMITS.input + 1)));
  assert.throws(() => put(book, 'CW1', '1'));
  assert.throws(() => put(sheet.create(), 'AA1', '1'));
  assert.throws(() => put(book, 'A1', '1', {}, 'missing'));
  for (let i = 0; i < sheet.LIMITS.cells; i++) book.sheets[0].cells[`${sheet.columnName(i % 100)}${Math.floor(i / 100) + 1}`] = entry('1');
  // The existing far-corner cell counts toward the total too.
  assert.equal(sheet.valid(book), false);
  delete book.sheets[0].cells.CV1000;
  assert.equal(sheet.valid(book), true);
  assert.throws(() => put(book, 'A201', '1'));
  assert.equal(sheet.valid(book), true);
  const two = sheet.addSheet(book, 'extra', 'Extra');
  two.sheets[1].cells.A1 = entry('1');
  assert.equal(sheet.valid(two), false);
});

test('reads and formula references respect declared sheet dimensions', () => {
  const book = workbook({A1:'=AA1', A2:'=SUM(A1:AA2)', A3:'=A101', A4:'=SUM(B1:B101)'});
  const calc = sheet.calculate(book);
  for (const key of ['AA1','A101','CW1','A0',null]) assert.deepEqual(calc.get(FIRST, key), {value:null,error:'#REF!'});
  assert.deepEqual(calc.get('missing','A1'), {value:null,error:'#REF!'});
  for (const key of ['A1','A2','A3','A4']) assert.deepEqual(calc.get(FIRST,key), {value:null,error:'#REF!'});
  assert.deepEqual(calc.get(FIRST,'B1'), {value:'',error:null});
});

test('numbers, quoted literal inputs and strings retain their intended types', () => {
  const book = workbook({A1:' 1.25e2 ', A2:"'0012", A3:"'=SUM(1,2)", A4:'hello', A5:'', A6:'=TRUE', A7:'=FALSE', A8:'="a""b"', A9:'1e999'});
  for (const [key, expected] of [['A1',125],['A2','0012'],['A3','=SUM(1,2)'],['A4','hello'],['A5',''],['A6',true],['A7',false],['A8','a"b']]) value(book,key,expected);
  error(book,'A9','#NUM!');
});

test('arithmetic obeys precedence, associativity, unary signs and scalar coercion', () => {
  const formulas = new Map([
    ['=1+2*3',7], ['=(1+2)*3',9], ['=20/5/2',2], ['=10-3-2',5], ['=2^3^2',64],
    ['=-2^2',4], ['=(-2)^2',4], ['=2^-2',0.25], ['=2*-3+4',-2], ['=--2',2],
    ['=+2+.5',2.5], ['="2"+TRUE',3], ['=A10+1',1], ['=1e2 + 2E-1',100.2]
  ]);
  for (const [formula, expected] of formulas) value(workbook({A1:formula}),'A1',expected);
  for (const [formula, expected] of [['=1/0','#DIV/0!'],['="abc"+1','#VALUE!'],['=1e999','#NUM!'],['=10^999','#NUM!'],['=(-1)^.5','#NUM!'],['=A2:A3+1','#VALUE!']]) {
    error(workbook({A1:formula}),'A1',expected);
  }
});

test('concatenation and comparisons use scalar values and case-insensitive text', () => {
  for (const [formula, expected] of [
    ['="Hello"&" "&"world"','Hello world'], ['="sum="&1+2','sum=3'], ['="A"="a"',true],
    ['="a"<>"B"',true], ['=2<3',true], ['=2<=2',true], ['=3>2',true], ['=3>=3',true], ['=2=3',false], ['="2"=2',false]
  ]) value(workbook({A1:formula}), 'A1', expected);
  error(workbook({A1:'=A2:A3&"x"'}),'A1','#VALUE!');
});

test('aggregates include only numeric values and handle empty input deterministically', () => {
  const book = workbook({A1:'2', A2:'4', A3:"'8", A4:'=TRUE', A5:'text', A7:'=SUM(A1:A6,3)', A8:'=AVERAGE(A1:A6)', A9:'=MIN(A1:A6)', A10:'=MAX(A1:A6)', A11:'=COUNT(A1:A6)'});
  for (const [key, expected] of [['A7',9],['A8',3],['A9',2],['A10',4],['A11',2]]) value(book,key,expected);
  for (const [formula, expected] of [['=SUM()',0],['=MIN()',0],['=MAX()',0],['=COUNT()',0],['=SUM("2",TRUE)',0]]) value(workbook({A1:formula}),'A1',expected);
  error(workbook({A1:'=AVERAGE()'}),'A1','#DIV/0!');
  error(workbook({A1:'=SUM(A2:A3)', A2:'=1/0'}),'A1','#DIV/0!');
});

test('reversed, absolute and cross-sheet ranges use the correct sheet', () => {
  let book = workbook({A1:'100', B1:'200', A2:'300', B2:'400'});
  book = sheet.addSheet(book, 'data', 'Data');
  for (const [key, input] of Object.entries({A1:'1', B1:'2', A2:'3', B2:'4', C1:'=SUM($B$2:$A$1)', C2:'=SUM(工作表1!B2:A1)', C3:'=SUM(data!B2:A1)'})) book = put(book,key,input,undefined,'data');
  book = put(book,'C1','=SUM(Data!$B$2:$A$1)');
  value(book,'C1',10);
  value(book,'C1',10,'data');
  value(book,'C2',1000,'data');
  value(book,'C3',10,'data');
});

test('default and Unicode sheet names support unquoted references', () => {
  let book = sheet.addSheet(workbook({A1:'7'}), 'data', '資料_2026');
  book = put(book, 'A1', '=工作表1!A1', undefined, 'data');
  book = put(book, 'A2', '3', undefined, 'data');
  book = put(book, 'B1', '=SUM(資料_2026!A1:A2)');
  value(book, 'B1', 10);
  value(book, 'A1', 7, 'data');
});

test('quoted sheet names support spaces, apostrophes and case-insensitive lookup', () => {
  let book = sheet.addSheet(sheet.create(), 'sales', "O'Brien Sales");
  book = put(book,'A1','7',undefined,'sales');
  book = put(book,'A2','5',undefined,'sales');
  book = put(book,'A1',"='o''brien sales'!$A$1+SUM('O''Brien Sales'!A2:A1)");
  value(book,'A1',19);
  error(put(book,'A2',"='Missing sheet'!A1"),'A2','#REF!');
});

test('IF is lazy for errors, unknown names and direct/self/cross-sheet dependencies', () => {
  let book = workbook({A1:'=IF(FALSE,1/0,42)', A2:'=IF(TRUE,7,UNKNOWN(1))', A3:'=IF(0,A3,9)', A4:'=IF(2,3,Missing!A1)', A5:'=IF("text",1,2)', A6:'=IF(TRUE,1)', A7:'=IF(FALSE,1,2,3)', A8:'=IF(FALSE,AVERAGE(),5)', A9:'=IF(A10,1,2)'});
  for (const [key, expected] of [['A1',42],['A2',7],['A3',9],['A4',3],['A8',5],['A9',2]]) value(book,key,expected);
  for (const key of ['A5','A6','A7']) error(book,key,'#VALUE!');
  book = sheet.addSheet(book,'other','Other');
  book = put(book,'A1','=工作表1!A1',undefined,'other');
  book = put(book,'A1','=IF(FALSE,Other!A1,8)');
  value(book,'A1',8);
  value(book,'A1',8,'other');
});

test('calculation sessions snapshot uncached and cached values from all sheets', () => {
  let book = sheet.addSheet(workbook({A1:'2', B1:'=A1+1'}),'data','Data');
  book = put(book,'A1','=工作表1!A1+10',undefined,'data');
  const calc = sheet.calculate(book);
  book.sheets[0].cells.A1.input = '100';
  book.sheets[1].name = 'Renamed';
  book.sheets[1].cells.A1.input = '0';
  assert.deepEqual(calc.get('data','A1'), {value:12,error:null});
  assert.deepEqual(calc.get(FIRST,'B1'), {value:3,error:null});
  book.sheets[0].cells.B1.input = '1000';
  assert.deepEqual(calc.get(FIRST,'B1'), {value:3,error:null});
  assert.deepEqual(calc.get(FIRST,'A1'), {value:2,error:null});
  const returned = calc.get(FIRST,'B1'); returned.value = 'changed';
  assert.deepEqual(calc.get(FIRST,'B1'), {value:3,error:null});
});

test('edits recalculate dependent formulas in new sessions and preserve earlier sessions', () => {
  const book = workbook({A1:'2', B1:'=A1*3', C1:'=B1+1'});
  const original = sheet.calculate(book);
  assert.deepEqual(original.get(FIRST,'C1'), {value:7,error:null});
  const edited = put(book,'A1','5');
  value(edited,'C1',16);
  assert.deepEqual(original.get(FIRST,'C1'), {value:7,error:null});
  const formulaEdit = put(edited,'B1','=A1*4');
  value(formulaEdit,'C1',21);
  value(edited,'C1',16);
});

test('direct, indirect and cross-sheet cycles produce stable errors without blocking valid reads', () => {
  let book = workbook({A1:'=A1', A2:'=A3', A3:'=A2', B1:'7', C1:'=A2+1'});
  book = sheet.addSheet(book,'other','Other');
  book = put(book,'D1','=Other!A1');
  book = put(book,'A1','=工作表1!D1',undefined,'other');
  const calc = sheet.calculate(book);
  for (const key of ['A1','A2','A3','C1','D1']) assert.deepEqual(calc.get(FIRST,key), {value:null,error:'#CYCLE!'});
  assert.deepEqual(calc.get('other','A1'), {value:null,error:'#CYCLE!'});
  assert.deepEqual(calc.get(FIRST,'B1'), {value:7,error:null});
  value(put(book,'A3','3'),'C1',4);
});

test('syntax, name, reference and numeric errors do not block subsequent valid reads', () => {
  const cases = [
    ['=','#ERROR!'], ['=1+','#ERROR!'], ['=(1+2','#ERROR!'], ['=SUM(,1)','#ERROR!'], ['=SUM(1,)','#ERROR!'], ['=SUM(1,,2)','#ERROR!'],
    ['=1 2','#ERROR!'], ['="unterminated','#ERROR!'], ['=A1!','#ERROR!'], ["='Sheet'",'#ERROR!'], ['=Unknown','#NAME?'],
    ['=ABS(-1)','#NAME?'], ['=ZZ9999','#REF!'], ['=A0','#REF!'], ['=Missing!A1','#REF!'], ['=A2:A3','#VALUE!'],
    ['=1/0','#DIV/0!'], ['=1e999','#NUM!'], ['="word"*2','#VALUE!']
  ];
  for (const [formula, expected] of cases) {
    const calc = sheet.calculate(workbook({A1:formula, B1:'=2+3'}));
    assert.deepEqual(calc.get(FIRST,'A1'), {value:null,error:expected}, formula);
    assert.deepEqual(calc.get(FIRST,'B1'), {value:5,error:null}, formula);
    assert.deepEqual(calc.get(FIRST,'A1'), {value:null,error:expected}, formula);
  }
});

test('executable-looking input is parsed as data and never invokes global code', () => {
  let executions = 0;
  const context = vm.createContext({structuredClone, tripwire() {executions++;}});
  vm.runInContext(fs.readFileSync(require.resolve('../../spreadsheet-model.js'),'utf8'), context);
  const hostile = ['=tripwire()', '=globalThis.tripwire()', '=constructor.constructor("tripwire()")()', '=1;tripwire()', '=(()=>tripwire())()', '=this["tripwire"]()', '=__proto__', '=process.exit()'];
  for (const input of hostile) {
    const outcome = vm.runInContext(`(() => { const b = NexusSpreadsheet.setCell(NexusSpreadsheet.create(), 'sheet-1', 'A1', ${JSON.stringify(input)}); return NexusSpreadsheet.calculate(b).get('sheet-1','A1'); })()`, context);
    assert.equal(outcome.value, null);
    assert.match(outcome.error, /^#(?:NAME\?|ERROR!)$/);
  }
  assert.equal(executions, 0);
  value(workbook({A1:'="tripwire()"'}),'A1','tripwire()');
  // The interpreter also functions with dynamic code generation disabled by CSP.
  const locked = vm.createContext({structuredClone}, {codeGeneration:{strings:false, wasm:false}});
  vm.runInContext(fs.readFileSync(require.resolve('../../spreadsheet-model.js'),'utf8'), locked);
  assert.equal(vm.runInContext("NexusSpreadsheet.calculate(NexusSpreadsheet.setCell(NexusSpreadsheet.create(),'sheet-1','A1','=SUM(1,2)')).get('sheet-1','A1').value",locked),3);
});

test('formula length and nested syntax/AST depth failures are bounded and leave sessions usable', () => {
  for (const formula of [
    '=' + '1+'.repeat(256) + '1',
    '=' + '('.repeat(70) + '1' + ')'.repeat(70),
    '=' + '1^'.repeat(70) + '1',
    '=' + '-'.repeat(70) + '1',
    '=' + '1+'.repeat(100) + '1'
  ]) {
    const calc = sheet.calculate(workbook({A1:formula,B1:'42'}));
    assert.deepEqual(calc.get(FIRST,'A1'), {value:null,error:'#LIMIT!'});
    assert.deepEqual(calc.get(FIRST,'B1'), {value:42,error:null});
  }
  value(workbook({A1:'=1' + ' '.repeat(sheet.LIMITS.formula - 2)}),'A1',1);
});

test('a depth-limited dependency does not poison a later independently affordable read', () => {
  const book = sheet.create();
  for (let row = 1; row < 45; row++) book.sheets[0].cells[`A${row}`] = entry(`=A${row + 1}`);
  book.sheets[0].cells.A45 = entry('17');
  const calc = sheet.calculate(book);
  assert.deepEqual(calc.get(FIRST,'A1'), {value:null,error:'#LIMIT!'});
  assert.deepEqual(calc.get(FIRST,'A30'), {value:17,error:null});
  assert.deepEqual(calc.get(FIRST,'A45'), {value:17,error:null});
});

test('a step-limited dependency does not poison later affordable reads or leave visiting state', () => {
  const book = workbook({A1:'=SUM(B1:K600)+M1', M1:'=SUM(N1:W600)', X1:'=M1+7'});
  book.sheets[0].rows = 1000;
  const calc = sheet.calculate(book);
  assert.deepEqual(calc.get(FIRST,'A1'), {value:null,error:'#LIMIT!'});
  assert.deepEqual(calc.get(FIRST,'M1'), {value:0,error:null});
  assert.deepEqual(calc.get(FIRST,'X1'), {value:7,error:null});
  assert.deepEqual(calc.get(FIRST,'A1'), {value:0,error:null});
});

test('exponential text growth is rejected before concatenation while affordable results remain available', () => {
  const book = workbook({A1:'x'});
  for (let row = 2; row <= 17; row++) book.sheets[0].cells[`A${row}`] = entry(`=A${row - 1}&A${row - 1}`);
  const calc = sheet.calculate(book);
  assert.deepEqual(calc.get(FIRST,'A17'), {value:null,error:'#LIMIT!'});
  const accepted = calc.get(FIRST,'A16');
  assert.equal(accepted.error, null);
  assert.equal(accepted.value.length, sheet.LIMITS.text);
  assert.deepEqual(calc.get(FIRST,'A10'), {value:'x'.repeat(512),error:null});
  assert.deepEqual(calc.get(FIRST,'A17'), {value:null,error:'#LIMIT!'});
});
