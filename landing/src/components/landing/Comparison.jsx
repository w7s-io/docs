import {
  Cloud,
  Github,
  Layers3,
} from "lucide-react";
import W7SCloudLink from "./W7SCloudLink";

const OPTIONS = [
  {
    key: "w7s-cloud",
    icon: Github,
    eyebrow: <W7SCloudLink className="text-amber-400 hover:text-amber-300" />,
    title: "Repo-native deploys",
    desc: "Best when the GitHub repo should own the deploy path. The workflow uses GITHUB_TOKEN, W7S hosts the runtime, and usage tracking is built in.",
    tone: "primary",
  },
  {
    key: "vercel",
    icon: Layers3,
    eyebrow: "Vercel",
    title: "Repo workflow over platform workflow",
    desc: "W7S is better when you want GitHub Actions to stay in charge. No dashboard-first deploy flow, product account setup, or framework-specific hosting conventions between commit and release.",
  },
  {
    key: "cloudflare",
    icon: Cloud,
    eyebrow: "Cloudflare",
    title: "One action over cloud setup",
    desc: "W7S is better when you want the edge runtime without wiring accounts, CLI auth, worker projects, and deploy scripts yourself. Commit, push, and let W7S serve the app.",
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
            <W7SCloudLink /> is for projects that want GitHub-native deploys
            without opening another cloud account first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10 bg-white/10 gap-px">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const isPrimary = option.tone === "primary";
            return (
              <div
                key={option.key}
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
