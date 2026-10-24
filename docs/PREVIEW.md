# 候選預覽（不影響正式站）

- 工作台M1：https://lrqrll.github.io/practical-thinking-studio-preview/
- 僅斜體入口撤下：https://lrqrll.github.io/practical-thinking-studio-preview/italic-controls/

上述網址只有在Pages建置及HTTPS瀏覽器檢查通過後才可標為已驗證；最新狀態以候選PR checks及deployment.json為準，不能以版本參數冒充部署。完整來源SHA顯示在橫幅。

M1使用新的獨立候選DB／草稿prefix；先前預覽資料仍留在原namespace，可從斜體候選入口讀取，沒有清除或自動遷移。正式DB完全分開。不同路徑仍共用origin，詳WORKBENCH-M1.md。

建置只複製已提交公開資產，排除測試／環境秘密，拒絕覆蓋非空輸出資料夾。候選包file://操作由CI測；終端使用者主要入口是HTTPS，不要求安裝Node、Python或Office。
