'use strict';
const TOOL_CATEGORIES=Object.freeze(['專案','財務','文件','行政','素材']);
const WORK_TOOLS=[
{id:'notes',name:'備忘錄',group:'行政',desc:'記錄文字、清單與圖片。',icon:'<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>'},
{id:'asset',name:'圖片與截圖',group:'素材',desc:'收集圖片、裁切與標註。',icon:'<path d="M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6"/><circle cx="16" cy="8" r="1"/>'},
{id:'tasks',name:'任務管理',group:'專案',desc:'安排任務、負責人與期限。',icon:'<path d="M9 6h11M9 12h11M9 18h11M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2"/>'},
{id:'budget',name:'預算試算',group:'財務',desc:'計算成本、利潤與兩平人數。',icon:'<rect x="5" y="2" width="14" height="20" rx="1"/><path d="M8 6h8M8 11h2m4 0h2M8 15h2m4 0h2M8 19h2m4 0h2"/>'},
{id:'quotes',name:'報價比較',group:'財務',desc:'比較費用、範圍與交期。',icon:'<path d="M5 3h5v18H5zM14 3h5v18h-5zM7 7h1m-1 4h1m-1 4h1m8-8h1m-1 4h1m-1 4h1"/>'},
{id:'slides',name:'簡報大綱',group:'文件',desc:'整理提案結論與支持證據。',icon:'<path d="M3 4h18v13H3zM12 17v5m-4 0 4-5 4 5M7 9h10M7 13h6"/>'},
{id:'report',name:'工作報告',group:'行政',desc:'說清現況、影響與所需決策。',icon:'<path d="M4 3h16v14H9l-5 4zM8 7h8M8 11h6"/>'},
{id:'minutes',name:'會議紀錄',group:'行政',desc:'留下決議、待確認與行動。',icon:'<path d="M8 3H4v19h16V3h-4M8 2h8v4H8zM8 11h8M8 15h8M8 19h5"/>'}];
