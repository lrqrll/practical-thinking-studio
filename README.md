# NEXUS

正式版本 **3.4.0**，發布提交 `78e90aec61ca825d45534c93515df4d8f949a431`。目前進行驗收補強與必要修補；獨立驗收門檻與原始失敗／未測範圍見 [QA報告](docs/QA-REPORT.md)。M3尚未授權。

專業本機工作工具平台，部署於 GitHub Pages。八個現有工具與架構見 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)，規則見 [AGENTS.md](AGENTS.md)。

## 開發

需要 Python 3、Node.js 24（QA）、支援 IndexedDB 的現代瀏覽器。

```sh
npm ci --ignore-scripts
npm run serve
```

應用程式是原生 HTML/CSS/JavaScript，沒有打包步驟；npm 套件只供測試，不需要在正式網站部署 node_modules。

## 自動驗收

```sh
npx playwright install --with-deps chromium
npm test
npm audit --audit-level=high
```

已有 Chromium 的雲端環境可使用 `NEXUS_CHROMIUM=/usr/bin/chromium npm test`。`npm test` 依序執行模型單元測試與真實瀏覽器測試，包含故障注入、備份還原、DOCX/XLSX 結構、八個工具、檔案管理、響應式及 axe 無障礙檢查。報告在 playwright-report/，失敗 trace 與 JSON 在 test-results/（皆忽略提交）。CI 以全新瀏覽器執行，保留報告。

測試使用隔離瀏覽器環境，不操作真實使用者資料。原生檔案選擇器使用替身驗證協定，OS 視窗、真實硬碟權限及瀏覽器列印視窗仍需發布前實機驗收。`npm audit` 只涵蓋 QA 鎖定依賴，不代表 vendor bundle 已通過供應鏈稽核。

## 資料與備份

自動保存僅寫入目前瀏覽器。工作檔按「儲存工作檔到電腦…」才會寫入所選 JSON 檔案；不支援時改為下載。外部檔案不隨自動保存更新。「開啟電腦工作檔…」與完整備份匯入均建立副本，不覆蓋原檔。

每份檔案保留最近十次成功修改前版本，可還原為副本；完整備份包含歷史版本。歷史與圖片也占用瀏覽器配額，請定期下載完整備份。永久刪除會移除相應歷史，無法復原。瀏覽器清除資料、系統強制結束、儲存裝置故障不在自動保存保證範圍。

發布條件與尚未驗證項目見 [docs/QA-REPORT.md](docs/QA-REPORT.md)、[docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md)。

候選版預覽與下載方式見 [docs/PREVIEW.md](docs/PREVIEW.md)，發布批准與驗收進度見 [docs/RELEASE-CHECKLIST.md](docs/RELEASE-CHECKLIST.md)。
