# M2-NAV-01：修正候選，獨立瀏覽器複審門檻仍有效

## 修正前現象與根因

舊候選 `e6f620353c2976f00e7913167d5c4720904c788e`，建立範本後切向目標，目標資料尚未讀完時，舊工作台表單仍在 DOM 且能取得焦點。兩頁欄名相同時，操作者／測試可能操作舊欄位，造成「範本預設沒有錯誤」等錯判；草稿若用已變更的 `location.hash` 綁定，可能標到錯誤頁面。

原 [CI 40168831089](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40168831089) 25單元／82瀏覽器通過、2失敗，包含取消離開URL斷言過早及新舊表單時序。不能把全部歸咎測試等待：舊表單可focus是獨立可重現產品問題。[最初負控制原始紀錄](evidence/initial-negative-control.log) 明確 `Expected false / Received true`，原紀錄中的本機trace路徑不是本包證據依賴。

另一原 [CI 40168603581](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40168603581) 是驗證腳本把native fetch的 `Response.ok` 布林值當函數；HTTPS功能當次未執行，應分類測試工具失敗。修正 `.ok` 並補native Response契約單元後，才執行後續HTTPS測試，不能用前一輪本機綠燈充當HTTPS證據。

## rc.2 實際修正

產品差異已在凍結的 #12 `59dff72bb55a77c371863d6e8a998529b1997bf0`，本材料分支**沒有再修改產品**。

- `workspace.js` 記錄 `viewLoading`／`viewReadyHash`；檔案 `flush()` 完整排空後，才把主區 `inert`／`aria-busy`，一直到精確的目標畫面載入完成。
- `benchAction` 處理結束時依目標是否已就緒解鎖，不把已顯示目的地再次永久鎖住；舊表單在載入空窗不能focus／鍵盤編輯。
- 欄位草稿的 `ownerHash` 在編輯建立時固定，不以正在跳轉的網址錯綁。
- 取消離開等待hash回復；測試等目標特有DOM／就緒狀態，不只是等待同名欄位存在。保存／raw／引用等資料斷言保留。

[59dff72實際diff](https://github.com/lrqrll/practical-thinking-studio/commit/59dff72bb55a77c371863d6e8a998529b1997bf0)。原 `storage.spec.cjs`、`document.spec.cjs`、`ci-regressions.spec.cjs` 相對正式基線未改。早期把鎖放在flush前的方案被既有「等待寫入時追加輸入」回歸抓出，已撤掉該方案，不能用提前禁止編輯來規避新輸入保存。

## 可獨立重跑的負控制

[nav-negative-control.cjs](../../../scripts/qa/m2/nav-negative-control.cjs) 用 git archive 取得兩個**完整固定SHA**，各在自己的臨時靜態服務／空白context建立合成工作台。以promise latch暫停範本讀取，對切換中的舊input直接 `.focus()`，再以實際鍵盤輸入 `9`。舊版值變成9，新版舊表單仍空白；不靠固定睡眠。

```sh
npm ci --ignore-scripts
npx playwright install --with-deps chromium
node scripts/qa/m2/nav-negative-control.cjs
```

儲存庫需包含兩個提交（CI fetch-depth=0）；工具只清除它自己建立的臨時目錄。已有Chromium可指定 `NEXUS_CHROMIUM`。預期輸出：

| 產品來源 | 控制斷言 | 解讀 |
|---|---|---|
| e6f620353c2976f00e7913167d5c4720904c788e | `observedFocus: true` | 負控制重現舊漏洞；不是宣布舊版本合格 |
| 59dff72bb55a77c371863d6e8a998529b1997bf0 | `observedFocus: false` | rc.2阻止舊表單focus；不是完整獨立QA |

[本次雙SHA原始輸出](evidence/nav-control.json) 是開發者驗證。舊版若未重現、或新版仍能focus，工具必須失敗，不能把期望改成兩邊都false或跳過舊版。本控制另驗證鍵盤不能改寫新版舊表單；新頁資料隔離由候選m2-ui案例確認。

## 必須獨立複審的五個面向

完整步驟、預期及結果欄在[操作清單 NAV-01～05](OPERATING-CHECKLIST.md)。涉及內部時序需使用受控Playwright，或在隔離候選頁DevTools按對應測試的evaluate片段注入promise latch，然後以頁面按鈕／鍵盤操作。不是在正常畫面盲點擊等待。

1. **目標載入**：候選 `m2-ui.spec.cjs` 的 `a delayed template transition cannot focus or edit the outgoing workbench fields`。暫停 `readMetaPrefix('workbench-template:')`，驗證舊input不能focus；釋放後新範本預設0.001拒絕、原工作台values仍空。
2. **保存中切頁**：`header navigation during a pending field save does not leave the destination inert or lose the committed value`。先完成實際寫入、暫停回應，從頁首切工作空間，目的畫面出現後才釋放。目的頁不能永久inert，再開原工作台值完整。
3. **取消離開**：`dirty navigation is guarded and reloaded drafts recover as copies without sources; failed saves keep drafts`。取消確認後網址回原hash、輸入保持；重整後草稿可復原新副本且來源為空，不覆寫原檔。
4. **CAS與配額**：`two browser tabs never overwrite newer field values...` 保護另一分頁已保存值、保留失敗分頁輸入與草稿，復原成獨立副本；CAS不是強行原rev重試覆寫。`recovery quota errors...` 同時故障備援與IDB寫入，修復後原頁重試及後續保存成功、不清空輸入。
5. **文件追加輸入**：原 `storage.spec.cjs` 的 `navigation drains an edit made during an in-flight write`。存檔回應暫停期間追加編輯，切頁後仍要完整保存最新內容。候選完整CI已通過，本材料workflow另重複3次本機回歸；不可把它誤稱本次正式站HTTPS文件驗收。

[候選測試原碼 permalink](https://github.com/lrqrll/practical-thinking-studio/blob/59dff72bb55a77c371863d6e8a998529b1997bf0/tests/e2e/m2-ui.spec.cjs)、[原保存回歸](https://github.com/lrqrll/practical-thinking-studio/blob/59dff72bb55a77c371863d6e8a998529b1997bf0/tests/e2e/storage.spec.cjs)。所有故障注入只用合成資料的隔離context；完成即關閉context，不修改正式資料。

[候選 CI 40170486240](https://github.com/lrqrll/practical-thinking-studio/actions/runs/40170486240) 完整回歸成功，並以HTTPS跑13個M2 UI＋1大容量案例；這是開發者原始證據。新增材料workflow在同候選HTTPS再跑上述5個M2案例各3次，以及本機原文件保存3次，零自動重試。獨立QA沒有瀏覽器的缺口仍存在；只有獨立複審結果可解除M2-NAV-01，本包不自行宣布解除。
