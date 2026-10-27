# 3.4.0 隔離驗收補強：開發者驗證

產品固定正式 M `78e90aec61ca825d45534c93515df4d8f949a431`／tree `bba3bb3c0ae02afbfcfbeeeb7cee63f216c086b1`。工具SHA及實際結果見本PR head／原始checks；主站32根資產必須逐位元等於M，否則停止。這個PR只有測試、取證及重跑指令，無產品修補／新功能，未合併／部署。DOC-STATE-01是另個獨立文件PR。

Work回報19純模型通過不代表本表端到端通過。歷史正式紀錄仍為36通過＋1失敗／後續1補驗通過，不改稱單輪全綠。M2-NAV-01仍未完整獨立驗收，直到Work對指定SHA複驗；以下新結果一律是開發者驗證。

| ID／分級 | 修前／原證據限制 | 補強與成功條件（未執行不能先寫通過） |
|---|---|---|
| M2-NAV-01／P1獨立門檻 | 開發者有證據，仍缺完整獨立複驗 | 目標讀取latch期間實際focus＋鍵盤不能改舊欄位；pending保存切頁可解鎖；取消後URL、hash、dirty及輸入保留 |
| QA-DOC-FORMAT-01／P1驗收缺口 | 原真正document等待保存案例只核對文字 | 先用工具列粗體，保存被latch暫停時追加文字；切頁、保存、重開及reload後文字與bold marks都完整 |
| QA-CAS-01／P1驗收缺口 | 原CAS案例未補寫衝突後的最後輸入 | 第二分頁遇CAS後再輸入最後版本並再試；新輸入、匯出草稿、恢復副本都保留；較新已保存原檔不覆寫。配額解除後原頁及後續保存不阻塞 |
| QA-SNAPSHOT-01／P1驗收缺口 | 原固定輸出案例未涵蓋來源更新及欄位恢復 | 由頁面建立成果，下載真CSV／JSON；編輯報價與備忘來源、欄名、順序、移除／恢復、值，逐階段重新下載與原Buffer逐位元比較 |
| QA-LEGACY-01／P1驗收門檻 | 保留原36＋1及舊文件預設值控制 | 3.3.0驗證器認可合成資料，原ID／rev／folder／history／來源及schema1成果於載入重開不變；明確編輯後舊歷史原JSON保留。段落標準化只允許已證明的textAlign:null，內容／marks不忽略 |
| QA-BACKUP-ROUNDTRIP-01／P1驗收缺口 | 原七包案例僅匯入並核對，未實際下載再二次還原 | 108,082,768 bytes／七包／151成果，空白context實際匯入→由頁面完整下載七包→第二空白context選檔還原；來源映射、欄位／範本／歷史／圖片解碼與semantic SHA256皆相同 |
| QA-BACKUP-REJECT-01／P1驗收缺口 | transport單元／舊測試不能替代v3正式UI拒絕 | 缺包、重複、payload損毀、混集合透過真input選取；有既有合成資料時整份拒絕，檔案及meta原ID與全內容在錯誤後／reload後完全不變 |

「P1驗收缺口」不預判已確認產品P1缺陷。原來缺少斷言屬未測，不偽造修前產品失敗。本輪若發現產品缺陷，另列實際重現及最小產品diff，不把工具／環境失敗冒稱產品缺陷。

## Work重跑

最方便的是以有Actions權限的GitHub身分，對本PR專項成功run執行 `gh run rerun <run-id> --repo lrqrll/practical-thinking-studio`；run-id見本PR checks，不是main舊CI。它固定產品M，main變動就拒絕沿用結論。此動作只重跑驗證，不合併／部署。

自行環境：checkout本PR的**完整工具SHA**，Node24，npm ci保持TLS及lock驗證；Chromium/Chrome必須具完整runtime dependencies。可先用已安裝的相容Chrome並設定NEXUS_CHROMIUM，否則有限安裝Playwright Chromium（不得無限重試或跳過依賴）。在儲存庫根目錄：

```sh
npm ci --ignore-scripts
export NEXUS_M2_SITE_URL=https://lrqrll.github.io/practical-thinking-studio/
export NEXUS_QA_SITE_URL="$NEXUS_M2_SITE_URL"
export NEXUS_QA_FIXTURE_REF=59dff72bb55a77c371863d6e8a998529b1997bf0
export NEXUS_FORMAL_VERIFY=1
export NEXUS_CAPTURE_EVIDENCE=1
# GH_TOKEN／gh既有授權只用來讀取儲存庫與M身分，不新增API key。
node scripts/qa/production/identity.cjs before
node scripts/qa/production/browser-environment.cjs
# 指定一個尚不存在的輸出子資料夾；生成器拒絕覆寫。
export NEXUS_QA_LARGE_DIR=/tmp/nexus-work-QA-NEW-fixtures
node --max-old-space-size=4096 scripts/qa/m2/generate-large.cjs "$NEXUS_QA_LARGE_DIR"
npx playwright test tests/e2e/production-legacy.spec.cjs tests/e2e/m2-ui.spec.cjs tests/e2e/qa-fixtures.spec.cjs tests/e2e/document-save-drain.spec.cjs tests/e2e/document.spec.cjs tests/e2e/ci-regressions.spec.cjs --workers=2 --trace on --output=production-https-results
node scripts/qa/production/identity.cjs after
```

