# 獨立瀏覽器操作清單

共同前提：使用全新隔離設定檔，開啟 [候選 HTTPS](https://lrqrll.github.io/practical-thinking-studio-preview/m2/#benches)，核對 `3.4.0-rc.2`／`59dff72bb55a77c371863d6e8a998529b1997bf0`。所有內容用合成資料；不得在真實資料設定檔測故障注入。每列均待獨立操作，開發者 CI 是對照證據，不代填結果。

來源測試固定在[候選 tests/e2e](https://github.com/lrqrll/practical-thinking-studio/tree/59dff72bb55a77c371863d6e8a998529b1997bf0/tests/e2e)。下表路徑相對該目錄，測試名稱用唯一關鍵字；新 fixture 測試見本材料分支 `tests/e2e/qa-fixtures.spec.cjs`。[原始候選 CI](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40170486240)涵蓋下列候選測試；本次材料 CI 另見 [EVIDENCE](EVIDENCE.md)。

| ID／操作 | 預期與需留存證據 | 對應測試 | 獨立結果 |
|---|---|---|---|
| ID-01 核對 banner、deployment.json、開工作空間／八工具，切明暗 | 版本 SHA 正確；原工具入口可用，沒有 Excel 入口；34 公開資產一致，記瀏覽器／OS | scripts/m2-preview-smoke.cjs；tools.spec.cjs | 待測 |
| FIELD-01 新工作台新增文字、數字、日期、單選、金額，輸入 `中文`、`-00123.4500`、閏日、南區、`0.30`；保存重整 | raw 保留；摘要數字 -123.45、金額0.30；空白不是0 | m2-ui: `actual fields use stable ids`；fields模型10項 | 待測 |
| FIELD-02 改名、上下移動；含值移除先取消再確認，於已移除欄位恢復 | 值與穩定 ID 不變；取消不刪、確認軟移除；恢復原值與ID | m2-ui: `actual fields use stable ids` | 待測 |
| FIELD-03 無效數字、日期、金額0.001，保存重開，嘗試成果，再修正 | 明確錯誤；raw保留；不能以0或截短輸出；修正後能保存／成果 | m2-ui: `actual fields use stable ids`；workbench: `missing and excess precision` | 待測 |
| TPL-01 工作台含來源與合成私密標記，另存範本 | 預設只複製活動結構，無現值、來源文件ID、舊成果、私密屬性 | m2-ui: `templates are structure only` | 待測 |
| TPL-02 範本改名、明確預設值、保存重開，套用兩工作台；編輯一份與範本 | 新欄位／選項／工作台ID，各無來源；彼此不連動 | m2-ui: `templates are structure only` | 待測 |
| TPL-03 範本刪除、恢復；無效預設0.001重整並復原草稿，修正另存 | 已建工作台不變；範本可恢復；草稿新副本不覆寫原範本 | m2-ui: `template invalid defaults remain editable` | 待測 |
| FLOW-01 建立或連結報價＋備忘，編輯來源／返回，保存重開 | 原M1流程、來源獨立工具仍可操作；報價0.1+0.2精確0.30；摘要同步 | workbench: `real M1 flow`、`link existing independent tools` | 待測 |
| SNAP-01 建固定成果，同一成果下載CSV／JSON；再改欄名、順序、值、移除 | 新schema2結構版本1，數字／金額精確；舊下載內容不變，新成果另建；CSV首碼公式防護、中文引號正確 | m2-ui: `fixed custom snapshots`、`custom field labels` | 待測 |
| SNAP-02 匯入v2舊成果，建立新M2成果，再完整備份 | 舊schema1內容原樣；新schema2共存，非偷偷升版重寫 | m2-capacity；qa-fixtures v2/v3；manifest | 待測 |
| NAV-01 目標範本讀取以 latch 暫停，舊表單嘗試focus／鍵盤輸入，釋放 | 舊input不能focus或編輯；新表單獨立，0.001預設被拒，原工作台values不變 | m2-ui: `a delayed template transition`；[控制步驟](NAV-01.md) | 待複審 |
| NAV-02 欄位保存寫入後暫停回應，頁首切工作空間，目標出現後釋放 | 目的畫面不永久inert，可互動；再開原工作台已保存值完整 | m2-ui: `header navigation during a pending field save` | 待複審 |
| NAV-03 未保存欄位離開選取消，再重整／復原草稿 | 網址回原hash、輸入仍在、dirty草稿仍在；復原新工作台不連來源，不覆寫 | m2-ui: `dirty navigation is guarded` | 待複審 |
| NAV-04 同資料兩分頁先後保存；及注入quota錯誤 | CAS失敗不覆寫新版本，輸入與草稿保留可下載／復原副本；解除配額故障同頁重試及後續保存成功 | m2-ui: `two browser tabs never overwrite`、`recovery quota errors` | 待複審 |
| NAV-05 原文件存檔回應等待中，再追加文字並切頁，釋放後重開 | 最新追加文字完整保存；不能因切頁鎖而漏輸入 | storage: `navigation drains an edit made during an in-flight write`（候選未改原斷言） | 待複審 |
| BK-01 每次全新profile，分別匯入workspace v1／workbench v2／v3 | 按README各數量；來源、圖片、6份歷史、偏好、垃圾桶、封存皆在；v3含範本／已移除值 | qa-fixtures: 四個 `synthetic restore` | 待測 |
| BK-02 每份完整匯出，第二個空白profile再匯入，重整 | 新ID正確映射，來源及歷史/成果內容完全一致；棋盤解碼16×16；工作台每次多一個副本後綴 | qa-fixtures: 四個 `synthetic restore`；fixture-manifest.projection | 待測 |
| BK-03 原始legacy v1、unknown-v3與刻意錯誤缺來源v3 | legacy產生6工具＋封存；unknown資訊不清除；錯誤整份拒絕，錯誤前後記錄相等 | qa-fixtures: `original v1`、`invalid source`；m2-ui: `unknown saved value keys` | 待測 |
| BK-04 生成或下載七包大容量組，同時反序選取還原，重整完整匯出 | 108,082,768bytes，151成果含舊成果、7歷史、1範本、圖片／關聯／移除欄位皆一致；manifest語意hash一致 | qa-fixtures: `downloadable multipart`；原 m2-capacity完整v3 | 待測 |
| BK-05 缺包、重複、混包、截斷；還原交易中quota失敗 | 明確錯誤且不部分寫入；現有資料相等；故障解除完整組可重試 | backup-format unit；backup-capacity；workbench: `restore failure never partially imports` | 待測 |
| UX-01 390與1280寬、明暗、Tab／Enter，工作台及範本往返 | 無橫向溢出；焦點可達、提示可辨，空值／錯誤清楚；axe僅基本檢查 | m2-ui: `M2 keyboard editing dark light layout and axe` 兩尺寸 | 待測 |
| REG-01 文件清單、反向選取、保存重開；斜體入口撤下、舊格式保持；八工具／預算XLSX | 原已完成能力不退步；不是修復斜體字形的宣稱 | document、ci-regressions、tools、files各spec及單元格式檢查 | 待測 |

## 內容與輸出核對

1. 每份 fixture 可用 [manifest](fixture-manifest.json) 的 SHA256 確認下載完整；輸入 JSON 不是成果JSON，也不是 GitHub HTML頁。
2. v3 工作台 7 欄含1移除；範本6欄含明確預設；新快照6個活動欄，舊快照無customFields。範本無來源／舊成果，工作台仍指向兩份來源。
3. 原始成果內容比對允許副本ID重建，不能允許報價、備忘、時間、欄名、raw、typed value被改寫。新快照JSON金額minor是字串30；CSV同一快照，不用現行欄位重新算舊成果。
4. 補充工具會完整比對資料／歷史與semantic projection，另核對引用圖譜。原資料與新副本 ID 不同屬預期；名稱副本後綴有獨立斷言，不以忽略名稱掩蓋錯置。

## 複驗紀錄表

| 操作者／日期 | 瀏覽器／OS | 完整候選SHA | 清單ID | 通過／失敗／未測 | 原始證據連結及備註 |
|---|---|---|---|---|---|
| 待獨立QA填寫 | | | | | |

失敗請保留trace／下載檔／錯誤訊息，記錄環境與產品斷言的區別；停止發布，不清除真實資料。完整獨立操作尚待執行，本文件不解除M2-NAV-01。
