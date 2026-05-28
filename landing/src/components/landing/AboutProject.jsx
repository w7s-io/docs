import { ArrowUpRight, Github } from "lucide-react";

export default function AboutProject() {
  return (
    <section
      id="about"
      data-testid="about-project-section"
      className="relative py-24 lg:py-32 border-t border-white/10 bg-[#070708]"
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-4">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60">
              <div className="absolute inset-0 border border-amber-400/40 translate-x-4 translate-y-4" />
              <img
                src="https://github.com/guerrerocarlos.png"
                alt="Carlos Guerrero"
                className="relative h-full w-full object-cover border border-white/10 bg-zinc-900 rounded-lg"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
              // about the project
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
              Built by Carlos Guerrero.
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                W7S is an open source deployment project by Carlos Guerrero,
                built around a simple idea: your GitHub repo should be enough
                to build, deploy, and serve an app.
              </p>
              <p>
                The project focuses on practical deploys for developers who
                want fewer dashboards, fewer setup steps, and a workflow that
                stays close to the code.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="https://github.com/guerrerocarlos/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 text-black px-5 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-colors"
              >
                <Github className="h-4 w-4" strokeWidth={2.5} />
                GitHub
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
              <a
                href="https://x.com/guerrerocarlos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-100 px-5 py-3 text-xs uppercase tracking-[0.2em] hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                X
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
