# 正式3.4.0：目前驗收狀態（2026-10-27）

產品main／正式提交 `78e90aec61ca825d45534c93515df4d8f949a431`，tree `bba3bb3c0ae02afbfcfbeeeb7cee63f216c086b1`；PR #15已一次合併並部署。文件[PR #16](https://github.com/lrqrll/practical-thinking-studio/pull/16)續作DOC-STATE-01／B維護線，仍為獨立文件候選；[工具PR #17](https://github.com/lrqrll/practical-thinking-studio/pull/17)仍開啟、未合併，工具head `ab0551364946fb11868cc6f5f309ef45dc2fe64d`，不改產品M。A／C已有實作及自己的候選驗證，待Work有界複審；以下正式M結果不能代表新功能候選驗收。

| 證據 | 實際狀態與界線 |
|---|---|
| [M main CI](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40428696084) | 開發者：25單元、93瀏覽器通過，1容量fixture分工skipped，15選取回歸、audit0；skip不算通過 |
| [M deployment verification](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40428696123)／[Pages](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40428695537) | 對應M成功；32公開資產符合M |
| [正式37項執行](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40430565458)／[後續補驗](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40430857549) | 保留36通過＋1失敗／後續1補驗通過，不寫成單輪全綠；正式產品未改 |
| Work第一輪獨立核對（使用者回報） | main／parents／tree、32資產兩輪與19純模型通過；當時不等於瀏覽器／IDB還原或M2-NAV-01獨立操作通過 |
| [舊工具41項](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40439317668) | 工具f737d0a616f283e5ddfc861205da0a706a22dfa8的41 Pass及原artifact保留，不與新42項相加；Work證據審查不等於親自重演 |
| [工具ab055136正式HTTPS](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40458178564) | 開發者驗證：42正式HTTPS Pass／0 Fail／0 skipped／retries=0；另列4工具控制Pass（3預期拒絕＋1正常），不算46項產品案例 |
| [相應Quality](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40458178558) | 開發者：25單元、99瀏覽器（含4控制）、15選取回歸通過，audit0；5條件skipped保留，不算通過，相應大集合已在正式42項實跑 |
| Work本輪結案（使用者明確回報） | 對ab055136獨立程式／證據審查42正式項與另列4控制，核對47 context／57 page、2,129資源、29下載的雜湊及映射，目視中文修後、保存等待追加、重開、混合格式；QA-FONT-01／QA-CONTEXT-01 CLOSED，未發現阻擋PR #17的P0／P1或其他明確問題。不是Work親自重演全部42個操作 |

