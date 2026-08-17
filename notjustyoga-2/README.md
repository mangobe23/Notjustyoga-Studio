# Notjustyoga Studio 網站使用說明

這是一個**純手工打造、免月費**的靜態網站（HTML + CSS + JS，沒有後端、沒有資料庫），
你可以自己用記事本或 VS Code 打開檔案直接修改文字，改完存檔、上傳就完成了。

## 檔案結構

```
notjustyoga/
├── index.html              首頁
├── courses.html             瑜伽課程頁（哈達 / 陰瑜伽 / 一對一 / 戶外公園瑜伽）
├── services.html            物理治療頁
├── blog.html                部落格文章列表
├── blog-post-template.html  單篇文章「範本」，每次寫新文章就複製這份
├── contact.html             聯絡我們 + 預約表單
├── css/style.css            所有樣式（顏色、字體、排版都在這）
├── js/main.js               手機選單 + 中英切換功能
├── notion-sync/             Notion 自動同步的程式（見 NOTION_SETUP.md）
└── .github/workflows/       GitHub Actions 自動化設定
```

> ✍️ **想用 Notion 寫文章、自動發布？** 完整設定步驟都在
> **`NOTION_SETUP.md`** 這份文件裡，跟著做一次（大約 20–30 分鐘）
> 之後就完全不用碰程式碼，在 Notion 打字、把狀態改成 `Published` 就好。

---

## 1. 怎麼修改文字

每個頁面裡，中英文是成對出現的，長這樣：

```html
<span class="lang-en">Hatha Yoga</span>
<span class="lang-zh">哈達瑜伽</span>
```

- `lang-en` 是英文版本，`lang-zh` 是中文版本，網站右上角的「EN / 中文」按鈕會自動切換顯示哪一段。
- 直接把裡面的文字改成你要的內容即可，**不要動 `<span class="lang-en">` 這些標籤本身**。
- 用瀏覽器打開任一個 `.html` 檔案，就可以直接預覽（雙擊檔案，或拖進 Chrome）。

## 2. 怎麼改顏色 / 字體

打開 `css/style.css`，最上面 `:root { ... }` 這一段是所有顏色的集中管理區：

```css
--wall:     #f2ecdf;   /* 牆面米杏色 */
--curtain:  #2b3346;   /* 深藍窗簾色 */
--timber:   #5b3d28;   /* 木樑棕色 */
--clay:     #cdae83;   /* 按鈕陶土色 */
```

改這幾個色碼，全站顏色會一起跟著換，不用一頁一頁改。
字體在 `--serif`（標題用）跟 `--sans`（內文用），目前用 Google Fonts 的
`Cormorant Garamond` + `Noto Serif TC`（中文標題）與 `Jost` + `Noto Sans TC`（中文內文）。

## 3. 怎麼寫新的部落格文章

**推薦方式：用 Notion 寫**，設定一次之後完全不用碰程式碼，
詳細步驟見 **`NOTION_SETUP.md`**。

**手動方式（不想設定 Notion，或想寫一篇快速的）：**

1. 複製 `blog-post-template.html`，改名例如 `why-yin-yoga-helps.html`
2. 打開這個新檔案，把標題、日期、內文換成你自己寫的內容（英文/中文都可以改，
   若不想維護雙語版本，把不要的 `<span class="lang-en">` 或 `<span class="lang-zh">`
   標籤跟裡面的文字直接刪掉就好）
3. 打開 `blog.html`，複製其中一整塊：

   ```html
   <article class="blog-card"> ... </article>
   ```

4. 把複製的區塊貼到 `.blog-grid` 最上面（最新文章放最上面），
   改標題、日期、摘要，並把連結 `href="blog-post-template.html"` 改成你新檔案的檔名，
   最後**記得刪掉 `<span class="sample-flag">Sample post...</span>` 這一行**（那是範例標記）。

## 4. 怎麼設定 Google 表單（預約用）

