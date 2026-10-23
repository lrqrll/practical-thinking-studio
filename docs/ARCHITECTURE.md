# 接手盤點

基線 `c5786f3`（GitHub main，接手時已 fetch 核對），基線 BRAND.version = 3.2.0；本分支候選版為 3.2.1-rc.1，未發布。

## 架構與載入

GitHub Pages 純靜態網站，`.nojekyll`，相對路徑資源、hash 路由，不需後端／API／金鑰／建置。原儲存庫沒有 README、AGENTS、套件清單、測試或 Actions；本分支新增的 npm 依賴僅供 QA。

index.html defer 依序：storage → media-model → document-model → tool-registry → tools-core → workbench → excel-export → media-tools → document-export → document-editor → local-files（本次新增）→ workspace。函式在啟動時才使用模型，所有 classic scripts 共用全域作用域。app.js 是舊快取入口的轉址相容檔，首頁不載入。

workspace 管理路由、檔案／資料夾、備份、主題與偏好；tools-core 管理 state、保存佇列與基礎工具；workbench 為報價、簡報大綱及會議紀錄；media-tools 為備忘錄及退休素材匯出；document-editor 為 Tiptap 文件編輯。退休素材不列入正式工具，舊資料保留。

## 儲存

IndexedDB `nexus-workspace` v1：files、folders、meta，以 id 為 key。檔案含 type、name、folderId、時間、deletedAt、schemaVersion、rev、data。update 交易讀取並比較 rev，避免跨分頁覆寫。localStorage 保留失敗草稿；本分支改為每分頁獨立 key，debounce 前立即寫入。兩層皆可能滿額，提供明確警示與未保存內容下載，不能保證瀏覽器／系統強制終止時資料不遺失。

JSON 備份是 nexus-workspace v1，匯入重新產生 id，避免覆蓋。舊版 thinking-studio-v1 在首次開啟保留 archive 並轉換；不刪除原 localStorage。rev 是樂觀鎖版本號。本分支另外在 meta 的 history:<fileId> 保存最近十次修改前快照，與檔案更新在同一交易完成，並納入完整備份；歷史復原建立獨立副本。既有資料不能回溯重建修復前歷史。

## 正式工具及輸出

| 工具 | 內容 | 原有輸出 |
| --- | --- | --- |
| 文件 | Tiptap 圖文、表格、頁面設定 | DOCX、HTML、瀏覽器列印／PDF；DOCX 匯入副本 |
| 備忘錄 | 文字、標籤、清單、圖片、釘選 | HTML、TXT，清單轉任務副本 |
| 任務管理 | 工作、負責人、日期、前置條件、狀態 | CSV；前置條件不自動排程 |
| 預算試算 | 成本、售價、人數與損益 | 含公式 XLSX、數值 CSV |
| 報價比較 | 兩家費用、範圍、交期與條件 | CSV |
| 簡報大綱 | 五頁標題與文字 | HTML，非 PPTX |
| 工作報告 | 結果、影響、決策 | TXT |
| 會議紀錄 | 決定、待確認、行動 | HTML，非 DOCX |

所有工具另有本次新增的 NEXUS JSON 工作檔讀寫，支援 File System Access 與下載／匯入替代方案。

## 第三方及部署

文件引擎延遲載入 document-vendor（授權清單含 Tiptap 3.32.0／ProseMirror）、docx-vendor、mammoth-vendor、purify-vendor（DOMPurify 3.4.17）；XLSX 匯出延遲載入 xlsx.full.min.js。字型與 vendor 均已提交，執行不需 CDN。授權見 document-vendor-LICENSES.txt、sheetjs-LICENSE.txt 及檔頭；未有可重建 vendor 的來源套件清單與建置腳本，npm audit 不涵蓋這些嵌入式資產。

原儲存庫無部署 workflow。Pages 分支／站點設定需 GitHub API 權限核對；不能單憑 .nojekyll 推定實際部署設定。重大變更以 PR 合併，由現有 Pages 設定部署，然後對公開站執行冒煙驗證。
