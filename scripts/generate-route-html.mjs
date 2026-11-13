import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const site = JSON.parse(readFileSync(resolve(root, "src/data/site-meta.json"), "utf8"));
const baseHtml = readFileSync(resolve(dist, "index.html"), "utf8");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
}

function setMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
}

function setCanonical(html, href) {
  const pattern = /<link rel="canonical" href="[^"]*"\s*\/?>/;
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
}

function withMeta(html, entry, path) {
  const url = `${site.siteUrl}${path}`;
  const image = `${site.siteUrl}${entry.ogImage}`;

  let output = setTitle(html, entry.title);
  output = setMeta(output, "name", "description", entry.description);
  output = setCanonical(output, url);
  output = setMeta(output, "property", "og:title", entry.title);
  output = setMeta(output, "property", "og:description", entry.description);
  output = setMeta(output, "property", "og:url", url);
  output = setMeta(output, "property", "og:image", image);
  output = setMeta(output, "property", "og:image:secure_url", image);
  output = setMeta(output, "property", "og:image:alt", entry.title);
  output = setMeta(output, "name", "twitter:title", entry.title);
  output = setMeta(output, "name", "twitter:description", entry.description);
  output = setMeta(output, "name", "twitter:image", image);
  output = setMeta(output, "name", "twitter:image:alt", entry.title);

  return output;
}

function withJsonLd(html, data) {
  const script = `    <script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>\n  </head>`;
  return html.replace("</head>", script);
}

function writePage(path, html) {
  const directory = path === "/" ? dist : resolve(dist, path.replace(/^\/+|\/+$/g, ""));
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, "index.html"), html);
}

writePage("/", withMeta(baseHtml, site.default, "/"));
writePage("/collection", withMeta(baseHtml, site.default, "/"));

const sitemapUrls = [
  { loc: `${site.siteUrl}/`, priority: "1.0" },
  ...Object.keys(site.categories).map((id) => ({
    loc: `${site.siteUrl}/collection/${id}/`,
    priority: "0.8",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(resolve(dist, "sitemap.xml"), sitemap);
writeFileSync(
  resolve(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`,
);

for (const [id, entry] of Object.entries(site.categories)) {
  const path = `/collection/${id}/`;
  const url = `${site.siteUrl}${path}`;

  let html = withMeta(baseHtml, entry, path);
  html = withJsonLd(html, {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": `${site.siteUrl}/` },
          { "@type": "ListItem", "position": 2, "name": entry.name, "item": url },
        ],
      },
      {
        "@type": "CollectionPage",
        "name": entry.title,
        "description": entry.description,
        "url": url,
        "isPartOf": { "@type": "WebSite", "name": site.siteName, "url": `${site.siteUrl}/` },
      },
    ],
  });

  writePage(path, html);
}

console.log(`Generated static HTML for the home page and ${Object.keys(site.categories).length} collection routes.`);
