# NEXUS M3.3 第一階段接續紀錄（2026-10-28）

本輪交付可操作的新功能；所有測試為開發者驗證，待Work獨立複驗。未合併main／正式部署／auto-merge，未啟動M3.4。

正式main重新確認為78e90aec61ca825d45534c93515df4d8f949a431，M3.2 #21仍8df0db6112394e87876fe0358bbd370d0f78e78f；#16～21未變更。

## 來源與依賴

|階段|分支|完整SHA|Base|
|---|---|---|---|
|穩定ID模型|codex/nexus-m33-categories|afc80c2b530c6f39c8b73b7e7849937158042457|codex/nexus-m32-ux|
|原子保存／DB2／v4|codex/nexus-m33-storage|9772839043d8cffb4003994f21843a6d3ef895e5|codex/nexus-m33-categories|
|手機／桌面操作與整合|codex/nexus-m33-interface|394acbfb1bb8e30041b440e0b3267a57ec9e51d0|codex/nexus-m33-storage|

隔離預覽：https://lrqrll.github.io/practical-thinking-studio-preview/m33/
版本3.7.0-rc.1；namespace=m33-categories；DB=nexus-preview-m33-categories-workspace。只更新m33子目錄，正式站／m31／m32未動；同origin不同DB不是安全權限隔離。

## 實際新增

「工作台」→「建立自由工作台」→新增自訂分類→九工具選擇新增獨立內容→開啟原編輯器。分類可改名、上下排序（穩定ID）；關閉瀏覽器重開設定及內容保留。手機390／桌面1280、鍵盤操作、深淺模式及基本axe驗證。

CAS／quota失敗保留最新輸入、可重試／下載本分頁草稿；取消離開維持URL與輸入，reload需明確恢復，不自動保存或清其他分頁草稿。類別引用保護包含垃圾桶；建立file+item原子交易。完整備份v4納入分類與完整舊資料，副本恢復重映射關聯；新程式讀v1-v4。DB2使用者已明確批准，保留原3stores、無批次轉寫；舊writer關閉後仍可下載最後草稿。

## 原始證據

- 模型CI https://github.com/lrqrll/practical-thinking-studio/actions/runs/40618752033 （44單元通過）
- 保存CI https://github.com/lrqrll/practical-thinking-studio/actions/runs/40618810799 （已成功）
- 首輪整合 https://github.com/lrqrll/practical-thinking-studio/actions/runs/40622143781 ：44單元、129瀏覽器通過／5條件跳過、15文件選取通過；HTTPS25通過／1測試控制逾時，不能寫全綠。
- 首輪artifact https://github.com/lrqrll/practical-thinking-studio/actions/runs/40622143781/artifacts/12788036646 ，GitHub ZIP digest 454157520b00ccf8eacbb7ef768243ab00b43e1ce2487e952342219697e12ae6。
- 新完整工具SHA CI https://github.com/lrqrll/practical-thinking-studio/actions/runs/40645014438 （成功：44單元、129瀏覽器通過／5條件跳過、15文件選取重複、26真正HTTPS，0失敗／0重試）。
- 本機全站129通過／5條件跳過（未算pass），0fail；npm audit 0漏洞。新v4超100MB／150成果七包實際還原已通過，與既有條件式151成果fixture skip不同。

首輪HTTPS原始trace：取消離開confirm正確dismiss，reload觸發beforeunload，但監測器監聽dialog後沒有測試handler接受第二提示，reload等待30秒逾時。僅修改測試明確斷言並接受beforeunload，保留全部資料斷言與產品確認機制，沒有放寬timeout或TLS。本機該案1通過。新head相對3727e6f只改這個測試與docs/M33-CATEGORIES.md，產品bytes未改；預覽metadata/cache SHA隨新head更新。原始失敗trace／JSON在codex/nexus-m33-diagnostics的diagnostic-evidence，該分支只供證據讀取，不納入產品PR。

## 可重跑