只使用新受控context及合成資料。UI取證對正式HTTPS即時回應驗證M雜湊後原樣傳入瀏覽器，不以本機程式替換網站。工具及產品SHA、Chrome版本／TLS、原fixture與大集合manifest／每包SHA256、實際下載與hash、截圖、trace、原始案例結果均在專項artifact；保留30天，可能須GitHub登入。合成原fixtures位於既有`docs/qa/m2-rc2/fixtures/`，生成器與projection沿用#13，不另造相同資料。

未測限制保留：真實Safari／Firefox、手機觸控、完整螢幕閱讀器、OS原生選檔視窗、Office／Calc；瀏覽器記憶體／配額限制仍適用。本輪不宣稱獨立QA完整通過，不合併main／正式部署，不開M3或恢復Excel。

## QA-FONT-01／QA-CONTEXT-01（P2，工具與環境修正）

保留舊工具f737d0a616f283e5ddfc861205da0a706a22dfa8與專項40439317668的41 Pass；Work獨立審查artifact digest、41 trace、28下載及分包內容，不等於親自重演全部案例。原36 Pass＋1 Fail／後續1補驗Pass也不變。這次不預判產品資料遺失，未改產品32資產。

QA-FONT-01修前觀察：舊artifact真正document正文中文為方框，但record文字與bold marks完整。本次在同款新runner、未安裝額外字型前，保存完整／editor原始PNG、fc-list（file/family/style/fontversion）、fc-match zh-tw、OS／Chrome／套件版本、網站FontFace狀態及CDP實際platform fonts；然後只在CI安裝`fonts-noto-cjk`，以新context重做相同合成文件。根因與視覺結果須以這次原始截圖及字型資料判讀，不能只用fonts.ready／textContent宣告通過。另保留真正等待保存追加案例及混合繁中／英數標點／normal／bold／既有italic的保存重開reload截圖與資料斷言。italic marks相容與斜體字形外觀分開判斷；沒有新增斜體入口，不要求終端安裝字型。此次不製作Office／Calc視覺驗證。

QA-CONTEXT-01修前：初始context有route、初始page有error監測；CAS同context route有效，第二還原context已有資料／TLS／trace，不能寫成完全無取證。修正為test自動fixture在任何page／context導航前攔接browser.newContext，透過單一`monitor.cjs`初始化全部context/page；每個contextId/pageId記錄建立、導航、pageerror、必要document/script/stylesheet/font HTTP及requestfailed。所有context固定同M／允許清單／預期hash。關閉前等取證，關閉後再drain、保存錯誤並斷言空集合；同context/page只初始化一次。每個正式live-response都記錄requestId、M、URL、資源類別、status、bytes、sha256、expectedSha256及相對body路徑。`response-bytes/<sha256>.bin`是**當次HTTPS fetch、檢驗後原樣fulfill給該request**的原始bytes，不是本機替換；browser-response以requestId交叉對應。路由停用HTTP快取，TLS開啟、route.fetch maxRetries=0。PDF about:blank新page也有例外與必要資源監測，無正式URL時不冒稱Production身分。

每案`monitor-index.json`與附件列出所有context/page／錯誤；body路徑相對該index目錄，審查者可逐筆讀body重算SHA256，不能只按URL或trace content.size判斷。下載事件另列原檔bytes與SHA256。第二context關閉前也保存截圖，不丟失提前關閉環境的錯誤。取證失敗本身會讓測試失敗。

`monitor-controls.spec.cjs`是獨立的**測試工具負控制**：本機合成server正常第一context，再令第二context app.js hash錯誤／HTTP503，或第二page未捕捉例外；套件斷言monitor應拒絕。第四案正常第二context應通過。受控回應只允許control旗標，與正式產品HTTPS、資料還原及其通過數分開報告，不能當作產品缺陷。原始拒絕errors與body仍保存。

重跑除前述正式指令外，先做：

```sh
node scripts/qa/production/font-evidence.cjs before-cjk
# Ubuntu測試環境，保留before後才安裝；不是NEXUS終端需求。
sudo apt-get update
sudo apt-get install --no-install-recommends -y fonts-noto-cjk
fc-cache -f
node scripts/qa/production/font-evidence.cjs after-cjk
npx playwright test tests/e2e/monitor-controls.spec.cjs --workers=1 --reporter=list --trace on --output=monitor-control-results
```

正式整套仍使用原6個spec（document-save-drain新增1個混合字型案例）；負控制輸出獨立`monitor-control-results`，全正式輸出`production-https-results`。原始字型資料在`test-results/font-diagnosis/`。每個run完整工具SHA由checkout與log確認；新結果不得冒稱舊run重寫通過。M2-NAV-01維持未完整獨立驗收；瀏覽器／實機／輔具與原生選檔未測界線如前。

包括`browser-environment.cjs`前置瀏覽器及字型診斷context，也沿用相同正式M監測。套件結束後執行`node scripts/qa/production/verify-monitor.cjs production-https-results`，離線重算所有live-response／實際下載bytes，檢查requestId到browser-response的context/page映射與關閉狀態；結果存`test-results/monitor-integrity.json`。Work可在artifact解壓後用相同指令，參數指向實際解壓的production-https-results目錄。工具負控制請另查monitor-control-results，不混入正式完整性Pass。
