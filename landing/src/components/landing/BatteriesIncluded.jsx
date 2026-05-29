import { ArrowUpRight, Coins, Database, Plug } from "lucide-react";

const FEATURES = [
  {
    icon: Database,
    title: "Serverless SQL included",
    body: "Declare a D1 binding in w7s.json and W7S provisions a database for the repo and environment. No separate database account needed for typical app data.",
  },
  {
    icon: Coins,
    title: "Cost-aware by design",
    body: "D1 is serverless, cheap to keep around, and efficient for app-local SQL. Reads, writes, and storage are part of W7S usage estimates, so the data layer is included.",
  },
  {
    icon: Plug,
    title: "Postgres when you need it",
    body: "If your app needs an existing Postgres service, W7S can bind that too. Use the built-in database first, bring external Postgres when it is the right tool.",
  },
];

export default function BatteriesIncluded() {
  return (
    <section
      id="batteries"
      data-testid="batteries-included-section"
      className="relative py-24 lg:py-32 border-t border-white/10 bg-[#050505]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
              // batteries included
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
              Database included,
              <br />
              elastic by default.
            </h2>
            <p className="mt-6 text-sm text-zinc-400 max-w-lg leading-relaxed">
              W7S includes a serverless SQL database path through D1. For many
              apps, that means no external database setup before the first real
              user shows up.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/docs/serverless-database/"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 text-black px-5 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-colors"
              >
                Serverless database
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
              <a
                href="/docs/backend-hyperdrive/"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-100 px-5 py-3 text-xs uppercase tracking-[0.2em] hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                External Postgres
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-white/10 bg-white/10">
              <div className="bg-[#0b0b0c] px-5 py-4 sm:px-6 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                    w7s.json
                  </div>
                  <div className="mt-1 text-sm text-white font-medium">
                    One binding creates app SQL
                  </div>
                </div>
                <Database className="h-5 w-5 text-amber-400" strokeWidth={1.5} />
              </div>
              <pre className="overflow-x-auto bg-black p-5 sm:p-6 text-xs leading-relaxed text-zinc-300">
                <code>{`{
  "bindings": {
    "d1": [
      {
        "binding": "DB",
        "migrations": "migrations"
      }
    ]
  }
}`}</code>
              </pre>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="bg-[#0f0f11] p-6 lg:p-7">
                    <Icon className="h-5 w-5 text-amber-400 mb-5" strokeWidth={1.5} />
                    <div className="text-sm text-white font-medium mb-2">
                      {feature.title}
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {feature.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
