# 採購工作台 M1 候選契約

候選3.3.0-rc.1，尚未發布。分支codex/nexus-procurement-workbench，以斜體撤下分支codex/nexus-italic-controls-retired為明列依賴；後者從正式main a0edd15建立，未夾帶PR #6或已取消PR #7。

## 可完成的流程

工作台入口 → 命名建立 → 連結或原子建立報價／備忘錄 → 開啟既有來源編輯 → 保存後返回摘要 → 建立固定成果 → 預覽及下載同一快照CSV／JSON → 重開或完整備份還原。

管理包括改名、垃圾桶／還原、明確確認後永久刪除工作台及其成果；來源檔案一律保留。解除模組只移除連結。仍被任何工作台（含垃圾桶）引用的來源，不可永久刪除或被清空垃圾桶連帶刪除。

## 資料與保存

- 不升級IndexedDB、不重寫舊檔。既有files/folders/meta保留，新增meta的workbench:與workbench-snapshot:命名空間，讀取依prefix避免載入其他工具歷史內容。
- 工作台有固定id、schemaVersion=1、單調rev、名稱／時間／deletedAt、最多一個quotes及notes模組。模組id在重新連結同種類時保留，解除後重建才用新id；來源引用fileId而非名稱。
- 設定修改比較預期rev；來源建立與連結、成果捕捉、完整還原皆在同一交易，失敗回滾。工作台操作有pending狀態與離頁提醒，失敗後可重試，不污染既有保存隊列。
- 來源沿用原工具的自動保存、草稿恢復、多分頁衝突及歷史，不嵌入兩套編輯器。摘要與成果只使用已保存來源；其他分頁未保存內容不宣稱已納入。

## 金額與缺值（FIN-DEC-01）

共用NexusMoney，TWD固定兩位小數，以整數分計算並序列化十進位minor字串；不以Number加總、不四捨五入超精度輸入。0.1＋0.2＝30分，CSV為0.30。獨立報價工具也使用同一邏輯。

空白是missing，不是0；0必須明確輸入。負值、超精度、非有限或超範圍資料列invalid。舊raw字串不改寫；數學上可精確表示的科學記號／尾零保留相容（1e3、1.2300），無法精確到分則阻擋確認，不截短。最多999999999999.99 TWD（總價也有同樣上限）。目前不計算匯率、稅率或負數退款。

## 固定成果

資料包含workbenchId/rev、來源fileId/rev/moduleId、UTC建立時間、calculationVersion=twd-minor-v1、幣別／scale、兩家報價的整數分明細與總價、範圍／交期／條件、需求／建議及備忘清單。建立後沒有修改入口，來源變更只顯示提示，可另建新成果；不覆寫舊版。

CSV與JSON都直接由同一已儲存快照產生，下載檔各自獨立。CSV含中文、換行跳脫及文字公式注入防護；JSON為kind=nexus-result的成果交換檔，不是完整工作資料備份。成果不含備忘圖片，介面明示；原圖保留於來源與完整備份。

## 備份與舊資料

沒有工作台時仍可匯出v1；有工作台／成果則完整備份為v2，包含舊files/folders/archives/preferences/history與新workbenches/workbenchSnapshots。v1仍可匯入，原資料不改寫。v2先驗證全部型別、關聯及計算總價，再用單一交易建立副本；file/workbench/module/snapshot ID重新映射，來源rev與固定成果保留。匯入失敗不留下部分新資料。

舊版客戶端不支援v2，不能宣稱可降版還原。單一來源工作檔／選取檔案匯出仍為v1，不假稱包含工作台。限制：100工作台含垃圾桶、200成果、每成果序列化上限100萬字元、整份備份100 MB。超限明確拒絕，不自動刪資料。

## 預覽隔離與發布邊界

- M1候選：nexus-preview-procurement-m1-workspace／nexus-preview-procurement-m1-recovery:。
- 斜體撤下候選及先前預覽：nexus-preview-pr4-workspace／nexus-preview-pr4-recovery:。
- 正式仍為nexus-workspace／nexus-recovery:。

不同路徑共用origin，以上是應用命名空間隔離，非獨立origin安全邊界。M1不自動遷移正式或舊預覽資料；舊預覽資料可由斜體候選入口查看。metadata缺失時fail closed。候選顯示完整來源SHA，不更改正式Pages。

## 驗證與未完成事項

本機：12單元通過；完整65瀏覽器通過後，再補齊管理刪除及手機表格呈現測試。最終CI應執行66瀏覽器、既有15次選取重複、audit、建置與HTTPS候選的真實M1流程；實際結果以PR checks為準。

新增瀏覽器涵蓋實際編輯與重開、精確金額、固定快照不受來源更新影響、CSV/JSON同源、v1/v2副本還原／ID映射、配額中止與原子性、CAS衝突、共享來源刪除保護、工作台管理、390/1280px明暗及axe。手機表格只在資料區左右捲動，捲動區可鍵盤聚焦；附人工畫面檢查。

初次手機加捲動後axe抓到鍵盤不可聚焦，已補region/label/tabindex並維持斷言通過。管理恢復測試初次未重讀同hash，改為實際還原後重開，沒有降低資料／數量斷言。

不含：AI／自然語言引導、自訂模組／欄位、其他大型工具、工作台XLSX/DOCX/PDF/ZIP輸出、完整離線或同步。既有預算XLSX與文件DOCX保留。實機Safari／Firefox、OS檔案選擇器及Office／Calc開啟仍未由此候選證明；模擬手機不等於實機。獨立QA與具體合併／正式部署批准尚未取得。
