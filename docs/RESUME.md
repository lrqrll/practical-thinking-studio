# 最新接續：有限授權A／B／C，轉向功能交付

先核對main `78e90aec61ca825d45534c93515df4d8f949a431`／tree `bba3bb3c0ae02afbfcfbeeeb7cee63f216c086b1`；正式3.4.0已由PR #15一次合併部署，不重合併#10～#14。工具[PR #17](https://github.com/lrqrll/practical-thinking-studio/pull/17)仍未合併，head `ab0551364946fb11868cc6f5f309ef45dc2fe64d`；文件[PR #16](https://github.com/lrqrll/practical-thinking-studio/pull/16)從 `abee0ab1525cf7b940c2b2e273957ead405a3de3`接續B，最新完整head以PR為準。若基線漂移先列差異，不沿用不符SHA的驗收。

A候選[PR #18](https://github.com/lrqrll/practical-thinking-studio/pull/18) head `2ff102580ffa22f5f77f65ff54ef10e385597c8d`（base工具ab055136）已實作凍結來源→document保存重開→DOCX／HTML；C候選[PR #19](https://github.com/lrqrll/practical-thinking-studio/pull/19) head `4992808262c81f12e21252b776384a517a130f68`（base A）已實作第九工時工具、整數合計、CSV／adapter及完整備份。兩者為3.5.0-rc.1開發者驗證，待Work有界複審；[A預覽](https://lrqrll.github.io/practical-thinking-studio-preview/m31-assembly/)與[含A的整合預覽](https://lrqrll.github.io/practical-thinking-studio-preview/m31/)隔離於正式資料，完整SHA、namespace、依賴、CI與歷史失敗見[交付紀錄](../ROADMAP.md)。

使用者本輪已有限授權A：M3.1文字成果組裝完整可操作閉環、B：結案文件／待辦分級、C：獨立工時紀錄最小版／adapter；[完整範圍及必要驗收](../ROADMAP.md)。A主要開發，B／C並行，不等B；A／C候選已實作並經開發者驗證，待Work有界複審，不宣稱正式發布或獨立驗收完成。舊「尚未授權M3」不再阻擋範圍內A，但不是整個M3／M4獲准。允許範圍內實作、修補、測試、分支、小PR及隔離預覽；不合併main、不正式部署、不auto-merge、不增AI／後端／帳號或其他大型功能。main更新會觸發Pages。

Work已對工具ab055136獨立程式／證據審查：42正式HTTPS項與另列4工具控制，47 context／57 page、2,129資源及29下載雜湊／映射，目視中文修後、保存等待追加、重開及混合格式；QA-FONT-01／QA-CONTEXT-01 CLOSED，未發現阻擋PR #17的P0／P1或其他明確問題。不是Work親自重演42項。保留36通過＋1失敗／後續1補驗通過、舊41、環境失敗／skipped；[QA報告](QA-REPORT.md)含原始CI及證據。

M2-NAV-01仍未完整獨立操作，是驗收缺口，非已確認未修產品P1；不無限期阻擋A。Safari／Firefox、實機觸控、完整螢幕閱讀器、OS原生選檔、Office／Calc、中文斜體字形及其他非阻擋待辦依[分級及具體驗收／回歸觸發](KNOWN-ISSUES.md)追蹤。只有已重現P0／P1或其他明確阻擋問題才阻擋受影響發布。

A／C交付須自己的候選SHA／隔離HTTPS、全新context與合成資料；沿用監測／TLS／retries=0，不拿正式M的42項當新功能通過。先相關測試，共用保存／匯入／導航變更才擴受影響回歸。B只核對文件diff／連結／SHA／狀態，不新增產品測試或再擴42項QA專案。保留八工具、預算XLSX、舊marks與備份相容；Excel取消、斜體入口退休，不宣稱字形修復。交付標「開發者驗證」，Work再做有界複審。

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
