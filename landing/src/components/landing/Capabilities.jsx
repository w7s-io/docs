import {
  LayoutTemplate,
  Server,
  Layers,
  Database,
  Box,
  Network,
  Inbox,
  Clock,
  Workflow,
  Globe2,
  Terminal,
  Bot,
} from "lucide-react";

const ITEMS = [
  {
    icon: LayoutTemplate,
    label: "Static frontends",
    hint: "dist/, build/, out/",
    href: "/docs/project-layouts/#static-frontends",
  },
  {
    icon: Server,
    label: "Native backends",
    hint: "JS/TS in backend/, worker/",
    href: "/docs/project-layouts/#native-backends",
  },
  {
    icon: Layers,
    label: "Fullstack apps",
    hint: "frontend + backend",
    href: "/docs/project-layouts/#fullstack-repositories",
  },
  {
    icon: Box,
    label: "Durable Objects",
    hint: "bound to backends",
    href: "/docs/backend-durable-objects/",
  },
  {
    icon: Database,
    label: "Serverless DB",
    hint: "managed DB",
    href: "/docs/serverless-database/",
  },
  {
    icon: Database,
    label: "Postgres bindings",
    hint: "external Postgres",
    href: "/docs/backend-hyperdrive/",
  },
  {
    icon: Network,
    label: "Service bindings",
    hint: "backend-to-backend RPC",
    href: "/docs/backend-rpc/",
  },
  {
    icon: Inbox,
    label: "Background queues",
    hint: "delivered to workers",
    href: "/docs/backend-queues/",
  },
  {
    icon: Clock,
    label: "Cron schedules",
    hint: "cron on JS/TS backends",
    href: "/docs/backend-schedules/",
  },
  {
    icon: Workflow,
    label: "Durable workflows",
    hint: "long-running tasks",
    href: "/docs/backend-workflows/",
  },
  {
    icon: Globe2,
    label: "Custom domains",
    hint: "via CNAME file",
    href: "/docs/custom-domains/",
  },
  {
    icon: Terminal,
    label: "Console & logs",
    hint: "exceptions exposed",
    href: "/docs/observability/",
  },
  {
    icon: Bot,
    label: "Agent API",
    hint: "read-only infra state",
    href: "/docs/agent-api/",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      data-testid="capabilities-section"
      className="relative py-24 lg:py-32 border-t border-white/10 bg-[#070708]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
              // what you can deploy
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
              Not just static.
              <br />
              The whole stack.
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            W7S deploys static frontends, JavaScript/TypeScript native backends, fullstack apps and the
            edge primitives that glue them together — serverless DB, Durable Objects,
            queues, cron, workflows, and agent-readable infrastructure state.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <a
                key={it.label}
                href={it.href}
                data-testid={`capability-${i}`}
                aria-label={`Read docs for ${it.label}`}
                className="bg-[#0f0f11] p-6 lg:p-7 hover:bg-[#16161a] transition-colors group fade-up focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <Icon
                  className="h-5 w-5 text-zinc-500 group-hover:text-amber-400 transition-colors mb-5"
                  strokeWidth={1.5}
                />
                <div className="text-sm text-white font-medium mb-1">
                  {it.label}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  {it.hint}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
