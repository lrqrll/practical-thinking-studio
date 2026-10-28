# M3.3 自訂分類工作台：第一階段候選

使用者已明確批准分支開發／測試／PR／隔離預覽，以及限定資料契約：既有meta新增workbench-layout配置、DB1→2保留三個stores、不批次轉寫資料、備份v4向後讀v1-v3。沒有main合併、正式部署、auto-merge或M3.4授權。正式基線M78e90aec／3.4.0；M3.2 #16～21仍凍結。本輪從8df0db6112394e87876fe0358bbd370d0f78e78f另開三條線性相依分支，候選3.7.0-rc.1，不把新功能放回M3.2候選。

## 實際操作

工作台列表新增「建立自由工作台」→自己命名分類→從九工具選擇並新增獨立內容→卡片開啟原編輯器→保存→返回工作台。舊採購工作台、M2欄位／範本與九種獨立工具保留。分類可改名、上下排序；手機／桌面、鍵盤、深淺模式可用。分類不是檔案資料夾或權限邊界，工作空間仍能管理同一份檔案。新建不同工作台的內容預設是不同fileId，不意外共用。

「組裝成果」在自由工作台僅列本台支援的已保存備忘及相容固定成果，全域入口保留原跨來源流程；沒有冒稱九種資料全有組裝adapter。M3.2的PDF／DOCX／HTML、工時CSV、預算XLSX沿用，舊快照不改。

## 資料契約

- meta `workbench-layout:<bench-key>`：schemaVersion1、workbenchId、rev、categories[{id,name}]、items[{id,categoryId,fileId,toolType}]、createdAt、updatedAt。陣列代表順序，關聯使用ID；分類名trim後1–40字、同台不可同名，最多20分類／100項目。新建分類內容另受既有完整備份的5000全域檔案上限保護，超限保留表單／不建半檔，不截短。
- 原workbench schema1/2、最多兩個採購modules、M2欄位／範本、舊成果schema1/2、file.data/rev/history不改。自由工作台以新layout區分；啟動不大量轉換舊工作台。建立w+layout、建立file+layout item都在一個交易，CAS比較layout.rev，quota／CAS失敗整筆abort。
- 改名／排序保留category/item/file IDs；不改file.data/rev、不改既有快照。來源仍被layout引用（含工作台垃圾桶）禁止永久刪除；軟刪來源仍留卡片關聯與還原指引。永久刪工作台原功能只清工作台配置／成果，來源檔仍保留，須使用者原確認流程。
- 未知屬性以clone/spread保留；未知layout/schema唯讀且阻擋危險永久刪檔，不默默清空。未支援的備份先整份拒絕，沒有部分寫入。
- DB2只用於版本防護，原stores不存在才建立，不刪／重建／搬移。舊分頁onversionchange關閉writer；blocked顯示保留輸入、關閉舊分頁並重試。舊程式不能靠open(version1)誤寫DB2；不得為回退刪庫。真正舊3.6來源以同origin測試fixture驗證關閉連線後仍可下載最新草稿，原已保存資料不變；此是local歷史相容試驗，不冒充正式HTTPS。
- 有layout才輸出完整備份v4（workbenchLayouts）；無layout仍照既有v1-v3。新程式讀v1-v4；舊版對v4必須整份拒絕。原分包傳輸version1不改。副本還原重映射workbench／category／item／file ID並保持所有關聯；來源data/rev、歷史與舊成果保留，兩次還原不共用ID。缺包／損毀／非法引用不部分寫入。

## 未保存輸入

表單原值、配額失敗後追加輸入仍保留，可重試與下載分類草稿；CAS不覆寫勝方，重新讀取會保留輸入供明確核對。排序不吃掉別的未保存名稱。離開可取消且網址／輸入不變；分頁隔離草稿可在reload後明確恢復，恢復不自動保存、不當完整備份；不自動移除其他分頁的草稿。真正瀏覽器關閉與重開測試使用專用新建/tmp profile，不碰使用者profile。

## 小PR與驗證

分類模型→保存／DB2／v4→UI整合，base依序相依，共用檔案由同一整合分支處理。完整SHA、PR、CI及預覽以交付PR正文為準，不寫死未建立的PR號。

`npm ci --ignore-scripts; npm run test:unit`。瀏覽器須Chromium及poppler（只供開發驗證，不要求終端安裝）：
```
node scripts/qa/m33-legacy.cjs
NEXUS_CHROMIUM=/usr/bin/chromium npx playwright test tests/e2e/categories-storage.spec.cjs tests/e2e/categories-ui.spec.cjs tests/e2e/categories-compat.spec.cjs tests/e2e/categories-capacity.spec.cjs --workers=1 --trace on
```

驗證含穩定ID、九卡片原編輯器、390/1280兩主題／基本axe、CAS／quota最新輸入／恢復、真正關閉重開、DB1原地升級、舊分頁writer關閉、混合M2/v4副本還原、超100MB／150成果七包v4完整還原及圖片解碼、原保存及PDF回歸。沿用全context/page監測；HTTPS用自己SHA及新namespace，TLS驗證開啟、retries0。原始fixture／trace／下載／hash／CI是開發者驗證，待Work有界複驗。

本機第一個persistent-profile測試因Playwright已自動開始trace、工具重複tracing.start而失敗，功能尚未跑；移除重複初始化、沿用原trace後關閉重開與完整snapshot比較通過，未放寬資料比較。

## 未完成及界線

分類移動／隱藏／刪除恢復、自由工作台範本、跨台既有檔案連結／複製、更多組裝adapter留後續確認；不顯示未完成入口。Safari／Firefox、真手機觸控、完整螢幕閱讀器、OS原生選檔及Office／Calc未測。M2-NAV-01完整獨立操作缺口保留，不冒稱已完成Work獨立驗收。Excel維持取消，斜體入口不恢復，保留舊marks／匯入匯出。DB2／v4回復需相容讀取器，不可自動部署舊程式或降版刪資料。
