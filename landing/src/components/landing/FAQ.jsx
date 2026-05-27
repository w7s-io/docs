import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import W7SCloudLink from "./W7SCloudLink";

const QA = [
  {
    q: "Do I need a W7S account?",
    a: (
      <>
        No for <W7SCloudLink /> deploys. GitHub Actions builds your app, then
        the W7S action authenticates with your repo's GITHUB_TOKEN and uploads
        the deploy output for W7S to serve.
      </>
    ),
  },
  {
    q: "What languages and frameworks are supported?",
    a: "Any static frontend that produces dist/, build/, out/, dist/client/ or frontend/dist/. Native backends must be JavaScript or TypeScript Worker modules from backend/ or worker/. Fullstack apps that combine both. Vite, Next.js, Astro, SvelteKit, Remix, Hono, Express — all supported.",
  },
  {
    q: "How does the URL get generated?",
    a: (
      <>
        Your deploy is served by W7S Cloud at https://&lt;your-github-username&gt;.<W7SCloudLink />/&lt;repo-name&gt;.
        So forking guerrerocarlos/notepad as your-handle/notepad gives you https://your-handle.<W7SCloudLink />/notepad.
        Custom domains are a{" "}
        <a
          href="/docs/custom-domains/"
          className="text-amber-400 hover:text-amber-300 underline underline-offset-4"
        >
          CNAME file
        </a>{" "}
        in the deploy plus DNS pointing at w7w.cloud.
      </>
    ),
  },
  {
    q: "Is it really open source?",
    a: (
      <>
        Yes — the entire platform, including the GitHub Action, the deploy
        runtime, and the management plane. The same core that powers{" "}
        <W7SCloudLink /> can power your own deployment cloud.
      </>
    ),
  },
  {
    q: "Can I deploy backends, not just static sites?",
    a: "Yes. JavaScript/TypeScript native backends, Durable Objects, Hyperdrive for external Postgres, internal service bindings, background queues, cron schedules and durable workflow instances. Full stack, edge-native.",
  },
  {
    q: "How does usage and billing work?",
    a: "W7S exposes usage rollups through an authenticated API so teams can see what each repo is using. Start free; pay per use after the app has real traction.",
  },
  {
    q: "How is this different from Vercel?",
    a: (
      <>
        Vercel is a full hosted product platform with previews, teams, billing,
        and framework conventions. <W7SCloudLink /> sits closer to the repo:
        GitHub Actions deploys with the repo token, and W7S hosts the runtime.
      </>
    ),
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
