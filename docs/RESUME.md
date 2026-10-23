# 下一個 Codex 任務接續點

先讀 AGENTS、QA-REPORT、KNOWN-ISSUES、CI-FAILURE-ANALYSIS、RELEASE-CHECKLIST；不要重建。

使用者已批准 PR #4 的 0e27cdc 合併及正式部署，已完成：main c400e6f，Pages run 39978438967，公開站 3.2.1。不要再索取這次已執行合併的批准。但合併後 QA run 39978439742 為 6 單元通過、51 瀏覽器通過／1 清單失敗，不能宣稱驗收完成。

當前追加修正在 codex/nexus-document-selection-followup：原生導覽 keyup 即時同步選取，避免延後 focus 把 AllSelection 寫回；保留反向 anchor/head，新增控制／反向回歸。修正前本機原案例 14/15 通過，控制案例失敗；修正後原案例和控制案例各15次共30/30通過。GitHub artifact 403 時未降低 TLS，改用本機原案例重現與 trace 取得根因。

追加修正必須獨立 PR、CI、HTTPS 預覽，具體候選完成後再請使用者批准新 PR 合併／部署；原批准明確針對 PR #4 的 head。不能自行假設包含新提交。

預覽 https://lrqrll.github.io/practical-thinking-studio-preview/，只推送 practical-thinking-studio-preview repo，不動正式 Pages 來源。metadata／橫幅顯示來源 SHA，獨立 DB、草稿 namespace，缺失 metadata fail closed。建置用 scripts/build-preview.cjs 全新空目錄；部署 checkout /tmp/nexus-preview-publish-321，先核對 origin/main 未分歧。

Excel branch codex/nexus-spreadsheet 已建於 c400e6f，目前無已提交的編輯器。純模型草稿暫存 /tmp/nexus-spreadsheet-model-next.js，未測、未載入網站；不可當成完成。解除 DOC-SELECT-02 並正式驗證後才恢復，勿遺失這份草稿；完整多表／網格／公式／格式／列欄／貼上／排序篩選／CSV XLSX／保存重開歷史都需驗收。

本機測試 NEXUS_TEST_PORT=8012 NEXUS_CHROMIUM=/usr/bin/chromium npm test；預設8000舊server可能無回應。npm cache 用 /tmp/nexus-npm-cache。HTTPS瀏覽器用GitHub runner，不能忽略憑證錯誤或持久更動信任庫。CI Ubuntu24.04／安裝5分鐘上限保持。無額外AI審查或模型切換。
