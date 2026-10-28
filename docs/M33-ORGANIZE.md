# M3.3 既有內容整理增量（開發者候選）

基線#22 afc80c2b530c6f39c8b73b7e7849937158042457 → #23 9772839043d8cffb4003994f21843a6d3ef895e5 → #24 394acbfb1bb8e30041b440e0b3267a57ec9e51d0均已重新核對，原分支不改。Work有界條件通過不是全部瀏覽器親自重演。正式main仍78e90aec61ca825d45534c93515df4d8f949a431；無合併、正式部署、auto-merge或下一階段授權。

## 可操作流程

工作台卡片首頁→選擇工具→完整內容列表→建立新內容／加入已有內容。卡片由已保存有效關聯衍生，每工具一張、依九工具固定順序、顯示有效內容份數，沒有新卡片配置。不改分類名／順序；「管理分類」是次要入口，保留原改名／排序／草稿恢復流程。

工具列表可搜尋、按原分類順序／名稱／最近修改排序。選取目標分類→「加入已有內容」→搜尋名稱→選取→確認，工具頁只列相符工具，分類管理列九工具。已歸屬內容標示工作台／分類並禁止再選。加入後原fileId不變，仍由原編輯器開啟，返回原工具列表。同台可選目標分類移動（不依賴拖曳），或確認「從分類移除」；解除後檔案仍在工作空間、可再加入。不移資料夾、不刪原檔、不進垃圾桶。垃圾桶／已失效參照亦能解除。

沒有分類時可先建立普通工作檔案（明示保存於工作空間），之後建立分類再加入；不自動建隱藏分類／複製。首頁不強制九張空卡片，可透過「開始工作／更多工具」開啟空列表。進階統計／推薦／完整需求引導未做。

## 資料安全

沿用DB2、layout schema1、備份v4；不新增store或備份版本。link-item在同一files/meta readwrite交易內驗證layout.rev、原檔有效性及全域layout歸屬後，轉為現有add-item；兩台／兩分頁同時加入只能一方成功，包括垃圾桶工作台的歸屬。未知layout保守拒絕，不清空未知資料。

move-item只改categoryId，保留item ID／fileId；remove-item只解除該item。沒有來源正文／名稱／rev／歷史／資料夾寫入，固定成果保持凍結。CAS／quota失敗交易abort，原關聯保持，表單留存且可重試；CAS須重新讀取核對新版本，不覆寫勝方。不提供跨台移動或同一fileId多處共用，不放寬v4唯一性驗證。

QA-M33-SELECTED-01另以先行修復PR處理：v1輸出allowlist為kind/version/exportedAt/files/folders/archives/histories，只選取檔案、必要資料夾及對應歷史，不展開完整snapshot或放寬驗證器；v1-v4讀取保留。

## 有界開發者驗證

`npm ci --ignore-scripts; npm run test:unit`。
`NEXUS_CHROMIUM=/usr/bin/chromium npx playwright test tests/e2e/categories-selected.spec.cjs tests/e2e/categories-organize.spec.cjs tests/e2e/categories-ui.spec.cjs tests/e2e/categories-storage.spec.cjs --workers=1 --trace on`。

自己的HTTPS SHA、資產bytes、每context/page監測、真下載與原始SHA-256、七包v4／完整副本還原、保存追加及組裝回歸見.github/workflows/m33-incremental.yml及其PR原始CI。retries0、TLS開啟、全新context與合成資料。首輪本機新測試有無效CSS selector及舊測試對新增移動select定位不明確，已改明確定位，未刪斷言；產品未因這些工具錯誤改動。

原5個條件式skipped、36+1／補驗1、41、M2-NAV-01未完整獨立操作等歷史與限制均保留。Safari／Firefox、真手機觸控、完整讀屏、OS原生選檔及Office／Calc未測；390/1280瀏覽器不是實機認證。九工具／M2／PDF／DOCX／HTML／CSV／預算XLSX保留，Excel仍取消、斜體入口不恢復。

後續（本輪不做）：同瀏覽器跨台共用同fileId、引用位置／共用標示、獨立副本；需另設計衝突與備份規則並取得授權，不是雲端同步。可先優先評估分類隱藏與整理，非本次發布承諾。
