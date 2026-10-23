# B 路線與 K 的狩獵日誌整合評估

日期：2026-10-23（America/Vancouver）。狀態：歷史評估快照；作者同日核准後，已依此設計在 `mkhsu2002/neobabylon-0` 實作 `/journey/` 單一 B 主畫面。以下「建議／尚未實作」描述保留評估當時狀態，實際完成及正式驗證以官網 `docs/journey.md` 與 `docs/journey-release-2026-10-23.json` 為準。

## 結論

建議正式 B 版內建到 `mkhsu2002/neobabylon-0`，候選路由 `/journey/`，共用官網的權威資料、素材、發布門檻及 Cloudflare 建置。遊戲不再逐週手填 HTML 頻道，不另設 cron、跨 repo 寫入或第二份 Sheet。

本次已完成的是獨立 `k-journey` main 自動部署；這是整合前的持續維護措施，不代表官網已具備遊戲或自動擴站。

## 來源與查核範圍

- 官網來源 `neobabylon-0` 的 HEAD 與 origin/main 均為 `51ce3e5d934018f9e48a37d1ab1ca7d0e3103e10`；開始查核時工作樹乾淨。
- Cloudflare `neobabylon-zero` production `8b5b5fe6-52ca-4bf6-b810-395003049cf7` 為同 commit、deploy success；GitHub source main，build `npm run build`，輸出 `dist`。
- Cloudflare watch paths 為 include `*`，exclude `README.md`、`docs/*`、`tests/*`、`AGENTS.md`。目前 tracker 與程式碼變更可觸發部署；未修改官網部署設定。
- `trackers/weekly-planning.tsv` 的 W001–W012 均為 summary completed 且有 summary_verified_at。逐週各 15 幕皆通過既有公開條件、cloudflare_deploy_status=verified；12 個正式子領域頁逐一回讀 HTTP 成功、正確名稱與 canonical。這不代表本輪重新驗證全部 60 個物種頁及 180 張原圖。
- W013 為 active、summary pending、驗證時間空白，不得加入遊戲；不能以它已有子領域資料或部分日誌公開作為整週遊戲解鎖依據。
- `scripts/build-site-data.mjs` 從 tracker/world 產生 `src/data/site.ts`、`src/data/subdomains.ts`；後者包含已規劃但尚未完整公開的 W013，因此遊戲不可直接展示整個 subdomains 陣列。
- `src/lib/gallery-wall.mjs` 已實作週結驗證與五日完整公開檢查，可抽取共用資格判斷，避免複製兩套門檻。遊戲不依賴圖片牆策展清單，不會因忘記策展而少一站。
- B 原型的 `CHANNELS`、按鈕、觀察卡均為寫死資料，只涵蓋 W001 與 W012 的部分觀察；背景是靜態圖片漂移。網站內「24 支影片」文案不是本輪查得的資產證據。
- 官網 assets/public 內查得 0 個 MP4；圖片牆有 7 筆 YouTube Shorts，但不是每個子領域的定點影片對照。獨立原型有 9 個 MP4，仍需逐支核對內容及物種／子領域關聯，不能推定已覆蓋 12 站。

## 三種做法

| 做法 | 優點 | 代價 | 判斷 |
| --- | --- | --- | --- |
| 同 repo、同官網 `/journey/` | 內容與遊戲共用一次建置、無跨站契約漂移 | 需把原型拆成資料與介面，處理現有素材清除流程 | 推薦 |
| 保留獨立遊戲，讀官網公開 manifest | 遊戲可獨立部署 | 需版本契約、跨站快取／錯誤處理，內容與程式部署分開驗證 | 可作過渡，不是集中管理終點 |
| iframe 或整份 HTML 複製進官網 | 最快呈現既有原型 | 寫死頻道、企劃文案及重複資料仍存在，無法自動增加站點 | 不建議作正式架構 |

## 建議的 B 版範圍

以「棲地觀測」為主：選子領域頻道、欣賞棲地背景、閱讀五種物種觀察卡、連回正式物種與日誌。採用 B 的陪伴感與慢速瀏覽，不沿用沒有真實來源的 LIVE／直播宣稱。日夜色調若保留，定位為視覺選擇，不宣稱影像是該時段實拍或即時更新。

每站至少有已公開生態總結圖與五種物種卡。無合格影片時呈現靜態棲地圖及可關閉的輕微動態；不顯示壞播放器，不阻止該週新增。影片為可選增強，只有來源、對照、尺寸、格式、poster、權利與公開狀態查核完成後才啟用。尊重減少動態效果，切背景／切站即暫停影音，音效由使用者主動開啟。

A 版的圖鑑收集／明信片可列下一階段；其目前每站五個熱點座標無法由週結文字可靠推導，不作新站自動加入的前提。C 版分支劇情也不會由週結自動生成，避免把推論改成正典。獨立原型的 A/B/C 公開網址保留作歷史試玩，正式 B 版不展示企劃全記錄、prompt、內部規格或製作進度。

第一階段維持現有「不持久化遊戲進度」行為。若後續加入收藏存檔，另以 stable creatureId/subdomainId 加 schema version 設計；搬站前需決定是否有跨 origin 匯入需求，不能宣稱 localStorage 會自動搬移。

