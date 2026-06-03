import { Github, BookOpen, Cloud } from "lucide-react";
import W7SCloudLink from "./W7SCloudLink";

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
              Open source deploy platform for GitHub-native apps. Your
              deployment workflow <span className="text-amber-400">is</span> the
              control plane.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-4">
              Product
            </div>
            <ul className="space-y-3 text-sm text-zinc-400 font-mono">
              <li>
                <a
                  href="/#how"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-how"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="/#capabilities"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-capabilities"
                >
                  Capabilities
                </a>
              </li>
              <li>
                <a
                  href="/#batteries"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-batteries"
                >
                  Batteries included
                </a>
              </li>
              <li>
                <a
                  href="/#try"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-try"
                >
                  Try it now
                </a>
              </li>
              <li>
                <a
                  href="/#about"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-about"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://w7s.io/docs/pricing/"
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
                  href="/blog/"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-blog"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/rss.xml"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-rss"
                >
                  RSS feed
                </a>
              </li>
              <li>
                <a
                  href="https://w7s.io/docs/"
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
                  href="https://w7s.io/docs/deploy-from-github/"
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
                  href="https://w7s.io/docs/recommendations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-recommendations"
                >
                  Recommendations
                </a>
              </li>
              <li>
                <a
                  href="https://w7s.io/docs/self-host/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-self-host"
                >
                  Self host
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="footer-status"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <W7SCloudLink className="block text-[10px] uppercase tracking-[0.3em] text-zinc-600 hover:text-amber-400 transition-colors mb-4" />
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
                href="https://w7s.cloud/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-cloud"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors font-mono"
              >
                <Cloud className="h-4 w-4" strokeWidth={1.5} /> w7s.cloud
              </a>
              <a
                href="https://w7s.io/docs/"
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
            © {new Date().getFullYear()} W7S SERVICES LLC · Open source under permissive license
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/terms" className="transition-colors hover:text-amber-400">
              Terms
            </a>
            <a href="/privacy" className="transition-colors hover:text-amber-400">
              Privacy
            </a>
            <a
              href="/status"
              className="flex items-center gap-2 transition-colors hover:text-amber-400"
              data-testid="footer-status-indicator"
            >
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              All systems operational
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
