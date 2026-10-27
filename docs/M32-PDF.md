# M3.2 A：直接 PDF（開發候選，未合併／正式部署）

正式 main 仍 3.4.0／78e90aec61ca825d45534c93515df4d8f949a431。新分支從 PR19 的 2eee4dc6040f8b9078baa6727d7c11922d8d996b 開始，PR16～19 的已驗收3.5.0候選不變；本分支暫用3.6.0-rc.1。使用者授權直接PDF與組裝UX，不含main合併、正式部署、auto-merge或M3.3。

## 已實作

文件「下載PDF」→flush成功→讀指定fileId/rev並深拷貝→專屬worker排版→檢查實際頁面邊界→下載真正含文字PDF。生成時原文件仍可編輯，輸出不混入之後輸入；保存失敗不輸出。worker取消／換頁會終止，不留下半檔；失敗可重試。成功顯示rev、載入ms、生成ms及bytes。A4直／橫是此次輸出選項，不新增保存schema；頁碼每頁均有，標題／段落／粗體／底線／清單／矩形表格／跨頁重複第一列表頭。報價九欄以等寬換行呈現，未承諾保留編輯器colwidth。

按需從同站載入pdfmake0.2.23、兩份內嵌NotoTC靜態字型、coverage；不向外部服務傳送內容。正常打開文件不載入這些大資源。fontTools4.61.1從固定Google Fonts來源生成400/700權重，修改名稱NEXUS Noto TC；OFL允許內嵌及衍生，保留版權及授權，沒有使用保留名Source。版本／來源／原始與輸出SHA256：[supply manifest](qa/m32/pdf-supply.json)。pdfmake npm完整依賴另以暫存lock掃描無已知漏洞，原始結果[在此](qa/m32/pdfmake-audit.json)；不等於永久安全保證。網站不新增npm執行依賴。

## 明確首版界線

只支援A4；最多15萬字元、12欄規則表格。缺字（包含未涵蓋emoji）、圖片、合併儲存格、italic、指定其他字型或未知節點／marks會整份拒絕，原資料不動，可用DOCX／HTML／既有列印。斜體入口仍撤下，舊italic的保存／DOCX／HTML相容不變，沒有聲稱修好字形。保留原頁首頁尾；PDF頁碼固定顯示。引擎0.2.23固定的私有_createDoc/_flushDoc介面用來驗證同一份buffer的實際頁面：文字不得超出頁面、表格不得越過安全邊界；介面不符即停止，升級需重新驗證。120秒停止不無限重試。大字級／長不可分文字可能拒絕，絕不裁切假成功。

## 有限驗證／重跑

Node24、npm ci、Chromium、poppler的pdfinfo/pdffonts/pdftotext/pdftoppm。`NEXUS_CHROMIUM=/usr/bin/chromium npx playwright test tests/e2e/pdf.spec.cjs tests/e2e/pdf-controls.spec.cjs tests/e2e/document.spec.cjs tests/e2e/document-save-drain.spec.cjs --trace on --workers=2`。正常測試沿用全context/page的SHA監測器，補納worker所用的other/fetch資源，HTTPS候選由自己的SHA/namespace綁定。pdf-controls單獨標示測試工具負控制，503與延遲是真正受控網路情境，不能作正式站故障證據。

實際下載PDF，pdftotext核對完整中文字、清單順序、65列及總價數量／每頁表頭／頁碼，pdffonts確認粗體與一般字型emb/sub/uni，逐頁渲染PNG及人工檢視。DOCX／HTML及文件保存等待追加保留回歸。本機首輪3通過1失敗是測試工具將故意404控制混入正常零錯誤監測；保留結果，控制移至獨立negative-control suite，未放寬監測器。修後精確CI／下載／SHA與原始截圖在PR，不沿用先前候選綠燈。

以上是開發者驗證，待Work有界複驗；Safari/Firefox、真手機觸控、完整螢幕閱讀器、OS原生選檔、Office/Calc未測。M2-NAV-01完整獨立操作缺口仍保留，不冒稱已解除。舊41及36+1歷史不變；本次不重跑不相關正式42案、不新增備份版本、不碰真實資料。

首輪GitHub Quality 40527353382在安裝Playwright OS依賴時，azure.archive.ubuntu.com下載25.9MB用5分3秒，步驟5分鐘上限中止，功能測試尚未執行；同期候選實際HTTPS20項與獨立負控制1項通過。後續quality改用runner既有相容Chrome，保留無Chrome時的有界安裝後備，未跳過瀏覽器或TLS驗證。此為環境修正，非產品修前故障。
