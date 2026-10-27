# M3.1 文字成果組裝（候選，未合併／發布）

使用者本輪核准A成果組裝、B文件維護、C獨立工時工具；非整個M3/M4授權。正式仍3.4.0/M78e90aec61ca825d45534c93515df4d8f949a431。本A分支以未合併QA工具PR17 ab055136為基礎；B另PR16。C平行實作後整合A開發分支，C的PR以A為base，絕不依序合併main。

工作空間／工作台「組裝成果」→填名稱→選固定成果schema1/2或備忘錄→明確勾內容→加入→上移／下移／移除→含圖來源確認不納入圖片→建立普通document→直接編輯、保存重開→匯出DOCX/HTML。PDF仍是既有列印另存，非新增直接下載。

來源選項只是顯示；建立時readAssemblySources在單次files/meta唯讀交易讀選中的已保存版本及固定成果所屬工作台，驗證rev／存在／垃圾桶／型別，深拷貝後轉換。選擇後若來源已更新，拒絕並要求重新選擇，不能誤納未保存資料。取消或驗證失敗不建立任何檔案。未知schema／未辨識內容擴充／無效金額拒絕，不清除、不截短、不代零。精確金額沿用整數分；缺值明示未填；文字及換行／清單用document節點，不插HTML。來源名稱／ID／版本／凍結時間只是普通文件文字，非活連結；之後來源修改或垃圾桶不連動。

新文件沒有assembly資料庫／特製備份schema，沿用document保存、CAS、草稿、history、完整備份及副本還原。選擇器暫存只在畫面，首版不承諾重開選擇器／動態區塊／重同步。標籤與釘選非正文，圖片須選擇階段告知及明確確認，不刪來源圖片。沿用文件100萬字元／節點上限，超出整份拒絕，不部分保存。

DOCX／HTML（及列印）在flush後，讀取已保存文件並檢查目前rev，再深拷貝該rev。HTML從這份凍結model生成，不讀live editor DOM；DOCX壓縮期間繼續編輯不混入已擷取的匯出。沒有新npm依賴。

測試與取證沿用PR17的全context/page監測，新增可指定候選expected資產檔與preview identity；原正式M模式不改綁候選。候選workflow核對自己head、獨立namespace及實際HTTPS每個根資產，禁止用正式42項當此功能驗收。每頁原始response bytes及實際下載hash可用verify-monitor離線重算，retries0/TLS驗證。舊v1/v2/v3與未知值fixture照舊完整還原；組裝遇未知內容另明確拒絕。新happy-path合成fixture明確移除原測試的未知qaPrivateAttribute以構成已知結構（只在測試記憶體衍生，不改原fixture或使用者資料）；原opaque fixture另有拒絕且原樣保留斷言。

開發者驗證不等於Work親自操作；M2-NAV-01獨立操作等後續待辦保留但不當未重現產品P1停工。Safari/Firefox、實機觸控、完整螢幕閱讀器、原生OS選檔、Office/Calc及中文斜體字形未測。Excel取消／預算XLSX保留；斜體入口維持退休，舊marks相容。

首輪候選161e26e的HTTPS22項通過＋5容量條件skipped，但嚴格取證器拒絕沒有導航的skipped空白context（run40462351872）。不是產品失敗，沒有放寬雜湊／資料比較或忽略空context；後續job提供原本既有108MB七包合成集合，讓該5案真正執行。另保存390px來源選擇與390／1280已保存重開PNG及原始bytes／SHA256傳輸；結果須看新SHA的原始CI，不沿用首輪綠燈。