因為網站不收線上付款，只需要一個簡單的「預約諮詢表單」：

1. 到 [forms.google.com](https://forms.google.com)，用你的 Gmail 建立一個新表單，
   例如欄位設計：姓名 / Email / 電話 / 想預約的課程或服務 / 想預約的時間 / 備註
2. 表單設定裡（齒輪圖示 → 一般）打開「收集電子郵件地址」，這樣你才知道怎麼回覆對方
3. 表單右上角「回覆」分頁 → 綠色 Sheets 圖示，可以把回覆自動存成 Google 試算表，方便管理
4. 要嵌入網站：右上角「傳送」按鈕 → 選第三個 `<>` 嵌入圖示 → 按「複製」，
   會複製到一段 `<iframe ...>` 的程式碼
5. 打開 `contact.html`，找到 `<div class="form-embed" id="form-embed">` 這個區塊，
   把裡面的 `.form-fallback` 整段刪掉，貼上你剛剛複製的 `<iframe>` 程式碼即可

如果你比較想直接收 email 而不用表單，`contact.html` 裡也已經放了一個
「Email us / 寄信給我們」按鈕（`mailto:` 連結），把裡面的信箱換成你的 Gmail 就能用，
兩個方式可以同時保留。

## 5. 關於工作室地址與社群連結

`contact.html`、`index.html` 和頁尾（footer）裡目前寫著「地址與電話即將公開」，
Instagram / Facebook 連結目前是 `href="#"` 佔位符。等你準備好公開資訊時：

- 搜尋檔案裡的 `Address & phone coming soon` / `地址與電話即將公開`，換成你的實際地址
- 搜尋 `href="#" target="_blank"`，把 `#` 換成你的 IG / FB 網址

## 6. 註冊網域 + 免費上架（不用付主機月費）

你提到想註冊 `notjustyoga.uk`，這部分年費是網域註冊本身的費用（跟主機無關，
一般 `.uk` 網域一年大約 £5–15，你可以到 Namecheap、GoDaddy、或 123-reg 等平台註冊）。

網站主機的部分，因為這是純靜態網站，可以用以下**完全免費**的方式上架：

> ⚠️ 如果你要用第 3 節的 Notion 自動同步功能，**必須**用下面「GitHub +
> Netlify 連動部署」的方式（`NOTION_SETUP.md` 裡有完整步驟），
> 因為自動化機器人需要透過 GitHub 才能把新文章推送上線。
> 如果你不打算用 Notion，單純用最簡單的 Netlify Drop 拖拉上傳也完全沒問題。

**推薦：Cloudflare Pages（免費、含 CDN、綁自訂網域簡單）**
1. 把整個 `notjustyoga` 資料夾上傳到一個 GitHub 帳號的 repository
2. 到 [pages.cloudflare.com](https://pages.cloudflare.com) 用該 GitHub 帳號登入，選擇這個 repository，
   Build command 留空、Build output directory 填 `/`，按部署
3. 部署完成後，到 Cloudflare Pages 專案設定裡的「Custom domains」，
   輸入 `notjustyoga.uk`，並依照畫面指示把 DNS 設定改到 Cloudflare（免費）
4. 之後只要更新 GitHub 上的檔案，網站會自動重新部署，完全不用月費

也可以用 **Netlify** 或 **GitHub Pages**，流程大同小異，一樣免費且支援自訂網域。

## 7. 常見小提醒

- 目前網站沒有放真實照片（因為沒有你的工作室照片素材），視覺是用色塊、線條與拱形圖案做出質感，
  等你有實拍照片後，我可以幫你把照片加進 hero 區塊或課程卡片裡。
- 手機版排版已經處理好（選單會變成右滑式選單），可以直接用手機瀏覽器打開檔案測試。
- 中英切換按鈕會記住使用者上次選的語言（存在瀏覽器本機，不會影響其他人）。

如果之後想加新頁面、換版型細節，或想把真實照片放進去，都可以再回來找我調整。
