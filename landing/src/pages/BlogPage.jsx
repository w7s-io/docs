import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Database, FileBox, Search, Server, X } from "lucide-react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import { blogArticles, featuredBlogArticles, getBlogArticle } from "../data/blogArticles";

const categoryIcon = {
  Storage: Database,
  Alternatives: Server,
  "Self-hosting": FileBox,
};

const articleUrl = (article) => `/blog/${article.slug}/`;

const tokenizeSearch = (value) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 2);

const searchTextFor = (article) =>
  [
    article.title,
    article.summary,
    article.category,
    article.slug,
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      section.code || "",
      ...(section.sources ?? []).flatMap((source) => [source.label, source.url]),
    ]),
  ]
    .join(" ")
    .toLowerCase();

const scoreArticle = (article, terms) => {
  if (terms.length === 0) return 1;

  const title = article.title.toLowerCase();
  const summary = article.summary.toLowerCase();
  const category = article.category.toLowerCase();
  const body = searchTextFor(article);

  let score = 0;
  for (const term of terms) {
    if (!body.includes(term)) return 0;
    if (title.includes(term)) score += 40;
    if (category.includes(term)) score += 20;
    if (summary.includes(term)) score += 12;
    score += 2;
  }

  return score;
};

const javascriptKeywords = new Set([
  "async",
  "await",
  "const",
  "default",
  "export",
  "function",
  "if",
  "new",
  "return",
]);

const isWordStart = (char) => /[A-Za-z_$]/.test(char);
const isWordPart = (char) => /[\w$]/.test(char);
const isDigit = (char) => /\d/.test(char);

const token = (className, text, key) => (
  <span key={key} className={className}>
    {text}
  </span>
);

function readQuoted(line, index, quote) {
  let cursor = index + 1;
  while (cursor < line.length) {
    if (line[cursor] === "\\") {
      cursor += 2;
      continue;
    }
    if (line[cursor] === quote) {
      cursor += 1;
      break;
    }
    cursor += 1;
  }

  return [line.slice(index, cursor), cursor];
}

function tokenizeJson(line) {
  const tokens = [];
  let index = 0;

  while (index < line.length) {
    const char = line[index];

    if (char === "\"") {
      const [value, next] = readQuoted(line, index, "\"");
      const rest = line.slice(next).trimStart();
      tokens.push(token(rest.startsWith(":") ? "text-sky-300" : "text-emerald-300", value, index));
      index = next;
      continue;
    }

    if (isDigit(char) || (char === "-" && isDigit(line[index + 1]))) {
      const match = line.slice(index).match(/^-?\d+(?:\.\d+)?/);
      tokens.push(token("text-amber-300", match[0], index));
      index += match[0].length;
      continue;
    }

    const word = line.slice(index).match(/^(true|false|null)\b/);
    if (word) {
      tokens.push(token("text-violet-300", word[0], index));
      index += word[0].length;
      continue;
    }

    if (/[\[\]{}:,]/.test(char)) {
      tokens.push(token("text-zinc-500", char, index));
      index += 1;
      continue;
    }

    tokens.push(char);
    index += 1;
  }

  return tokens;
}

function tokenizeJavaScript(line) {
  const tokens = [];
  let index = 0;

  while (index < line.length) {
    const char = line[index];

    if (line.startsWith("//", index)) {
      tokens.push(token("text-zinc-600", line.slice(index), index));
      break;
    }

    if (char === "\"" || char === "'" || char === "`") {
      const [value, next] = readQuoted(line, index, char);
      tokens.push(token("text-emerald-300", value, index));
      index = next;
      continue;
    }

    if (isDigit(char)) {
      const match = line.slice(index).match(/^\d+(?:\.\d+)?/);
      tokens.push(token("text-amber-300", match[0], index));
      index += match[0].length;
      continue;
    }

    if (isWordStart(char)) {
      let next = index + 1;
      while (next < line.length && isWordPart(line[next])) next += 1;
      const word = line.slice(index, next);
      const following = line.slice(next).trimStart();

      if (javascriptKeywords.has(word)) {
        tokens.push(token("text-fuchsia-300", word, index));
      } else if (/^(true|false|null|undefined)$/.test(word)) {
        tokens.push(token("text-violet-300", word, index));
      } else if (following.startsWith("(")) {
        tokens.push(token("text-sky-300", word, index));
      } else {
        tokens.push(word);
      }

      index = next;
      continue;
    }

    if (/[{}()[\].,;:?]/.test(char)) {
      tokens.push(token("text-zinc-500", char, index));
      index += 1;
      continue;
    }

    if (/[=+\-*/!<>|&]/.test(char)) {
      tokens.push(token("text-amber-300", char, index));
      index += 1;
      continue;
    }

    tokens.push(char);
    index += 1;
  }

  return tokens.length > 0 ? tokens : "\u00A0";
}

