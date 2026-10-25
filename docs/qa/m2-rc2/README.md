# M2 rc.2 獨立複驗包

本包只補文件、合成資料與測試工具；產品程式及依賴維持候選原樣。**開發者驗證不等於獨立 QA 通過；M2-NAV-01 仍待獨立瀏覽器複審，不可發布。** 使用者回報獨立核對程式／依賴／原始 CI，並重跑 10 項模型測試通過；完整候選瀏覽器操作尚未完成，不應視為功能已失敗。

- [逐項操作、預期結果及測試映射](OPERATING-CHECKLIST.md)
- [M2-NAV-01 根因、負控制、重現方式](NAV-01.md)
- [原始 CI 與本次材料驗證](EVIDENCE.md)
- [合成資料逐項內容與 SHA256](fixture-manifest.json)
- [產品／候選公開資產預期 SHA256](source-identity.json)

## 凍結身分與依賴

| PR | head（完整 SHA） | base |
|---|---|---|
| [#10](https://github.com/lrqrll/practical-thinking-studio/pull/10) | ede75bd60e905f65fbc01f03b4e4806ea89097ef | main |
| [#11](https://github.com/lrqrll/practical-thinking-studio/pull/11) | 2381aeb6a484daa4ee2e076bd202b3f3d6498593 | codex/nexus-m2-field-contract |
| [#12](https://github.com/lrqrll/practical-thinking-studio/pull/12) | 59dff72bb55a77c371863d6e8a998529b1997bf0 | codex/nexus-m2-persistence |

候選：[3.4.0-rc.2 HTTPS](https://lrqrll.github.io/practical-thinking-studio-preview/m2/#benches)。核對頁面版本／完整 SHA 及 [deployment.json](https://lrqrll.github.io/practical-thinking-studio-preview/m2/deployment.json)。IndexedDB `nexus-preview-workbench-m2-workspace`，恢復鍵前綴 `nexus-preview-workbench-m2-recovery:`；不讀入正式資料。同一 Pages origin 的路徑命名空間**不是**安全來源邊界，請另開全新瀏覽器設定檔／受控 context，不在真實資料的設定檔測試。

正式維持 3.3.0／main `ff3f8a16cb343b93973bd191003c30ca9c13b996`。沒有合併、正式部署、M3 或 Excel 授權。獨立 Excel 已取消；既有預算與 XLSX 保留。

## 直接下載的合成備份

GitHub 檔案頁請按 **Download raw file**，存為 `.json`，不要把 HTML 檔案頁存成備份。也可下載本材料分支的原始碼 ZIP；全部檔案都在本資料夾的 `fixtures/`。每個正向備份獨立匯入新的空白設定檔。

| 檔案 | 用途／預期 |
|---|---|
| [workspace-v1.json](fixtures/workspace-v1.json) | workspace v1：4 檔（含 1 垃圾桶）、1 資料夾、3 組共 6 份歷史、1 封存、偏好；無工作台 |
| [workbench-v2.json](fixtures/workbench-v2.json) | 同上，加 1 舊工作台、2 個來源關聯、1 schema1 舊固定成果 |
| [workbench-v3.json](fixtures/workbench-v3.json) | 同上，7 欄（6 使用中／1 已移除）、1 結構範本、舊 schema1＋新 schema2 共 2 成果 |
| [opaque-values-v3.json](fixtures/opaque-values-v3.json) | v3 加未知值鍵與擴充資訊，應保留且提示，不可清空 |
| [legacy-original-v1.json](fixtures/legacy-original-v1.json) | 最早原始 v1 UI 轉換格式；產生 6 個工具副本及原始封存；不是 workspace v1 |
| [invalid-missing-source-v3.json](fixtures/invalid-missing-source-v3.json) | **刻意錯誤的負控制**；缺來源，必須整份拒絕且資料不變 |
| [qa-checkerboard.png](fixtures/qa-checkerboard.png) | 真正可解碼的 16×16 黑白棋盤，嵌入備忘、文件及相關歷史 |

所有姓名、文字、圖片、UUID 都是固定合成資料，無私人資料。`QA-PRIVATE-*` 是用來檢查範本隔離的**合成標記**。v3 可在 M2 還原；正式舊 3.3.0 不支援 v3，不能把向後讀 v1/v2 說成可降版。

內容：報價甲 `0.10+0.20=0.30`、乙 `1.00`，備忘含圖片、勾選、中文字元與歷史，舊文件含 italic 與圖片。v3 數字 raw `-00123.4500`／成果 `-123.45`，閏日 `2024-02-29`，南區選項，金額 `0.30`／minor `30`，公式樣式 CSV 文字，已移除值 `QA-ARCHIVED-VALUE-KEEP`。範本只含 6 個使用中結構與明確預設值（北區／10.50／0／2026-10-25／文字），無來源 ID、工作台現值或私人擴充欄位。詳細內容與各檔 bytes 在 manifest，可直接核對。

## 無瀏覽器時也可執行

在本材料分支根目錄執行，Node 24；不需網路套件或瀏覽器：

```sh
node scripts/qa/m2/verify-fixtures.cjs
node --max-old-space-size=4096 scripts/qa/m2/generate-large.cjs /tmp/nexus-qa-NEW-directory
```

第二個命令要求**尚不存在的輸出資料夾**，拒絕覆寫。使用凍結候選的真實打包器產生 **108,082,768 UTF-8 bytes／7 包**，151 成果（150 M2＋1 舊成果）、4 檔、1 範本、7 份歷史；保留中文字元、圖片、移除欄位、來源、封存與偏好。`large-manifest.json` 記錄分包檔名、bytes、SHA256 及整份內容語意雜湊。還原時只選**全部七個 `.nexuspart`**，不要選 manifest；順序可反轉。生成過程也解包核對，但這不是瀏覽器還原驗收。大檔不提交 Git；CI artifact 提供可直接下載的分包組。

## 有受控瀏覽器時執行

```sh
npm ci --ignore-scripts
npx playwright install --with-deps chromium
node scripts/qa/m2/verify-fixtures.cjs
NEXUS_QA_LARGE_DIR=/tmp/nexus-qa-NEW-directory npx playwright test tests/e2e/qa-fixtures.spec.cjs --workers=2
node scripts/qa/m2/nav-negative-control.cjs
```

已有相容 Chromium 可設 `NEXUS_CHROMIUM=/usr/bin/chromium`；埠衝突可設 `NEXUS_TEST_PORT=8027`。測 HTTPS 時增加 `NEXUS_QA_SITE_URL=https://lrqrll.github.io/practical-thinking-studio-preview/m2/`；該工具強制核對候選 SHA。若未指定大容量目錄，僅該新增 fixture 案例會明確 skipped，**不能計入完整容量通過**。正式容量回歸仍在 `m2-capacity.spec.cjs`，未刪改。

新工具只在隔離 context 匯入合成資料，沒有伺服器資料寫入。TLS 保持驗證、Playwright retries=0。沒有瀏覽器就記錄「未測」，不要憑 Node 模型通過推定操作通過。每次還原是新 ID 的副本，工作台名稱另加「還原副本」；核對工具保留原資料／歷史／成果內容，只正規化重建 ID、時間及副本後綴，同時另外驗證引用圖譜與每次副本命名。

## 審查者回填

請在操作清單的結果欄填「通過／失敗／未測」、瀏覽器版本、OS／視窗、候選完整 SHA、證據連結；故障區分安裝／網路／錯誤站點等環境因素與功能斷言。M2-NAV-01 需獨立瀏覽器確認；本包不自行解除該門檻。完成後才準備正式版與具體 SHA，另請批准合併及部署。
