# NEXUS 路線圖：本輪有限授權A／B／C

正式3.4.0／產品M `78e90aec61ca825d45534c93515df4d8f949a431`／tree `bba3bb3c0ae02afbfcfbeeeb7cee63f216c086b1`已由PR #15部署，保持不變。未合併[工具PR #17](https://github.com/lrqrll/practical-thinking-studio/pull/17)工具head `ab0551364946fb11868cc6f5f309ef45dc2fe64d`的QA-FONT-01及QA-CONTEXT-01已由Work獨立程式／證據／視覺審查結案；42正式項與4工具控制分開，未親自重演全部42項。歷史36通過＋1失敗／後續1補驗通過、舊41、環境失敗及skipped見[QA報告](docs/QA-REPORT.md)。

本次使用者已授權以下三線的程式實作、必要修補、測試、開發分支、小型PR與隔離預覽。A為主線，B／C並行，B不是A的前置條件；A／C候選已實作並經開發者驗證，待Work有界複審；不能以候選通過聲稱正式站已更新。此授權取代下方或其他歷史文件「尚未授權M3」對A的限制，僅限M3.1文字成果組裝；不代表整個M3／M4或其他大型功能獲准。不得合併main、正式部署或啟用auto-merge。

## 已交付候選與可操作預覽（開發者驗證，待Work有界複審）

正式仍3.4.0／M `78e90aec61ca825d45534c93515df4d8f949a431`；以下為3.5.0-rc.1隔離候選，不是main合併或正式部署，不再擴充其他M3功能。

