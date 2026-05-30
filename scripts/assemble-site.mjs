import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const rootDir = path.resolve('.');
const buildDir = path.join(rootDir, 'build');
const landingBuildDir = path.join(rootDir, 'landing', 'build');
const cnamePath = path.join(rootDir, 'static', 'CNAME');
const blogDataPath = path.join(rootDir, 'landing', 'src', 'data', 'blogArticles.js');
const docsTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'w7s-docs-'));
const canonicalOrigin = 'https://w7s.io';
const defaultTitle = 'W7S - GitHub-native app deployment';
const defaultDescription =
  'Open source deploy platform for GitHub-native apps. Ship frontend apps and JavaScript/TypeScript backends from GitHub Actions to W7S Cloud, with no dashboard, card, or cloud setup required.';
const blogDescription =
  'Practical migration notes, storage patterns, and platform comparisons for teams that want GitHub-native deploys, explicit infrastructure, and a self-hostable path.';
const feedPublishedAt = new Date('2026-05-30T00:00:00Z').toUTCString();

const assertDir = (dir, message) => {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error(message);
  }
};

const xmlEscape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const htmlTextEscape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const htmlAttrEscape = (value) =>
  htmlTextEscape(value)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const siteUrl = (pathname) => `${canonicalOrigin}${pathname}`;

const replaceOrInsertHeadTag = (html, pattern, replacement) => {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace(/<\/head>/i, `        ${replacement}\n    </head>`);
};

const patchHtmlMetadata = (html, metadata) => {
  const title = metadata.title || defaultTitle;
  const description = metadata.description || defaultDescription;
  const url = metadata.url || siteUrl('/');
  const type = metadata.type || 'website';

  let next = html;
  next = replaceOrInsertHeadTag(next, /<title>[\s\S]*?<\/title>/i, `<title>${htmlTextEscape(title)}</title>`);
  next = replaceOrInsertHeadTag(
    next,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${htmlAttrEscape(url)}" />`
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${htmlAttrEscape(description)}" />`
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${htmlAttrEscape(title)}" />`
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${htmlAttrEscape(description)}" />`
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${htmlAttrEscape(type)}" />`
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${htmlAttrEscape(url)}" />`
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${htmlAttrEscape(title)}" />`
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${htmlAttrEscape(description)}" />`
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:url" content="${htmlAttrEscape(url)}" />`
  );

  return next;
};

const writeSpaRoute = (route, metadata) => {
  const routeDir = path.join(buildDir, route);
  fs.mkdirSync(routeDir, {recursive: true});
  const html = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(routeDir, 'index.html'), patchHtmlMetadata(html, metadata));
};

const readBlogArticles = () => {
  if (!fs.existsSync(blogDataPath)) return [];
  const source = fs.readFileSync(blogDataPath, 'utf8');
  const readValues = (field) =>
    [...source.matchAll(new RegExp(`${field}:\\s*(?:\\n\\s*)?"([^"]+)"`, 'g'))].map((match) => match[1]);
  const slugs = readValues('slug');
  const titles = readValues('title');
  const summaries = readValues('summary');

  return slugs.map((slug, index) => ({
    slug,
    title: titles[index] || slug,
    summary: summaries[index] || blogDescription,
  }));
};

const readDocsSitemapUrls = () => {
  const docsSitemapPath = path.join(buildDir, 'docs', 'sitemap.xml');
  if (!fs.existsSync(docsSitemapPath)) return [];
  const source = fs.readFileSync(docsSitemapPath, 'utf8');
  return [...source.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
};

const uniqueByLocation = (entries) => {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });
};

