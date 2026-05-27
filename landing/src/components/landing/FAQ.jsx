import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const QA = [
  {
    q: "Do I need a W7S or Cloudflare account?",
    a: "No for w7s.cloud deploys. The GitHub Action authenticates with your repo's GITHUB_TOKEN, uploads the build to W7S Cloud, and W7S serves it from shared Cloudflare infrastructure.",
  },
  {
    q: "What languages and frameworks are supported?",
    a: "Any static frontend that produces dist/, build/, out/, dist/client/ or frontend/dist/. Native backends must be JavaScript or TypeScript Worker modules from backend/ or worker/. Fullstack apps that combine both. Vite, Next.js, Astro, SvelteKit, Remix, Hono, Express — all supported.",
  },
  {
    q: "How does the URL get generated?",
    a: "Your deploy is served by W7S Cloud at https://<your-github-username>.w7s.cloud/<repo-name>. So forking guerrerocarlos/notepad as your-handle/notepad gives you https://your-handle.w7s.cloud/notepad. Custom domains are a CNAME file in the deploy plus DNS pointing at w7w.cloud.",
  },
  {
    q: "Is it really open source?",
    a: "Yes — the entire platform, including the GitHub Action, the deploy runtime, and the management plane. The same core that powers w7s.cloud can power your own deployment cloud.",
  },
  {
    q: "Can I deploy backends, not just static sites?",
    a: "Yes. JavaScript/TypeScript native backends, Durable Objects, Hyperdrive for external Postgres, internal service bindings, background queues, cron schedules and durable workflow instances. Full stack, edge-native.",
  },
  {
    q: "What about limits and quotas?",
    a: "w7s.cloud limits apply per GitHub repo, per W7S environment, per UTC day. Owner-level and global caps protect the shared service. W7S exposes usage rollups, warnings, and hard-limit status through an authenticated API.",
  },
  {
    q: "How is this different from Vercel or Cloudflare?",
    a: "Vercel is a full hosted product platform with previews, teams, billing, and framework conventions. Cloudflare is direct infrastructure control through your own account. w7s.cloud sits closer to the repo: GitHub Actions deploys with the repo token, W7S hosts the runtime, and repo-scoped limits are built in.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative py-24 lg:py-32 border-t border-white/10"
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
            // faq
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-[0.95] mb-6">
            Questions,
            <br />
            answered.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Still curious? Head to the docs or open a discussion on GitHub.
          </p>
        </div>

        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="w-full">
            {QA.map((item, i) => (
              <AccordionItem
                key={i}
                value={`q-${i}`}
                data-testid={`faq-item-${i}`}
                className="border-b border-white/10 border-t-0"
              >
                <AccordionTrigger
                  className="py-6 text-left text-base text-white hover:no-underline hover:text-amber-400 font-mono [&[data-state=open]]:text-amber-400"
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-400 leading-relaxed pb-6 pr-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
