# NEXUS 3.2.1 驗收報告

日期：2026-10-23（Asia/Taipei）。正式基線 main c5786f3／3.2.0；3.2.1 已備妥，PR #4 可審查，尚未批准合併／正式部署。

## 實際結果

- 本機：Node 24.19.0、Python 3.12.14、Chromium；**6/6 單元、52/52 瀏覽器，0 失敗／跳過／重試**。
- [Actions 39976684098](https://github.com/lrqrll/practical-thinking-studio/actions/runs/39976684098)，已驗證應用提交 `3c51edec480f954a830a2eb92c62edfe50b492c2`：全部測試、audit、預覽建置、file:// 預覽包、正式 HTTPS 基線及獨立 HTTPS 預覽全部成功。PR 最新文件提交的 checks 另以 GitHub 顯示為準。
- npm audit：QA 鎖定依賴 0 弱點；git diff --check 通過。audit 不涵蓋提交的 vendor bundle。
- 公開預覽：[NEXUS 3.2.1](https://lrqrll.github.io/practical-thinking-studio-preview/)。畫面與 deployment.json 顯示實際來源 SHA；公開關鍵資產已與建置包逐位元比對。
- 正式站 index.html／storage.js 在預覽部署前後逐位元相同，仍為 3.2.0，Pages 來源未改。

## 首次失敗沒有忽略

已以正常 HTTPS 取得 39820174844 的 artifact：42 通過、4 失敗。比對證明 afc977f 到 bc328f0 未修改該四個測試或功能，因此後續一次綠燈不是修復證據。

本次根因與修復見 [CI-FAILURE-ANALYSIS.md](CI-FAILURE-ANALYSIS.md)：

1. 清單：原生 DOM 選取與 ProseMirror model 可能不同步，舊焦點恢復把額外 trailing paragraph 納入。現在格式化前同步畫面可見範圍，保留 NodeSelection／CellSelection。
2. 尋找：Tiptap focus 延至 animation frame，處理完成時選取仍空白。改為同步焦點與結果選取。
3. 移動：全選非同步重繪替換目標 select，丟失已選目的地。現在只更新勾選／按鈕，不重建控制項。
4. 資料夾：測試過早讀取 nth(1) 誤選垃圾桶；刪除交易未完成時切換又被後續回呼重設。改為名稱選項、等待真實刪除結果，且操作期間真正 disabled。

兩組控制時序測試各取得修復前 2/2 失敗證據，修復後通過。原四案例曾各 5 次共 20/20 通過，但 39974712148 仍在遠端抓出 2 項未完整修復；已繼續補強並保留該失敗，未用本機重複通過取代根因分析。最終 52 項完整遠端通過。統計見 qa-3.2.1-results.json；舊 qa-results.json 為 rc.1 歷史紀錄。

39975827685 停於 OS 依賴安裝，取消日誌顯示 Azure Ubuntu mirror 的字型下載極慢，尚未執行應用測試，不列入通過。CI 已固定 Ubuntu 24.04 並限制安裝步驟 5 分鐘；後續完整執行成功。

## 覆蓋

儲存配額／transaction abort 回滾、失敗重試、保存中再次編輯／導覽、跨分頁衝突、草稿副本、十版歷史及版本號、完整備份／還原、舊版遷移保留原資料；八工具新增／編輯／保存／重開／匯出與獨立性；文件格式／清單／表格增刪合併分割／圖片／連結／尋找取代／頁面設定、DOCX 回讀與 ZIP/XML、HTML、列印 frame／PDF 結構；檔案與資料夾管理、垃圾桶、CSV 注入、sanitize、390／1280px 與 axe。

預覽測試證明正式 IndexedDB 與 recovery sentinel 保持原值、不遷移正式 legacy 資料；缺少預覽 metadata 時 fail closed。GitHub runner 已實際操作下載包文件編輯／保存／重開，以及 HTTPS 預覽初始化／備忘錄編輯保存重開。未停用 TLS 驗證或修改持久憑證信任庫。

## 發布邊界

目前沒有已知未解決的 P0／P1 程式缺陷；正式合併／部署仍需使用者批准。OS 原生選擇器／實體列印、Word 精確版型、Safari／Firefox／真實手機及螢幕閱讀器仍是如實列出的 P2 驗收限制，不能以 headless／API 替身宣稱全部實機通過。

批准後合併 PR #4，核對 Pages 部署提交，以 NEXUS_EXPECTED_VERSION=3.2.1 驗證正式 HTTPS；成功後才開獨立 Excel 分支。見 RELEASE-CHECKLIST.md 與 RESUME.md。
