# 之後怎麼換照片 — GitHub 版教學

網站目前還沒有放真實照片（用色塊、線條、拱形圖案做視覺），
等你有工作室、老師、學生上課的照片後，照這份教學就能自己換上去，
不需要重新打包、不需要再問我。

## 照片放哪裡

所有照片都放在 `images/` 這個資料夾裡。檔名建議全部小寫、用 `-` 連接、
不要有空格或中文字，例如：`hero-studio.jpg`、`hatha-class.jpg`。

**建議尺寸與檔案大小**（避免網站載入太慢）：
| 用途 | 建議尺寸 | 格式 |
|---|---|---|
| 首頁大圖（hero） | 1600×1400px 左右 | `.jpg`（品質 80% 左右）或 `.webp` |
| 部落格縮圖 | 800×600px | `.jpg` 或 `.webp` |
| 課程 / 服務照片 | 1000×700px | `.jpg` 或 `.webp` |

每張照片盡量控制在 300KB 以下，手機上開網站才不會等太久。
可以用 [squoosh.app](https://squoosh.app)（免費、線上、不用安裝）壓縮照片。

---

## 上傳照片到 GitHub（不需要任何軟體）

1. 打開你的 GitHub repository 網頁
2. 點進 `images` 資料夾（如果還沒有，就在網址列打
   `你的repo網址/upload/main/images` 直接建立）
3. 點右上角 **Add file → Upload files**
4. 把照片從 Finder 拖進網頁，捲到最下方按 **Commit changes**

上傳完成後，這張照片的路徑就是 `images/你的檔名.jpg`。

---

## 把照片接進網頁（在 GitHub 上直接改，不用下載）

1. 回到 repository 首頁，找到你要改的 `.html` 檔案（例如 `index.html`）
2. 點檔案右上角的 **鉛筆圖示（Edit this file）**
3. 找到要替換的區塊，貼上下面對應的程式碼，改成你自己的檔名
4. 捲到最下方按 **Commit changes** — Netlify 會在 1–2 分鐘內自動重新部署

### 範例 1：首頁大圖（hero 區塊的深色拱形區域）

打開 `index.html`，找到這一行：

```html
<div class="hero-arch"></div>
```

換成：

```html
<div class="hero-arch">
  <img src="images/hero-studio.jpg" alt="Notjustyoga 工作室內部"
       style="width:100%;height:100%;object-fit:cover;">
</div>
```

### 範例 2：部落格文章縮圖

打開 `blog.html`（或任何一篇 `blog-xxx.html`），找到類似這樣的區塊：

```html
<div class="blog-thumb">
  <svg viewBox="0 0 24 24" ...>...</svg>
</div>
```

把裡面的 `<svg>...</svg>` 整段刪掉，換成：

```html
<div class="blog-thumb">
  <img src="images/blog-yin-yoga.jpg" alt="陰瑜伽練習照片"
       style="width:100%;height:100%;object-fit:cover;">
</div>
```

### 範例 3：課程 / 服務卡片加照片

打開 `courses.html` 或 `services.html`，找到任一個 `.detail-card`，例如：

```html
<div class="detail-card">
  <div class="detail-tag">01</div>
  <div>
    <h3>...</h3>
    ...
```

在 `<div class="detail-tag">01</div>` 後面、`<div>` 前面加一段：

```html
<img src="images/hatha-class.jpg" alt="哈達瑜伽課堂照片"
     style="width:120px;height:120px;border-radius:4px;object-fit:cover;">
```

（如果想要照片更大張、換版型排列，跟我說一聲，我可以幫你調整 CSS。）

---

## 小提醒

- `alt="..."` 裡的文字是給看不到圖片的人（螢幕閱讀器）跟 Google 搜尋看的，
  盡量寫清楚照片內容，中英文都可以寫兩個 alt（或只寫中文/英文都行，
  不影響網站正常運作）。
- 如果想連 Notion 同步的文章也自動帶封面照，之後可以再擴充
  `notion-sync/build.js`，讓它讀取 Notion 頁面的封面圖並自動放進
  `blog-thumb`，需要的話跟我說，我可以幫你加上這個功能。
- 改壞了不用緊張，GitHub 每次 commit 都有紀錄，可以隨時點檔案的
  **History** 回到上一個版本。
