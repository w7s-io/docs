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
    feature: "GitHub-native deployment",
    w7s: "Yes (one Action)",
    href: "/docs/deploy-from-github/",
    vercel: "Good",
    cloudflare: "Manual",
    railwayFly: "Good",
    primary: true,
  },
  {
    feature: "Open Source + Self-hostable",
    w7s: "Yes",
    href: "/docs/self-host/",
    vercel: "No",
    cloudflare: "Partial",
    railwayFly: "No",
    primary: true,
  },
  {
    feature: "Native JS/TS Backends",
    w7s: "Yes",
    href: "/docs/project-layouts/#native-backends",
    vercel: "Serverless Functions",
    cloudflare: "Workers",
    railwayFly: "Yes",
    primary: true,
  },
  {
    feature: "Serverless DB",
    w7s: "Included",
    href: "/docs/serverless-database/",
    vercel: "Add-on",
    cloudflare: "Native DB",
    railwayFly: "External",
    primary: true,
  },
  {
    feature: "External Postgres",
    w7s: "Supported",
    href: "/docs/backend-hyperdrive/",
    vercel: "Yes (paid)",
    cloudflare: "Manual",
    railwayFly: "Yes",
    primary: true,
  },
  {
    feature: "Queues, Cron & Workflows",
    w7s: "Native",
    href: "/docs/backend-queues/",
    vercel: "Limited",
    cloudflare: "Yes",
    railwayFly: "Yes",
    primary: true,
  },
  {
    feature: "Vendor Lock-in",
    w7s: "None",
    href: "/docs/self-host/",
    vercel: "High",
    cloudflare: "Medium",
    railwayFly: "High",
    primary: true,
  },
  {
    feature: "Pricing",
    w7s: "Free self-host + hosted",
    href: "/docs/pricing/",
    vercel: "Usage-based",
    cloudflare: "Usage-based",
    railwayFly: "Usage-based",
    primary: true,
  },
];

const CHART_COLUMNS = [
  ["feature", "Feature"],
  ["w7s", "W7S"],
  ["vercel", "Vercel"],
  ["cloudflare", "Cloudflare Pages + Workers"],
  ["railwayFly", "Railway / Fly.io"],
];

const startsWithYes = (value) => String(value).startsWith("Yes");

function ComparisonValue({ value, href, label, highlight = false }) {
  if (!highlight && !startsWithYes(value)) {
    return value;
  }

  const className =
    "font-semibold text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

  if (href) {
    return (
      <a href={href} aria-label={label} className={className}>
        {value}
      </a>
    );
  }

  return (
    <span className={className}>
      {value}
    </span>
  );
}

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
                // comparison chart
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight">
                W7S vs Others
              </h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg">
              The same comparison table from the docs, focused on deploy
              ownership, backend support, platform services, lock-in, and cost.
            </p>
          </div>

          <div className="hidden lg:grid grid-cols-[1.15fr_0.85fr_1fr_1.45fr_1.05fr] gap-px text-xs">
            {CHART_COLUMNS.map(([, label]) => (
              <div
                key={label}
                className={`bg-black px-4 py-3 text-[10px] uppercase tracking-[0.22em] ${label === "W7S" ? "text-amber-400" : "text-zinc-500"}`}
              >
                {label}
              </div>
            ))}

            {COMPARISON_ROWS.map((row) =>
              CHART_COLUMNS.map(([key]) => {
                const isFeature = key === "feature";
                const isW7S = key === "w7s";
                return (
                  <div
                    key={`${row.feature}-${key}`}
                    className={`${isW7S ? "bg-[#0c0a06] text-zinc-100" : "bg-[#101012] text-zinc-500"} px-4 py-4 leading-relaxed`}
                  >
                    {isFeature ? (
                      <span className="font-display text-base text-white">
                        {row.feature}
                      </span>
                    ) : isW7S ? (
                      <ComparisonValue
                        value={row[key]}
                        href={row.href}
                        label={`Read W7S docs for ${row.feature}`}
                        highlight
                      />
                    ) : (
                      <ComparisonValue
                        value={row[key]}
                        href={startsWithYes(row[key]) ? row.href : undefined}
                        label={`Read W7S docs for ${row.feature}`}
                      />
                    )}
                  </div>
                );
              }),
            )}
          </div>

          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-px">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.feature}
                className="bg-[#101012] p-5"
              >
                <div className="font-display text-2xl mb-4 text-white">
                  {row.feature}
                </div>
                <dl className="space-y-4">
                  {CHART_COLUMNS.slice(1).map(([key, label]) => (
                    <div key={`${row.feature}-${key}`}>
                      <dt className={`text-[10px] uppercase tracking-[0.22em] mb-1 ${key === "w7s" ? "text-amber-400" : "text-zinc-600"}`}>
                        {label}
                      </dt>
                      <dd className={`text-xs leading-relaxed ${key === "w7s" ? "font-semibold text-amber-400" : "text-zinc-500"}`}>
                        <ComparisonValue
                          value={row[key]}
                          href={key === "w7s" || startsWithYes(row[key]) ? row.href : undefined}
                          label={`Read W7S docs for ${row.feature}`}
                          highlight={key === "w7s"}
                        />
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
