# 下一個 Codex 任務接續點

延續 PR #4、codex/nexus-storage-quality；不重建專案。先讀 AGENTS、QA-REPORT、CI-FAILURE-ANALYSIS、PREVIEW、RELEASE-CHECKLIST。

首次 CI 四個失敗已取得原始 artifact 並分析；目前修復與新版測試在分支，版本準備為 3.2.1。正式站仍 3.2.0，沒有合併／部署授權；需先讓使用者驗看候選版，再就具體 PR 請求批准。不要在等待批准時重做已完成的功能，也不要提早開發大型 Excel。

使用者已建立公開 practical-thinking-studio-preview 並授權；已確認當時為空白且具 admin／push 權限。預覽包只能部署到此庫，不修改正式 Pages 來源。最新預覽身份見該庫 deployment.json，必須與 PR head／測試證據對照。CI 也會提供可操作下載版。

同 origin 的預覽庫路徑不能共享正式資料庫；必須保留預覽 namespace、metadata 橫幅及 fail-closed 檢查。不可降低 TLS 驗證或持久修改憑證信任庫。

3.2.1 經批准正式部署並驗證後，才建立獨立 Excel 開發分支。依使用者要求，多表、儲存格、列欄、貼上、格式、公式、自動重算、排序篩選、CSV/XLSX、保存／重開／歷史及測試都須真正實作，不使用預算工具冒充。

此任務未自行切換模型；使用針對性故障重現、保存證據及 GitHub Actions 控制成本，不額外啟動多個 AI 審查。
