/**
 * Notion → Website blog sync
 * -----------------------------------------------------------------
 * Reads every page in your Notion "Blog Posts" database whose
 * Status = "Published", converts it into a static HTML article
 * page using the site's existing look, and rewrites blog.html's
 * post list. Run by the GitHub Action in
 * .github/workflows/sync-notion.yml — you don't need to run this
 * by hand, but you can with: node notion-sync/build.js
 *
 * Required environment variables (set as GitHub repo secrets):
 *   NOTION_TOKEN         - your Notion integration secret
 *   NOTION_DATABASE_ID   - the Blog Posts database ID
 *
 * Expected Notion database properties (see NOTION_SETUP.md):
 *   Title    (title)
 *   Slug     (rich text)   e.g. "why-yin-yoga-helps"
 *   Summary  (rich text)   1-2 sentence excerpt for the card
 *   Date     (date)
 *   Status   (select)      "Draft" | "Published"
 * The article BODY is just the normal Notion page content
 * (paragraphs, headings, lists, images, quotes).
 */

const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("Missing NOTION_TOKEN or NOTION_DATABASE_ID environment variables.");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const SITE_ROOT = path.join(__dirname, "..");
const BLOG_HTML_PATH = path.join(SITE_ROOT, "blog.html");

const START_MARKER = "<!-- NOTION-SYNC:START -->";
const END_MARKER = "<!-- NOTION-SYNC:END -->";

// ---------- helpers -----------------------------------------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getPlainText(richTextArray) {
  if (!richTextArray) return "";
  return richTextArray.map((t) => t.plain_text).join("");
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Convert a flat list of Notion blocks into article HTML.
// Supports the block types most people need for a blog post.
function blocksToHtml(blocks) {
  let html = "";
  let listBuffer = null; // { type: 'ul'|'ol', items: [] }

  function flushList() {
    if (!listBuffer) return;
    const tag = listBuffer.type;
    html += `<${tag}>\n` + listBuffer.items.map((i) => `  <li>${i}</li>`).join("\n") + `\n</${tag}>\n`;
    listBuffer = null;
  }

  for (const block of blocks) {
    const type = block.type;
    const rich = block[type] && block[type].rich_text ? getPlainText(block[type].rich_text) : "";

    if (type === "bulleted_list_item") {
      if (!listBuffer || listBuffer.type !== "ul") { flushList(); listBuffer = { type: "ul", items: [] }; }
      listBuffer.items.push(escapeHtml(rich));
      continue;
    }
    if (type === "numbered_list_item") {
      if (!listBuffer || listBuffer.type !== "ol") { flushList(); listBuffer = { type: "ol", items: [] }; }
      listBuffer.items.push(escapeHtml(rich));
      continue;
    }
    flushList();

    switch (type) {
      case "paragraph":
        if (rich.trim()) html += `<p>${escapeHtml(rich)}</p>\n`;
        break;
      case "heading_1":
        html += `<h2>${escapeHtml(rich)}</h2>\n`;
        break;
      case "heading_2":
        html += `<h2>${escapeHtml(rich)}</h2>\n`;
        break;
      case "heading_3":
        html += `<h3>${escapeHtml(rich)}</h3>\n`;
        break;
      case "quote":
        html += `<blockquote style="border-left:2px solid var(--timber);padding-left:20px;color:var(--ink-soft);font-style:italic;">${escapeHtml(rich)}</blockquote>\n`;
        break;
      case "divider":
        html += `<hr style="border:0;border-top:1px solid var(--line);margin:2em 0;">\n`;
        break;
      case "image": {
        const src = block.image.type === "external" ? block.image.external.url : block.image.file.url;
        const caption = getPlainText(block.image.caption);
        html += `<figure style="margin:1.6em 0;"><img src="${src}" alt="${escapeHtml(caption)}" style="width:100%;border-radius:4px;">`;
        if (caption) html += `<figcaption style="font-size:13px;color:var(--ink-soft);margin-top:8px;">${escapeHtml(caption)}</figcaption>`;
        html += `</figure>\n`;
        break;
      }
      default:
        // unsupported block types are skipped silently
        break;
    }
  }
  flushList();
  return html;
}

