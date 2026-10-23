# 新巴比倫・療癒探險之旅

《新巴比倫 ZERO｜K 的狩獵日誌》的手機優先網頁遊戲試玩。以 FK-W001 潮痕回聲濕地為主，對照探索圖鑑、定點觀察與節律劇情三種方向；B 概念頁另有 FK-W012 霧階回聲外環頻道。

這是玩法驗證用的垂直切片，沒有帳號、後端、排行榜或付費功能。各頁及各演示進度獨立，只存在記憶體，重新整理即重設。節律互動需要等待光圈節拍，但沒有倒數期限或失敗懲罰。

## 試玩入口

Cloudflare Pages 正式網址：https://k-journey.pages.dev/ 。

| 檔案 | 內容 | 適合驗證 |
| :--- | :--- | :--- |
| `index.html` | 三版導覽與進度說明 | 手機入口與版本選擇 |
| `version-a.html` | 獨立 A 版：航圖、抵達、影片熱點、五物種圖鑑、明信片翻面與 PNG 下載 | 最完整的單站探索收藏流程 |
| `version-b.html#b` | 企劃記錄與 A/B/C 輕量演示；B 用靜圖漂移模擬活景，並非即時串流 | 頻道、色調、觀察卡與陪伴感 |
| `version-c.html#c` | 含真影片的 A/B/C 整合頁；C 為方與 K 的對話、選項及四拍調律 | 故事推進與節律互動 |

C 整合頁的 A 演示需要六拍，C 劇情需要四拍。兩者每個呼吸週期最多記錄一次，不可連點跳過。B 概念頁的 A 演示則採吸氣按住、吐氣放開。

## 專案結構與執行

```text
index.html
version-a.html
version-b.html
version-c.html
assets/               共用 JPG、MP4、MP3，依內容雜湊命名
tests/journey.test.cjs 互動回歸與本地連結檢查
package.json          僅提供開發測試指令
.nojekyll             保留的 GitHub Pages 相容檔，不納入 Cloudflare 輸出
```

正式網站不需要 Node.js、npm、建置工具、API key 或資料庫。Google Fonts 是唯一外部字型依賴，無法連線時使用系統字型；遊戲媒體皆來自本站。這不是可直接離線使用的 PWA，也不再是內嵌素材的獨立單檔，移動時須保留 `assets/`。

本機預覽，於專案根目錄執行：

```sh
python3 -m http.server 8000
```

開啟 http://localhost:8000/ 。透過 HTTP 測試影片與明信片下載，避免依賴 `file:` 模式的瀏覽器差異。

開發檢查需要 Node.js 18 以上與 npm：

```sh
npm ci
npm test
```

測試使用 jsdom 驗證頁面初始化、素材及連結、A 收集解鎖、影片切換狀態、節拍防連點、分支說話者，以及重設時取消延遲事件。媒體播放以替身模擬，不能取代真實裝置的影音解碼、音訊解鎖及下載測試。

## 2026-10-23 檢視與修正

| 問題 | 修正 |
| :--- | :--- |
| 三頁重複內嵌 base64，開頁即下載未使用素材 | 抽出 29 個共用媒體，保留原始內容，利用瀏覽器快取及影片按需載入 |
| 首頁與 README 寫每頁約 15 MB，與目前內容不符 | 改成實測數據與按需載入說明 |
| C 整合頁切離 A 棲地後再切回，影片仍暫停 | 回到已開啟的棲地時恢復播放 |
| 一個節拍快速連點可直接完成修復 | 每個週期只接受一次有效點按，完成後鎖定 |
| C 重玩後，上一輪選項回覆或過關計時器仍會寫入畫面 | 重設時取消相關計時器 |
| C 選項文字是方的指示，卻標成 K；回覆反之 | 修正說話者標示，不改故事內容 |
| B 收齊圖鑑後反覆點物種會啟動多個呼吸動畫 | 開始前取消前一個動畫；隱藏時不累積呼吸進度 |
| B 抵達動畫與節律完成延遲可能跨越重玩 | 重設時取消待執行事件；加入 pointercancel 與鍵盤按住操作 |
| 首頁點 B/C 卻進入頁內 A 演示 | 加入 `#b`、`#c` 入口選擇 |
| 缺少回入口、彈窗鍵盤關閉及焦點循環 | 新增返回連結、Escape 關閉、焦點返回與可見焦點樣式 |
| 手機切到背景仍可能播放媒體 | A/C 頁隱藏時暫停影音與環境音；返回時僅恢復目前棲地影片 |