checkout上述interface完整SHA，npm ci --ignore-scripts；npm run test:unit；node scripts/qa/m33-legacy.cjs；NEXUS_CHROMIUM=/usr/bin/chromium npx playwright test --workers=1（PDF解析需要poppler，CI有固定CJK fallback）。完整HTTPS命令與自己SHA資產manifest綁定見.github/workflows/m33-development.yml。所有context合成資料、TLS驗證開、retries0；原始HTML/JS/CSS/font bytes、每context/page ID、trace、真實下載hash在artifact。

## 剩餘邊界

分類移動／隱藏／刪除恢復、自由工作台範本、跨台既有來源連結及更多組裝adapter未做，未顯示假入口。九工具資料仍可用獨立入口，不宣稱全部都有組裝adapter。保留M2、PDF／DOCX／HTML／CSV及預算XLSX。Excel維持取消、斜體入口不恢復。

Safari／Firefox、真手機觸控、完整讀屏、OS原生選檔、Office／Calc未測；M2-NAV-01完整獨立操作缺口未解除。DB2/v4回復需相容讀取器，不能刪DB降版。

本機api.github.com／github.io仍受環境代理403阻擋，沒有降低TLS；透過GitHub runner做真HTTPS驗收。PR factory run40645014455原先失敗；使用者完成設定並重跑後成功建立#22／#23／#24，最新head/base已交叉核對Git refs與公開PR資料，三份均OPEN／未合併。#24正文已由完成的CI更新為實際結果，沒有只建立空PR。

## 最終可審查交付

- #22 https://github.com/lrqrll/practical-thinking-studio/pull/22 — afc80c2b530c6f39c8b73b7e7849937158042457
- #23 https://github.com/lrqrll/practical-thinking-studio/pull/23 — 9772839043d8cffb4003994f21843a6d3ef895e5
- #24 https://github.com/lrqrll/practical-thinking-studio/pull/24 — 394acbfb1bb8e30041b440e0b3267a57ec9e51d0

以上為審查依賴，不是合併／部署指令。不可依序合入main造成中間版本上線；正式發布須另外準備具體完整release SHA並取得批准。M3.1/M3.2建議另以完整3.6.0一次發布，M3.3不混入；規劃尚非發布準備完成或發布授權。

最終CI https://github.com/lrqrll/practical-thinking-studio/actions/runs/40645014438
最終artifact https://github.com/lrqrll/practical-thinking-studio/actions/runs/40645014438/artifacts/12797209248
GitHub ZIP digest（非本機重算ZIP）：9ba6d456812b10f2200ec2a7ad9a784c75e845ab7c717dd7bd551a2c37bd25cd。

49公開資產在HTTPS前後與394acbf對應build逐bytes一致。26個monitor-index：2016實際資源回應bytes／SHA、29真實下載，完整性驗證0錯誤；每context/page身分可區分。超100MB/150固定成果v4七包下載與第二空白環境還原、圖片解碼／history／關聯通過。正式main仍78e90aec…，M3.2 #21仍8df0db6…；只更新preview/m33，Pages run40645011498成功。

已檢視最終原始390明色與1280暗色截圖，繁中可讀，無整頁橫向溢出；其他兩主題截圖及axe結果同在artifact。390明色PNG SHA256：978dd53f3e7662e2674876e4b73c9f61d0df94c706e07b05ffa468c3b3ac76b1；1280暗色：9dfa7889a221bc5770a6e94f1828c4e6e760f05b5236404a91636981ecdb0384。

可交Work文字：請對#22→#23→#24候選394acbfb1bb8e30041b440e0b3267a57ec9e51d0進行有界獨立複驗，優先分類ID/排序/九工具實例隔離、真正關閉重開、DB1舊writer保留最後草稿、CAS/quota原值與重試、混合M2/v4與七包完整還原。原始CI與artifact如上；開發者44+129（5skip）+15+26通過不是獨立QA。保留首輪25+1測試prompt逾時及修正證據，不把M2-NAV-01或實機跨瀏覽器未測改稱獨立通過。本輪不合併、不正式部署，不擴充下一階段。
