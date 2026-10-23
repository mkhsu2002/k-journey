# Cloudflare 上線紀錄

查核日期：2026-10-23（America/Vancouver）。

- 正式網址：https://k-journey.pages.dev/
- Cloudflare Pages project：`k-journey`；production branch：`main`。
- 已部署程式版本：`a14f644cd00893a2a7a0ee73bb99f2cf9ba0abc4`，已推送 GitHub main。
- Deployment：`3343b13b-cfde-4685-90ee-94d08b76ec11`；Cloudflare API canonical deployment 的 deploy stage 為 `success`。
- `npm test`：8/8 通過；`npm run build`：成功。
- 正式站四個 HTML（跟隨 Cloudflare 正規化重新導向後）與 29 個媒體，共 33 個檔案均與本機逐位元一致。
- 抽查 MP4 Content-Type 為 `video/mp4`；`Range: bytes=0-99` 回傳 HTTP 200 完整檔案，未確認 206 分段回應，不能宣稱分段載入已驗證。
- 未執行手機實機影音解碼、音訊解鎖及明信片 PNG 下載測試。
- 無後端、資料庫、migration、runtime secrets 或 API 契約變更。
- 使用本機 Direct Upload，未建立排程或 GitHub 自動部署。推送 GitHub 不會自動發布。文件更新不需重新部署。
