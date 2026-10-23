# 3.2.1 發布檢查

- [x] 首次 CI artifact 已取得，四個失敗已逐項分析；不是只引用後續成功。
- [x] 焦點時序及移動目的地問題有修復前失敗／修復後通過的控制測試。
- [x] 既有正式資料庫名稱、schema 及舊版遷移保留；備份還原、跨分頁衝突及八工具回歸已在本機通過。
- [x] 版本備妥為 3.2.1；這代表待發布程式，不代表正式站已更新。
- [x] 預覽包建置與真實 file:// 瀏覽器驗證完成；獨立 HTTPS 預覽也已驗證。
- [x] 應用提交 3c51ede 的 GitHub Actions 39976684098 全部通過；後續純文件提交仍執行相同 checks。
- [x] PR #4 已轉為 ready for review。
- [ ] 使用者批准合併及正式部署。
- [ ] 合併後確認 Pages build／deployment 對應合併提交。
- [ ] 對正式 HTTPS 網址執行 NEXUS_EXPECTED_VERSION=3.2.1 的瀏覽器冒煙測試。
- [ ] 更新 QA、KNOWN-ISSUES、ROADMAP 及開始獨立 Excel 分支。

P2 限制如實保留：OS 檔案選擇器／真實列印視窗、Word 精確版型、其他瀏覽器及實機無障礙並未由 Chromium headless 全面證明。正式部署與開始 Excel 不得在批准／發布驗證前標為完成。
