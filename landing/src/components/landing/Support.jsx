import { ArrowUpRight, MessageCircle } from "lucide-react";

const DISCORD_URL = "https://discord.gg/qJefeyEGZx";

export default function Support() {
  return (
    <section
      id="support"
      data-testid="support-section"
      className="relative py-20 lg:py-28 border-t border-white/10 bg-[#050505]"
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border border-white/10 bg-[#0a0a0c] p-6 sm:p-8 lg:p-10 hover-lift">
          <div className="lg:col-span-8">
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
              // support
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white leading-[0.95] mb-5">
              Get live help
              <br />
              from the W7S Discord.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Ask deployment questions, debug GitHub Actions runs, compare
              project layouts, or get feedback before moving an app to W7S.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="support-discord-link"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-amber-400 text-black px-6 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
              Join Discord
              <ArrowUpRight
                className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                strokeWidth={2.5}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
