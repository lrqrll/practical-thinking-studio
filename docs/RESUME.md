# 最新接續：M2完整候選待獨立QA

正式仍3.3.0 main ff3f8a16cb343b93973bd191003c30ca9c13b996。本輪只授權開發／測試／小PR／隔離預覽，不合併／正式部署，不恢復Excel或開發其他功能。

PR依賴：#10 codex/nexus-m2-field-contract（ede75bd，契約與純模型）→ #11 codex/nexus-m2-persistence（2381aeb，保存／schema2成果／v3）→ codex/nexus-m2-interface（完整UI／草稿／安全及相容補強，明列base #11）。最終head與CI、預覽證據在各PR描述，避免文件自我引用SHA造成無限重提。

欄位／模板完整操作、固定成果、v3大容量還原與24單元／84瀏覽器預期驗證詳QA-REPORT.md，實際以最終CI為準。M2預覽使用m2/與nexus-preview-workbench-m2-workspace，不自動移入或更改正式、M1根預覽及舊斜體預覽資料。不要重建或重做已完成功能。

下一步核對最終CI、HTTPS實際操作與公開資產，提供完整SHA、獨立QA操作清單與限制，交獨立QA；開發者通過不等於獨立QA通過，不要擅自合併／發布。
