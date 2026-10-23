# NEXUS 候選版預覽

正式站仍由 practical-thinking-studio 的 main 根目錄部署；未取得合併／正式部署批准前，不修改 Pages 來源，不合併 PR #4。

## 可操作替代方案

GitHub 整合起初拒絕 createRepository；使用者已建立空白公開 `lrqrll/practical-thinking-studio-preview` 並授權，目前已確認 admin／push 權限。預覽部署在該獨立儲存庫，正式 Pages 來源不變。公開網址必須在實際部署與 HTTPS 瀏覽器驗證後才標為可用。

品質 workflow 會建立 **NEXUS-preview-3.2.1** artifact，包含真實候選版完整靜態檔案、deployment.json、版本／來源 commit 標示，以及 OPEN-PREVIEW.txt。下載、完整解壓後，在 Chromium 開啟 index.html 即可操作；若瀏覽器限制 file:// 儲存，依 OPEN-PREVIEW.txt 使用 Python 提供本機 HTTP 服務。不需 npm、主機帳號或付費 API。此方案需要下載，並非線上代管的 HTTPS 網站。

`node scripts/preview-smoke.cjs` 會以真正的 file:// 預覽包驗證版本／commit、獨立資料庫、文件編輯、自動保存及重新開啟，不只驗證 ZIP 存在。

## 資料隔離

GitHub Pages 的不同儲存庫路徑仍共用 lrqrll.github.io origin。預覽因此明確使用 nexus-preview-pr4-workspace 與 nexus-preview-pr4-recovery:；正式站保留 nexus-workspace／nexus-recovery:。預覽不自動遷移 thinking-studio-v1，不恢復正式草稿。這是應用命名空間隔離，不宣稱同源網站具有獨立 origin 的安全邊界。

預覽 deployment.js 由建置注入完整來源 SHA；橫幅顯示版本與 SHA。既定公開預覽路徑若缺少有效 metadata，會在開啟 IndexedDB 前停止，避免退回正式資料庫。預覽包不包含 repository metadata、測試套件或環境值。建置拒絕未提交的應用變更及非空輸出目錄。

## 建立公開 Pages 的必要條件

使用者建立空白公開儲存庫 `lrqrll/practical-thinking-studio-preview`，並授予目前 GitHub 整合存取權後，可將已驗證預覽包推送該庫並啟用免費 Pages。必須實際確認 HTTPS 載入、metadata、獨立資料及編輯保存，才提供網址。不能為了預覽覆寫正式站或切換正式 Pages 來源。