| 線別 | 精確head及依賴 | 已實作／驗證與預覽 |
|---|---|---|
| [A／PR #18](https://github.com/lrqrll/practical-thinking-studio/pull/18) | `2ff102580ffa22f5f77f65ff54ef10e385597c8d`，base工具PR #17 `ab0551364946fb11868cc6f5f309ef45dc2fe64d` | 兩份來源挑選／排序→凍結已保存資料→普通document編輯／保存重開→真實DOCX／HTML下載；來源後改不連動。[預覽m31-assembly](https://lrqrll.github.io/practical-thinking-studio-preview/m31-assembly/)，namespace `m31-assembly` |
| [C／PR #19](https://github.com/lrqrll/practical-thinking-studio/pull/19) | `4992808262c81f12e21252b776384a517a130f68`，base A `2ff102580ffa22f5f77f65ff54ef10e385597c8d`；整合A開發分支保留歷史，index衝突以新增兩線入口處理 | 第九工具工時紀錄：整數分鐘合計、編輯／篩選／保存重開、真實CSV、版本化adapter及完整備份還原。[整合預覽m31](https://lrqrll.github.io/practical-thinking-studio-preview/m31/)，namespace `m31-integrated`／DB `nexus-preview-m31-integrated-workspace`；含A閉環 |

[A HTTPS 40462812589](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40462812589)成功：27 Pass／0 skipped，含5項舊格式／108MB分包真實下載／第二context還原回歸。[A Quality 40462812660](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40462812660)成功：31單元、104瀏覽器、15選取回歸、audit0，5條件skipped另列，不算通過。[C HTTPS 40463068703](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40463068703)成功：27組裝／舊文件／備份案例及另列5工時案例、37單元；[C Quality 40463068723](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40463068723)成功。以上皆開發者驗證，對應各候選SHA，不借正式M的42項替代；仍待Work有界複審及既有未測邊界。

保留候選失敗：A首候選 `161e26ec933f9bb2958aafb674985950c3314bfa` 的run40462351872為22 Pass／5 skipped，嚴格monitor verifier因skipped空白context沒有資產而失敗；後續供既有108MB fixture實際執行5項，不刪斷言或放寬校驗。C首輪33 Pass／5 skipped／1 Fail為alias問題；修正後針對性14 Pass，再以上述整合候選驗證，不把首次結果改成全綠。

## A：M3.1文字成果組裝最小閉環（候選已實作／開發者驗證，待Work複審）

- 在工作台及工作空間提供「組裝成果」。首批僅既有固定成果schema1／2與文字備忘錄；由使用者挑來源及內容（報價、需求／建議、決策備忘、自訂欄位、備忘文字／清單），填名稱、排序及移除區塊，不預設全選。
- 建立時以**單次唯讀交易**取得選定來源的已保存版本，驗證後凍結；提示未保存輸入不包含。刪除／失效／未知格式／無法完整呈現須要求修正或重新選擇，無效金額不得變零。取消不得留下半份檔案。凍結後不讀活來源，改名／改值／垃圾桶不得改寫成果。
- 建立普通document，重用既有model、editor、保存、CAS、history、草稿及完整備份；建立後可編輯、保存重開。來源名稱／版本／凍結時間可作明示文字，首版不承諾活連結、重開選擇器、動態區塊或同步；不修改來源。
- 沿用真實DOCX／HTML下載，每次匯出取同一已保存rev的深拷貝；DOCX ZIP時間戳可不同。PDF只標既有瀏覽器列印另存，不聲稱新增直接下載；不得用JSON或截圖替代成果。
- 僅文字：選擇階段有圖片須提示不納入並讓使用者確認／取消，不靜默忽略或刪來源圖片。不加大型editor、assembly資料庫、新npm依賴或備份版本；若document契約無法承載，先提具體限制及最小替代，越界部分才待批准。

完成／必要驗收：全新使用者在390px及桌面完成「兩份來源→挑內容→排序→建立→編輯→保存→離開重開→DOCX／HTML下載」，中文、換行、清單、精確金額與自訂欄位正確，來源後改不連動；保存失敗／CAS保護有效；完整備份至第二空白context還原後仍可編輯下載。轉換器測選擇／排序／欄位／清單、無效金額、凍結及惡意文字；候選HTTPS驗證主閉環、來源後改、保存／CAS及還原；核對真實DOCX封裝與word/document.xml、HTML內容／安全。保留八工具、schema1／2及v1／v2／v3相容，不冒稱Office視覺驗收。**第一份功能PR須包含整個可操作閉環。**

## B：結案紀錄與待辦分級（文件候選）

接續獨立[PR #16](https://github.com/lrqrll/practical-thinking-studio/pull/16)，一致更新README、AGENTS、QA、KNOWN-ISSUES、RESUME、ROADMAP與M2契約摘要；分開產品M、未合併工具與歷史。記錄Work結案，不宣稱親自重演。待辦分嚴重度、產品問題／驗收缺口、具體驗收及回歸觸發。只做diff、連結、SHA與狀態檢查，不新增產品測試、不重跑42項、不擴成全站QA專案。

## C：工時紀錄最小版（候選已實作／開發者驗證，待Work複審）

- 新增獨立工時工具並保留原八工具。每列穩定ID、有效YYYY-MM-DD、專案／分類、工作項目、1–1440整數分鐘、備註，最多500列；空白／零／負數／非整數／無效日期明確提示。
- 用安全整數分鐘合計，顯示小時＋分鐘；新增、編輯、刪除確認或可復原、日期篩選、專案合計、保存重開及真實CSV。篩選、合計與CSV範圍一致且明示，中文／引號／換行／公式字首安全。
- 重用既有檔案／保存／history／CAS／草稿／完整備份，新type完整納入validator、建立、複製、選取匯出與完整還原。版本化純資料adapter含fileId、rev、schemaVersion、rows、totals；首版不強改M2固定成果schema／兩種module、不宣稱活連動。若必須改備份版本，先提最小契約及相容策略，不降版或丟資料。
- 不含自動計時、背景timer、薪資／費率／稅務、日曆同步、甘特圖、AI、後端或雲端帳號。

完成／必要驗收：30＋45分鐘即時為1小時15分鐘，多日期／專案改值及保存重開一致，篩選／合計／CSV一致；完整備份至第二空白context還原，內容／row ID映射／合計符合契約；多分頁不覆寫新rev，保存失敗保留輸入，390px及桌面可操作。測日期／分鐘邊界、安全整數、adapter、CSV安全，候選HTTPS建立→修改→保存重開→真實下載、CAS、新檔完整備份還原與舊備份相容。

## 共同界線及後續待辦

A／C在storage、registry、workspace等共用檔案先明列重疊並隔離分支／整合，分別PR；若使用工具head作基線或帶必要提交須明列依賴及獨立差異，不擅自合併#16／#17到main。所有新結果標「開發者驗證」，對各候選自己的SHA及隔離HTTPS namespace，全新context／合成資料，沿用全context／page資產／錯誤監測、TLS與retries=0。先相關測試，改共用保存／匯入／導航才擴到受影響回歸；不刪斷言、降比較或禁止正常輸入規避問題。交付含PR／完整SHA／依賴、可操作預覽與步驟、A畫面及DOCX／HTML、C畫面／CSV／adapter、Pass／Fail／未測和原始證據，交Work有界複審。

M2-NAV-01未完整獨立操作仍列驗收缺口，不是已確認未修產品P1；Safari／Firefox、實機觸控、完整螢幕閱讀器、OS原生選檔、Office／Calc及中文斜體字形等按[已知問題](docs/KNOWN-ISSUES.md)驗收／回歸觸發追蹤。只有已重現P0／P1或其他明確阻擋問題才阻擋受影響發布；資料遺失、覆寫、還原破壞及重大安全問題保存證據並優先處理。

保留黑白灰、深淺模式、響應式、Pages靜態、本機優先、免費、無強制登入。已完成斜體入口退休與舊marks相容、採購報價／決策備忘M1、精確金額、M2欄位／範本／固定成果schema2及完整備份v3，不回退。獨立Excel／試算表已取消，PR #7及歷史分支／核心／測試保留而不合併、不恢復網格；#6不整包帶入。保留預算與XLSX，退休圖片工具不恢復。不宣稱跨裝置同步、完全離線、完整Excel／PPT或中文斜體字形修好。
