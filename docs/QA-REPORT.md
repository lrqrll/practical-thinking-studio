# QA 驗收報告

驗收日期：2026-10-23（Asia/Taipei）。基線 main `c5786f3`／3.2.0；候選版 `3.2.1-rc.1`，尚未合併或發布。

## 驗證環境與方法

Linux、Node 24.19.0、Python 3.12.14、系統 Chromium、Playwright 1.64.1。由 Python HTTP server 提供相同靜態檔案；使用隔離 browser context，兩個 worker，不使用真實使用者資料。無自動重跑失敗案例來掩蓋結果。

可重跑：

```sh
npm ci --ignore-scripts
NEXUS_CHROMIUM=/usr/bin/chromium npm test
npm audit --audit-level=high
```

一般 CI 使用 Playwright 安裝的 Chromium，不設定 NEXUS_CHROMIUM。HTML、JSON 與失敗 trace 由 runner 產生在忽略目錄，GitHub Actions 設定會保存 artifact。

## 本次修改

- 保存佇列不再被舊 saveError 永久阻斷；成功後清除錯誤，重試仍保留 rev 衝突檢查。
- debounce 前立即備援草稿，每分頁獨立 key；僅清除自己的草稿，離開前檢查 dirty。flush 排空等待期間新增的保存。
- 保存失敗可下載最新草稿，或直接另存 NEXUS 工作檔；不會誤稱瀏覽器已保存。
- 通用 NEXUS JSON 檔案另存／開啟，File System Access 支援手動重寫同一 handle；替代路徑為下載／檔案上傳匯入。匯入建立副本。
- 新增最近十次修改前歷史快照，同交易寫入與回滾；完整備份保留歷史，復原為副本；匯入後修訂號繼續遞增。
- 永久刪除與清空垃圾桶需確認；資料層拒絕永久刪除未進垃圾桶的檔案，刪除時清除歷史。
- 搜尋只重建結果，保留輸入節點；區分「最近使用工具」和「最近開啟文件」。
- 防止空白／控制字元前綴 CSV 公式注入；拒絕畸形備份與文件 marks、非整數預算人數。
- 建立 AGENTS、ROADMAP、架構盤點、已知問題、README、鎖定 QA 依賴及 GitHub Actions。保留既有架構、資料庫名稱與八個工具，不恢復退休圖片工具。

## 已覆蓋範圍

| 項目 | 實際斷言 |
| --- | --- |
| 儲存 | 容量不足重試、最新資料、寫入中再次編輯、導覽期間編輯、兩分頁衝突、草稿副本復原、兩層失敗仍可下載、真實 IDB transaction abort 回滾 |
| 歷史與備份 | 十版上限、版本內容、還原副本、匯入後修訂號、完整 JSON UI 下載／還原、畸形輸入不寫入、舊版遷移一次且保留原資料 |
| 文件格式 | 粗體／斜體／底線實際 DOM、CSS、重新開啟及 DOCX XML；字型字級、標題、對齊、編號／項目清單、復原重做、尋找全部／單次取代、連結與移除 |
| 文件結構 | 表格增刪列欄、合併／分割後重新開啟；圖片插入／調整與頁面設定保存 |
| 文件互通 | DOCX ZIP／XML、HTML 內容、DOCX 回讀副本、損毀 DOCX 拒絕、列印 frame 內容、同內容 PDF 簽章與大小 |
| 八個工具 | 新增、編輯、保存、重新開啟與輸出；備忘錄／報告／報價／大綱／會議及任務／預算的獨立資料；文字輸入不執行 HTML、負值／不支援圖片等異常 |
| 檔案管理 | 命名、複製、移動、多選、資料夾建立／刪除、垃圾桶還原、確認取消／永久刪除／清空、搜尋插入游標穩定 |
| 本機讀寫 | 下載／匯入真實瀏覽器流程；API 替身驗證選擇器、write／close、handle 重用、取消、失敗 abort 與開啟讀入 |
| 介面與安全 | 390px 八個工具無全頁水平溢出；390／1280px 首頁與文件深淺色、axe WCAG A/AA／2.1 AA 規則；sanitizer 移除 script、事件、危險連結與遠端圖片；未捕捉 JS 錯誤或應用資源 HTTP 失敗即失敗 |

## 結果

**最終完整執行通過：6/6 單元測試、46/46 瀏覽器測試；0 失敗、0 跳過、0 重試。** 瀏覽器套件約 1.1 分鐘。逐項結果見 [qa-results.json](qa-results.json)。較早的 31 項瀏覽器回歸曾全數通過；擴充測試時發現並修正了測試在資料夾重新繪製前就勾選舊 checkbox 的同步問題，保留永久刪除的所有斷言。另一次初始化逾時的 trace 顯示頁面仍在啟動、未有程式例外，單獨重跑通過；最終結果以固定來源的完整重跑為準，不把這些先前失敗隱藏為從未發生。

`npm ci --ignore-scripts` 已成功重建六個 QA 套件；`npm audit --audit-level=high` 回報 0 個弱點（僅 QA 依賴）；`git diff --check` 通過。

## 未驗證與發布門檻

重新檢查後 GitHub API／Pages HTTPS 已可存取，確認 Pages 是 legacy 模式、來源 main 根目錄，現有網站仍為 3.2.0。草稿 PR #4 已建立；首次遠端 Actions 失敗，正在取得診斷，不能稱遠端已通過。原生 OS 選擇器／權限、列印視窗、Word／LibreOffice 排版、Safari／Firefox／真實手機與螢幕閱讀器未驗收。PDF 測試沒有冒稱已完成 OS 的「另存 PDF」視窗操作。

詳細限制與分級見 KNOWN-ISSUES.md。**目前不得正式發布或開始大型編輯器**；先解除 RELEASE-01 並完成發布驗收，再依 ROADMAP 前進。