function CodeBlock({ code }) {
  const language = code.trimStart().startsWith("{") ? "json" : "javascript";
  const tokenize = language === "json" ? tokenizeJson : tokenizeJavaScript;
  const label = language === "json" ? "JSON" : "JavaScript";

  return (
    <div className="mt-6 overflow-hidden border border-white/10 bg-black">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0a0c] px-4 py-2.5">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-zinc-300 sm:text-[13px]">
        <code>
          {code.split("\n").map((line, index) => (
            <span key={index} className="block min-w-max">
              <span className="inline-block w-8 select-none pr-4 text-right text-zinc-700">
                {index + 1}
              </span>
              <span className="whitespace-pre">{tokenize(line)}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function BlogHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050505] pt-32 pb-14">
      <div className="absolute inset-0 grid-bg opacity-70" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute right-[-6vw] top-10 font-display text-[22vw] leading-none text-white/[0.025] select-none"
      >
        BLOG
      </div>
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.6} />
            W7S Blog
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.92] text-white">
            Notes for building outside the usual cloud path.
          </h1>
          <p className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-400">
            Practical migration notes, storage patterns, and platform comparisons for teams that want GitHub-native deploys, explicit infrastructure, and a self-hostable path.
          </p>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article, featured = false }) {
  const Icon = categoryIcon[article.category] || BookOpen;
  return (
    <a
      href={articleUrl(article)}
      className={`group block border border-white/10 bg-white/[0.025] transition-colors hover:border-amber-400/40 hover:bg-amber-400/[0.04] ${
        featured ? "p-6 sm:p-7" : "p-5"
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-zinc-500">
          <Icon className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.6} />
          {article.category}
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          {article.readingTime}
        </div>
      </div>
      <h2 className={`font-display leading-none text-white group-hover:text-amber-300 ${featured ? "text-3xl" : "text-2xl"}`}>
        {article.title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{article.summary}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
        Read article
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
      </div>
    </a>
  );
}

function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const featured = useMemo(
    () => featuredBlogArticles
      .map((slug) => getBlogArticle(slug))
      .filter(Boolean),
    []
  );
  const remaining = blogArticles.filter(
    (article) => !featuredBlogArticles.includes(article.slug)
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(blogArticles.map((article) => article.category))).sort()],
    []
  );
  const filteredArticles = useMemo(() => {
    const terms = tokenizeSearch(searchQuery);

    return blogArticles
      .map((article, index) => ({
        article,
        index,
        score: scoreArticle(article, terms),
      }))
      .filter(({ article, score }) => (
        score > 0 &&
        (selectedCategory === "All" || article.category === selectedCategory)
      ))
      .sort((a, b) => (
        terms.length > 0
          ? b.score - a.score || a.index - b.index
          : a.index - b.index
      ))
      .map(({ article }) => article);
  }, [searchQuery, selectedCategory]);
  const isFiltering = searchQuery.trim().length > 0 || selectedCategory !== "All";
  const libraryArticles = isFiltering ? filteredArticles : remaining;
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  useEffect(() => {
    document.title = "W7S Blog - GitHub-native cloud alternatives";
  }, []);

  return (
    <div className="relative z-10" data-testid="blog-page">
      <Header />
      <main>
        <BlogHero />
        <section className="bg-[#050505] py-16 sm:py-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Start here</div>
                <h2 className="mt-2 font-display text-4xl leading-none text-white">Featured articles</h2>
              </div>
              <a href="/docs/" className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 hover:text-amber-400">
                Open docs
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {featured.map((article) => (
                <ArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#08080a] py-16 sm:py-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Library</div>
                <h2 className="mt-2 font-display text-4xl leading-none text-white">Cloud alternatives and migration notes</h2>
              </div>
              <div className="w-full xl:max-w-xl">
                <label className="group flex min-h-12 items-center gap-3 border border-white/10 bg-black/30 px-4 text-zinc-400 focus-within:border-amber-400/50 focus-within:text-amber-300">
                  <Search className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  <span className="sr-only">Search blog articles</span>
                  <input
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search blog articles"
                  />
                  {isFiltering && (
                    <button
                      type="button"
                      aria-label="Clear blog search"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-zinc-500 hover:text-amber-300"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  )}
                </label>
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter blog articles by category">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selectedCategory === category}
                    className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] transition-colors ${
                      selectedCategory === category
                        ? "border-amber-400 bg-amber-400 text-black"
                        : "border-white/10 bg-white/[0.025] text-zinc-500 hover:border-amber-400/40 hover:text-amber-300"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-600">
                {libraryArticles.length} {libraryArticles.length === 1 ? "article" : "articles"}
              </div>
            </div>

            {libraryArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {libraryArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="border border-white/10 bg-black/30 px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/10 text-zinc-500">
                  <Search className="h-5 w-5" strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 font-display text-3xl leading-none text-white">No articles found</h3>
                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 bg-amber-400 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-amber-300"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ArticlePage({ article }) {
  useEffect(() => {
    document.title = `${article.title} - W7S Blog`;
  }, [article.title]);

  const related = blogArticles
    .filter((candidate) => candidate.slug !== article.slug && candidate.category === article.category)
    .slice(0, 3);

  return (
    <div className="relative z-10" data-testid="blog-article-page">
      <Header />
      <main>
        <article className="relative overflow-hidden bg-[#050505] pt-28">
          <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
          <div className="relative max-w-[1040px] mx-auto px-6 lg:px-10 pb-16">
            <a href="/blog/" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 hover:text-amber-400">
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
              Blog
            </a>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              <span className="border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-amber-300">{article.category}</span>
              <span>{article.readingTime}</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.92] text-white">
              {article.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-400">{article.summary}</p>
          </div>
        </article>

        <section className="border-t border-white/10 bg-[#050505] py-14 sm:py-16">
          <div className="max-w-[1040px] mx-auto px-6 lg:px-10">
            <div className="max-w-3xl space-y-12">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-3xl leading-none text-white">{section.heading}</h2>
                  <div className="mt-5 space-y-5 text-sm leading-8 text-zinc-300">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.code && (
                    <CodeBlock code={section.code} />
                  )}
                  {section.sources?.length > 0 && (
                    <div className="mt-6 border border-white/10 bg-white/[0.025] p-4">
                      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-600">Sources</div>
                      <div className="flex flex-wrap gap-2">
                        {section.sources.map((source) => (
                          <a
                            key={source.url}
                            className="border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 hover:border-amber-400/40 hover:text-amber-300"
                            href={source.url}
                            rel="noreferrer"
                            target={source.url.startsWith("/") ? undefined : "_blank"}
                          >
                            {source.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {related.length > 0 && (
              <aside className="mt-16 border-t border-white/10 pt-10">
                <div className="mb-5 text-[10px] uppercase tracking-[0.3em] text-zinc-600">Related</div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {related.map((candidate) => (
                    <ArticleCard key={candidate.slug} article={candidate} />
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function MissingArticle() {
  useEffect(() => {
    document.title = "Article not found - W7S Blog";
  }, []);

  return (
    <div className="relative z-10">
      <Header />
      <main className="min-h-[70vh] bg-[#050505] pt-32 pb-20">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Missing article</div>
          <h1 className="mt-4 font-display text-5xl leading-none text-white">That blog post is not available.</h1>
          <a href="/blog/" className="mt-8 inline-flex items-center gap-2 bg-amber-400 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-amber-300">
            Back to blog
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BlogPage({ slug }) {
  if (!slug) return <BlogIndex />;
  const article = getBlogArticle(slug);
  return article ? <ArticlePage article={article} /> : <MissingArticle />;
}
