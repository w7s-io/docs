import { useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Database, FileBox, Server } from "lucide-react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import { blogArticles, featuredBlogArticles, getBlogArticle } from "../data/blogArticles";

const categoryIcon = {
  Storage: Database,
  Alternatives: Server,
  "Self-hosting": FileBox,
};

const articleUrl = (article) => `/blog/${article.slug}/`;

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
  const featured = useMemo(
    () => featuredBlogArticles
      .map((slug) => getBlogArticle(slug))
      .filter(Boolean),
    []
  );
  const remaining = blogArticles.filter(
    (article) => !featuredBlogArticles.includes(article.slug)
  );

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
            <div className="mb-8">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Library</div>
              <h2 className="mt-2 font-display text-4xl leading-none text-white">Cloud alternatives and migration notes</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
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
                    <pre className="mt-6 overflow-x-auto border border-white/10 bg-black p-5 text-xs leading-relaxed text-zinc-300">
                      <code>{section.code}</code>
                    </pre>
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