[固定工具SHA的操作及取證說明](https://github.com/lrqrll/practical-thinking-studio/blob/ab0551364946fb11868cc6f5f309ef45dc2fe64d/docs/qa/3.4.0-hardening/README.md)與[原artifact 12713237645](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40458178564/artifacts/12713237645)保留；artifact須授權且有保存期限。完整資源／下載bytes及映射在逐案monitor-index；新功能沿用此監測，不另建重複框架。

QA-FONT-01為runner CJK fallback環境修正，非產品文字遺失或中文斜體字形修復；QA-CONTEXT-01為全context／page監測與工具負控制補強。兩項已結案，不重開全站42項測試專案。保留環境失敗：40456795105與40457556438的Azure字型下載逾時，產品案例未執行；40457032644雖42＋4通過，當時視覺日誌未輸出圖片，不冒稱當時已視覺驗收。舊CI失敗／skipped見下方歷史與PR #17。

M2-NAV-01仍未完整獨立操作，是驗收缺口；歷史產品風險及開發者修正證據保留，不寫成現行已確認未修P1，不無期限阻擋A。後續待辦的分級、驗收條件及回歸觸發見[已知問題](KNOWN-ISSUES.md)。只有已重現P0／P1或其他明確阻擋問題才阻擋受影響發布。

本輪有限授權A：M3.1文字成果組裝、B：文件維護、C：工時紀錄；實作／驗收範圍見[路線圖](../ROADMAP.md)，不代表整個M3／M4獲准，不含合併main、正式部署或auto-merge。B與A／C並行，只做文件diff、連結、SHA與狀態核對，不新增產品測試。新功能須對自己的候選SHA／隔離預覽驗收，不能用正式M的42項冒充。

未測／限制：Safari／Firefox、實機觸控、完整螢幕閱讀器、OS原生選檔、Office／Calc與中文斜體字形；舊資料僅經3.3.0驗證的合成資料，未碰真人設定檔。完整備份不含未保存草稿；格式、記憶體、配額與容量限制仍在。斜體入口退休、舊marks相容保留；Excel產品取消，預算及XLSX保留。

## 已交付候選與可操作預覽（開發者驗證，待Work有界複審）

正式仍3.4.0／M `78e90aec61ca825d45534c93515df4d8f949a431`；以下為3.5.0-rc.1隔離候選，不是main合併或正式部署，不再擴充其他M3功能。

| 線別 | 精確head及依賴 | 已實作／驗證與預覽 |
|---|---|---|
| [A／PR #18](https://github.com/lrqrll/practical-thinking-studio/pull/18) | `2ff102580ffa22f5f77f65ff54ef10e385597c8d`，base工具PR #17 `ab0551364946fb11868cc6f5f309ef45dc2fe64d` | 兩份來源挑選／排序→凍結已保存資料→普通document編輯／保存重開→真實DOCX／HTML下載；來源後改不連動。[預覽m31-assembly](https://lrqrll.github.io/practical-thinking-studio-preview/m31-assembly/)，namespace `m31-assembly` |
| [C／PR #19](https://github.com/lrqrll/practical-thinking-studio/pull/19) | `4992808262c81f12e21252b776384a517a130f68`，base A `2ff102580ffa22f5f77f65ff54ef10e385597c8d`；整合A開發分支保留歷史，index衝突以新增兩線入口處理 | 第九工具工時紀錄：整數分鐘合計、編輯／篩選／保存重開、真實CSV、版本化adapter及完整備份還原。[整合預覽m31](https://lrqrll.github.io/practical-thinking-studio-preview/m31/)，namespace `m31-integrated`／DB `nexus-preview-m31-integrated-workspace`；含A閉環 |

[A HTTPS 40462812589](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40462812589)成功：27 Pass／0 skipped，含5項舊格式／108MB分包真實下載／第二context還原回歸。[A Quality 40462812660](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40462812660)成功：31單元、104瀏覽器、15選取回歸、audit0，5條件skipped另列，不算通過。[C HTTPS 40463068703](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40463068703)成功：27組裝／舊文件／備份案例及另列5工時案例、37單元；[C Quality 40463068723](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40463068723)成功。以上皆開發者驗證，對應各候選SHA，不借正式M的42項替代；仍待Work有界複審及既有未測邊界。

保留候選失敗：A首候選 `161e26ec933f9bb2958aafb674985950c3314bfa` 的run40462351872為22 Pass／5 skipped，嚴格monitor verifier因skipped空白context沒有資產而失敗；後續供既有108MB fixture實際執行5項，不刪斷言或放寬校驗。C首輪33 Pass／5 skipped／1 Fail為alias問題；修正後針對性14 Pass，再以上述整合候選驗證，不把首次結果改成全綠。

---
# 以下為歷史版本、授權與驗證紀錄（非目前狀態）

## 3.4.0 發布準備（尚未合併／正式部署）

本輪在凍結rc.2／59dff72的真正HTTPS以隔離合成資料執行21項操作全通過，含確認取消／恢復原ID值、兩實例隔離、固定輸出不變、M2-NAV-01、真正文件保存追加及v1/v2/v3／七包完整還原。這是開發者實際驗證，不是獨立QA；原始run40177583100與下載證據詳[既有結果索引](qa/m2-rc2/RESULTS.md)。

3.4.0分支僅更新版本／資產快取鍵、預覽專用DB／草稿命名空間，並有精確diff守衛；正式nexus-workspace、資料庫版本1、資料模型與所有儲存邏輯未改。新預覽m2-release/使用nexus-preview-workbench-m2-release-workspace／nexus-preview-workbench-m2-release-recovery:，不讀舊預覽或正式資料；同origin不是安全來源邊界。原m2/保持rc.2／59及原資料命名空間。

依賴順序#10→#11→#12→#13（材料）→#14（測試補強）→3.4.0版本PR。所有PR均未合併，正式仍3.3.0 main ff3f8a16cb343b93973bd191003c30ca9c13b996。新版本最終SHA與CI以版本PR為準，不以舊SHA綠燈代替最終回歸。合併／正式部署需另批准，之後仍須核對main CI／Pages／公開資產及正式HTTPS驗收。

限制保留：40活動／100含移除欄位、100範本、200成果、單成果100萬JSON字元，配額／記憶體限制；舊3.3.0不能讀v3。Safari／Firefox、實機觸控、完整螢幕閱讀器、OS原生選檔UI與Office／Calc未驗證。選檔本輪用Playwright真實input，未人工操作OS選檔視窗。沒有可用GUI控制工具，不把程式驅動UI冒稱人工點選；實際截圖與下載內容另有證據。Excel維持取消，既有預算與XLSX保留，未新增M3／AI或遷移、刪除真實資料。

# M2 rc.2導航修正候選（2026-10-25）

e6f620353c2976f00e7913167d5c4720904c788e的CI40168831089通過25單元，82瀏覽器通過／2失敗：取消導航URL尚未處理即斷言，以及未等範本畫面就緒而取得舊工作台同名欄位。額外延遲載入控制在舊程式穩定失敗（舊input仍可聚焦），確認不只是事件存在檢查。

rc.2包含實質UI修正：切換中保護舊表單、正確的目標就緒／pending操作解除鎖定、草稿保留原編輯URL；測試同步目標畫面並保留原資料斷言。鎖定必須在既有flush排空後生效，原storage.spec的保存中追加輸入案例完全保留，否則會阻擋最後輸入。中途控制測試有重複selector定位失敗，已改為唯一頁首導覽連結；沒有刪除案例或放寬資料斷言。

最終針對性驗證：取消導航、無效預設值恢復、延遲目標禁止舊input聚焦、保存中從頁首切頁不永久鎖住、既有保存中追加輸入，5案例各3次共15/15通過，零重試。即將對rc.2新head執行完整25單元／86瀏覽器、15次文件選取、34公開資產及14個HTTPS M2操作／v3容量流程；結果須以新head實際CI為準。M2-NAV-01只標修正候選，仍交獨立QA，不發布。

---

# M2候選CI追蹤（2026-10-25）

2aa814b113cff45d51b68e23e45c5556581a7e4f的CI40168603581：24單元、84瀏覽器、15次選取重複及audit／候選包／正式基線通過；公開M2資產檢查因把Node fetch Response.ok布林屬性誤當Playwright的ok()而失敗，HTTPS M2操作尚未執行，不能稱該head完全通過。保留原失敗，不放寬資產或TLS斷言。

修正僅驗證腳本API用法，產品程式不變；新增原生Response契約測試，確認正確來源／逐位元資產可成功、異動bytes或錯誤SHA不得記成功。新head預期25單元、84瀏覽器、15次重複及12項HTTPS，需以新head實際CI結論為準。

---

# 最新：M2完整介面候選3.4.0-rc.1（未上架／未獨立QA）

依賴鏈：PR #10 ede75bd60e905f65fbc01f03b4e4806ea89097ef（契約／純模型）→ PR #11 2381aeb6a484daa4ee2e076bd202b3f3d6498593（保存／成果／v3）→ 本介面PR。各自base明列，沒有合併任何PR，也不整包帶入#6／#7或驗收工具分支。

實際本機：23單元＋81瀏覽器完整回歸通過後，新增雙分頁CAS恢復1項、欄位／選項XSS與CSV注入、恢復配額及保存重試、M1舊預覽隔離3項針對性通過；又補上已移除無效範本預設值的單元。最終新head預期24單元／84瀏覽器＋15次選取，以及公開M2 HTTPS的11個UI＋1個容量案例，實際以此head CI為準。audit 0。不得以本機測試或之前PR綠燈冒稱最終HTTPS／獨立QA已完成。

v3大容量實測113,907,256 bytes、8包、150個M2成果＋1舊快照，在新context透過真實下載／檔案輸入還原；比對來源／歷史／成果雜湊、範本、已移除值、圖片、資料夾／封存／偏好及關聯。舊快照於欄位修改後原始JSON不變，舊v1／v2仍能使用，分包格式不變。保留原3.3.0容量與文件選取測試。

UI實際操作：五種欄位、改名／排序穩定ID、移除確認／恢復、raw錯誤保存重開、範本結構不帶私人值／來源、明確預設與獨立新實例、模板編輯／移除還原、固定快照及CSV／JSON、quota/CAS與草稿副本復原、390／1280px工作台及範本明暗與axe，已檢視手機截圖。整合補強：未知值鍵副本不重命名；金額物件驗證不依JSON屬性順序；已移除的無效預設值保留但不套用；來源工作台與範本資料未改寫。

候選M2位於預覽庫m2/新命名空間，不覆蓋M1根預覽、舊斜體預覽或正式站。正式仍3.3.0／ff3f8a16cb343b93973bd191003c30ca9c13b996。未驗證：真實Safari／Firefox／手機／螢幕閱讀器、OS選擇器、Office／Calc及實體列印；大備份仍受瀏覽器記憶體／配額限制。欄位型別／選項固定，尚無轉型、選項後續修改、通用模組或同步；草稿JSON僅留存，完整備份以保存資料為準。未知未來schema拒絕整份匯入、不部分清除。開發者綠燈不是獨立QA結論。

---

# M2保存層階段（尚未上架／未獨立QA）

依賴PR #10的ede75bd60e905f65fbc01f03b4e4806ea89097ef，加入欄位保存、範本CAS／隔離建立、成果schema2及完整備份v3。IDB版本仍1；v1／v2與M1純流程維持原樣，不讀取時自動遷移。副本還原於同一交易映射欄位／選項與快照，保留未知屬性／原值。

本機4項新增API瀏覽器與11項既有M1流程合計15項通過，包含舊成果CSV不變、錯誤raw保留、確認與恢復、CAS、v2／v3、副本關聯、範本預設與獨立性、template配額中止與重試。新增schema2成果單元驗證負數精確字串、CSV注入防護與快照不變。最終完整回歸以此PR的CI為準。仍未加入M2產品操作入口，完整UI／草稿／手機／HTTPS／v3大型分包留在依賴此PR的下一分支驗證。

---

# 最新：M2開發驗收紀錄

正式3.3.0／main ff3f8a16cb343b93973bd191003c30ca9c13b996已發布且獨立QA結案（main CI40090062525／正式HTTPS40090170631）。以下舊「尚未發布」是歷史狀態。

M2契約已先提交，再實作純欄位／範本模型。新增6單元本機通過，涵蓋ID、精確值、缺值／錯誤、刪除恢復、範本結構隱私及預設值獨立、凍結與映射、未知值保留、活動欄位上限；未加入產品入口。完整M2瀏覽器／保存／v3還原及隔離預覽仍待完成，不以單元通過代替產品驗收。各PR最新完整CI結果記錄於PR。

---

# 最新：3.3.0正式版本準備（2026-10-24）

使用者已完成獨立QA並解除3772e4ab7246ea9e5abccc53d547711436502f90的BACKUP-CAPACITY-01（P1）。候選CI40087283672已14單元／68瀏覽器／15次選取及公開HTTPS容量2項通過；不以此取代新head驗證，也不表示正式站已部署。

本次產品執行程式與已QA候選相比，只修改storage.js的BRAND版本為3.3.0，以及index所有?v資產快取鍵。package／lock版號、文件與quality workflow的PR #8驗證SHA一併更新，整合依賴a16250ab4b4a355feef8559e44a278ee023ef889；保存、金額、成果、備份格式、還原與工具行為沒有修改。其他產品檔案必須逐位元相同，最終diff證據記錄於PR。

新head執行npm ci、14單元、68瀏覽器、15次選取重複、audit，並驗證公開HTTPS兩預覽與容量專項2項。包含舊斜體格式保存／DOCX回讀／HTML、工作台、精確金額／缺值、固定成果CSV／JSON、150份合法成果超過100 MB完整分包及超限JSON在新context還原。結果以本次最終提交CI為準。

正式main仍a0edd157ef1a01572e296db01c23f9a8b9651a76／3.2.1。待使用者對具體SHA批准後，先發布並驗收#8的3.2.2，再改#9 base為main、核對head及範圍，發布並驗收3.3.0。全部正式HTTPS實際流程通過前不能宣告正式發布驗收完成。實機Safari／Firefox、OS選擇器、Office／Calc、實體列印與記憶體／配額限制保留。

以下保留各階段歷史記錄，當時待QA／待修狀態不得當成最新狀態。

# NEXUS 發布驗收紀錄

## 目前狀態（2026-10-24，優先於下方歷史紀錄）

正式main仍為a0edd157ef1a01572e296db01c23f9a8b9651a76／3.2.1；正式驗收39985267265核對26資產與15文件專項，使用者確認文件選取P1已解除。PR #8正準備3.2.2，尚未合併／正式部署。

與已測候選4197a3d267988a31d556c49696de62531faf2c61比較，本次只調整正式版本、index資產快取鍵與發布文件；document-editor、資料模型、保存邏輯及相容測試不變。最終提交將重新執行6單元、55瀏覽器、15次選取重複、audit及隔離預覽驗證，以該提交的CI為準，不能只引用舊SHA綠燈。

斜體入口依使用者決定撤下，不是字形修復；舊italic格式、保存重開、DOCX匯出再匯入與HTML相容保留。預算及XLSX保留，獨立Excel產品取消、未曾上架；PR #7不合併。PR #6歷史內容不夾帶。

授權僅發布準備／測試／PR及隔離預覽；合併與正式部署仍需對具體SHA批准。OS選擇器、實體列印、Office／Calc、Safari／Firefox及真實手機仍未由Chromium模擬證明；audit不代表嵌入vendor已完整稽核。

## 以下為過往記錄（包含當時待修／待批准狀態，非目前狀態）

# NEXUS 3.2.1 驗收報告

日期：2026-10-23。使用者已批准 PR #4 的 0e27cdc；已合併為 c400e6f57403490337c9435548be02459a1eac1c，Pages 39978438967 成功部署，HTTPS storage.js 確為 3.2.1。但合併後 CI 39978439742 的清單回歸再失敗，**最終驗收尚未完成**。目前追加修正在獨立分支 codex/nexus-document-selection-followup，尚未合併／部署此修正。

## 合併後追蹤（優先於以下歷史結果）

- main CI：6 單元通過；51 瀏覽器通過、1 失敗；後續 audit／線上冒煙步驟因測試失敗未執行，不能標記通過。
- 本機原案例重複：14 通過／1 失敗；控制案例修正前失敗；修正後原案例＋控制案例各 15 次，30/30 通過。
- 追加同步導覽鍵選取、保留反向範圍，新增兩項回歸；本機完整結果為 **6/6 單元＋54/54 瀏覽器，0 失敗／跳過／重試**；npm audit 0 弱點，diff check 通過。[Actions 39979908311](https://github.com/lrqrll/practical-thinking-studio/actions/runs/39979908311) 驗證應用提交 `87feee59aade651fd06ee0f076920b038fcaa9e0` 全部成功：6 單元、54 瀏覽器、三個選取案例各 5 次共 15 次、audit、file:// 預覽包、指定 3.2.1 的正式 HTTPS 保存重開，以及核對候選 SHA 的 HTTPS 預覽。
- 正式 HTTPS 冒煙已驗證版本 3.2.1 與保存／重開；獨立線上驗證工作流程也已新增，完整 QA 失敗時仍可另外執行。線上備忘錄冒煙通過不會解除正式站的已知清單阻擋。
- Excel 分支已建立但暫停；試算表草稿未接入網站、未上架。先解除 DOC-SELECT-02。

以下為合併前的歷史證據，保留原始結果，不代表合併後全部通過。

## 實際結果

- 本機：Node 24.19.0、Python 3.12.14、Chromium；**6/6 單元、52/52 瀏覽器，0 失敗／跳過／重試**。
- [Actions 39976684098](https://github.com/lrqrll/practical-thinking-studio/actions/runs/39976684098)，已驗證應用提交 `3c51edec480f954a830a2eb92c62edfe50b492c2`：全部測試、audit、預覽建置、file:// 預覽包、正式 HTTPS 基線及獨立 HTTPS 預覽全部成功。PR 最新文件提交的 checks 另以 GitHub 顯示為準。
- npm audit：QA 鎖定依賴 0 弱點；git diff --check 通過。audit 不涵蓋提交的 vendor bundle。
- 公開預覽：[NEXUS 3.2.1](https://lrqrll.github.io/practical-thinking-studio-preview/)。畫面與 deployment.json 顯示實際來源 SHA；公開關鍵資產已與建置包逐位元比對。
- 合併前預覽部署未改動正式站；當時 index.html／storage.js 逐位元相同、版本為 3.2.0。之後經使用者批准才部署 3.2.1。

## 首次失敗沒有忽略

已以正常 HTTPS 取得 39820174844 的 artifact：42 通過、4 失敗。比對證明 afc977f 到 bc328f0 未修改該四個測試或功能，因此後續一次綠燈不是修復證據。

本次根因與修復見 [CI-FAILURE-ANALYSIS.md](CI-FAILURE-ANALYSIS.md)：

1. 清單：原生 DOM 選取與 ProseMirror model 可能不同步，舊焦點恢復把額外 trailing paragraph 納入。現在格式化前同步畫面可見範圍，保留 NodeSelection／CellSelection。
2. 尋找：Tiptap focus 延至 animation frame，處理完成時選取仍空白。改為同步焦點與結果選取。
3. 移動：全選非同步重繪替換目標 select，丟失已選目的地。現在只更新勾選／按鈕，不重建控制項。
4. 資料夾：測試過早讀取 nth(1) 誤選垃圾桶；刪除交易未完成時切換又被後續回呼重設。改為名稱選項、等待真實刪除結果，且操作期間真正 disabled。

兩組控制時序測試各取得修復前 2/2 失敗證據，修復後通過。原四案例曾各 5 次共 20/20 通過，但 39974712148 仍在遠端抓出 2 項未完整修復；已繼續補強並保留該失敗，未用本機重複通過取代根因分析。最終 52 項完整遠端通過。統計見 qa-3.2.1-results.json；舊 qa-results.json 為 rc.1 歷史紀錄。

39975827685 停於 OS 依賴安裝，取消日誌顯示 Azure Ubuntu mirror 的字型下載極慢，尚未執行應用測試，不列入通過。CI 已固定 Ubuntu 24.04 並限制安裝步驟 5 分鐘；後續完整執行成功。

## 覆蓋

儲存配額／transaction abort 回滾、失敗重試、保存中再次編輯／導覽、跨分頁衝突、草稿副本、十版歷史及版本號、完整備份／還原、舊版遷移保留原資料；八工具新增／編輯／保存／重開／匯出與獨立性；文件格式／清單／表格增刪合併分割／圖片／連結／尋找取代／頁面設定、DOCX 回讀與 ZIP/XML、HTML、列印 frame／PDF 結構；檔案與資料夾管理、垃圾桶、CSV 注入、sanitize、390／1280px 與 axe。

預覽測試證明正式 IndexedDB 與 recovery sentinel 保持原值、不遷移正式 legacy 資料；缺少預覽 metadata 時 fail closed。GitHub runner 已實際操作下載包文件編輯／保存／重開，以及 HTTPS 預覽初始化／備忘錄編輯保存重開。未停用 TLS 驗證或修改持久憑證信任庫。

## 發布邊界

正式站仍有 DOC-SELECT-02（P1）；追加修正候選需完成 CI／預覽並經使用者批准合併部署，才可解除發布門檻。OS 原生選擇器／實體列印、Word 精確版型、Safari／Firefox／真實手機及螢幕閱讀器仍是如實列出的 P2 驗收限制，不能以 headless／API 替身宣稱全部實機通過。

PR #4 已批准合併部署；PR #5 追加修正尚未批准。完成追加發布驗證後恢復既有 codex/nexus-spreadsheet 分支。見 RELEASE-CHECKLIST.md 與 RESUME.md。

## 最新候選：撤下斜體操作（尚未發布）

候選3.2.2-rc.1從正式main a0edd15建立，未合併PR #6/#7。依使用者決定移除按鈕及Ctrl/Cmd+I；保留italic模型、舊文件、HTML與DOCX匯入匯出。這是操作入口撤下，不是字形修復。

針對性文件／選取15項通過；新測試驗證兩種快捷鍵不新增或清除italic，舊格式與bold/underline編輯、保存重開及DOCX／HTML相容。新增DOCX實際回讀亦須通過候選CI；最新結果以PR checks為準。獨立Excel產品已取消，沒有從正式站下架，歷史成果保留。

## 工作台M1候選（最新，尚未合併／發布）

12單元、本機65項完整瀏覽器先通過；新增工作台管理與手機捲動修正後，11項M1實際流程及2項響應式／axe再通過。最終66項回歸與HTTPS候選證據以PR checks為準；不把舊有工具回歸當M1驗收。

規格與驗收涵蓋見WORKBENCH-M1.md。手機新增捲動曾被axe正確攔下不可鍵盤聚焦，補region/label/tabindex後通過；管理測試也補了真正保存還原後重開。未刪案例或放寬斷言。

## 2026-10-24 完整備份容量 P1 修正候選

獨立QA發現150份合法成果可超過100 MB，使完整備份無法匯出／匯入；選取匯出排除工作台與成果，不可作恢復方案。已建立完整傳輸分包，保持v1/v2原始資料，先驗證全部分包再原子還原；既有超限JSON允許安全匯入。測試不降低模型／金額／關聯斷言。

新增單元測試：100 MB前／等於／後一byte，UTF-8中文、缺包、重複、混包、損毀及截斷拒絕。新增真實Chromium：150份合法成果超過105 MB，完整來源與圖片／歷史、下載全部分包，在全新隔離瀏覽器context還原，比對完整內容雜湊、關聯及rev，並另測既有超限單JSON。原有工作台／保存及全站回歸保留。實際結果以此新head的CI與PR證據為準，不沿用上一head綠燈。

環境首次執行碰到8000埠占用，尚未測到功能；改用8034埠後，新增分包／新環境還原流程通過。後續加入超限舊JSON路徑，再執行最終回歸。P1保持候選待獨立QA，不合併／部署。

本機實測：14單元與67瀏覽器完整回歸通過；再補資料夾／封存／偏好、另存分包與單檔寫入／取消／失敗，2項容量專項最終通過（150成果完整JSON 108,563,481 bytes、7包；另在第二個全新context還原同份超限JSON）。最終新head CI預期14單元、68瀏覽器與15次選取，另在公開HTTPS候選重跑容量專項；未完成CI前不得稱其已通過。

## M2 rc.2 獨立複驗材料（不改候選產品）

使用者回報獨立QA已核對程式／依賴／原始CI並重跑10項模型測試通過；因缺受控瀏覽器，完整操作仍未測，不是已確認功能失敗。#10 ede75bd60e905f65fbc01f03b4e4806ea89097ef、#11 2381aeb6a484daa4ee2e076bd202b3f3d6498593、#12 59dff72bb55a77c371863d6e8a998529b1997bf0保持凍結。M2-NAV-01獨立瀏覽器複審門檻有效。

[可下載合成v1/v2/v3備份、逐項操作、內容manifest、負控制與原始證據](qa/m2-rc2/README.md) 已在獨立材料分支整理；不修改產品程式／依賴、版本、預覽來源SHA或正式站。新增7項fixture瀏覽器測試在本機開發者環境全通過，含108,082,768bytes／7包／151成果全新context還原；雙SHA負控制確認舊版可focus／rc.2不可focus。開發者證據見材料索引，不稱獨立QA通過。
