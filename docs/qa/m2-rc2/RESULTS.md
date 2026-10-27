# 本次材料 CI 實際結果

**僅開發者驗證；獨立瀏覽器複審未完成，M2-NAV-01不解除。**

測試工具提交 `dbb346702696db9b2b19d1a4462d30b90bcdd816`，其後只補本證據文件／原始日誌，未改產品或測試邏輯。[材料PR #13](https://github.com/lrqrll/practical-thinking-studio/pull/13) base 固定為 #12 的 `59dff72bb55a77c371863d6e8a998529b1997bf0`；不是新產品候選。

| 執行 | 實際結果 | 原始證據 |
|---|---|---|
| 專用複驗workflow | success，第一次執行；候選34公開資產byte match；HTTPS 7 fixture還原、15次M2導航／配額／CAS／取消流程；雙SHA鍵盤負控制；本機文件保存追加3次。0失敗、0跳過、0重試 | [40174835032](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40174835032)、[原始日誌副本](evidence/materials-ci-40174835032.log) |
| 既有完整quality | success：25單元、92瀏覽器通過／1 skipped；15次文件選取回歸，audit 0 | [40174834965](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40174834965) |

quality唯一skipped是**新增**可下載容量fixture案例，因該workflow沒有設定 `NEXUS_QA_LARGE_DIR`；該同案例已在專用workflow設定大容量組後真正通過，不以skip冒充容量完成。既有86項候選瀏覽器回歸全保留；新增6個小fixture使一般quality合計92通過。原m2-capacity動態大容量回歸仍正常執行。

## 可直接下載的完整合成資料組

[下載 M2-synthetic-backups-and-developer-evidence.zip](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40174835032/artifacts/12591478266)（artifact ID12591478266，保留30天；GitHub可能要求登入）。壓縮後約434KB，**解壓後七個分包合計約108MB**，請預留空間。目錄內含：

- `synthetic-m2-complete/`：七個 `.nexuspart`＋`large-manifest.json`；只選七個分包還原。
- `fixtures/`：小份v1/v2/v3、原始v1、未知值、刻意錯誤備份與PNG；檔案實際共同前綴可能包含`docs/qa/m2-rc2/`，依目錄尋找。
- HTTPS還原／導航／原文件保存測試報告、公開資產SHA256與雙SHA負控制JSON。

若artifact過期或取用受限，[小檔與manifest](README.md) 永久保留在材料提交，Node生成器可在無瀏覽器／無npm依賴的環境重建大容量組。不是要求修改TLS或安裝私人憑證。

## 候選與正式身分

2026-10-25重新核對：#10 ede75bd60e905f65fbc01f03b4e4806ea89097ef → #11 2381aeb6a484daa4ee2e076bd202b3f3d6498593 → #12 59dff72bb55a77c371863d6e8a998529b1997bf0。main仍ff3f8a16cb343b93973bd191003c30ca9c13b996，正式3.3.0。

候選 [HTTPS m2/](https://lrqrll.github.io/practical-thinking-studio-preview/m2/#benches) 仍3.4.0-rc.2／59dff72，34資產符合；preview庫Pages提交785c432b753810474e215a1aaa052320985ce5fc（built）。DB `nexus-preview-workbench-m2-workspace`，恢復鍵 `nexus-preview-workbench-m2-recovery:`。本輪未推送preview庫或正式main，未覆寫預覽，也未合併任何PR。

下一步由獨立QA按[完整清單](OPERATING-CHECKLIST.md)及[NAV控制](NAV-01.md)記錄瀏覽器結果，再決定是否準備正式版本及具體發布SHA；目前沒有發布批准。

## 本輪恢復操作驗收（開發者實際驗證）

以#13材料、凍結59dff72在真正候選HTTPS重新操作：[40177583100](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40177583100) **21/21通過，0失敗／跳過／重試**。保留原檔下載與SHA256、對話框／導航紀錄、全程trace與截圖，[原始artifact](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40177583100/artifacts/12593077504)（30天，可能需登入）。不是引用舊CI或冒稱獨立QA。

沿用原案例，補強兩個實例互不影響、範本不含來源／成果，以及實際排序後固定CSV／JSON逐位元不變。新增1個真正文件編輯器的保存等待追加輸入案例；原storage同類案例實為備忘錄，仍完整保留。所有確認均實際accept／dismiss，選檔由受控瀏覽器提供合成檔，未移除確認或繞過產品流程。完整v1/v2/v3及108,082,768bytes七包151成果在空白context還原並核對圖片、來源、關聯、歷史、欄位及範本。雙SHA負控制也重新通過。

測試分支#14 `520a0653261c8da3625a6408e8adf4b612b0d997`，以#13為base；[完整quality 40177583093](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40177583093)成功。本機最初新文件案例使用錯誤的data-open定位造成逾時，改用實際#file連結後通過，未更動產品。公開候選TLS在本機失敗，GitHub-hosted Chromium正常；未降低TLS。

上述完成開發者操作缺口，M2-NAV-01仍留給獨立審查／發布批准判斷，不冒稱獨立QA解除。依最新授權接續3.4.0發布準備；不合併或正式部署。

最終版本首次CI [40178080686](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40178080686) 在建立預覽包前誤執行需要dist-preview的公開檢查而ENOENT，瀏覽器尚未執行，屬工具順序失敗。修正為先做精確runtime diff、建立包後再公開驗證，並有限等待Pages指定SHA；不是產品修正，也不降低斷言。最終head與新CI以版本PR #15為準。
