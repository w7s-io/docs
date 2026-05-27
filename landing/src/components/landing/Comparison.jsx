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

const COMPARISON_ROWS = [
  {
    platform: "W7S",
    demand: "Launch to real traction",
    firstDeploy: "GitHub Actions only; no W7S account, card, or cloud setup for community deploys.",
    controlPlane: "Your deployment workflow is the control plane.",
    growth: "Start free, then pay per use after the app has real demand.",
    w7sEdge: "Shortest path from repo to public URL.",
    primary: true,
  },
  {
    platform: "Vercel",
    demand: "Frontend teams that want a full product platform.",
    firstDeploy: "Create a Vercel project and connect the repo to their platform.",
    controlPlane: "Vercel dashboard and Git integration sit between repo and runtime.",
    growth: "Usage, teams, previews, and platform features scale inside Vercel.",
    w7sEdge: "W7S keeps deploys in GitHub Actions when GitHub already owns CI.",
  },
  {
    platform: "AWS",
    demand: "Teams already standardizing on AWS.",
    firstDeploy: "AWS account, Amplify app, IAM, and billing context before launch.",
    controlPlane: "AWS Console and service configuration become part of deployment.",
    growth: "Powerful pay-as-you-go cloud, with cloud operations entering early.",
    w7sEdge: "W7S skips AWS setup until the repo actually proves demand.",
  },
  {
    platform: "Azure",
    demand: "Microsoft and Azure-governed organizations.",
    firstDeploy: "Azure resource, hosting plan, and portal setup before the app is live.",
    controlPlane: "Azure Portal plus GitHub Actions or Azure DevOps integration.",
    growth: "Useful when Azure governance matters more than launch speed.",
    w7sEdge: "W7S is faster for repos that only need deploy, URL, and usage tracking.",
  },
  {
    platform: "Netlify",
    demand: "Jamstack teams that want a hosted product workflow.",
    firstDeploy: "Create a Netlify team/site and connect the Git provider.",
    controlPlane: "Netlify dashboard and Git app own the deployment surface.",
    growth: "Usage is shaped by credits, plan choices, and add-on features.",
    w7sEdge: "W7S keeps the repo central and avoids product-plan decisions upfront.",
  },
  {
    platform: "Google Cloud",
    demand: "Container and serverless workloads already heading to Google Cloud.",
    firstDeploy: "Google Cloud project, APIs, IAM, region, and billing setup before production.",
    controlPlane: "Cloud Run, Cloud Build, gcloud, and project configuration.",
    growth: "Strong pay-per-use runtime once cloud setup is accepted.",
    w7sEdge: "W7S avoids project, IAM, and container setup for community deploys.",
  },
];

const CHART_COLUMNS = [
  ["platform", "Platform"],
  ["demand", "Demand fit"],
  ["firstDeploy", "First deploy"],
  ["controlPlane", "Control plane"],
  ["growth", "When usage grows"],
  ["w7sEdge", "Why W7S wins"],
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

        <div className="mt-8 border border-white/10 bg-white/10">
          <div className="bg-[#0b0b0c] px-5 py-4 sm:px-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-2">
                // demand chart
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight">
                W7S vs the default cloud path
              </h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg">
              A quick read on what each option asks from a developer before and
              after an app starts getting real traffic.
            </p>
          </div>

          <div className="hidden xl:grid grid-cols-[0.85fr_1fr_1.35fr_1.3fr_1.2fr_1.25fr] gap-px text-xs">
            {CHART_COLUMNS.map(([, label]) => (
              <div
                key={label}
                className="bg-black px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-zinc-500"
              >
                {label}
              </div>
            ))}

            {COMPARISON_ROWS.map((row) =>
              CHART_COLUMNS.map(([key]) => {
                const isPlatform = key === "platform";
                return (
                  <div
                    key={`${row.platform}-${key}`}
                    className={`${row.primary ? "bg-[#0c0a06]" : "bg-[#101012]"} px-4 py-4 leading-relaxed ${row.primary ? "text-zinc-200" : "text-zinc-500"}`}
                  >
                    {isPlatform ? (
                      <span className={`font-display text-lg ${row.primary ? "text-amber-400" : "text-white"}`}>
                        {row.platform}
                      </span>
                    ) : (
                      row[key]
                    )}
                  </div>
                );
              }),
            )}
          </div>

          <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 gap-px">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.platform}
                className={`${row.primary ? "bg-[#0c0a06]" : "bg-[#101012]"} p-5`}
              >
                <div className={`font-display text-2xl mb-4 ${row.primary ? "text-amber-400" : "text-white"}`}>
                  {row.platform}
                </div>
                <dl className="space-y-4">
                  {CHART_COLUMNS.slice(1).map(([key, label]) => (
                    <div key={`${row.platform}-${key}`}>
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-1">
                        {label}
                      </dt>
                      <dd className={`text-xs leading-relaxed ${row.primary ? "text-zinc-200" : "text-zinc-500"}`}>
                        {row[key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
