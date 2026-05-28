import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";

const STATUS_API_URL = "https://w7s.cloud/api/v1/status";

const STATUS_META = {
  operational: {
    label: "Operational",
    tone: "text-emerald-300",
    dot: "bg-emerald-400",
    border: "border-emerald-400/30",
    icon: CheckCircle2,
  },
  degraded_performance: {
    label: "Degraded",
    tone: "text-amber-300",
    dot: "bg-amber-400",
    border: "border-amber-400/40",
    icon: AlertTriangle,
  },
  partial_outage: {
    label: "Partial outage",
    tone: "text-orange-300",
    dot: "bg-orange-400",
    border: "border-orange-400/40",
    icon: AlertTriangle,
  },
  major_outage: {
    label: "Major outage",
    tone: "text-red-300",
    dot: "bg-red-400",
    border: "border-red-400/40",
    icon: XCircle,
  },
  unknown: {
    label: "Checking",
    tone: "text-zinc-300",
    dot: "bg-zinc-500",
    border: "border-white/10",
    icon: Activity,
  },
};

const OVERALL_META = {
  none: {
    label: "All systems operational",
    tone: "text-emerald-300",
    border: "border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  minor: {
    label: "Some systems need attention",
    tone: "text-amber-300",
    border: "border-amber-400/40",
    dot: "bg-amber-400",
  },
  major: {
    label: "Active outage detected",
    tone: "text-red-300",
    border: "border-red-400/40",
    dot: "bg-red-400",
  },
  critical: {
    label: "Critical outage detected",
    tone: "text-red-300",
    border: "border-red-400/40",
    dot: "bg-red-400",
  },
  unknown: {
    label: "Checking W7S status",
    tone: "text-zinc-300",
    border: "border-white/10",
    dot: "bg-zinc-500",
  },
};

const formatDate = (value) => {
  if (!value) return "Not checked yet";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not checked yet";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const groupComponents = (components = []) =>
  components.reduce((groups, component) => {
    const group = component.group || "Other";
    groups[group] = groups[group] || [];
    groups[group].push(component);
    return groups;
  }, {});

const componentMeta = (status) => STATUS_META[status] || STATUS_META.unknown;
const overallMeta = (indicator) => OVERALL_META[indicator] || OVERALL_META.unknown;

function StatusBadge({ status }) {
  const meta = componentMeta(status);
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 border ${meta.border} px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${meta.tone}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {meta.label}
    </span>
  );
}

function ComponentRow({ component }) {
  return (
    <div className="bg-[#0b0b0d] p-5 md:grid md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-6">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <h3 className="font-display text-xl text-white">{component.name}</h3>
          <StatusBadge status={component.status} />
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
          {component.description}
        </p>
      </div>
      <div className="mt-4 font-mono text-xs text-zinc-500 md:mt-0 md:text-right">
        <div>{component.endpoint}</div>
      </div>
      <div className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-600 md:mt-0 md:text-right">
        {formatDate(component.checked_at)}
      </div>
    </div>
  );
}

function IncidentPanel({ incidents = [] }) {
  if (!incidents.length) {
    return (
      <div className="border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
        <div className="flex items-center gap-3 text-emerald-300">
          <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
          <h2 className="font-display text-2xl text-white">No active incidents.</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          W7S public delivery, control plane, and runtime feature surfaces are
          currently marked operational.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-red-400/30 bg-red-400/[0.05] p-6">
      <div className="flex items-center gap-3 text-red-300">
        <AlertTriangle className="h-5 w-5" strokeWidth={2} />
        <h2 className="font-display text-2xl text-white">Active incident.</h2>
      </div>
      <div className="mt-5 space-y-5">
        {incidents.map((incident) => (
          <div key={incident.id} className="border-t border-white/10 pt-5">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">
              {incident.impact} impact
            </div>
            <h3 className="mt-2 font-display text-xl text-white">{incident.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Impacted: {incident.component_names?.join(", ") || "Unknown components"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(STATUS_API_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Status API returned HTTP ${response.status}`);
      setSummary(await response.json());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "W7S Status";
    refresh();
    const interval = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const groupedComponents = useMemo(
    () => groupComponents(summary?.components || []),
    [summary],
  );
  const status = error
    ? { indicator: "major", description: "Status checks unavailable" }
    : summary?.status || { indicator: "unknown", description: "Checking W7S status" };
  const meta = overallMeta(status.indicator);
  const operationalCount = summary?.components?.filter(
    (component) => component.status === "operational",
  ).length || 0;
  const componentCount = summary?.components?.length || 0;

  return (
    <div className="relative z-10 min-h-screen bg-[#050505] text-zinc-100">
      <header className="border-b border-white/10 bg-[#050505]/90">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <a href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-tighter text-white">W7S</span>
            <span className="hidden border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:inline-block">
              status
            </span>
          </a>
          <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-zinc-400">
            <a href="/" className="hover:text-amber-400 transition-colors">
              Home
            </a>
            <a href="/docs/" className="hover:text-amber-400 transition-colors">
              Docs
            </a>
            <a
              href="https://github.com/w7s-io"
              className="hidden items-center gap-1 hover:text-amber-400 transition-colors sm:inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
        <section className={`border ${meta.border} bg-white/[0.03] p-6 lg:p-8`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400">
                Live component status
              </p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.9] text-white sm:text-6xl lg:text-7xl">
                W7S Status
              </h1>
              <div className={`mt-6 inline-flex items-center gap-3 ${meta.tone}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                <span className="font-mono text-sm uppercase tracking-[0.2em]">
                  {status.description || meta.label}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 border border-white/20 px-5 py-3 text-xs uppercase tracking-[0.2em] text-zinc-100 transition-colors hover:border-amber-400 hover:text-amber-400 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} strokeWidth={2} />
              Refresh
            </button>
          </div>

          <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-3">
            <div className="bg-[#09090b] p-5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Components
              </div>
              <div className="mt-2 font-display text-3xl text-white">
                {componentCount ? `${operationalCount}/${componentCount}` : "Checking"}
              </div>
            </div>
            <div className="bg-[#09090b] p-5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Active incidents
              </div>
              <div className="mt-2 font-display text-3xl text-white">
                {summary?.incidents?.length || 0}
              </div>
            </div>
            <div className="bg-[#09090b] p-5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Last checked
              </div>
              <div className="mt-2 flex items-center gap-2 font-mono text-sm text-zinc-300">
                <Clock className="h-4 w-4 text-zinc-500" strokeWidth={2} />
                {formatDate(summary?.page?.updated_at)}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-8 border border-red-400/30 bg-red-400/[0.05] p-5 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="mt-8">
          <IncidentPanel incidents={summary?.incidents || []} />
        </section>

        <section className="mt-12 space-y-10">
          {Object.entries(groupedComponents).map(([group, components]) => (
            <div key={group}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-3xl text-white">{group}</h2>
                <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                  {components.length} components
                </span>
              </div>
              <div className="grid gap-px border border-white/10 bg-white/10">
                {components.map((component) => (
                  <ComponentRow key={component.id} component={component} />
                ))}
              </div>
            </div>
          ))}

          {!componentCount && !error && (
            <div className="border border-white/10 bg-[#0b0b0d] p-8 text-sm text-zinc-400">
              Checking W7S components...
            </div>
          )}
        </section>

        <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-zinc-500">
          Status data refreshes every 60 seconds and follows the same component
          model as public hosted status APIs: overall status, components,
          incidents, and scheduled maintenance.
        </footer>
      </main>
    </div>
  );
}
