# NEXUS 候選版預覽

正式站由 practical-thinking-studio 的 main 根目錄部署；PR #4 已經使用者批准合併並部署 3.2.1。PR #5 的追加選取修正僅在獨立預覽，尚未批准合併。

## 可操作替代方案

GitHub 整合起初拒絕 createRepository；使用者已建立空白公開 `lrqrll/practical-thinking-studio-preview` 並授權，目前已確認 admin／push 權限。預覽部署在該獨立儲存庫，正式 Pages 來源不變。公開網址必須在實際部署與 HTTPS 瀏覽器驗證後才標為可用。

品質 workflow 會建立 **NEXUS-preview-3.2.1** artifact，包含真實候選版完整靜態檔案、deployment.json、版本／來源 commit 標示，以及 OPEN-PREVIEW.txt。下載、完整解壓後，在 Chromium 開啟 index.html 即可操作；若瀏覽器限制 file:// 儲存，依 OPEN-PREVIEW.txt 使用 Python 提供本機 HTTP 服務。不需 npm、主機帳號或付費 API。此方案需要下載，並非線上代管的 HTTPS 網站。

`node scripts/preview-smoke.cjs` 在 GitHub runner 以真正的 file:// 預覽包驗證版本／commit、獨立資料庫、文件編輯、自動保存及重新開啟，不只驗證 ZIP 存在。

## 資料隔離

GitHub Pages 的不同儲存庫路徑仍共用 lrqrll.github.io origin。預覽因此明確使用 nexus-preview-pr4-workspace 與 nexus-preview-pr4-recovery:；正式站保留 nexus-workspace／nexus-recovery:。預覽不自動遷移 thinking-studio-v1，不恢復正式草稿。這是應用命名空間隔離，不宣稱同源網站具有獨立 origin 的安全邊界。

預覽 deployment.js 由建置注入完整來源 SHA；橫幅顯示版本與 SHA。既定公開預覽路徑若缺少有效 metadata，會在開啟 IndexedDB 前停止，避免退回正式資料庫。預覽包不包含 repository metadata、測試套件或環境值。建置拒絕未提交的應用變更及非空輸出目錄。

## 建立公開 Pages 的必要條件

使用者建立空白公開儲存庫 `lrqrll/practical-thinking-studio-preview`，並授予目前 GitHub 整合存取權後，可將已驗證預覽包推送該庫並啟用免費 Pages。必須實際確認 HTTPS 載入、metadata、獨立資料及編輯保存，才提供網址。不能為了預覽覆寫正式站或切換正式 Pages 來源。

本機受管理 Chromium 政策禁止 file://（ERR_BLOCKED_BY_ADMINISTRATOR），未繞過政策；本機改以 HTTP 提供相同預覽包驗證。CI 另驗證下載包的 file:// 使用，以及公開 HTTPS 預覽。

## 已發布並驗證

HTTPS 預覽：https://lrqrll.github.io/practical-thinking-studio-preview/ 。Actions 39976684098 已驗證版本、實際 source SHA、獨立資料庫及編輯保存重開；同時驗證可下載 artifact 的 file:// 文件操作。來源 SHA 以部署時 deployment.json／橫幅為準，每次更新都重新產生資產查詢 SHA 以防混用舊快取，實際 JS／CSS 亦由對應提交複製。這次預覽更新未更動正式站設定或資產；正式站先前經批准的 3.2.1 部署是獨立動作。

追加修正 PR #5 的應用提交 87feee59aade651fd06ee0f076920b038fcaa9e0 已通過 Actions 39979908311 的公開 HTTPS 身份／版本／隔離資料及保存重開驗證，公開 index／deployment.js／document-editor.js／storage.js 也逐位元符合建置包。最新純文件提交部署後，仍以 metadata／橫幅的完整 SHA 為準。
