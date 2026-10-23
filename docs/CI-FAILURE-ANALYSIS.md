# 首次 CI 四項失敗的根因與修復

來源：Actions 39820174844 的 playwright-results artifact（12445085101），提交 afc977f；原始結果 42 通過／4 失敗／0 跳過。2026-10-23 已透過正常 HTTPS 下載 JSON、error-context 及 trace，沒有降低 TLS 驗證。

`git diff afc977f bc328f0 -- tests document-editor.js workspace.js` 為空。39821101746 的成功不是上述四項已有程式修復的證據；這些案例有時序依賴，本次才進行針對性修復。

| 失敗 | 根因證據 | 本次修正／驗證 |
| --- | --- | --- |
| Word 項目清單預期 1、實際 2 | trace 顯示標題後有 Tiptap trailing paragraph；鍵盤重新選取後套用本文／清單時，範圍包含額外空白段落。引擎的 focus 指令透過 requestAnimationFrame 延後恢復焦點，快速工具列及鍵盤交錯的選取時序不穩。 | 工具列改用同步 editor.view.focus()，不留下延後的 focus 動作；保留原鍵盤操作與清單數量、保存／重開斷言，另進行重複時序驗證。清單引擎本身未改成忽略合法空白項目。 |
| Word 尋找文字得到空選取 | error-context 有「2 處」，內容仍正確；測試在按鈕處理完成後立即讀取 getSelection，焦點當時尚待 animation frame 恢復。 | 同步焦點後設定選取。新增刻意延遲 animation frame 的測試：舊程式得到空字串、修正後立即得到 alpha，不靠增加等待秒數通過。 |
| 檔案移動逾時 | error-context 保留根目錄檔案，目標 select 回到根目錄、全選清空。全選處理會非同步重繪整頁，替換目標 select，可能在測試／使用者選擇目標後把值重設。 | 全選與個別勾選只更新勾選、數量及按鈕狀態，保留目標 DOM。新增「先選目標再全選」測試，舊程式穩定重設成空值，修正後保留同一節點及目的地且確實搬移。 |
| 資料夾刪除逾時 | 新增名稱 dialog 關閉後，IndexedDB／選項重繪未完成；測試讀取 option nth(1)，當時是垃圾桶。最終 snapshot 顯示新資料夾存在，但目前仍選垃圾桶，故沒有 delete-folder 按鈕。 | 等待名稱相符的新選項，禁止以可變排序索引推測 id；新增資料夾期間工作區 inert，完成後才可操作。原本永久刪除、取消、資料層保護、清空等斷言全部保留。 |

新增兩項控制時序的回歸測試，曾在未修復程式上 2/2 失敗，再於修復後通過。最新全套結果與重複驗證結果見 QA-REPORT.md；不把後續偶然成功當成根因分析。

## 首輪修正後遠端再現與補強

39974712148（bd6b26c）仍有清單／刪資料夾 2 項失敗，48 項通過；沒有忽略這次失敗。同步 focus 本身不足：瀏覽器的原生 DOM range 已變，但 selectionchange 尚未更新 ProseMirror model 時，view.focus 仍可能把舊的全文件範圍寫回 DOM。新增同一 JS task 內製造兩者不同步的測試，舊版確實把 trailing paragraph 變成第二個 li。現在先透過公開 posAtDOM／setTextSelection 同步可見範圍，再 focus；NodeSelection／CellSelection 保留原語意。工具列值在同步前擷取，避免 selection callback 改回 select 的值。

資料夾後半段失敗則是刪除尚在 await 交易／refresh 時，測試已切換垃圾桶，之後刪除回呼又把 currentFolder 改回 all。現在非同步工作區操作把控制項真正 disabled（不只 inert），且刪除資料夾也套用同一保護；完成交易／重繪才恢復。測試另等待已刪資料夾選項消失，驗證操作確實完成才繼續。

上述兩個新增控制案例在補強前 2/2 失敗，補強後與既有文件／檔案案例共 21/21 通過。最終全套及遠端結果見 QA-REPORT.md。
