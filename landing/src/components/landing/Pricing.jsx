import { Gauge, Github, Cloud, ArrowUpRight } from "lucide-react";

const FACTS = [
  {
    icon: Github,
    k: "No signup",
    v: "Your GitHub repo token authorizes deploys. There is no W7S account, card, or separate Cloudflare account required for w7s.cloud deploys.",
  },
  {
    icon: Cloud,
    k: "Hosted by W7S",
    v: "The action uploads your deploy archive to W7S Cloud. W7S serves the app from shared Cloudflare infrastructure at w7s.cloud or your custom domain.",
  },
  {
    icon: Gauge,
    k: "Hard limits",
    v: "Default caps apply per GitHub repo, per W7S environment, per UTC day. Owner and global caps protect the shared platform.",
  },
];

const LIMITS = [
  ["Deploys", "50/day"],
  ["Runtime requests", "10k/day"],
  ["Static files", "1,000"],
  ["Static size", "100 MB"],
  ["Worker logs", "5k/day"],
  ["Workflow starts", "1k/day"],
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="relative py-24 lg:py-32 border-t border-white/10 bg-[#070708]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
              // pricing
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
              Free w7s.cloud deploys.
              <br />
              Clear limits.
            </h2>
            <p className="mt-6 text-sm text-zinc-400 max-w-lg leading-relaxed">
              w7s.cloud is free today. Self-serve paid billing is not live
              yet. For production workloads that need higher limits, run your
              own W7S instance on Cloudflare or arrange a hosted limit override.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/docs/pricing/"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 text-black px-5 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-colors"
              >
                Full limits
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
              <a
                href="/docs/usage-accounting/"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-100 px-5 py-3 text-xs uppercase tracking-[0.2em] hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                Usage API
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
              {FACTS.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.k} className="bg-[#0f0f11] p-6 lg:p-7">
                    <Icon className="h-5 w-5 text-amber-400 mb-5" strokeWidth={1.5} />
                    <div className="text-sm text-white font-medium mb-2">
                      {fact.k}
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {fact.v}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border border-white/10 bg-white/10">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px">
                {LIMITS.map(([label, value]) => (
                  <div key={label} className="p-4 bg-black">
                    <div className="font-display text-2xl text-white leading-none">
                      {value}
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
              These are w7s.cloud defaults, not isolated Cloudflare accounts per
              user. W7S tracks repo usage and applies owner/global circuit
              breakers to keep the shared service available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
