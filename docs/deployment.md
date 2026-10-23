# Cloudflare 上線與自動部署紀錄

## 2026-10-23 首次手動上線（歷史快照）

下列首次部署記錄保留當時狀態；自動部署現況見下一節。

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


## 2026-10-23 main 自動部署（目前機制）

- Workflow：`.github/workflows/cloudflare-pages.yml`；僅 main push，paths 白名單限四頁、assets、build/verify script、package/lock、Wrangler 與 workflow 自身。
- 無 schedule、workflow_dispatch 或 docs-only CI；README/docs/handoff/audit/tracker 不在觸發清單。concurrency group 將 production 部署序列化。
- GitHub Actions Secrets 名稱：`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_API_TOKEN`；已用官方 API 建立專用 Pages Write token、讀回權限並測試可讀取目標專案，直接寫入 GitHub Secrets。管理憑證未傳入 GitHub。
- 權限界線：專用 token 為指定帳號 Pages Write，Cloudflare 此 scope 是帳號級，並不限制到單一 project；workflow 的目標固定為 k-journey。無 token 管理、DNS、D1、R2 權限。
- 實際 main push：`4d11cf6c3571854e8ff33d5f720669dbbebf0fc1`；[GitHub Actions run 40012991623](https://github.com/mkhsu2002/k-journey/actions/runs/40012991623) 為 completed / success。
- Cloudflare production deployment：`5556529c-ba59-4dc4-9fbf-732e64c47410`，canonical deployment API 為 deploy success、main、同一 commit，commit_dirty=false。
- CI 通過安裝、8 項互動測試、建置、Wrangler 發布及正式 API／全部 33 檔內容雜湊驗證；失敗會使 workflow 標紅。
- docs-only 驗證使用本輪真正的 README／部署紀錄／B 路線評估文件更新，不製造空 commit 或人工喚醒。
- 舊首次手動上線段落中的「未建立 GitHub 自動部署」只描述當時狀態，現已由本節取代；手動部署保留為必要維護手段。
