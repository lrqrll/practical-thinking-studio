# M3.4 視覺與工作台 UX 候選

使用者本輪明確批准實作／測試／PR／隔離預覽，取代舊黑白灰限制；不含main合併、正式部署、auto-merge或後續里程碑。基線#26 af4d6b6bb399ac8eef47a0856d8135754b8dc870（base #25 a0ae51c2cbb885a3afcbbfc2f9e1804d918f96fc，#24 394acbfb1bb8e30041b440e0b3267a57ec9e51d0），遠端均重新核對未變。正式main仍78e90aec61ca825d45534c93515df4d8f949a431／3.4.0。M3.3有界開發者證據不代表完整Work獨立操作驗收完成。

## 可操作改版

- visual-system.css保留KON/RURI/SORA/SEIJI/TOKIWA/WAKATAKE/FUJI/SUMIRE/FUJINEZUMI九原色，以品牌、互動、成功、輔助與資料色語意token使用；配色參考使用者提供的nipponcolors，不擷取第三方圖片／字型或新增外部資源依賴。
- 暖白中性淺色、炭灰藍深色；16px正文、統一間距／按鈕／列表／表格／對話框。紙張仍維持白底，呈現匯出文件的實際內容色；編輯器外框與工具列隨主題。
- 桌面232px側邊欄可收合；手機使用可關閉的導覽選單，Escape與Tab焦點控制、目前頁ARIA選取、圖示與文字。收合與專注是當頁顯示狀態，不新增持久配置。
- #dashboard為首頁：真實openedAt文件、最近更新工作台、快速開始與原工具最近／最愛。沒有虛構數字；側邊「本次最近工作台」僅記錄本分頁實際開啟紀錄，不冒稱跨次數據。
- #data與#toolbox分開顯示既有檔案／工具UI，沿用原事件與分類搜尋；#work相容入口保留。工作台卡片與列表沿用M3.3的原關聯、有效數及固定工具順序，不新增自訂排序／隱藏設定。
- 原九工具共用頁首與保存狀態保留；工作台來源文字清楚；專注模式只切CSS、不重建編輯器或重載資料。手機可收合文件格式工具，表格／紙張在自身區域水平捲動。

## 資料契約

DB2、三stores、layout schema1、v1-v4備份完全不變，沒有資料遷移／來源內容批次改寫。僅沿用現有meta/settings.theme增加system顯示選項，舊light/dark原值保留；transaction內合併settings保護未知屬性。不變更既有備份格式，外觀仍是本瀏覽器偏好，不冒稱為內容備份。

系統外觀使用prefers-color-scheme事件，只更新effective theme；手動選擇保存成功後才套用，失敗保留原偏好與明確錯誤。主題／專注操作不經render、flush或file更新，實測DOM身分不變與保存重開。卡片顯示偏好若要持久化與納入備份，需另提最小契約並獲批准，本輪不實作。

## 驗收與原始界線

首次本機外觀案例4通過／1失敗：桌面設定連結的aria-label「設定」與可見「設定與外觀」不符，已改一致；後續四寬度／深淺／系統／專注與分類有界15通過。全部結果為開發者驗證，不是Work獨立QA；歷史skipped與M2-NAV-01完整獨立操作缺口保留。

舊測試原本以根路徑進入檔案工具列，改以明確#work測試原功能；新根首頁另有真實最近資料與跳轉測試，不刪斷言、不弱化資料比較。重用既有九工具保存重開、原生文件選取、PDF/DOCX/HTML/CSV/XLSX、選取備份／v4七包與完整還原、CAS/quota／草稿測試。字型沿用同站字型與CI既有CJK fallback。TLS驗證開、retries0、全新context／合成資料。

可重跑：npm ci --ignore-scripts；npm run test:unit；node scripts/qa/m33-legacy.cjs；NEXUS_CHROMIUM=/usr/bin/chromium npx playwright test（PDF解析需poppler）。自己的最終SHA HTTPS取證、PNG、下載hash、原始資產bytes與CI結果見本PR及.github/workflows/m34-visual.yml。

## 未做／未測

卡片自訂排序／隱藏（需契約）、跨台共用、完整智慧引導、進階統計、AI、OAuth、帳號／後端皆未實作，沒有假入口。Excel仍取消、預算XLSX保留、斜體入口不恢復，九工具與原採購台保留。桌面／390／360／768為Chromium視窗；真手機觸控、Safari/Firefox、完整螢幕閱讀器、OS選檔與Office/Calc未測。自動axe只代表已測頁面與規則，不是整體無障礙認證。

本機首次全站137pass／3fail／5條件skip：三處是新版本／新導覽的測試契約未更新（新程式仍期待3.7版本、定位已搬到側欄的header連結、只hash導航未重載而未套用預覽mock），不是已確認產品資料損毀。改明確3.8版本、新側欄實際操作及明確reload，三個針對性案例全通過；原斷言／舊3.6fixture保留。新增三種外觀的quota拒絕與未知settings保留驗證。最終自己的SHA全站結果另以CI為準，不把137+3寫成單輪全綠。

首輪自己的SHA CI40656270375發現真實顯示缺陷：主題切換時button/card背景色transition經過中間灰，而文字已切為新主題色，M2 390px對比瞬間降到4.18:1（需4.5:1）。移除背景色動畫，只保留邊框色回饋；不延後或停用axe、不拉低門檻。屬視覺對比問題，沒有資料遺失證據；修後同一M2主題操作有限重複驗證及新SHA完整CI另列。

另依實際390px編輯器截圖，將頁首名稱與檔案操作改為上下自然換行，避免五個檔案按鈕擠成右側高直欄；原按鈕／事件／保存狀態皆保留，未把功能藏掉。

中間CI40657088901另有範本fixture失敗，讀取原始trace後確認：sources helper在報價編輯器main仍inert／aria-busy=true時fill第一個廠商名稱，該筆輸入未進入欄位，後續成果按正確驗證拒絕「請填寫廠商1名稱」。不是已保存正文被改寫；原trace在獨立codex/nexus-m34-evidence分支留存。helper現先確認目標編輯器可見且既有ready條件成立，再逐欄fill並斷言原值；備忘來源同樣處理。不改產品載入鎖、不延長timeout、不刪後續成果／範本隔離斷言；刻意延遲／追加輸入的故障注入案例保留原流程。

補強helper時的首個本機版本漏了for區塊，三案因i未定義而在工具端中止，未形成產品結論；已改為明確區塊並保留逐欄原值斷言。就緒修正後，完整範本隔離流程有限重複3次，全數通過。該提交只有測試與紀錄差異，產品資產與c3f6adf相同（預覽SHA標記依工具提交更新）。

產品c3f6adf的完整回歸與原生選取通過，HTTPS專項僅新外觀／專注案例停在doc-save後立刻reload；其餘35案通過。該測試未等文件保存結束，觸發正常beforeunload而被取證dialog listener保留，並非已證實保存失敗。現核對dirty/pending/timer/saveError全解除及UI已保存後才reload；保留正文、粗體marks、DOM身分及重新開啟的全部斷言，不改產品保存／確認機制。修後自己的工具SHA以最後CI為準，中間測試提交不新增產品內容。
