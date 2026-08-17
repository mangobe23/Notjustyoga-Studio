# 用 Notion 寫部落格文章 — 完整設定教學

設定一次大概 20–30 分鐘，之後你只要在 Notion 裡打字、把狀態改成
`Published`，最多等 30 分鐘（或手動觸發），文章就會自動變成網站上
一篇跟主站風格一致的頁面。全程免費。

這套系統牽涉三個免費服務，先了解一下分工：
- **Notion** — 你寫文章的地方
- **GitHub** — 存放網站程式碼 + 跑「自動同步」機器人的地方
- **Netlify** — 網站實際上線的地方，會自動偵測 GitHub 有更新就重新部署

---

## 第一步：把網站放上 GitHub（之後才有「自動化」可以跑）

之前用 Netlify Drop 是手動拖資料夾，這次要換成「GitHub 連動」的方式，
這樣自動化機器人才有地方可以推送新文章。

1. 到 [github.com](https://github.com) 註冊一個免費帳號（如果還沒有）
2. 右上角 `+` → **New repository**，Repository name 填 `notjustyoga-website`，
   設為 **Public** 或 **Private** 皆可，按 **Create repository**
3. 把我給你的整個 `notjustyoga` 資料夾內容上傳上去，最簡單的方式：
   在剛建立的 repository 頁面點 **uploading an existing file**，
   把資料夾內所有檔案（包含 `notion-sync` 和 `.github` 資料夾）拖進去，
   Commit 儲存

> 💡 如果你不熟悉 GitHub 網頁操作，跟我說一聲，我可以把上傳步驟拆得更細，
> 或是教你用 GitHub Desktop（有圖形介面，不用打指令）。

---

## 第二步：在 Notion 建立「Blog Posts」資料庫

1. 在 Notion 新增一個頁面，選擇 **Table（表格）** 類型的資料庫，命名為 `Blog Posts`
2. 資料庫需要以下**五個欄位**（欄位名稱要完全一樣，包含大小寫）：

   | 欄位名稱 | 類型 | 說明 |
   |---|---|---|
   | `Title` | Title（標題，資料庫預設就有） | 文章標題 |
   | `Slug` | Text（文字） | 網址用的英文代稱，例如 `why-yin-yoga-helps`（純小寫、用 `-` 連接，不要有空格） |
   | `Summary` | Text（文字） | 一兩句話的文章摘要，會顯示在部落格列表卡片上 |
   | `Date` | Date（日期） | 發佈日期 |
   | `Status` | Select（單選） | 選項設定兩個：`Draft`、`Published` |

3. 文章的「內文」不用另外設欄位 —— 直接點進每一筆資料，
   像平常寫 Notion 頁面一樣打字（標題、段落、項目符號清單、引用、圖片都支援）

---

## 第三步：建立 Notion 整合（Integration），取得金鑰

1. 前往 [www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. 點 **+ New integration**，命名例如 `Notjustyoga Website Sync`，
   Associated workspace 選你的工作區，儲存
3. 儲存後會看到一組 **Internal Integration Secret**（一長串英數字），
   點 **Show** 後複製起來 —— 這組就是等一下要用的 `NOTION_TOKEN`，
   **不要公開分享這組密鑰**

4. 回到你的 `Blog Posts` 資料庫頁面，右上角 `···` 選單 →
   **Connections**（或 **Add connections**）→ 選你剛建立的
   `Notjustyoga Website Sync` 整合，讓它取得存取這個資料庫的權限
   （這一步很容易漏掉，沒做的話同步會失敗）

5. 取得 **Database ID**：打開 `Blog Posts` 資料庫，複製瀏覽器網址列的網址，
   格式類似：

   ```
   https://www.notion.so/yourworkspace/1a2b3c4d5e6f7g8h9i0j...?v=...
   ```

   網址中 `yourworkspace/` 後面、`?v=` 前面那一串 32 位英數字就是
   Database ID，複製起來備用。

---

## 第四步：把金鑰安全地存進 GitHub

1. 打開你的 GitHub repository 頁面 → **Settings** →
   左側選單 **Secrets and variables** → **Actions**
2. 點 **New repository secret**，新增第一組：
   - Name: `NOTION_TOKEN`
   - Value: 貼上第三步拿到的 Internal Integration Secret
3. 再新增第二組：
   - Name: `NOTION_DATABASE_ID`
   - Value: 貼上第三步拿到的 Database ID

這兩組資訊只有這個自動化流程看得到，不會顯示在網站上或公開的程式碼裡。

---

## 第五步：讓 Netlify 改成「跟著 GitHub 自動部署」

1. 登入 [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import an existing project** → 選 **GitHub**，
   授權後選擇你的 `notjustyoga-website` repository
3. Build command 留空，Publish directory 填 `.`（代表整個根目錄），按部署
4. 之後回到 Site settings → Domain management，把你的 `notjustyoga.uk`
   接上去（跟之前教的步驟一樣）

設定完成後，**以後只要 GitHub 上的檔案有更新（不管是你手動改，
還是 Notion 同步機器人自動推送），Netlify 都會自動重新部署**，
你完全不用再手動拖資料夾了。

---

## 第六步：開啟自動同步，寫下第一篇文章

1. 回到 GitHub repository 頁面，點上方 **Actions** 分頁，
   如果看到提示要 enable workflows，按下同意
2. 到 Notion 的 `Blog Posts` 資料庫，新增一筆資料，
   填好 Title / Slug / Summary / Date，內文正常打字，
   最後把 **Status 改成 `Published`**
3. 回到 GitHub → **Actions** 分頁 → 左側選
   **Sync blog posts from Notion** → 右邊 **Run workflow** 按鈕，
   手動觸發一次（平常它每 30 分鐘會自動跑，但第一次可以手動測試比較快）
4. 等它跑完（綠勾勾代表成功），Netlify 會自動偵測到新的 commit 並重新部署，
   通常 1–2 分鐘後你的 `blog.html` 就會出現這篇新文章，
   原本的兩篇「Sample post」範例會被自動換掉

之後每次要發新文章，重複第 6 步的第 2–3 點就好，
甚至不用手動觸發，最慢 30 分鐘內就會自動上線。

---

## 疑難排解

- **文章沒有出現** → 檢查 Notion 那筆資料的 `Status` 是不是真的選了
  `Published`（不是 `Draft`）
- **GitHub Actions 跑失敗（紅色叉叉）** → 點進去看錯誤訊息，最常見原因是
  `Blog Posts` 資料庫忘記在第三步第 4 點「Add connections」授權給整合
- **Slug 留空** → 系統會自動用文章標題產生網址代稱，但建議還是手動填一個
  乾淨的英文 slug，比較好看也比較好分享
- **想暫時停用自動同步** → GitHub repository → Settings → Actions →
  General，選 Disable actions，就不會再自動跑

有任何一步卡住，把錯誤畫面截圖給我，我可以幫你排查。