## 自動新增的資料契約

建議由 build-time 純函式建立公開站點清單，僅挑選符合以下條件的週次：

1. weekly-planning 中 `summary_status=completed` 且 `summary_verified_at` 非空；不以 planning_status=active 為必要條件，歷史 completed/archived 的公開內容永久保留。
2. 五日各早／中／晚共 15 幕均通過官網既有公開門檻，每日正式部署驗證已完成，五個物種皆 revealed。
3. 一個穩定 subdomain_id、五個不同 creature_id；公開子領域／生物／日誌路徑與封面素材可解析且存在。
4. 週總結圖與五個物種封面皆可用。合法但未完成的週次直接略過；已標 completed 卻缺關鍵資料／素材則阻止建置，保留上一個成功部署，避免上線空頻道。

候選公開欄位：`schemaVersion`、內容雜湊 `revision`、`stations[]`；每站只輸出 `id`、`weekId`、`title`、`cover`、`summaryUrl`、`species[]`，可選 `video`（src/poster/type）；每種物種僅輸出 stable id、公開名稱、威脅標籤、已公開觀察摘要、image、creatureUrl、logUrl。不得將整份 TSV、尚未揭露資料、prompt、notes、驗收／排程狀態或 secret 送到前端。

契約由官網 Astro 建置使用，可直接輸入頁面資料；需要獨立 manifest 時才新增 `/journey/stations.json` 靜態產物，不新增動態 API／資料庫。所有公開文字採已公開的官網文案白名單，不能直接把 tracker 的任務策略或生成欄位當作觀察卡說明。繁中先上線，英日若新增，仍遵守既有獨立 reviewed 翻譯閘門。

## 發布時序與事件驅動

```text
既有週結流程完成文章與圖片
  → main push、Cloudflare 官網部署
  → 正式頁／素材／canonical 等實際回讀
  → 既有流程保存 summary_status=completed + summary_verified_at
  → 該狀態 commit 推入 main
  → Cloudflare 既有來源觸發建置
  → build 依同一資格判斷增加一站及五張物種卡
  → 官網及遊戲一同部署
  → 回讀遊戲站點 ID、數量、排除未完成週、卡片連結與素材
```

不在「第一個週結文章 commit」就宣稱遊戲解鎖，因為那時正式回讀可能尚未成功；應在已驗證狀態 commit 部署成功後可見。這會沿用既有週結驗證後的狀態保存，不另加輪詢。預估每個新增週結至多增加一次必要的官網狀態部署；若既有狀態 push 已涵蓋，額外 0 次；固定空跑 0。訪客已開啟的舊頁第一階段在重新整理後看到新站，不承諾未實作的即時推播。

一般 docs/handoff/audit 不影響公開輸出，不觸發部署；`trackers/weekly-planning.tsv` 的週結完成狀態會改變公開遊戲清單，應視為發布輸入而非 docs-only。可在後續收斂成資格清單雜湊比對，但不得將該 tracker 一概排除，否則週結驗證後無法自動增加站點。

## 搬移注意事項與順序

1. 先在官網實作純資料資格判斷與回歸測試，W001–W012 可重建 12 站、60 種物種卡；W013 必須為 0 新站。此數字是本次快照，正式驗收以當下權威資料為準。
2. 新增獨立 B 版 Astro 頁、樣式、互動模組，從資料清單產生 UI；拆開 B 原型中混在一起的企劃、A/C 演示及寫死資料。保留官網主導覽、無障礙與正式摘要。
3. 共用已公開 `/media/hunts/` 素材。額外遊戲素材放 `assets/journey/` 並明確整合 `scripts/sync-assets.mjs`；該腳本每次清空 public/media，只放 public/media/journey 會在 build 遺失。圖片牆縮圖需確認來源／解析度適合，不把低解析縮圖當全屏背景。
4. 查核並建立可選影片對照；不自動付費生圖／生影片，不新增排程。先以有實證的資產啟用，無影片站點仍完整可玩。
5. 做 12→13 站的暫存 fixture 測試、重跑不重複、已完成但缺圖阻止發布、回滾不破壞舊 ID、未完成內容不出現在 HTML/JSON。fixture 不得寫入正式 tracker/Sheet。
6. 官網測試及一次完整 build，檢查新路由、各語系公開文案／ARIA／SEO／alt、手機前後景與低動態、素材載入、404；部署後以 Cloudflare API + 真正公開頁／資料／素材交叉回讀。
7. 官網正式驗證後才在原型加入前往正式 B 版連結。舊站保持可讀；關閉獨立部署或設重新導向需另作明確遷移，不在本輪刪站。

## 下一輪可直接執行的工作

先做「官網資料驅動 B 版」，以靜圖與既有公開觀察卡完成所有已驗證週次的自動擴站，再按可驗證的資產加入影片。這比先做影片全集、帳號系統、積分或任務編輯器更能達成週結完成即增加新棲地的目標。實際官網功能實作尚未開始，本文件不表示遷移已獲完成驗證。
