import { CreditCard, Github, Cloud, ArrowUpRight } from "lucide-react";
import W7SCloudLink from "./W7SCloudLink";

const FACTS = [
  {
    icon: Github,
    k: "No signup",
    v: (
      <>
        Your GitHub repo token authorizes deploys. There is no W7S account,
        card, or cloud setup required to start on <W7SCloudLink />.
      </>
    ),
  },
  {
    icon: Cloud,
    k: "Hosted by W7S",
    v: (
      <>
        The action uploads your deploy archive to W7S Live. W7S serves the app
        at <W7SCloudLink /> or your custom domain.
      </>
    ),
  },
  {
    icon: CreditCard,
    k: "Usage-based",
    v: "Start free. Pay only after your app is a hit, and only for what it uses. No subscriptions just to keep it online.",
  },
];

const BILLING_POINTS = [
  ["Start free", "Build and share projects before billing matters."],
  ["Pay after traction", "Upgrade only when real usage shows up."],
  ["Per-use billing", "Pay for usage, not a subscription seat."],
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
              Free <W7SCloudLink className="text-amber-400 hover:text-amber-300" /> deploys.
              <br />
              Pay only after your app is a hit.
            </h2>
            <p className="mt-6 text-sm text-zinc-400 max-w-lg leading-relaxed">
              Deploy without a card. For successful apps, billing is usage-based:
              no subscriptions just to keep an app online.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.w7s.io/docs/pricing/"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 text-black px-5 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-colors"
              >
                Pricing details
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px">
                {BILLING_POINTS.map(([label, value]) => (
                  <div key={label} className="p-4 bg-black">
                    <div className="text-sm text-white font-medium">
                      {label}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500 leading-relaxed">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
