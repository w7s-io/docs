import { Github, BookOpen, Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-white/10 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-20">
          <div className="md:col-span-5">
            <div className="font-display text-3xl text-white mb-4">W7S</div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Open source deploy platform for GitHub-native apps. Push to{" "}
              <span className="text-amber-400">GitHub</span>. Live in less than
              30 seconds.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-4">
              Product
            </div>
            <ul className="space-y-3 text-sm text-zinc-400 font-mono">
              <li>
                <a
                  href="#how"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-how"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#capabilities"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-capabilities"
                >
                  Capabilities
                </a>
              </li>
              <li>
                <a
                  href="#try"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-try"
                >
                  Try it now
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-pricing"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-4">
              Resources
            </div>
            <ul className="space-y-3 text-sm text-zinc-400 font-mono">
              <li>
                <a
                  href="https://www.w7s.io/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-docs"
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="https://www.w7s.io/docs/deploy-from-github/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-deploy-guide"
                >
                  Deploy guide
                </a>
              </li>
              <li>
                <a
                  href="https://www.w7s.io/docs/recommendations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-recommendations"
                >
                  Recommendations
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-4">
              w7s.cloud
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/w7s-io"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-github"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors font-mono"
              >
                <Github className="h-4 w-4" strokeWidth={1.5} /> github.com/w7s-io
              </a>
              <a
                href="https://w7s.cloud"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-cloud"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors font-mono"
              >
                <Cloud className="h-4 w-4" strokeWidth={1.5} /> w7s.cloud
              </a>
              <a
                href="https://www.w7s.io/docs/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-docs-link"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors font-mono"
              >
                <BookOpen className="h-4 w-4" strokeWidth={1.5} /> docs
              </a>
            </div>
          </div>
        </div>

        {/* Massive logo wordmark */}
        <div
          aria-hidden="true"
          className="font-display select-none text-white/[0.04] leading-none tracking-tighter overflow-hidden whitespace-nowrap"
          style={{ fontSize: "clamp(6rem, 22vw, 22rem)" }}
        >
          W7S.
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-[11px] text-zinc-600 font-mono">
          <div>
            © {new Date().getFullYear()} W7S · Open source under permissive license
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
