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
  Activity,
  Terminal,
} from "lucide-react";

const ITEMS = [
  { icon: LayoutTemplate, label: "Static frontends", hint: "dist/, build/, out/" },
  { icon: Server, label: "Native backends", hint: "backend/, worker/" },
  { icon: Layers, label: "Fullstack apps", hint: "frontend + backend" },
  { icon: Box, label: "Durable Objects", hint: "bound to backends" },
  { icon: Database, label: "Hyperdrive", hint: "external Postgres" },
  { icon: Network, label: "Service bindings", hint: "backend-to-backend RPC" },
  { icon: Inbox, label: "Background queues", hint: "delivered to workers" },
  { icon: Clock, label: "Cron schedules", hint: "cron on native backends" },
  { icon: Workflow, label: "Durable workflows", hint: "long-running tasks" },
  { icon: Globe2, label: "Custom domains", hint: "via CNAME file" },
  { icon: Activity, label: "Usage analytics", hint: "authenticated API" },
  { icon: Terminal, label: "Console & logs", hint: "exceptions exposed" },
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
            W7S deploys static frontends, native backends, fullstack apps and the
            edge primitives that glue them together — Durable Objects, Hyperdrive,
            queues, cron, workflows.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <div
                key={it.label}
                data-testid={`capability-${i}`}
                className="bg-[#0f0f11] p-6 lg:p-7 hover:bg-[#16161a] transition-colors group cursor-default fade-up"
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
