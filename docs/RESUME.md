# NEXUS 接續點

2026-10-24（Asia/Taipei）。先讀AGENTS、MODEL-STRATEGY、QA-REPORT、KNOWN-ISSUES，不重建、不重做已完成修復。

## 已完成正式發布

- PR #5已依批准的cb7c8a5合併，正式main與Pages為a0edd157ef1a01572e296db01c23f9a8b9651a76，3.2.1。
- main CI39983494640（6單元＋54瀏覽器＋15重複＋audit）及Pages39983494187通過。
- 正式文件驗收39985267265通過：26個公開實際資產逐位元符合a0edd15；正式HTTPS原清單／受控焦點／反向選取，各5次保存重開共15/15，無跳過／重試。P1已解除，可以恢復Excel。
- 39983688217 attempt1安裝5分鐘逾時；一次有限重試attempt2安裝成功、但原生fetch ok當方法造成驗收腳本錯誤。測試分支c49c4d4修正ok/status屬性後新執行成功。失敗保留，不能誤寫為正式功能失敗。
- Artifact12514418883有assets及測試報告（30天）；本環境代理對blob下載403，未繞過TLS；GitHub日誌已核對。不要因下載artifact失敗而否定或虛構瀏覽器結果。

## 開發與授權

- QA／策略／發布證據在codex/nexus-qa-policy-report，尚未合併。新的合併須具體批准；PR #5原批准已執行，不再索取。
- 使用者授權必要時指定模型代理；主代理模型／推理與切換工具未提供可確認資訊，不假裝切換。能力與升降級規則見MODEL-STRATEGY；一般工作不用多代理審查。
- 下一項是真正Excel：純核心資料模型／安全公式與測試先行，之後網格、多表／列欄／貼上／格式／排序篩選、CSV/XLSX、保存重開歷史與瀏覽器驗收。未完成不上架，不用預算工具冒充。
- 本機NEXUS_TEST_PORT=8012 NEXUS_CHROMIUM=/usr/bin/chromium npm test，npm cache /tmp/nexus-npm-cache。預設8000舊server可能無回應。
- 正式HTTPS瀏覽器由GitHub runner驗證；不降低TLS或持久加入CA。依賴下載的Azure Ubuntu mirror偶爾很慢，有限重試與環境修正要有界線，不刪測試或假通過。
- 預覽：https://lrqrll.github.io/practical-thinking-studio-preview/，metadata／橫幅為真實來源SHA；獨立DB／草稿。預覽部署只改preview庫，絕不覆蓋正式站。建置用scripts/build-preview.cjs全新空目錄。
