# 工時紀錄最小版本（開發分支）

本功能依使用者本輪 C 授權實作；基線為未合併 QA PR #17 的 `ab0551364946fb11868cc6f5f309ef45dc2fe64d`。不代表已合併 main 或正式部署。測試結果均為開發者驗證。

## 操作

工作空間「專案」分類或新增檔案選單 → 工時紀錄。輸入日期、專案／分類、工作項目、整數分鐘及備註，按「加入紀錄」。原八工具保留。

按列的「編輯」修改；有效值即時更新該列與合計，按「完成編輯」關閉表單。未完成或無效的文字會保留在輸入草稿；合計仍顯示最後有效的列，畫面會清楚提示。日期、分鐘修正後才會替換有效列。結束編輯／清除輸入時，未完成草稿須先確認。刪列須確認，歷史版本可另存復原副本。

日期篩選包含起訖日；任一端可空白代表無界限。列表、專案合計及 CSV 都使用同一範圍。CSV 首列寫明日期範圍，附合計分鐘、可讀時間及專案合計；UTF-8 BOM、雙引號與換行依 CSV 引用規則保留，公式字首（含前導空白及控制字元）加單引號防護。未完成輸入或無效範圍會明確阻止 CSV，避免漏掉使用者以為已加入的資料。

## 純資料契約

檔案 type 為 `time-records`，data 僅含 `timeRecords`。資料如下：

```json
{
  "timeRecords": {
    "schemaVersion": 1,
    "rows": [{"id":"row-id","date":"2026-10-27","project":"中文專案","task":"需求整理","minutes":30,"notes":"備註"}],
    "draft": {"editingId":null,"date":"2026-02-30","project":"","task":"","minutes":"-2.5","notes":"待修正輸入"}
  }
}
```

`draft` 可省略；其所有欄位為原始字串，`editingId` 為 null 或現有列 ID。草稿可保存無效輸入，不會冒充已完成列。日期為有效西曆 `0001-01-01` 至 `9999-12-31`，必須含完整補零格式。每列分鐘為 1–1440 安全整數，最多 500 列；以整數分鐘累加，30 + 45 = 75 = 1 小時 15 分鐘。專案、工作、備註可空白。

列 ID 在單檔內唯一，建立時產生，編輯／篩選／重開不變。複製、歷史復原及備份還原保留列 ID，檔案 ID 會重新產生；跨檔案完整身份使用 `(fileId, row.id)`。不把列 ID 當全域唯一 ID。

`NexusTime.adapter(savedFile, {from?, to?})` 是不讀 IndexedDB／DOM 的版本化純函式。輸入已保存檔案，輸出深拷貝：

```json
{
  "fileId":"file-id", "rev":3, "schemaVersion":1,
  "range":{"from":null,"to":null},
  "rows":[{"id":"row-id","date":"2026-10-27","project":"中文專案","task":"需求整理","minutes":30,"notes":"備註"}],
  "totals":{"minutes":30,"projects":[{"project":"中文專案","minutes":30}]}
}
```

沒有範圍時包含所有列，專案以原字串區分、依第一次出現順序列出。adapter 驗證版本／列／ID／日期／分鐘／範圍；有未完成輸入會拋錯，要求完成或清除，避免未來成果讀取靜默漏資料。未知資料鍵或未支援 schema 會拒絕，既有資料不會被截斷或另存成空值。adapter 不承諾活資料連動，不修改 M2 module 或固定成果 schema。

## 保存與備份

沿用 IndexedDB 檔案、rev CAS、最多十份歷史、每分頁獨立 localStorage 草稿備援、保存失敗重試、草稿另存副本，以及本機工作檔。有效列與原始輸入草稿均在相同檔案 data 內保存。每次 CSV 等待既有保存佇列清空，再深拷貝本分頁已保存的同一份檔案 rev；當次範圍同時凍結。

完整備份保持既有 v1／v2／v3 選擇規則，工時不提高備份版本；validator、建立、複製、選取備份、歷史與完整還原皆透過共用檔案契約支援新 type。舊版本客戶端不認識新 type 時會拒絕含工時的備份；未修改舊客戶端，不宣稱舊版可讀新 type。

## 驗證界線

專用測試位於 `tests/unit/time-records.test.cjs` 與 `tests/e2e/time-records.spec.cjs`，沿用現有全 context／page monitor，TLS 驗證不關閉，retries=0。瀏覽器涵蓋 390px／桌面、深淺模式、axe、真實 CSV 與完整備份下載、空白第二 context 還原、CAS、保存失敗與無效原始草稿復原。候選 HTTPS 的精確 SHA、原始證據與部署狀態由整合交付記錄提供。

Safari／Firefox、實機觸控、完整螢幕閱讀器及 OS 原生選檔仍未驗；未新增計時器、費率薪資、同步、AI 或後端。

## 本輪開發整合依賴

C平行從QA PR17 ab055136開發，之後以開發分支Merge Commit整合A PR18（codex/nexus-m31-assembly）；C PR以A分支為base，只審查工時增量及必要衝突整合，沒有合併main或#6/#7。index衝突保留A所有載入、版本與組裝入口，再加time-model（storage之前）、time-ui（workspace之前）及time CSS。候選3.5.0-rc.1使用m31-integrated命名空間，DB nexus-preview-m31-integrated-workspace／草稿nexus-preview-m31-integrated-recovery:，不讀正式或A獨立預覽資料。C候選同時可操作A＋C，但不把A舊SHA的結果當C整合SHA通過。

本機整合後37單元、A/C/preview 12瀏覽器通過；最終HTTPS與原始checks另以本PR head為準。舊回歸初次33Pass／5容量skip／1Fail是新增工具搜尋alias缺漏；已修正並通過C＋files14項回歸，不隱藏首輪失敗。條件容量案例在候選workflow供既有完整七包實跑，通用job skip不冒稱通過。所有結果均為開發者驗證，Work後續有界複審。
