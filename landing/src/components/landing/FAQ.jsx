import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const QA = [
  {
    q: "Do I need an account on w7s.cloud?",
    a: "No. W7S authenticates via your repo's GitHub token. If you can push to the repo, you can deploy it. No signup, no dashboard, no API keys to rotate.",
  },
  {
    q: "What languages and frameworks are supported?",
    a: "Any static frontend that produces dist/, build/, out/, dist/client/ or frontend/dist/. Native backends from backend/ or worker/. Fullstack apps that combine both. Vite, Next.js, Astro, SvelteKit, Remix, Hono, Express — all supported.",
  },
  {
    q: "How does the URL get generated?",
    a: "Your deploy is served at https://<your-github-username>.w7s.cloud/<repo-name>. So forking guerrerocarlos/notepad as your-handle/notepad gives you https://your-handle.w7s.cloud/notepad. Custom domains via CNAME file.",
  },
  {
    q: "Is it really open source?",
    a: "Yes — the entire platform, including the GitHub Action, the deploy runtime, and the management plane. The same core that powers w7s.cloud can power your own deployment cloud.",
  },
  {
    q: "Can I deploy backends, not just static sites?",
    a: "Yes. Native backends, Durable Objects, Hyperdrive for external Postgres, internal service bindings, background queues, cron schedules and durable workflow instances. Full stack, edge-native.",
  },
  {
    q: "What about limits and quotas?",
    a: "W7S exposes daily usage rollups, hourly Cloudflare usage sync, warning thresholds and hard daily limits via an authenticated API. You can wire alerts into your existing tooling.",
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
