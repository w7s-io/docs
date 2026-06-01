import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { blogArticles } from "../../data/blogArticles";

const latestArticles = blogArticles.slice(0, 3);

export default function LatestBlogPosts() {
  return (
    <section
      id="latest"
      data-testid="latest-blog-posts"
      className="relative border-t border-white/10 bg-[#050505] py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-amber-400">
              // latest articles
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
              Start with the newest deploy guides.
            </h2>
          </div>
          <a
            href="/blog/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-amber-400"
          >
            Open blog
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <a
              key={article.slug}
              href={`/blog/${article.slug}/`}
              className="group flex min-h-[280px] flex-col border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-amber-400/40 hover:bg-amber-400/[0.04]"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  <BookOpen className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.6} />
                  {article.category}
                </div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {article.readingTime}
                </div>
              </div>
              <h3 className="font-display text-3xl leading-none text-white group-hover:text-amber-300">
                {article.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {article.summary}
              </p>
              <div className="mt-auto pt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
                Read article
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
