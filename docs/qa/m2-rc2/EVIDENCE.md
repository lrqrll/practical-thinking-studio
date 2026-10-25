# 證據索引與驗證界線

截至本材料整理：M2候選未合併／未正式部署；開發者重跑成功不代表獨立瀏覽器QA通過。使用者回報的獨立程式／依賴／CI核對及10項模型通過已記錄，瀏覽器操作仍未完成，M2-NAV-01待複審。

## 凍結候選的原始 CI

| head／run | 實際結果 | 原始證據 |
|---|---|---|
| #10 ede75bd60e905f65fbc01f03b4e4806ea89097ef | CI success；較早日誌儲存端403不代表功能失敗 | [40091757329](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40091757329) |
| #11 2381aeb6a484daa4ee2e076bd202b3f3d6498593 | CI success；整合覆蓋在#12，沒有偽造不可取用舊日誌 | [40092127923](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40092127923) |
| #12 59dff72bb55a77c371863d6e8a998529b1997bf0 | 25單元＋86瀏覽器＋15文件選取重複＋14真正候選HTTPS；audit 0 | [40170486240](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40170486240)、[完整日誌副本](evidence/candidate-ci-40170486240.log) |

40170486240的 `playwright-results` artifact ID12589283680，`NEXUS-candidate-preview` ID12589899690。Artifact可能到期，原始日誌已進儲存庫；本包合成小檔也不依賴artifact取用。原 `m2-capacity` 用150M2＋1舊成果，超100MB、全包下載、全新context還原、來源／歷史／欄位／範本／成果語意雜湊一致。新的可下載合成組與該動態資料不同，不能混用bytes／包數。

## 本次新增材料的開發者驗證

本機使用相容 `/usr/bin/chromium`，不是獨立QA。Node fixture驗證不需安裝依賴；本機瀏覽器先發生8000埠占用、預設Playwright瀏覽器缺失的環境失敗，改用空閒埠與既有Chromium解決，未降TLS。

| 檢查 | 結果／證據 |
|---|---|
| 公開預覽／正式資產重新核對 | [逐檔UTC時間、SHA256](evidence/public-assets.json)：M2 34符合59dff72；M1根32符合25fee3d；斜體28符合a16250a；正式30符合ff3f8a1 |
| 本機模型／checksum／圖譜／舊成果 | [fixture-model.log](evidence/fixture-model.log)：4合法workspace集＋1刻意錯誤＋原始v1格式辨識；原v1轉換本身另由瀏覽器測 |
| 7項新fixture瀏覽器案例 | [fixture-browser-local.log](evidence/fixture-browser-local.log)：7通過、0失敗、0跳過、0重試；4組兩次隔離還原含圖片解碼、錯誤原子拒絕、原始v1轉換、大容量新context還原 |
| 可下載大容量生成／解包 | [large-generation.json](evidence/large-generation.json)：108,082,768 bytes／7包；151成果、4檔、1範本、7歷史；原schema1不變 |
| 同工具雙SHA負控制 | [nav-control.json](evidence/nav-control.json)：舊e6focus=true／59focus=false；[最初失敗](evidence/initial-negative-control.log)保留 |

補驗工具開發時發現：再次副本還原會再加名稱後綴，錯誤訊息在toast而不是backup-status。修正的是新材料工具的名稱正規化與錯誤UI定位；另加每次副本完整名稱斷言，內容／關聯斷言保留，無產品程式變更。

本材料PR的 `M2 frozen candidate QA materials (developer verification)` workflow會重新生成七包，提供30天artifact（`M2-synthetic-backups-and-developer-evidence`），在真正候選HTTPS跑7個fixture還原案例、5個M2導航／故障案例各3次，雙SHA負控制，以及本機原文件保存追加3次。另跑既有quality完整回歸。原始run連結見本材料PR的checks；本文件不預先宣稱尚未執行的CI成功。已完成的實際run及可下載artifact見[RESULTS](RESULTS.md)。

## 未測及限制

- 獨立QA完整候選瀏覽器操作及M2-NAV-01複審仍待執行；本次不解除門檻、不準備正式發布SHA。
- 跨瀏覽器Safari／Firefox、真實手機觸控、完整螢幕閱讀器、OS檔案對話框、Office／Calc未測。axe與模擬尺寸不是完整無障礙認證。
- 大容量受記憶體／瀏覽器配額限制；分包不代表無限容量。失敗保留原資料，不部分還原；完整備份不含未保存草稿。
- 新增fixture集在M2驗證讀舊v1/v2；不宣稱正式3.3.0能讀v3。舊格式測試資料是以契約合成，不是真實歷史私有備份。
- 相同origin路徑只有DB／草稿命名空間隔離，不是安全來源隔離；獨立操作須新profile/context。
- 目前主代理模型／推理等級環境未提供可確認資訊；沒有切換主代理或使用子代理，也不推估帳號扣用量。

本機 Node 直接連 Pages 的DNS回覆 `EAI_AGAIN`，屬環境網路失敗；同環境Python標準TLS連線完成公開資產比對，結果已保存。新workflow在GitHub-hosted runner執行Node公開比對及HTTPS受控瀏覽器；不可用本機DNS失敗宣稱候選功能失敗，也未繞過憑證。
