# 下一個 Codex 任務接續點

## 2026-10-24 正式部署追蹤（最新狀態）

- 目前環境 GitHub 身分已恢復為 lrqrll；不需重新授權。使用者對 PR #5 指定 cb7c8a595295eaf301ad629f1e48c646559eb71d 的批准仍有效，已依批准合併。
- PR #5 合併提交：a0edd157ef1a01572e296db01c23f9a8b9651a76。Pages 39983494187 成功，Pages build API 的 commit 亦符合；正式站為 3.2.1。
- main CI 39983494640 成功：6 單元、54 瀏覽器、15 次選取重複、audit 0 弱點；一般正式 HTTPS 只驗證版本及備忘錄保存重開，不能代替文件專項。
- 正式文件專項 Actions 39983688217 **失敗**：Install browser 下載 Azure Ubuntu mirror 的 OS／字型依賴逾 5 分鐘；公開全資產比對與原清單／反向選取／保存重開測試均 skipped，沒有任何正式文件通過結果。
- 已依使用者「若失敗則停止並回報」停止，不重試、不解除 DOC-SELECT-02 驗收阻擋、不恢復 Excel。此為驗收基礎設施失敗，不能聲稱已在正式站重現或排除程式缺陷。
- 未停用 TLS 或修改憑證信任庫。驗證程式在 codex/nexus-release-acceptance 的 5af39fc；目前 codex/nexus-release-status 保存此結果，未合併、不部署，推送不觸發文件專項重跑。
- 下次接續：先由使用者確認停止後是否恢復工作，再處理依賴下載可靠性，執行相同標準的正式文件專項及實際公開資產比對。PR #5 合併授權已執行，不要再次索取相同授權；其他新提交不能擅自合併。所有門檻通過才恢復 Excel。


先讀 AGENTS、QA-REPORT、KNOWN-ISSUES、CI-FAILURE-ANALYSIS、RELEASE-CHECKLIST；不要重建。

使用者已批准 PR #4 的 0e27cdc 合併及正式部署，已完成：main c400e6f，Pages run 39978438967，公開站 3.2.1。不要再索取這次已執行合併的批准。但合併後 QA run 39978439742 為 6 單元通過、51 瀏覽器通過／1 清單失敗，不能宣稱驗收完成。

當前追加修正在 codex/nexus-document-selection-followup：原生導覽 keyup 即時同步選取，避免延後 focus 把 AllSelection 寫回；保留反向 anchor/head，新增控制／反向回歸。修正前本機原案例 14/15 通過，控制案例失敗；修正後原案例和控制案例各15次共30/30通過。GitHub artifact 403 時未降低 TLS，改用本機原案例重現與 trace 取得根因。

PR #5 https://github.com/lrqrll/practical-thinking-studio/pull/5 已建立並可審查。應用提交87feee59aade651fd06ee0f076920b038fcaa9e0 的 CI 39979908311 全通過：6單元＋54瀏覽器＋15次選取重複、audit、預覽包與正式／預覽HTTPS。正式冒煙確為3.2.1；正式站尚無追加修正。預覽來源以最新 deployment.json 和 PR head 為準，純文件補記後也須重新部署metadata。

追加修正必須獨立 PR、CI、HTTPS 預覽，具體候選完成後再請使用者批准新 PR 合併／部署；原批准明確針對 PR #4 的 head。不能自行假設包含新提交。

預覽 https://lrqrll.github.io/practical-thinking-studio-preview/，只推送 practical-thinking-studio-preview repo，不動正式 Pages 來源。metadata／橫幅顯示來源 SHA，獨立 DB、草稿 namespace，缺失 metadata fail closed。建置用 scripts/build-preview.cjs 全新空目錄；部署 checkout /tmp/nexus-preview-publish-321，先核對 origin/main 未分歧。

Excel branch codex/nexus-spreadsheet 已建於 c400e6f，目前無已提交的編輯器。純模型草稿暫存 /tmp/nexus-spreadsheet-model-next.js，未測、未載入網站；不可當成完成。解除 DOC-SELECT-02 並正式驗證後才恢復，勿遺失這份草稿；完整多表／網格／公式／格式／列欄／貼上／排序篩選／CSV XLSX／保存重開歷史都需驗收。

本機測試 NEXUS_TEST_PORT=8012 NEXUS_CHROMIUM=/usr/bin/chromium npm test；預設8000舊server可能無回應。npm cache 用 /tmp/nexus-npm-cache。HTTPS瀏覽器用GitHub runner，不能忽略憑證錯誤或持久更動信任庫。CI Ubuntu24.04／安裝5分鐘上限保持。無額外AI審查或模型切換。
