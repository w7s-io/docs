import { useState, useEffect } from "react";
import { Github, BookOpen, ArrowUpRight } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          data-testid="logo-link"
          className="flex items-center gap-2 group"
        >
          <span className="font-display text-2xl tracking-tighter text-white group-hover:text-amber-400 transition-colors">
            W7S
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em] text-zinc-500 border border-white/10 px-2 py-1">
            v1 · open source
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-zinc-400">
          <a
            href="#how"
            data-testid="nav-how"
            className="hover:text-amber-400 transition-colors"
          >
            How it works
          </a>
          <a
            href="#capabilities"
            data-testid="nav-capabilities"
            className="hover:text-amber-400 transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#compare"
            data-testid="nav-compare"
            className="hover:text-amber-400 transition-colors"
          >
            Why W7S
          </a>
          <a
            href="#faq"
            data-testid="nav-faq"
            className="hover:text-amber-400 transition-colors"
          >
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://www.w7s.io/docs/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="docs-link"
            className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
            Docs
          </a>
          <a
            href="https://github.com/w7s-io"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="github-link"
            className="inline-flex items-center gap-2 bg-amber-400 text-black px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-colors"
          >
            <Github className="h-3.5 w-3.5" strokeWidth={2} />
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>
      </div>
    </header>
  );
}