async function getAllBlocks(blockId) {
  let blocks = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor });
    blocks = blocks.concat(res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

function articleTemplate({ title, date, summary, bodyHtml }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} — Notjustyoga Studio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&family=Noto+Serif+TC:wght@500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="site-header">
  <div class="header-row">
    <a href="index.html" class="logo">Notjustyoga <span class="zh">工作室</span></a>
    <nav class="nav">
      <a href="index.html">Home <span class="lang-zh">首頁</span></a>
      <a href="index.html#about">About <span class="lang-zh">關於我們</span></a>
      <a href="courses.html">Courses <span class="lang-zh">瑜伽課程</span></a>
      <a href="services.html">Physiotherapy <span class="lang-zh">物理治療</span></a>
      <a href="blog.html" class="active">Blog <span class="lang-zh">部落格</span></a>
      <a href="contact.html">Contact <span class="lang-zh">聯絡我們</span></a>
    </nav>
    <div class="header-actions">
      <button class="lang-toggle">中文</button>
      <a href="contact.html" class="btn btn-primary">Book now <span class="lang-zh">立即預約</span></a>
      <button class="nav-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<section style="padding:80px 0 0;">
  <div class="container article-head">
    <span class="eyebrow">${escapeHtml(date)}</span>
    <h1 style="font-size:clamp(32px,4.6vw,50px);">${escapeHtml(title)}</h1>
    <p class="hero-sub" style="margin:20px auto 0;">${escapeHtml(summary)}</p>
  </div>
</section>

<section>
  <div class="container">
    <div class="article-body">
${bodyHtml}
    </div>
  </div>
</section>

<section class="section-alt">
  <div class="container text-center">
    <a href="blog.html" class="btn btn-outline">&larr; Back to blog <span class="lang-zh">回到部落格</span></a>
  </div>
</section>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <div class="footer-logo">Notjustyoga</div>
        <p><span class="lang-en">A London studio for mindful movement and clinical recovery.</span>
        <span class="lang-zh">一間結合正念練習與臨床復原的倫敦工作室。</span></p>
      </div>
      <div class="footer-col">
        <h5>Studio <span class="lang-zh">導覽</span></h5>
        <a href="index.html#about">About</a>
        <a href="courses.html">Courses</a>
        <a href="services.html">Physiotherapy</a>
        <a href="blog.html">Blog</a>
      </div>
      <div class="footer-col">
        <h5>Contact <span class="lang-zh">聯絡</span></h5>
        <p><span class="lang-en">Address &amp; phone coming soon</span><span class="lang-zh">地址與電話即將公開</span></p>
        <a href="contact.html">Enquiry form <span class="lang-zh">預約表單</span></a>
      </div>
      <div class="footer-col">
        <h5>Follow <span class="lang-zh">追蹤我們</span></h5>
        <a href="#" target="_blank" rel="noopener">Instagram</a>
        <a href="#" target="_blank" rel="noopener">Facebook</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Notjustyoga Studio. All rights reserved.</span>
      <span>London, UK</span>
    </div>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
`;
}

function blogCardHtml({ slug, title, date, summary }) {
  return `      <article class="blog-card">
        <div class="blog-thumb">
          <svg viewBox="0 0 24 24" fill="none" stroke="#5b3d28" stroke-width="1.2"><path d="M12 3v6M12 21c-4-1.5-6-5-6-9a6 6 0 0112 0c0 4-2 7.5-6 9z"/></svg>
        </div>
        <div class="blog-body">
          <span class="blog-date">${escapeHtml(date)}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(summary)}</p>
          <a href="blog-${slug}.html" class="blog-read">Read more <span class="lang-zh">閱讀更多</span></a>
        </div>
      </article>`;
}

// ---------- main -----------------------------------------------

async function main() {
  console.log("Querying Notion database...");
  const res = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: "Status", select: { equals: "Published" } },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  if (res.results.length === 0) {
    console.log("No published posts found — leaving blog.html untouched.");
    return;
  }

  const cards = [];

  for (const page of res.results) {
    const props = page.properties;
    const title = getPlainText(props.Title?.title) || "Untitled";
    const summary = getPlainText(props.Summary?.rich_text) || "";
    const dateIso = props.Date?.date?.start;
    const date = formatDate(dateIso) || formatDate(page.created_time);
    const rawSlug = getPlainText(props.Slug?.rich_text);
    const slug = slugify(rawSlug || title);

    console.log(`Building post: ${title} (${slug})`);

    const blocks = await getAllBlocks(page.id);
    const bodyHtml = blocksToHtml(blocks);

    const articleHtml = articleTemplate({ title, date, summary, bodyHtml });
    fs.writeFileSync(path.join(SITE_ROOT, `blog-${slug}.html`), articleHtml, "utf8");

    cards.push(blogCardHtml({ slug, title, date, summary }));
  }

  // rewrite the post list inside blog.html, between the sync markers
  let blogHtml = fs.readFileSync(BLOG_HTML_PATH, "utf8");
  const startIdx = blogHtml.indexOf(START_MARKER);
  const endIdx = blogHtml.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Could not find ${START_MARKER} / ${END_MARKER} markers in blog.html`);
    process.exit(1);
  }

  const before = blogHtml.slice(0, startIdx + START_MARKER.length);
  const after = blogHtml.slice(endIdx);
  blogHtml = `${before}\n${cards.join("\n\n")}\n      ${after}`;

  fs.writeFileSync(BLOG_HTML_PATH, blogHtml, "utf8");
  console.log(`Done. Synced ${cards.length} post(s).`);
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
