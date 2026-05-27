import {
  Github,
  GitBranch,
  Cloud,
  Lock,
  Code2,
  Settings2,
  Gauge,
  Terminal,
} from "lucide-react";

const W7S_TRAITS = [
  {
    icon: Github,
    t: "GitHub is the control plane",
    d: "Deploys are authorized by the repo token and triggered by the workflow you already review in git.",
  },
  {
    icon: Cloud,
    t: "W7S hosts the runtime",
    d: "The community service runs your app on W7S Cloud and gives it a w7s.cloud URL, without a Cloudflare account.",
  },
  {
    icon: Gauge,
    t: "Limits are built in",
    d: "Usage is tracked by repository and environment, with hard caps and warnings before shared infrastructure gets expensive.",
  },
];

const CLI_TRAITS = [
  {
    icon: Terminal,
    t: "Direct Cloudflare control",
    d: "Use wrangler when you want to own the Cloudflare account, billing, tokens, resources, and deploy surface.",
  },
  {
    icon: Settings2,
    t: "More setup to operate",
    d: "You manage CI auth, resource provisioning, routes, environments, limits, logs, and team access yourself.",
  },
  {
    icon: Lock,
    t: "Different trust model",
    d: "W7S trusts GitHub repository access. Wrangler trusts Cloudflare credentials that you create and rotate.",
  },
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
            // why w7s
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white leading-[0.95] max-w-4xl mx-auto">
            GitHub-native deploys.
            <br />
            <span className="text-amber-400">W7S-hosted runtime.</span>
          </h2>
          <p className="mt-6 text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Cloudflare's CLI is powerful when you want direct control of your
            own Cloudflare account. W7S is for repos that need a fast hosted
            path from push to production, with less platform setup.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 border border-white/10 bg-[#0a0a0c]">
          <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="h-6 w-6 text-amber-400" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                choose w7s for
              </span>
            </div>
            <h3 className="font-display text-3xl lg:text-4xl text-white mb-8">
              repo-owned deploys
            </h3>
            <ul className="space-y-6">
              {W7S_TRAITS.map((tr) => {
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

          <div className="p-8 lg:p-12 bg-[#0c0a06]">
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="h-6 w-6 text-white" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                choose wrangler for
              </span>
            </div>
            <h3 className="font-display text-3xl lg:text-4xl text-amber-400 mb-8">
              direct cloud control
            </h3>
            <ul className="space-y-6">
              {CLI_TRAITS.map((tr) => {
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
        </div>
      </div>
    </section>
  );
}