const writeRobotsTxt = () => {
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl('/sitemap.xml')}`,
    `Sitemap: ${siteUrl('/docs/sitemap.xml')}`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(buildDir, 'robots.txt'), robots);
};

const writeSitemapXml = (articles) => {
  const now = new Date().toISOString().slice(0, 10);
  const entries = uniqueByLocation([
    {loc: siteUrl('/'), changefreq: 'weekly', priority: '1.0'},
    {loc: siteUrl('/blog/'), changefreq: 'weekly', priority: '0.8'},
    ...articles.map((article) => ({
      loc: siteUrl(`/blog/${article.slug}/`),
      changefreq: 'monthly',
      priority: '0.7',
    })),
    {loc: siteUrl('/status'), changefreq: 'hourly', priority: '0.4'},
    {loc: siteUrl('/terms'), changefreq: 'yearly', priority: '0.2'},
    {loc: siteUrl('/privacy'), changefreq: 'yearly', priority: '0.2'},
    ...readDocsSitemapUrls().map((loc) => ({
      loc,
      changefreq: 'weekly',
      priority: loc === siteUrl('/docs/') ? '0.8' : '0.6',
    })),
  ]);

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  fs.writeFileSync(
    path.join(buildDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  );
};

const writeRssFeed = (articles) => {
  const items = articles
    .map((article) => {
      const link = siteUrl(`/blog/${article.slug}/`);
      return `    <item>
      <title>${xmlEscape(article.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid isPermaLink="true">${xmlEscape(link)}</guid>
      <description>${xmlEscape(article.summary)}</description>
      <pubDate>${feedPublishedAt}</pubDate>
    </item>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>W7S Blog</title>
    <link>${xmlEscape(siteUrl('/blog/'))}</link>
    <description>${xmlEscape(blogDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${xmlEscape(siteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  fs.writeFileSync(path.join(buildDir, 'rss.xml'), feed);
  fs.writeFileSync(path.join(buildDir, 'feed.xml'), feed);
  fs.mkdirSync(path.join(buildDir, 'blog'), {recursive: true});
  fs.writeFileSync(path.join(buildDir, 'blog', 'rss.xml'), feed);
};

assertDir(buildDir, 'Missing Docusaurus build directory. Run npm run build:docs first.');
assertDir(landingBuildDir, 'Missing landing build directory. Run npm run build:landing first.');

try {
  for (const entry of fs.readdirSync(buildDir, {withFileTypes: true})) {
    if (entry.name === 'docs') continue;

    fs.cpSync(path.join(buildDir, entry.name), path.join(docsTempDir, entry.name), {
      recursive: true,
    });
  }

  fs.rmSync(buildDir, {recursive: true, force: true});
  fs.mkdirSync(buildDir, {recursive: true});
  fs.cpSync(landingBuildDir, buildDir, {recursive: true});
  fs.cpSync(docsTempDir, path.join(buildDir, 'docs'), {recursive: true});

  const articles = readBlogArticles();
  writeSpaRoute('status', {
    title: 'W7S Status',
    description: 'Current availability and component status for W7S hosted services.',
    url: siteUrl('/status'),
  });
  writeSpaRoute('terms', {
    title: 'W7S Terms of Service',
    description: 'Terms for using W7S websites, documentation, hosted deployment services, APIs, and GitHub Actions integrations.',
    url: siteUrl('/terms'),
  });
  writeSpaRoute('privacy', {
    title: 'W7S Privacy Policy',
    description: 'How W7S collects and uses information for w7s.io, documentation, hosted deployment services, APIs, and GitHub Actions integrations.',
    url: siteUrl('/privacy'),
  });
  writeSpaRoute('blog', {
    title: 'W7S Blog - GitHub-native cloud alternatives',
    description: blogDescription,
    url: siteUrl('/blog/'),
  });
  for (const article of articles) {
    writeSpaRoute(path.join('blog', article.slug), {
      title: `${article.title} - W7S Blog`,
      description: article.summary,
      url: siteUrl(`/blog/${article.slug}/`),
      type: 'article',
    });
  }

  if (fs.existsSync(cnamePath)) {
    fs.copyFileSync(cnamePath, path.join(buildDir, 'CNAME'));
  }

  writeRobotsTxt();
  writeSitemapXml(articles);
  writeRssFeed(articles);

  console.log('Assembled landing frontend at / and Docusaurus docs at /docs/.');
} finally {
  fs.rmSync(docsTempDir, {recursive: true, force: true});
}