效能數據以未壓縮檔案大小計算，不代表網路實際傳輸量：原三個試玩 HTML 共 10,467,493 bytes，整理後約 0.16 MB；29 個獨立媒體共 3,839,462 bytes，整體靜態內容約 4 MB。初訪實際下載量依開啟頁面、圖片載入及影片操作而異，不能宣稱所有裝置都有相同首屏提升。

檢查未發現 PHP、伺服器執行碼、外部 API 請求或原始碼中的憑證；網站不處理登入或個資表單。這是本次程式碼檢視結果，不等於滲透測試或零風險保證。

## 部署：Cloudflare Pages

2026-10-23 改採 Cloudflare Pages Direct Upload；正式專案為 `k-journey`，production branch 為 `main`，網址為 https://k-journey.pages.dev/ 。原 GitHub Pages 設定說明已停用，不代表已在 GitHub 啟用或關閉 Pages。

```sh
npm ci
npm test
npm run build
npx wrangler pages deploy dist --project-name k-journey --branch main
```

部署憑證應由 macOS Keychain 或部署平台安全儲存按需注入，不得寫入 repository。`scripts/build.cjs` 只將四個 HTML 與 `assets/` 複製到 `dist/`，不會公開 README、測試、開發依賴或部署設定。此站沒有後端、環境變數、資料庫或 migration。

`main` 的網站內容、素材、建置／驗證腳本、依賴或部署設定更新後，由 `.github/workflows/cloudflare-pages.yml` 自動執行測試、建置、Cloudflare 發布及正式站驗證。README、`docs/`、handoff、audit、tracker 等純文件變更不在 paths 白名單，不啟動此 workflow；沒有 cron 或手動喚醒入口。部署以 concurrency 序列化。

GitHub Actions Secrets 使用 `CLOUDFLARE_ACCOUNT_ID` 與 `CLOUDFLARE_API_TOKEN`。專用 token 僅有目標帳號的 Pages Write 權限，不沿用本機管理 token；Cloudflare 此權限是帳號層級，並非單一 Pages project 隔離。憑證只注入部署及 API 回讀步驟。

`python3 scripts/verify-deployment.py` 比對四頁與全部媒體的 SHA-256；CI 額外核對 Cloudflare production canonical deployment 的 main commit 與成功狀態，失敗則整次 workflow 標紅。可在本機完成 `npm run build` 後執行此指令核對公開檔案。影音 Content-Type、Range 與手機實機下載另見部署紀錄；自動驗證不宣稱涵蓋實機操作。

本次正式部署與驗證結果見 [部署紀錄](docs/deployment.md)。

## B 路線整合方向

後續正式遊戲採 B 版棲地觀測方向。建議內建至 K 的狩獵日誌官網，共用已驗證週結與物種資料，自動產生頻道；本輪僅完成評估，尚未搬移或上線官網遊戲。詳見 [整合評估與發布時序](docs/b-route-integration-assessment-2026-10-23.md)。

## 下一步建議

| 優先序 | 建議 | 原因與驗證方式 |
| :--- | :--- | :--- |
| 1 | 在 iPhone Safari、Android Chrome 與應用程式內建瀏覽器實機試玩 | 驗證靜音自動播放、音訊解鎖、前後景切換、直橫向與 PNG 下載；jsdom 不涵蓋這些行為 |
| 2 | 依已選定 B 路線推進官網整合 | 先建立資料驅動的棲地頻道與五種物種觀察卡；週結完成並驗證後才新增。原型對話與企劃不自動視為正典，詳見整合評估 |
| 3 | 將物種、領域、影片對照抽成共用資料檔 | 目前三份 HTML 各自維護資料及邏輯；擴站前應用穩定 ID、素材清單與內容版本避免漂移 |
| 4 | 加入可選本機存檔、清除進度及 schema 版本 | 現在重整就消失；須先決定三版是否應共享進度，再設計遷移規則 |
| 5 | 完整處理媒體錯誤與無障礙替代玩法 | 部分影片失敗仍靜默，沒有完整字幕、音量控制或不依賴節拍的修復模式；減少動態效果目前僅涵蓋 CSS 動畫 |
| 6 | 收斂為單一應用，再評估 PWA 與離線快取 | 不宜讓三份企劃演示長期並行擴寫；離線快取須有更新及儲存空間策略 |

## 素材與權利

世界觀、圖像與物種資料來源：[K 的狩獵日誌](https://k-hunting-log.icareu.tw/)。此試玩含探索圖、生態總結圖、定點影片、物種圖及短影音；劇情包含企劃試寫內容。企劃 PDF 原紀錄位於 Google Drive「Muse work」，未隨 repository 提供，也不是網站執行依賴。

本 repository 尚未附公開授權條款。公開可讀不代表可任意使用角色、圖像、影音或程式碼；對外再散布與商業授權須由權利人明確訂定。
