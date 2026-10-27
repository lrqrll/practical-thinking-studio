# NEXUS

正式版本 **3.4.0**，發布提交 `78e90aec61ca825d45534c93515df4d8f949a431`。Work已對未合併[QA工具PR #17](https://github.com/lrqrll/practical-thinking-studio/pull/17)的工具 `ab0551364946fb11868cc6f5f309ef45dc2fe64d`完成獨立證據／程式／視覺審查，QA-FONT-01與QA-CONTEXT-01結案；不代表親自重演42項操作。現已有限授權A：M3.1文字成果組裝、B：文件維護、C：工時紀錄，A／C候選已實作並經開發者驗證，待Work有界複審；不是整個M3／M4獲授權，不含合併main、正式部署或auto-merge。範圍見[路線圖](ROADMAP.md)，歷史失敗、未測與後續待辦見[QA報告](docs/QA-REPORT.md)及[已知問題](docs/KNOWN-ISSUES.md)。

A候選[PR #18](https://github.com/lrqrll/practical-thinking-studio/pull/18) head `2ff102580ffa22f5f77f65ff54ef10e385597c8d`（base工具ab055136）已實作凍結來源→document保存重開→DOCX／HTML；C候選[PR #19](https://github.com/lrqrll/practical-thinking-studio/pull/19) head `4992808262c81f12e21252b776384a517a130f68`（base A）已實作第九工時工具、整數合計、CSV／adapter及完整備份。兩者為3.5.0-rc.1開發者驗證，待Work有界複審；[A預覽](https://lrqrll.github.io/practical-thinking-studio-preview/m31-assembly/)與[含A的整合預覽](https://lrqrll.github.io/practical-thinking-studio-preview/m31/)隔離於正式資料，完整SHA、namespace、依賴、CI與歷史失敗見[交付紀錄](ROADMAP.md)。

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
