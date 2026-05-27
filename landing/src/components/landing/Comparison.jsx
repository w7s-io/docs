import { Github, Zap, GitBranch, Cloud, Lock, Code2 } from "lucide-react";

const GITHUB_TRAITS = [
  { icon: Code2, t: "Lives in your repo", d: "Workflow YAML, secrets, history — all in git." },
  { icon: GitBranch, t: "Actions-native", d: "Triggered by push, PR, schedule. No webhooks." },
  { icon: Lock, t: "Your token, your trust", d: "Uses GITHUB_TOKEN. No third-party OAuth." },
];

const VERCEL_TRAITS = [
  { icon: Zap, t: "Push to deploy", d: "Live in seconds on a public URL." },
  { icon: Cloud, t: "Edge-ready", d: "Static, serverless, durable objects — all native." },
  { icon: Github, t: "Zero dashboards", d: "Your terminal is the dashboard." },
];

export default function Comparison() {
  return (
    <section
      id="compare"
      data-testid="comparison-section"
      className="relative py-24 lg:py-32 border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
            // positioning
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white leading-[0.95] max-w-4xl mx-auto">
            Like if{" "}
            <span className="text-amber-400">Vercel</span> and{" "}
            <span className="text-amber-400">GitHub</span>
            <br />
            had a child.
          </h2>
          <p className="mt-6 text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            GitHub's developer ergonomics. Vercel's deploy magic. Open source, no
            lock-in, no proprietary CLI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 border border-white/10 bg-[#0a0a0c]">
          {/* GitHub side */}
          <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Github className="h-6 w-6 text-white" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                inherits from
              </span>
            </div>
            <h3 className="font-display text-3xl lg:text-4xl text-white mb-8">
              GitHub
            </h3>
            <ul className="space-y-6">
              {GITHUB_TRAITS.map((tr) => {
                const Icon = tr.icon;
                return (
                  <li key={tr.t} className="flex gap-4">
                    <div className="shrink-0 w-9 h-9 border border-white/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-zinc-300" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium mb-1">
                        {tr.t}
                      </div>
                      <div className="text-xs text-zinc-500 leading-relaxed">
                        {tr.d}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Vercel side */}
          <div className="p-8 lg:p-12 bg-[#0c0a06]">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-6 w-6 text-amber-400" strokeWidth={2} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                inherits from
              </span>
            </div>
            <h3 className="font-display text-3xl lg:text-4xl text-amber-400 mb-8">
              Vercel
            </h3>
            <ul className="space-y-6">
              {VERCEL_TRAITS.map((tr) => {
                const Icon = tr.icon;
                return (
                  <li key={tr.t} className="flex gap-4">
                    <div className="shrink-0 w-9 h-9 border border-amber-400/30 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-amber-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium mb-1">
                        {tr.t}
                      </div>
                      <div className="text-xs text-zinc-500 leading-relaxed">
                        {tr.d}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
