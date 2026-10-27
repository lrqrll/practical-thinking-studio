# 最新接續：3.4.0驗收補強與必要修補，未授權M3

先核對main `78e90aec61ca825d45534c93515df4d8f949a431`／tree `bba3bb3c0ae02afbfcfbeeeb7cee63f216c086b1`；若變更，先列diff及受影響驗收，不沿用舊結論。正式已由PR #15一次合併部署，不再依序合併#10～#14。

Work回報32正式資產兩輪符合、19純模型通過；不是瀏覽器端到端驗收。原開發者正式紀錄36通過＋1失敗、後續1補驗通過，不能寫成單輪全綠。M2-NAV-01仍待Work對指定SHA完整複驗。

本輪授權：獨立小PR處理DOC-STATE-01及瀏覽器保存／還原補證與必要修補；不合併main、不正式部署、不清除真人資料、不開M3。main更新可能立即觸發Pages。證據與狀態見[QA報告](QA-REPORT.md)、[已知問題](KNOWN-ISSUES.md)，新的產品／工具完整SHA與原始CI見各小PR。

---
# 以下為歷史接續紀錄（舊授權不覆蓋目前授權）

# 最新接續：M2 3.4.0發布準備，未合併／未部署

凍結#10/#11/#12不變。#13材料ca3036bd6afb621f8f6dc381b4954d60f62f25ea→#14測試補強520a0653261c8da3625a6408e8adf4b612b0d997→codex/nexus-m2-release-3.4.0版本PR，依序疊加且不含#6/#7。#14在真正rc.2 HTTPS新21/21通過，詳[既有結果](qa/m2-rc2/RESULTS.md)。開發者實際驗證，不冒稱獨立QA。

3.4.0只版本／快取鍵與preview專用DB／草稿命名空間改動；正式nexus-workspace／schema／模型不變，verify-release.cjs逐檔限定diff。原m2/仍rc.2／59；新m2-release/使用nexus-preview-workbench-m2-release-*。Node合成fixture生成需NEXUS_QA_FIXTURE_REF=59dff72bb55a77c371863d6e8a998529b1997bf0，固定舊來源，最終瀏覽器測實際3.4.0而非假裝舊SHA。

最終head／新CI／preview以版本PR為準；尚待審查批准，不合併或正式部署。批准後才依序合併、核對main CI／Pages／公開資產與正式HTTPS。M2-NAV-01保留審查門檻，不開M3、不恢復Excel。以下為歷史接續紀錄。

最新rc.2接續：PR #12的rc.1在CI出現驗證腳本API錯誤及導航時序問題，原失敗40168603581／40168831089保留。已修正fetch.ok與產品UI切換鎖／草稿URL，保存佇列本身不變；5個導航與保存控制各3次通過。新head需完整25單元／86瀏覽器＋15文件選取及14個公開M2 HTTPS流程，詳QA-REPORT.md，不沿用舊SHA綠燈。PR #10／#11依賴head不變，正式3.3.0 main仍ff3f8a1；M2尚未獨立QA／不可合併或正式部署。

# 最新接續：M2完整候選待獨立QA

正式仍3.3.0 main ff3f8a16cb343b93973bd191003c30ca9c13b996。本輪只授權開發／測試／小PR／隔離預覽，不合併／正式部署，不恢復Excel或開發其他功能。

PR依賴：#10 codex/nexus-m2-field-contract（ede75bd，契約與純模型）→ #11 codex/nexus-m2-persistence（2381aeb，保存／schema2成果／v3）→ codex/nexus-m2-interface（完整UI／草稿／安全及相容補強，明列base #11）。最終head與CI、預覽證據在各PR描述，避免文件自我引用SHA造成無限重提。

欄位／模板完整操作、固定成果、v3大容量還原與24單元／84瀏覽器預期驗證詳QA-REPORT.md，實際以最終CI為準。M2預覽使用m2/與nexus-preview-workbench-m2-workspace，不自動移入或更改正式、M1根預覽及舊斜體預覽資料。不要重建或重做已完成功能。

下一步核對最終CI、HTTPS實際操作與公開資產，提供完整SHA、獨立QA操作清單與限制，交獨立QA；開發者通過不等於獨立QA通過，不要擅自合併／發布。

## 最新：凍結M2 rc.2，等待獨立瀏覽器複審

使用者獨立QA已核對程式／依賴／原始CI及10模型測試通過，但沒有受控瀏覽器，完整操作未測。#10 ede75bd60e905f65fbc01f03b4e4806ea89097ef、#11 2381aeb6a484daa4ee2e076bd202b3f3d6498593、#12 59dff72bb55a77c371863d6e8a998529b1997bf0保持；不得因補材料變動其head。材料另在codex/nexus-m2-qa-materials分支／PR，產品及package逐位元保持59。詳[交付材料入口](qa/m2-rc2/README.md)，含合成備份／manifest／七包容量生成器／完整操作與M2-NAV-01負控制及原始CI副本。開發者fixture 7/7不代表獨立瀏覽器QA，門檻仍有效。下一步等待獨立瀏覽器結果，必要修正另列差異再測；無合併／正式部署授權，不開M3，不恢復Excel。
