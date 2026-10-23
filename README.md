# 新巴比倫・療癒探險之旅（試玩版）

《新巴比倫》外傳企劃《K 的狩獵日誌》的療癒探險手機遊戲垂直切片。
三個版本共用 **FK-W001 潮痕回聲濕地**的同一包真實素材（探索圖、生態總結圖、
定點生態攝影影片、五個物種的圖鑑資料與短影音），只換玩法外殼，方便對照手感定主幹。

| 檔案 | 版本 | 內容 |
| --- | --- | --- |
| `index.html` | 入口 | 三版導覽頁 |
| `version-a.html` | A 棲地漫遊圖鑑 | 航圖→抵達→定點影片熱點收集圖鑑→翻面明信片（獨立完整版） |
| `version-b.html` | B 異世界定點直播 | 企劃全記錄＋A/B/C 輕量概念演示（靜圖漂移模擬活景） |
| `version-c.html` | C 節律修復之旅 | A/B/C 三版完整試玩（真影片）＋企劃全記錄；C 為方與 K 章回對話＋四拍調律 |

每頁都是自包含單檔 HTML（素材已內嵌），不依賴任何後端。
檔案較大（約 15 MB/頁），手機開啟建議用 Wi-Fi。

## 部署（GitHub Pages）

1. 本 repo → Settings → Pages
2. Source 選 **Deploy from a branch**，分支選 `main`、資料夾選 `/ (root)`，Save
3. 稍後即可在 `https://mkhsu2002.github.io/k-journey/` 開啟

也可以把整個資料夾拖到 Netlify Drop 或 Vercel 直接部署，效果相同。

## 素材來源

- 圖像與物種資料：《K 的狩獵日誌》https://k-hunting-log.icareu.tw/
- 定點生態攝影影片：FK-W001 探索圖版＋生態總結圖版（16:9、10 秒、固定鏡頭）
- 企劃書 PDF：Google Drive「Muse work」／`neobabylon-healing-game-plan.pdf`
