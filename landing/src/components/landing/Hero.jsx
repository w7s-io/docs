import { useState } from "react";
import { Copy, Check, ArrowRight, Terminal, Zap, Cloud } from "lucide-react";
import { toast } from "sonner";

const YAML = `name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: w7s-io/w7s-cloud@v1
        with:
          token: \${{ github.token }}`;

const W7S_ACTION = "w7s-io/w7s-cloud@v1";
const W7S_STEP_LINES = new Set([
  `      - uses: ${W7S_ACTION}`,
  "        with:",
  "          token: ${{ github.token }}",
]);

function CodeLine({ line }) {
  if (W7S_STEP_LINES.has(line)) {
    return (
      <div className="leading-relaxed font-bold text-amber-400">
        {line || "\u00A0"}
      </div>
    );
  }

  // simple syntax highlighting
  const tokens = [];
  let m;
  if (/^\s*#/.test(line)) {
    tokens.push(<span key="c" className="text-zinc-600">{line}</span>);
  } else if ((m = line.match(/^(\s*)([\w-]+):(.*)$/))) {
    tokens.push(
      <span key="i">{m[1]}</span>,
      <span key="k" className="text-zinc-100">{m[2]}</span>,
      <span key="c" className="text-zinc-500">:</span>,
      <span key="v" className="text-zinc-100">{m[3]}</span>
    );
  } else if ((m = line.match(/^(\s*-\s*)(.*)$/))) {
    tokens.push(
      <span key="i" className="text-zinc-500">{m[1]}</span>,
      <span key="v" className="text-zinc-100">{m[2]}</span>
    );
  } else {
    tokens.push(<span key="t">{line || "\u00A0"}</span>);
  }
  return <div className="leading-relaxed">{tokens}</div>;
}

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(YAML);
    setCopied(true);
    toast.success("Copied workflow YAML");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 grid-bg"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left content */}
        <div className="lg:col-span-7 fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 mb-8 text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            Open source · GitHub-native deploys
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] text-white">
            Instant cloud infra <em className="text-amber-400 italic">for the agentic era</em>
          </h1>

          <p className="mt-8 text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
            Deploy new apps in one push; no auth, no card, no config,{" "}
            <em className="text-zinc-100 italic">one commit away from shipping live</em>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#try"
              data-testid="hero-cta-primary"
              className="group inline-flex items-center justify-center gap-2 bg-amber-400 text-black px-6 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-all hover:-translate-y-0.5"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              Try the nodepad demo
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </a>
            <a
              href="https://w7s.io/docs/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-cta-secondary"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-100 px-6 py-4 text-xs uppercase tracking-[0.2em] hover:border-amber-400 hover:text-amber-400 transition-all"
            >
              <Terminal className="h-4 w-4" strokeWidth={2} />
              Read the docs
            </a>
            <a
              href="https://w7s.io/docs/self-host/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-cta-self-host"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-100 px-6 py-4 text-xs uppercase tracking-[0.2em] hover:border-amber-400 hover:text-amber-400 transition-all"
            >
              <Cloud className="h-4 w-4" strokeWidth={2} />
              Self host
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[
              { k: "W7S", v: "Cloud hosted" },
              { k: "No", v: "account needed" },
              { k: "Repo", v: "owned deploys" },
            ].map((s) => (
              <div key={s.k} className="border-l border-white/10 pl-4">
                <div className="font-display text-2xl text-white">{s.k}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: code block */}
        <div className="lg:col-span-5 fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="tracing-border bg-black border border-white/10 relative" data-testid="hero-code-block">
            {/* Terminal chrome */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0a0a0c]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="ml-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  .github/workflows/deploy.yml
                </span>
              </div>
              <button
                onClick={copy}
                data-testid="hero-copy-btn"
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

            {/* Code */}
            <pre className="font-mono text-xs sm:text-[13px] p-5 overflow-x-auto leading-relaxed">
              {YAML.split("\n").map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-zinc-700 select-none w-6 text-right shrink-0">
                    {i + 1}
                  </span>
                  <CodeLine line={line} />
                </div>
              ))}
            </pre>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500">
            <Terminal className="h-3.5 w-3.5 text-amber-400" strokeWidth={2} />
            <span className="font-mono">
              That's the entire deployment config. Really.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
