# NEXUS 3.2.1 正式驗收報告

最新狀態（2026-10-24，Asia/Taipei）：**PR #5 已批准合併、部署並完成正式專項驗收，DOC-SELECT-02 的 P1 阻擋解除。** 正式 main `a0edd157ef1a01572e296db01c23f9a8b9651a76`，版本 3.2.1。

## 本次可核對證據

| 驗證 | 結果／證據 |
| --- | --- |
| main 全站 CI | [39983494640](https://github.com/lrqrll/practical-thinking-studio/actions/runs/39983494640) 成功：6 單元、54 瀏覽器、15 次選取重複、audit 0 弱點。 |
| Pages | [39983494187](https://github.com/lrqrll/practical-thinking-studio/actions/runs/39983494187) 成功，build API commit 與 main 的 a0edd15 完全相同。 |
| 公開實際資產 | [39985267265](https://github.com/lrqrll/practical-thinking-studio/actions/runs/39985267265) 的 verify-release-assets：26 個根目錄公開資產逐位元符合 a0edd15，並保存每檔 SHA-256。不是只核對版本參數。 |
| 正式 HTTPS 文件 | 同次 Actions：原清單失敗流程、受控焦點競態、反向選取各 5 次，共 **15 通過、0 失敗／跳過／重試**。每測試使用全新隔離 context；清單數量、反向 anchor/head、斜體實際結果及保存重開均有斷言。未使用 ignoreHTTPSErrors 或注入代理 CA。 |
| 可下載證據 | Actions artifact `production-document-acceptance`，ID 12514418883，保留30天，含 assets.json、JSON／HTML測試報告。環境代理拒絕此 blob 下載（403），未繞過；已核對正常 GitHub API／完整執行日誌與工作流程來源。 |

## 失敗分類及有限重試

- 39983688217 attempt 1：OS／字型依賴下載逾5分鐘，文件未測，屬環境失敗。
- 使用者批准的一次有限重試 attempt 2：安裝成功，25.9 MB 依賴約3秒完成；Azure Ubuntu mirror 的慢速下載未再次發生。接著驗收腳本把原生 fetch 的 response.ok 屬性誤當方法，屬驗收程式失敗，文件仍未測。
- 測試分支 c49c4d4 只修正原生 fetch 的 ok／status 屬性存取；正式程式及 SHA 未改、未放寬斷言。新執行39985267265完成資產與15項正式文件測試，全部成功。
- 不是無限重跑；兩次失敗保留，沒有算成網站功能失敗或通過。既有5分鐘安裝限制此次足夠，未跳過依賴、降低TLS或另啟付費資源。

## 發布界線

本次 P1 已解除，可以恢復獨立 Excel 分支；沒有新的正式合併授權。Safari／Firefox／實機觸控與螢幕閱讀器、OS原生檔案選擇器、真實列印與Word精確版型、vendor可重建性仍為已揭露P2限制。既有儲存與八工具回歸證據見上列main CI；不以此宣稱所有實機場景已測。

## 先前階段歷史紀錄（不是目前狀態）


## 2026-10-24 正式部署追蹤（最新狀態）

- 目前環境 GitHub 身分已恢復為 lrqrll；不需重新授權。使用者對 PR #5 指定 cb7c8a595295eaf301ad629f1e48c646559eb71d 的批准仍有效，已依批准合併。
- PR #5 合併提交：a0edd157ef1a01572e296db01c23f9a8b9651a76。Pages 39983494187 成功，Pages build API 的 commit 亦符合；正式站為 3.2.1。
- main CI 39983494640 成功：6 單元、54 瀏覽器、15 次選取重複、audit 0 弱點；一般正式 HTTPS 只驗證版本及備忘錄保存重開，不能代替文件專項。
- 正式文件專項 Actions 39983688217 **失敗**：Install browser 下載 Azure Ubuntu mirror 的 OS／字型依賴逾 5 分鐘；公開全資產比對與原清單／反向選取／保存重開測試均 skipped，沒有任何正式文件通過結果。
- 已依使用者「若失敗則停止並回報」停止，不重試、不解除 DOC-SELECT-02 驗收阻擋、不恢復 Excel。此為驗收基礎設施失敗，不能聲稱已在正式站重現或排除程式缺陷。
- 未停用 TLS 或修改憑證信任庫。驗證程式在 codex/nexus-release-acceptance 的 5af39fc；目前 codex/nexus-release-status 保存此結果，未合併、不部署，推送不觸發文件專項重跑。
- 下次接續：先由使用者確認停止後是否恢復工作，再處理依賴下載可靠性，執行相同標準的正式文件專項及實際公開資產比對。PR #5 合併授權已執行，不要再次索取相同授權；其他新提交不能擅自合併。所有門檻通過才恢復 Excel。


日期：2026-10-23。使用者已批准 PR #4 的 0e27cdc；已合併為 c400e6f57403490337c9435548be02459a1eac1c，Pages 39978438967 成功部署，HTTPS storage.js 確為 3.2.1。但合併後 CI 39978439742 的清單回歸再失敗，**最終驗收尚未完成**。目前追加修正在獨立分支 codex/nexus-document-selection-followup，尚未合併／部署此修正。

## 合併後追蹤（優先於以下歷史結果）

- main CI：6 單元通過；51 瀏覽器通過、1 失敗；後續 audit／線上冒煙步驟因測試失敗未執行，不能標記通過。
- 本機原案例重複：14 通過／1 失敗；控制案例修正前失敗；修正後原案例＋控制案例各 15 次，30/30 通過。
- 追加同步導覽鍵選取、保留反向範圍，新增兩項回歸；本機完整結果為 **6/6 單元＋54/54 瀏覽器，0 失敗／跳過／重試**；npm audit 0 弱點，diff check 通過。[Actions 39979908311](https://github.com/lrqrll/practical-thinking-studio/actions/runs/39979908311) 驗證應用提交 `87feee59aade651fd06ee0f076920b038fcaa9e0` 全部成功：6 單元、54 瀏覽器、三個選取案例各 5 次共 15 次、audit、file:// 預覽包、指定 3.2.1 的正式 HTTPS 保存重開，以及核對候選 SHA 的 HTTPS 預覽。
- 正式 HTTPS 冒煙已驗證版本 3.2.1 與保存／重開；獨立線上驗證工作流程也已新增，完整 QA 失敗時仍可另外執行。線上備忘錄冒煙通過不會解除正式站的已知清單阻擋。
- Excel 分支已建立但暫停；試算表草稿未接入網站、未上架。先解除 DOC-SELECT-02。

以下為合併前的歷史證據，保留原始結果，不代表合併後全部通過。

## 實際結果

- 本機：Node 24.19.0、Python 3.12.14、Chromium；**6/6 單元、52/52 瀏覽器，0 失敗／跳過／重試**。
- [Actions 39976684098](https://github.com/lrqrll/practical-thinking-studio/actions/runs/39976684098)，已驗證應用提交 `3c51edec480f954a830a2eb92c62edfe50b492c2`：全部測試、audit、預覽建置、file:// 預覽包、正式 HTTPS 基線及獨立 HTTPS 預覽全部成功。PR 最新文件提交的 checks 另以 GitHub 顯示為準。
- npm audit：QA 鎖定依賴 0 弱點；git diff --check 通過。audit 不涵蓋提交的 vendor bundle。
- 公開預覽：[NEXUS 3.2.1](https://lrqrll.github.io/practical-thinking-studio-preview/)。畫面與 deployment.json 顯示實際來源 SHA；公開關鍵資產已與建置包逐位元比對。
- 合併前預覽部署未改動正式站；當時 index.html／storage.js 逐位元相同、版本為 3.2.0。之後經使用者批准才部署 3.2.1。

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

正式站仍有 DOC-SELECT-02（P1）；追加修正候選需完成 CI／預覽並經使用者批准合併部署，才可解除發布門檻。OS 原生選擇器／實體列印、Word 精確版型、Safari／Firefox／真實手機及螢幕閱讀器仍是如實列出的 P2 驗收限制，不能以 headless／API 替身宣稱全部實機通過。

PR #4 已批准合併部署；PR #5 追加修正尚未批准。完成追加發布驗證後恢復既有 codex/nexus-spreadsheet 分支。見 RELEASE-CHECKLIST.md 與 RESUME.md。
