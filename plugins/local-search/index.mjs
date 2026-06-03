import fs from "node:fs/promises";
import path from "node:path";

const DOC_EXTENSIONS = new Set([".md", ".mdx"]);

const listDocs = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listDocs(absolutePath);
      if (!DOC_EXTENSIONS.has(path.extname(entry.name))) return [];
      return [absolutePath];
    })
  );
  return files.flat().sort();
};

const parseFrontMatter = (source) => {
  if (!source.startsWith("---\n")) return { frontMatter: {}, body: source };
  const end = source.indexOf("\n---", 4);
  if (end < 0) return { frontMatter: {}, body: source };

  const raw = source.slice(4, end).trim();
  const frontMatter = {};
  for (const line of raw.split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key) frontMatter[key] = value;
  }

  return {
    frontMatter,
    body: source.slice(end + 4).trim()
  };
};

const routePathFor = (frontMatter, file, routeBasePath = "") => {
  const slug = String(frontMatter.slug || "").trim();
  const prefix = routeBasePath ? `/${routeBasePath.replace(/^\/|\/$/g, "")}` : "";
  if (slug) return slug.startsWith("/") ? slug : `${prefix}/${slug}/`;
  const id = String(frontMatter.id || path.basename(file, path.extname(file))).trim();
  return `${prefix}/${id}/`;
};

const titleFor = (frontMatter, body, file) => {
  const explicitTitle = String(frontMatter.title || "").trim();
  if (explicitTitle) return explicitTitle;
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;
  return path.basename(file, path.extname(file)).replace(/[-_]+/g, " ");
};

const collectHeadings = (body) =>
  [...body.matchAll(/^#{2,3}\s+(.+)$/gm)]
    .map((match) => match[1].replace(/[#`*_]+/g, "").trim())
    .filter(Boolean)
    .slice(0, 8);

const plainText = (body) =>
  body
    .replace(/^import\s+.+$/gm, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>\n]+>/g, (match) =>
      match.includes(" ") || match.startsWith("</") ? " " : match.slice(1, -1)
    )
    .replace(/[#>*_|{}[\]()]|---/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildDocuments = async (directory, routeBasePath = "", type = "docs") => {
  const files = await listDocs(directory);
  return Promise.all(
    files.map(async (file) => {
      const source = await fs.readFile(file, "utf8");
      const { frontMatter, body } = parseFrontMatter(source);
      return {
        type,
        title: titleFor(frontMatter, body, file),
        description: String(frontMatter.description || "").trim(),
        path: routePathFor(frontMatter, file, routeBasePath),
        headings: collectHeadings(body),
        content: plainText(body).slice(0, 8000)
      };
    })
  );
};

const buildSearchIndex = async (siteDir) => {
  const docs = await buildDocuments(path.join(siteDir, "docs"), "", "docs");
  const blog = await buildDocuments(path.join(siteDir, "blog"), "blog", "blog");
  return [...docs, ...blog];
};

export default function localSearchPlugin(context) {
  return {
    name: "w7s-local-search",
    async loadContent() {
      return buildSearchIndex(context.siteDir);
    },
    contentLoaded({ content, actions }) {
      actions.setGlobalData({
        documents: content
      });
    }
  };
}
