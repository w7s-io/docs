import { GitFork, FileCode2, GitCommit, Globe } from "lucide-react";
import W7SCloudLink from "./W7SCloudLink";

function LinkedCodeText({ text, className }) {
  if (!text.includes("w7s.cloud")) {
    return text;
  }

  const parts = text.split("w7s.cloud");
  return parts.map((part, idx) => (
    <span key={`${part}-${idx}`}>
      {part}
      {idx < parts.length - 1 ? (
        <W7SCloudLink
          className={`${className} hover:text-amber-300 underline underline-offset-4`}
        />
      ) : null}
    </span>
  ));
}

const STEPS = [
  {
    n: "01",
    icon: GitFork,
    title: "Fork the nodepad repo",
    desc: "Grab the starter template — a working app with the W7S workflow already wired up.",
    code: "gh repo fork guerrerocarlos/nodepad",
    cli: true,
    span: "col-span-12 md:col-span-5",
  },
  {
    n: "02",
    icon: FileCode2,
    title: "The workflow is already there",
    desc: "One file. Five lines that matter. Uses GitHub Actions OIDC, not a W7S API key.",
    code: "permissions:\n  id-token: write\n  contents: read\n\nuses: w7s-io/w7s-cloud@v1",
    span: "col-span-12 md:col-span-7",
  },
  {
    n: "03",
    icon: GitCommit,
    title: "Push to GitHub",
    desc: "GitHub Actions triggers. The W7S action verifies OIDC claims and uploads the deploy archive to W7S Cloud.",
    code: "git push origin main",
    cli: true,
    span: "col-span-12 md:col-span-7",
  },
  {
    n: "04",
    icon: Globe,
    title: "Live on the edge",
    desc: (
      <>
        W7S serves the app from managed W7S infrastructure. For a custom domain, add a{" "}
        <a
          href="/docs/custom-domains/"
          className="text-amber-400 hover:text-amber-300 underline underline-offset-4"
        >
          CNAME file
        </a>{" "}
        and point DNS at w7w.cloud.
      </>
    ),
    code: "https://<your-github>.w7s.cloud/nodepad\ncustom.domain.com + CNAME file -> w7s.cloud",
    span: "col-span-12 md:col-span-5",
    highlight: true,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      data-testid="how-it-works"
      className="relative py-24 lg:py-32 border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
              // how it works
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
              Four steps.
              <br />
              Zero dashboards.
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Everything happens inside the repo you already use. Fork, push, done.
            The deploy config lives next to your code, and W7S hosts the result.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                data-testid={`step-card-${i + 1}`}
                className={`${s.span} bg-[#0f0f11] border border-white/10 p-6 lg:p-8 hover-lift fade-up relative overflow-hidden group`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <span className="font-display text-xs uppercase tracking-[0.3em] text-zinc-600">
                    Step {s.n}
                  </span>
                  <Icon
                    className={`h-5 w-5 ${s.highlight ? "text-amber-400" : "text-zinc-500 group-hover:text-amber-400"} transition-colors`}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-display text-2xl lg:text-3xl text-white leading-tight mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-md">
                  {s.desc}
                </p>
                <div
                  className={`font-mono text-xs sm:text-[13px] bg-black border ${s.highlight ? "border-amber-400/40" : "border-white/10"} px-4 py-3 overflow-x-auto`}
                >
                  {s.code.split("\n").map((ln, idx) => (
                    <div key={idx} className={`flex ${s.cli ? "gap-3" : ""}`}>
                      {s.cli ? (
                        <span className={s.highlight ? "text-amber-400" : "text-zinc-600"}>
                          $
                        </span>
                      ) : null}
                      <span className={s.highlight ? "text-amber-400" : "text-zinc-200"}>
                        <LinkedCodeText
                          text={ln}
                          className={s.highlight ? "text-amber-400" : "text-zinc-200"}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
