import {
  Github,
  Settings2,
  Layers3,
  Workflow,
} from "lucide-react";

const OPTIONS = [
  {
    icon: Github,
    eyebrow: "w7s.cloud",
    title: "Repo-native deploys",
    desc: "Best when the GitHub repo should own the deploy path. The workflow uses GITHUB_TOKEN, W7S hosts the runtime, and usage limits are built in.",
    tone: "primary",
  },
  {
    icon: Layers3,
    eyebrow: "Vercel",
    title: "Managed product platform",
    desc: "Best when you want a polished hosted platform with previews, teams, billing, and framework conventions managed inside another product account.",
  },
  {
    icon: Settings2,
    eyebrow: "Cloudflare",
    title: "Direct infrastructure control",
    desc: "Best when you want to own the Cloudflare account, routes, credentials, resources, limits, observability, and billing yourself.",
  },
  {
    icon: Workflow,
    eyebrow: "The tradeoff",
    title: "Less setup, less direct control",
    desc: "w7s.cloud removes provider setup for default deploys. Use a provider directly when you need full account-level control on day one.",
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
            Simple hosted deploys.
            <br />
            <span className="text-amber-400">Clear alternatives.</span>
          </h2>
          <p className="mt-6 text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            w7s.cloud is for projects that want GitHub-native deploys without
            opening another cloud account first. Vercel and Cloudflare are good
            choices when you want their full product surfaces directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border border-white/10 bg-white/10 gap-px">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const isPrimary = option.tone === "primary";
            return (
              <div
                key={option.eyebrow}
                className={`${isPrimary ? "bg-[#0c0a06]" : "bg-[#0f0f11]"} p-7 lg:p-8 min-h-[260px]`}
              >
                <div className="flex items-center justify-between gap-4 mb-8">
                  <span className={`text-[10px] uppercase tracking-[0.3em] ${isPrimary ? "text-amber-400" : "text-zinc-500"}`}>
                    {option.eyebrow}
                  </span>
                  <Icon
                    className={`h-5 w-5 ${isPrimary ? "text-amber-400" : "text-zinc-400"}`}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className={`font-display text-2xl lg:text-3xl leading-tight mb-4 ${isPrimary ? "text-amber-400" : "text-white"}`}>
                  {option.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {option.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
