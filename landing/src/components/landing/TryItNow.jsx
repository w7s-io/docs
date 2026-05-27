import { useState } from "react";
import { Copy, Check, ArrowUpRight, Github } from "lucide-react";
import { toast } from "sonner";
import W7SCloudLink from "./W7SCloudLink";

const COMMANDS = [
  "gh repo fork guerrerocarlos/nodepad --clone",
  "cd nodepad",
  "git push origin main",
];

const OUTPUT = [
  "› Run actions/checkout@v5",
  "› Run w7s-io/w7s-cloud@v1",
  "› Verifying GitHub token... ok",
  "› Uploading deploy archive to W7S Cloud (12.4 kB)...",
  "› Provisioning edge runtime...",
  "› ✓ Deployed in 28.4s",
  "",
  "  https://<your-github>.w7s.cloud/nodepad",
];

export default function TryItNow() {
  const [copied, setCopied] = useState(false);

  const full = COMMANDS.join("\n");

  const copy = async () => {
    await navigator.clipboard.writeText(full);
    setCopied(true);
    toast.success("Copied 3 commands");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="try"
      data-testid="try-it-now"
      className="relative py-24 lg:py-32 border-t border-white/10 bg-[#070708]"
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
            // try it now
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
            Three lines,
            <br />
            and it's deployed.
          </h2>
          <p className="mt-6 text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Clone the nodepad reference app and watch it go live. No account,
            no card, no cloud setup.
          </p>
        </div>

        <div className="bg-black border border-white/10 overflow-hidden tracing-border">
          {/* Terminal chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0a0a0c]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="ml-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                ~ / deploy.sh
              </span>
            </div>
            <button
              onClick={copy}
              data-testid="try-copy-btn"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-amber-400 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="p-6 lg:p-8 font-mono text-xs sm:text-sm leading-relaxed">
            {COMMANDS.map((c, i) => (
              <div key={i} className="flex gap-3 mb-1">
                <span className="text-amber-400 shrink-0">$</span>
                <span className="text-zinc-100">{c}</span>
              </div>
            ))}
            <div className="mt-6 border-t border-white/5 pt-5 space-y-1">
              {OUTPUT.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.includes("✓")
                      ? "text-amber-400"
                      : line.includes("w7s.cloud")
                        ? "text-amber-400 font-semibold pl-2"
                        : "text-zinc-500"
                  }
                >
                  {line.includes("w7s.cloud") ? (
                    <>
                      {"  https://<your-github>."}
                      <W7SCloudLink className="text-amber-400 hover:text-amber-300 underline underline-offset-4" />
                      {"/nodepad"}
                    </>
                  ) : (
                    line || "\u00A0"
                  )}
                </div>
              ))}
              <div className="text-amber-400 cursor pt-2">$</div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://github.com/guerrerocarlos/nodepad"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="try-fork-btn"
            className="group inline-flex items-center justify-center gap-2 bg-amber-400 text-black px-6 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-all hover:-translate-y-0.5"
          >
            <Github className="h-4 w-4" strokeWidth={2.5} />
            Fork nodepad on GitHub
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
          </a>
          <a
            href="https://www.w7s.io/docs/deploy-from-github/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="try-docs-btn"
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-100 px-6 py-4 text-xs uppercase tracking-[0.2em] hover:border-amber-400 hover:text-amber-400 transition-all"
          >
            Read the deploy guide
          </a>
        </div>
      </div>
    </section>
  );
}
