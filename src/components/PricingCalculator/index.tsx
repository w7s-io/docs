import React, {useMemo, useState} from 'react';
import styles from './styles.module.css';

type Inputs = {
  visitorsPerDay: number;
  pageViewsPerVisitor: number;
  staticAssetsPerPage: number;
  backendRequestsPerPage: number;
  averageCpuMs: number;
  staticCacheHitRate: number;
  keyValueReadsPerVisitor: number;
  keyValueWritesPer100Visitors: number;
  sqlRowsReadPerVisitor: number;
  sqlRowsWrittenPer100Visitors: number;
  objectReadsPer100Visitors: number;
  objectWritesPer100Visitors: number;
  queueMessagesPer100Visitors: number;
  statefulObjectCallsPer100Visitors: number;
  statefulObjectActiveSecondsPerDay: number;
  logEventsPerVisitor: number;
  staticStorageGb: number;
  keyValueStorageGb: number;
  sqlStorageGb: number;
  objectStorageGb: number;
  statefulObjectStorageGb: number;
  runtimeScripts: number;
};

type StageId = 'free' | 'mvp' | 'launch' | 'seed' | 'seriesA' | 'growth';

type CostLine = {
  label: string;
  usage: number;
  usageLabel: string;
  unitSize: number;
  unitPrice: number;
  priceLabel: string;
};

type UsageMetrics = {
  monthlyVisitors: number;
  pageViews: number;
  staticAssetRequests: number;
  backendRequests: number;
  runtimeRequests: number;
  runtimeCpuMs: number;
  queueMessages: number;
  statefulObjectRequests: number;
  objectStorageGb: number;
  objectReadOperations: number;
  objectWriteOperations: number;
  keyValueReads: number;
  keyValueWrites: number;
  keyValueStorageGb: number;
  sqlRowsRead: number;
  sqlRowsWritten: number;
  sqlStorageGb: number;
  queueOps: number;
  statefulObjectGbSeconds: number;
  statefulObjectStorageGb: number;
  logEvents: number;
  runtimeScripts: number;
  platformExecutions: number;
  platformCpuMs: number;
  usageGuardReads: number;
  usageCounterWrites: number;
};

const DAYS_PER_MONTH = 30;
const GROSS_MARGIN_RATE = 0.5;

const PRICING = {
  runtimeRequestPricePerMillion: 0.3,
  runtimeCpuPricePerMillionMs: 0.02,
  runtimeScriptPrice: 0.02,
  objectStoragePricePerGb: 0.015,
  objectWriteOperationsPricePerMillion: 4.5,
  objectReadOperationsPricePerMillion: 0.36,
  keyValueReadPricePerMillion: 0.5,
  keyValueWritePricePerMillion: 5,
  keyValueStoragePricePerGb: 0.5,
  sqlRowsReadPricePerMillion: 0.001,
  sqlRowsWrittenPricePerMillion: 1,
  sqlStoragePricePerGb: 0.75,
  queueOpsPricePerMillion: 0.4,
  statefulObjectRequestPricePerMillion: 0.15,
  statefulObjectDurationPricePerMillionGbSeconds: 12.5,
  statefulObjectStoragePricePerGb: 0.2,
  logsPricePerMillion: 0.6,
};

const FREE_TIER_INPUTS: Inputs = {
  visitorsPerDay: 100,
  pageViewsPerVisitor: 5,
  staticAssetsPerPage: 10,
  backendRequestsPerPage: 1,
  averageCpuMs: 5,
  staticCacheHitRate: 50,
  keyValueReadsPerVisitor: 1,
  keyValueWritesPer100Visitors: 1,
  sqlRowsReadPerVisitor: 10,
  sqlRowsWrittenPer100Visitors: 1,
  objectReadsPer100Visitors: 0,
  objectWritesPer100Visitors: 0,
  queueMessagesPer100Visitors: 0,
  statefulObjectCallsPer100Visitors: 0,
  statefulObjectActiveSecondsPerDay: 0,
  logEventsPerVisitor: 0,
  staticStorageGb: 1,
  keyValueStorageGb: 1,
  sqlStorageGb: 1,
  objectStorageGb: 0,
  statefulObjectStorageGb: 0,
  runtimeScripts: 1,
};

const STAGE_VALUES: Record<StageId, Inputs> = {
  free: FREE_TIER_INPUTS,
  mvp: {
    visitorsPerDay: 1_000,
    pageViewsPerVisitor: 5,
    staticAssetsPerPage: 12,
    backendRequestsPerPage: 2,
    averageCpuMs: 8,
    staticCacheHitRate: 92,
    keyValueReadsPerVisitor: 2,
    keyValueWritesPer100Visitors: 2,
    sqlRowsReadPerVisitor: 30,
    sqlRowsWrittenPer100Visitors: 2,
    objectReadsPer100Visitors: 0,
    objectWritesPer100Visitors: 0,
    queueMessagesPer100Visitors: 1,
    statefulObjectCallsPer100Visitors: 0,
    statefulObjectActiveSecondsPerDay: 0,
    logEventsPerVisitor: 1,
    staticStorageGb: 2,
    keyValueStorageGb: 1,
    sqlStorageGb: 1,
    objectStorageGb: 0,
    statefulObjectStorageGb: 0,
    runtimeScripts: 1,
  },
  launch: {
    visitorsPerDay: 5_000,
    pageViewsPerVisitor: 6,
    staticAssetsPerPage: 14,
    backendRequestsPerPage: 3,
    averageCpuMs: 10,
    staticCacheHitRate: 90,
    keyValueReadsPerVisitor: 3,
    keyValueWritesPer100Visitors: 5,
    sqlRowsReadPerVisitor: 60,
    sqlRowsWrittenPer100Visitors: 5,
    objectReadsPer100Visitors: 2,
    objectWritesPer100Visitors: 1,
    queueMessagesPer100Visitors: 5,
    statefulObjectCallsPer100Visitors: 1,
    statefulObjectActiveSecondsPerDay: 300,
    logEventsPerVisitor: 2,
    staticStorageGb: 5,
    keyValueStorageGb: 2,
    sqlStorageGb: 3,
    objectStorageGb: 10,
    statefulObjectStorageGb: 1,
    runtimeScripts: 2,
  },
  seed: {
    visitorsPerDay: 20_000,
    pageViewsPerVisitor: 6,
    staticAssetsPerPage: 16,
    backendRequestsPerPage: 4,
    averageCpuMs: 14,
    staticCacheHitRate: 88,
    keyValueReadsPerVisitor: 5,
    keyValueWritesPer100Visitors: 10,
    sqlRowsReadPerVisitor: 150,
    sqlRowsWrittenPer100Visitors: 15,
    objectReadsPer100Visitors: 10,
    objectWritesPer100Visitors: 3,
    queueMessagesPer100Visitors: 20,
    statefulObjectCallsPer100Visitors: 5,
    statefulObjectActiveSecondsPerDay: 2_400,
    logEventsPerVisitor: 3,
    staticStorageGb: 12,
    keyValueStorageGb: 5,
    sqlStorageGb: 12,
    objectStorageGb: 100,
    statefulObjectStorageGb: 4,
    runtimeScripts: 5,
  },
  seriesA: {
    visitorsPerDay: 50_000,
    pageViewsPerVisitor: 7,
    staticAssetsPerPage: 18,
    backendRequestsPerPage: 6,
    averageCpuMs: 18,
    staticCacheHitRate: 86,
    keyValueReadsPerVisitor: 8,
    keyValueWritesPer100Visitors: 20,
    sqlRowsReadPerVisitor: 300,
    sqlRowsWrittenPer100Visitors: 35,
    objectReadsPer100Visitors: 30,
    objectWritesPer100Visitors: 8,
    queueMessagesPer100Visitors: 50,
    statefulObjectCallsPer100Visitors: 20,
    statefulObjectActiveSecondsPerDay: 14_400,
    logEventsPerVisitor: 5,
    staticStorageGb: 30,
    keyValueStorageGb: 12,
    sqlStorageGb: 40,
    objectStorageGb: 500,
    statefulObjectStorageGb: 20,
    runtimeScripts: 12,
  },
  growth: {
    visitorsPerDay: 100_000,
    pageViewsPerVisitor: 8,
    staticAssetsPerPage: 20,
    backendRequestsPerPage: 8,
    averageCpuMs: 24,
    staticCacheHitRate: 85,
    keyValueReadsPerVisitor: 12,
    keyValueWritesPer100Visitors: 40,
    sqlRowsReadPerVisitor: 600,
    sqlRowsWrittenPer100Visitors: 80,
    objectReadsPer100Visitors: 80,
    objectWritesPer100Visitors: 20,
    queueMessagesPer100Visitors: 120,
    statefulObjectCallsPer100Visitors: 60,
    statefulObjectActiveSecondsPerDay: 43_200,
    logEventsPerVisitor: 8,
    staticStorageGb: 60,
    keyValueStorageGb: 25,
    sqlStorageGb: 120,
    objectStorageGb: 2_000,
    statefulObjectStorageGb: 80,
    runtimeScripts: 25,
  },
};

const STAGE_LABELS: Record<StageId, string> = {
  free: 'Free tier',
  mvp: 'MVP',
  launch: 'Launch',
  seed: 'Seed',
  seriesA: 'Series A',
  growth: 'Growth',
};

const STAGE_DESCRIPTIONS: Record<StageId | 'custom', string> = {
  free: 'Top of the included free-tier baseline. This stage should estimate $0.00.',
  mvp: 'A small product with real users, simple data access, and light logs.',
  launch: 'A public launch with steady daily traffic, queues, storage, and early backend usage.',
  seed: 'A seed-stage app with meaningful data volume, background work, and observability.',
  seriesA: 'A larger production app with heavier API use, storage, logs, and stateful work.',
  growth: 'A high-traffic app pushing the current calculator range.',
  custom: 'Custom slider values.',
};

const STAGE_ORDER: StageId[] = ['free', 'mvp', 'launch', 'seed', 'seriesA', 'growth'];

const numberFormatter = new Intl.NumberFormat('en-US');
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const formatMoney = (value: number) => {
  if (value > 0 && value < 0.01) return '<$0.01';
  return currencyFormatter.format(value);
};

const formatCompact = (value: number) => compactFormatter.format(Math.round(value));

const formatNumber = (value: number) => numberFormatter.format(Math.round(value));

const billable = (usage: number, included: number) =>
  Math.max(0, usage - included);

const calculateMetrics = (input: Inputs): UsageMetrics => {
  const monthlyVisitors = input.visitorsPerDay * DAYS_PER_MONTH;
  const pageViews = monthlyVisitors * input.pageViewsPerVisitor;
  const staticAssetRequests = pageViews * input.staticAssetsPerPage;
  const backendRequests = pageViews * input.backendRequestsPerPage;
  const queueMessages = (monthlyVisitors * input.queueMessagesPer100Visitors) / 100;
  const statefulObjectRequests = (monthlyVisitors * input.statefulObjectCallsPer100Visitors) / 100;
  const objectAppReads = (monthlyVisitors * input.objectReadsPer100Visitors) / 100;
  const objectAppWrites = (monthlyVisitors * input.objectWritesPer100Visitors) / 100;
  const cacheMissRatio = Math.max(0, Math.min(100, 100 - input.staticCacheHitRate)) / 100;
  const staticObjectReads = staticAssetRequests * cacheMissRatio;
  const keyValueReads = monthlyVisitors * input.keyValueReadsPerVisitor;
  const keyValueWrites = (monthlyVisitors * input.keyValueWritesPer100Visitors) / 100;
  const sqlRowsRead = monthlyVisitors * input.sqlRowsReadPerVisitor;
  const sqlRowsWritten = (monthlyVisitors * input.sqlRowsWrittenPer100Visitors) / 100;
  const queueOps = queueMessages * 3;
  const logEvents = monthlyVisitors * input.logEventsPerVisitor;
  const runtimeRequests =
    pageViews +
    staticAssetRequests +
    backendRequests +
    queueMessages +
    statefulObjectRequests;
  const runtimeCpuMs =
    pageViews * 0.25 +
    staticAssetRequests * 0.1 +
    backendRequests * input.averageCpuMs +
    queueMessages * Math.max(1, input.averageCpuMs * 0.5) +
    statefulObjectRequests * Math.max(1, input.averageCpuMs * 0.25);
  const statefulObjectGbSeconds =
    input.statefulObjectActiveSecondsPerDay * DAYS_PER_MONTH * 0.125;
  const objectStorageGb = input.staticStorageGb + input.objectStorageGb;
  const objectReadOperations = staticObjectReads + objectAppReads;
  const objectWriteOperations = objectAppWrites;
  const publicRequests = pageViews + staticAssetRequests + backendRequests;
  const platformExecutions =
    publicRequests +
    queueMessages * 2 +
    statefulObjectRequests +
    logEvents;
  const platformCpuMs =
    pageViews * 0.25 +
    staticAssetRequests * 0.15 +
    backendRequests * 0.75 +
    queueMessages * 2 +
    statefulObjectRequests * 0.5 +
    logEvents * 0.15;
  const usageGuardReads =
    runtimeRequests +
    objectReadOperations +
    objectWriteOperations +
    keyValueReads +
    keyValueWrites +
    sqlRowsRead +
    sqlRowsWritten +
    queueOps +
    logEvents;
  const usageCounterWrites =
    runtimeRequests +
    objectWriteOperations +
    keyValueWrites +
    sqlRowsWritten +
    queueOps +
    logEvents;

  return {
    monthlyVisitors,
    pageViews,
    staticAssetRequests,
    backendRequests,
    runtimeRequests,
    runtimeCpuMs,
    queueMessages,
    statefulObjectRequests,
    objectStorageGb,
    objectReadOperations,
    objectWriteOperations,
    keyValueReads,
    keyValueWrites,
    keyValueStorageGb: input.keyValueStorageGb,
    sqlRowsRead,
    sqlRowsWritten,
    sqlStorageGb: input.sqlStorageGb,
    queueOps,
    statefulObjectGbSeconds,
    statefulObjectStorageGb: input.statefulObjectStorageGb,
    logEvents,
    runtimeScripts: input.runtimeScripts,
    platformExecutions,
    platformCpuMs,
    usageGuardReads,
    usageCounterWrites,
  };
};

const lineCost = (line: CostLine) => (line.usage / line.unitSize) * line.unitPrice;

const marginCost = (operatingCost: number) =>
  operatingCost / (1 - GROSS_MARGIN_RATE) - operatingCost;

const makeLine = (
  label: string,
  usage: number,
  usageLabel: string,
  unitSize: number,
  unitPrice: number,
  priceLabel: string,
): CostLine => ({
  label,
  usage,
  usageLabel,
  unitSize,
  unitPrice,
  priceLabel,
});

type SliderFieldProps = {
  id: keyof Inputs;
  label: string;
  help: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueLabel: string;
  onChange: (id: keyof Inputs, value: number) => void;
};

function SliderField({
  id,
  label,
  help,
  min,
  max,
  step,
  value,
  valueLabel,
  onChange,
}: SliderFieldProps) {
  return (
    <label className={styles.sliderField}>
      <span className={styles.sliderHeader}>
        <span>{label}</span>
        <strong>{valueLabel}</strong>
      </span>
      <input
        className={styles.slider}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(id, Number(event.target.value))}
      />
      <span className={styles.sliderHelp}>{help}</span>
    </label>
  );
}

export default function PricingCalculator() {
  const [profile, setProfile] = useState<StageId | 'custom'>('free');
  const [inputs, setInputs] = useState<Inputs>(STAGE_VALUES.free);

  const updateInput = (id: keyof Inputs, value: number) => {
    setProfile('custom');
    setInputs((current) => ({...current, [id]: value}));
  };

  const selectProfile = (nextProfile: StageId) => {
    setProfile(nextProfile);
    setInputs(STAGE_VALUES[nextProfile]);
  };

  const estimate = useMemo(() => {
    const metrics = calculateMetrics(inputs);
    const included = calculateMetrics(FREE_TIER_INPUTS);

    const operatingLines = [
      makeLine(
        'Runtime requests',
        billable(metrics.runtimeRequests, included.runtimeRequests),
        formatCompact(billable(metrics.runtimeRequests, included.runtimeRequests)),
        1_000_000,
        PRICING.runtimeRequestPricePerMillion,
        '$0.30 / 1M',
      ),
      makeLine(
        'Runtime CPU',
        billable(metrics.runtimeCpuMs, included.runtimeCpuMs),
        `${formatCompact(billable(metrics.runtimeCpuMs, included.runtimeCpuMs))} ms`,
        1_000_000,
        PRICING.runtimeCpuPricePerMillionMs,
        '$0.02 / 1M ms',
      ),
      makeLine(
        'Deployed runtimes',
        billable(metrics.runtimeScripts, included.runtimeScripts),
        formatNumber(billable(metrics.runtimeScripts, included.runtimeScripts)),
        1,
        PRICING.runtimeScriptPrice,
        '$0.02 / runtime',
      ),
      makeLine(
        'Asset and object storage',
        billable(metrics.objectStorageGb, included.objectStorageGb),
        `${formatNumber(billable(metrics.objectStorageGb, included.objectStorageGb))} GB`,
        1,
        PRICING.objectStoragePricePerGb,
        '$0.015 / GB',
      ),
      makeLine(
        'Object write operations',
        billable(metrics.objectWriteOperations, included.objectWriteOperations),
        formatCompact(billable(metrics.objectWriteOperations, included.objectWriteOperations)),
        1_000_000,
        PRICING.objectWriteOperationsPricePerMillion,
        '$4.50 / 1M',
      ),
      makeLine(
        'Object read operations',
        billable(metrics.objectReadOperations, included.objectReadOperations),
        formatCompact(billable(metrics.objectReadOperations, included.objectReadOperations)),
        1_000_000,
        PRICING.objectReadOperationsPricePerMillion,
        '$0.36 / 1M',
      ),
      makeLine(
        'Key-value reads',
        billable(metrics.keyValueReads, included.keyValueReads),
        formatCompact(billable(metrics.keyValueReads, included.keyValueReads)),
        1_000_000,
        PRICING.keyValueReadPricePerMillion,
        '$0.50 / 1M',
      ),
      makeLine(
        'Key-value writes',
        billable(metrics.keyValueWrites, included.keyValueWrites),
        formatCompact(billable(metrics.keyValueWrites, included.keyValueWrites)),
        1_000_000,
        PRICING.keyValueWritePricePerMillion,
        '$5.00 / 1M',
      ),
      makeLine(
        'Key-value storage',
        billable(metrics.keyValueStorageGb, included.keyValueStorageGb),
        `${formatNumber(billable(metrics.keyValueStorageGb, included.keyValueStorageGb))} GB`,
        1,
        PRICING.keyValueStoragePricePerGb,
        '$0.50 / GB',
      ),
      makeLine(
        'SQL rows read',
        billable(metrics.sqlRowsRead, included.sqlRowsRead),
        formatCompact(billable(metrics.sqlRowsRead, included.sqlRowsRead)),
        1_000_000,
        PRICING.sqlRowsReadPricePerMillion,
        '$0.001 / 1M',
      ),
      makeLine(
        'SQL rows written',
        billable(metrics.sqlRowsWritten, included.sqlRowsWritten),
        formatCompact(billable(metrics.sqlRowsWritten, included.sqlRowsWritten)),
        1_000_000,
        PRICING.sqlRowsWrittenPricePerMillion,
        '$1.00 / 1M',
      ),
      makeLine(
        'SQL storage',
        billable(metrics.sqlStorageGb, included.sqlStorageGb),
        `${formatNumber(billable(metrics.sqlStorageGb, included.sqlStorageGb))} GB`,
        1,
        PRICING.sqlStoragePricePerGb,
        '$0.75 / GB',
      ),
      makeLine(
        'Queue operations',
        billable(metrics.queueOps, included.queueOps),
        formatCompact(billable(metrics.queueOps, included.queueOps)),
        1_000_000,
        PRICING.queueOpsPricePerMillion,
        '$0.40 / 1M',
      ),
      makeLine(
        'Stateful object requests',
        billable(metrics.statefulObjectRequests, included.statefulObjectRequests),
        formatCompact(billable(metrics.statefulObjectRequests, included.statefulObjectRequests)),
        1_000_000,
        PRICING.statefulObjectRequestPricePerMillion,
        '$0.15 / 1M',
      ),
      makeLine(
        'Stateful object duration',
        billable(metrics.statefulObjectGbSeconds, included.statefulObjectGbSeconds),
        `${formatCompact(billable(metrics.statefulObjectGbSeconds, included.statefulObjectGbSeconds))} GB-s`,
        1_000_000,
        PRICING.statefulObjectDurationPricePerMillionGbSeconds,
        '$12.50 / 1M GB-s',
      ),
      makeLine(
        'Stateful object storage',
        billable(metrics.statefulObjectStorageGb, included.statefulObjectStorageGb),
        `${formatNumber(billable(metrics.statefulObjectStorageGb, included.statefulObjectStorageGb))} GB`,
        1,
        PRICING.statefulObjectStoragePricePerGb,
        '$0.20 / GB',
      ),
      makeLine(
        'App logs',
        billable(metrics.logEvents, included.logEvents),
        formatCompact(billable(metrics.logEvents, included.logEvents)),
        1_000_000,
        PRICING.logsPricePerMillion,
        '$0.60 / 1M',
      ),
      makeLine(
        'W7S routing executions',
        billable(metrics.platformExecutions, included.platformExecutions),
        formatCompact(billable(metrics.platformExecutions, included.platformExecutions)),
        1_000_000,
        PRICING.runtimeRequestPricePerMillion,
        '$0.30 / 1M',
      ),
      makeLine(
        'W7S routing CPU',
        billable(metrics.platformCpuMs, included.platformCpuMs),
        `${formatCompact(billable(metrics.platformCpuMs, included.platformCpuMs))} ms`,
        1_000_000,
        PRICING.runtimeCpuPricePerMillionMs,
        '$0.02 / 1M ms',
      ),
      makeLine(
        'W7S usage guard reads',
        billable(metrics.usageGuardReads, included.usageGuardReads),
        formatCompact(billable(metrics.usageGuardReads, included.usageGuardReads)),
        1_000_000,
        PRICING.keyValueReadPricePerMillion,
        '$0.50 / 1M',
      ),
      makeLine(
        'W7S usage counter writes',
        billable(metrics.usageCounterWrites, included.usageCounterWrites),
        formatCompact(billable(metrics.usageCounterWrites, included.usageCounterWrites)),
        1_000_000,
        PRICING.keyValueWritePricePerMillion,
        '$5.00 / 1M',
      ),
    ];

    const operatingCost = operatingLines.reduce(
      (total, line) => total + lineCost(line),
      0,
    );
    const marginAmount = marginCost(operatingCost);
    const lines = [
      ...operatingLines,
      makeLine(
        'W7S operating margin',
        1,
        '50% gross margin',
        1,
        marginAmount,
        'price target',
      ),
    ];

    return {
      lines,
      monthlyVisitors: metrics.monthlyVisitors,
      pageViews: metrics.pageViews,
      staticAssetRequests: metrics.staticAssetRequests,
      backendRequests: metrics.backendRequests,
      runtimeRequests: metrics.runtimeRequests,
      runtimeCpuMs: metrics.runtimeCpuMs,
      queueMessages: metrics.queueMessages,
      statefulObjectRequests: metrics.statefulObjectRequests,
      usageCost: operatingCost,
      marginAmount,
      totalCost: operatingCost + marginAmount,
    };
  }, [inputs]);

  return (
    <section className={styles.calculator} aria-label="W7S monthly cost estimator">
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Interactive estimate</p>
          <h2>Pick a startup stage.</h2>
          <p>
            Each stage sets the sliders to a common startup shape. The first
            stage is the top of the included free tier, so it prices at zero.
          </p>
        </div>
        <div className={styles.totalPanel}>
          <span>Estimated monthly cost</span>
          <strong>{formatMoney(estimate.totalCost)}</strong>
          <small>
            Billable overage after the included free-tier baseline, W7S
            overhead, and 50% gross margin.
          </small>
        </div>
      </div>

      <div className={styles.profileGroup} role="group" aria-label="Startup stage">
        {STAGE_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            className={profile === id ? styles.profileButtonActive : styles.profileButton}
            aria-pressed={profile === id}
            onClick={() => selectProfile(id)}
          >
            {STAGE_LABELS[id]}
          </button>
        ))}
        <p className={styles.stageDescription}>{STAGE_DESCRIPTIONS[profile]}</p>
      </div>

      <div className={styles.summaryGrid}>
        <div>
          <span>Monthly visitors</span>
          <strong>{formatCompact(estimate.monthlyVisitors)}</strong>
        </div>
        <div>
          <span>Runtime requests</span>
          <strong>{formatCompact(estimate.runtimeRequests)}</strong>
        </div>
        <div>
          <span>Backend requests</span>
          <strong>{formatCompact(estimate.backendRequests)}</strong>
        </div>
        <div>
          <span>CPU time</span>
          <strong>{formatCompact(estimate.runtimeCpuMs)} ms</strong>
        </div>
      </div>

      <div className={styles.controlsGrid}>
        <SliderField
          id="visitorsPerDay"
          label="Visitors per day"
          help="Human visitors reaching the app each day."
          min={FREE_TIER_INPUTS.visitorsPerDay}
          max={100_000}
          step={100}
          value={inputs.visitorsPerDay}
          valueLabel={formatNumber(inputs.visitorsPerDay)}
          onChange={updateInput}
        />
        <SliderField
          id="pageViewsPerVisitor"
          label="Page views per visitor"
          help="Used to estimate HTML requests and asset delivery."
          min={FREE_TIER_INPUTS.pageViewsPerVisitor}
          max={20}
          step={1}
          value={inputs.pageViewsPerVisitor}
          valueLabel={formatNumber(inputs.pageViewsPerVisitor)}
          onChange={updateInput}
        />
        <SliderField
          id="staticAssetsPerPage"
          label="Static assets per page"
          help="Scripts, CSS files, images, fonts, and generated files."
          min={FREE_TIER_INPUTS.staticAssetsPerPage}
          max={80}
          step={1}
          value={inputs.staticAssetsPerPage}
          valueLabel={formatNumber(inputs.staticAssetsPerPage)}
          onChange={updateInput}
        />
        <SliderField
          id="backendRequestsPerPage"
          label="Backend requests per page"
          help="API calls or native backend routes triggered by each page view."
          min={FREE_TIER_INPUTS.backendRequestsPerPage}
          max={20}
          step={1}
          value={inputs.backendRequestsPerPage}
          valueLabel={formatNumber(inputs.backendRequestsPerPage)}
          onChange={updateInput}
        />
        <SliderField
          id="averageCpuMs"
          label="Average backend CPU"
          help="W7S caps backend CPU, but heavier handlers still cost more."
          min={FREE_TIER_INPUTS.averageCpuMs}
          max={200}
          step={1}
          value={inputs.averageCpuMs}
          valueLabel={`${formatNumber(inputs.averageCpuMs)} ms`}
          onChange={updateInput}
        />
        <SliderField
          id="staticCacheHitRate"
          label="Static cache hit rate"
          help="Higher cache hits reduce origin reads for immutable assets."
          min={FREE_TIER_INPUTS.staticCacheHitRate}
          max={100}
          step={1}
          value={inputs.staticCacheHitRate}
          valueLabel={`${formatNumber(inputs.staticCacheHitRate)}%`}
          onChange={updateInput}
        />
      </div>

      <details className={styles.advanced}>
        <summary>More infrastructure sliders</summary>
        <div className={styles.controlsGrid}>
          <SliderField
            id="keyValueReadsPerVisitor"
            label="Key-value reads per visitor"
            help="Sessions, feature flags, config, or cache lookups."
            min={FREE_TIER_INPUTS.keyValueReadsPerVisitor}
            max={100}
            step={1}
            value={inputs.keyValueReadsPerVisitor}
            valueLabel={formatNumber(inputs.keyValueReadsPerVisitor)}
            onChange={updateInput}
          />
          <SliderField
            id="keyValueWritesPer100Visitors"
            label="Key-value writes per 100 visitors"
            help="Light session or state writes."
            min={FREE_TIER_INPUTS.keyValueWritesPer100Visitors}
            max={100}
            step={1}
            value={inputs.keyValueWritesPer100Visitors}
            valueLabel={formatNumber(inputs.keyValueWritesPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="sqlRowsReadPerVisitor"
            label="SQL rows read per visitor"
            help="Rows scanned by queries, not just rows returned."
            min={FREE_TIER_INPUTS.sqlRowsReadPerVisitor}
            max={2_000}
            step={10}
            value={inputs.sqlRowsReadPerVisitor}
            valueLabel={formatNumber(inputs.sqlRowsReadPerVisitor)}
            onChange={updateInput}
          />
          <SliderField
            id="sqlRowsWrittenPer100Visitors"
            label="SQL rows written per 100 visitors"
            help="Inserts, updates, deletes, and index writes."
            min={FREE_TIER_INPUTS.sqlRowsWrittenPer100Visitors}
            max={1_000}
            step={1}
            value={inputs.sqlRowsWrittenPer100Visitors}
            valueLabel={formatNumber(inputs.sqlRowsWrittenPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="objectReadsPer100Visitors"
            label="Object reads per 100 visitors"
            help="App object reads outside the static asset cache."
            min={FREE_TIER_INPUTS.objectReadsPer100Visitors}
            max={1_000}
            step={1}
            value={inputs.objectReadsPer100Visitors}
            valueLabel={formatNumber(inputs.objectReadsPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="objectWritesPer100Visitors"
            label="Object writes per 100 visitors"
            help="Uploads or generated files written to object storage."
            min={FREE_TIER_INPUTS.objectWritesPer100Visitors}
            max={500}
            step={1}
            value={inputs.objectWritesPer100Visitors}
            valueLabel={formatNumber(inputs.objectWritesPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="queueMessagesPer100Visitors"
            label="Queue messages per 100 visitors"
            help="Each delivered message is roughly one write, one read, and one delete."
            min={FREE_TIER_INPUTS.queueMessagesPer100Visitors}
            max={500}
            step={1}
            value={inputs.queueMessagesPer100Visitors}
            valueLabel={formatNumber(inputs.queueMessagesPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="statefulObjectCallsPer100Visitors"
            label="Stateful object calls per 100 visitors"
            help="Stateful coordination, counters, rooms, locks, or sessions."
            min={FREE_TIER_INPUTS.statefulObjectCallsPer100Visitors}
            max={2_000}
            step={1}
            value={inputs.statefulObjectCallsPer100Visitors}
            valueLabel={formatNumber(inputs.statefulObjectCallsPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="statefulObjectActiveSecondsPerDay"
            label="Stateful object active seconds per day"
            help="Only active non-hibernated wall-clock time is estimated here."
            min={FREE_TIER_INPUTS.statefulObjectActiveSecondsPerDay}
            max={86_400}
            step={300}
            value={inputs.statefulObjectActiveSecondsPerDay}
            valueLabel={`${formatCompact(inputs.statefulObjectActiveSecondsPerDay)} sec`}
            onChange={updateInput}
          />
          <SliderField
            id="logEventsPerVisitor"
            label="Log events per visitor"
            help="Console logs and exceptions retained by W7S."
            min={FREE_TIER_INPUTS.logEventsPerVisitor}
            max={20}
            step={1}
            value={inputs.logEventsPerVisitor}
            valueLabel={formatNumber(inputs.logEventsPerVisitor)}
            onChange={updateInput}
          />
          <SliderField
            id="staticStorageGb"
            label="Static asset storage"
            help="Built frontend files and immutable deploy assets."
            min={FREE_TIER_INPUTS.staticStorageGb}
            max={500}
            step={1}
            value={inputs.staticStorageGb}
            valueLabel={`${formatNumber(inputs.staticStorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="objectStorageGb"
            label="App object storage"
            help="User uploads, generated files, or blobs."
            min={FREE_TIER_INPUTS.objectStorageGb}
            max={10_000}
            step={10}
            value={inputs.objectStorageGb}
            valueLabel={`${formatNumber(inputs.objectStorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="keyValueStorageGb"
            label="Key-value storage"
            help="Key-value data stored by the app."
            min={FREE_TIER_INPUTS.keyValueStorageGb}
            max={100}
            step={1}
            value={inputs.keyValueStorageGb}
            valueLabel={`${formatNumber(inputs.keyValueStorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="sqlStorageGb"
            label="SQL storage"
            help="SQLite-backed relational data."
            min={FREE_TIER_INPUTS.sqlStorageGb}
            max={500}
            step={1}
            value={inputs.sqlStorageGb}
            valueLabel={`${formatNumber(inputs.sqlStorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="statefulObjectStorageGb"
            label="Stateful object storage"
            help="SQLite-backed stateful object data."
            min={FREE_TIER_INPUTS.statefulObjectStorageGb}
            max={500}
            step={1}
            value={inputs.statefulObjectStorageGb}
            valueLabel={`${formatNumber(inputs.statefulObjectStorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="runtimeScripts"
            label="Deployed runtimes"
            help="Usually one script per deployed backend/environment."
            min={FREE_TIER_INPUTS.runtimeScripts}
            max={5_000}
            step={1}
            value={inputs.runtimeScripts}
            valueLabel={formatNumber(inputs.runtimeScripts)}
            onChange={updateInput}
          />
        </div>
      </details>

      <div className={styles.breakdown}>
        <h3>Monthly breakdown</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Area</th>
                <th>Billable usage</th>
                <th>Rate</th>
                <th>Estimate</th>
              </tr>
            </thead>
            <tbody>
              {estimate.lines.map((line) => (
                <tr key={line.label}>
                  <td>{line.label}</td>
                  <td>{line.usageLabel}</td>
                  <td>{line.priceLabel}</td>
                  <td>{formatMoney(lineCost(line))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className={styles.disclaimer}>
        This is a planning estimate, not a bill. It subtracts the included
        free-tier baseline first, estimates app usage plus W7S routing and
        usage-accounting overhead, then applies a 50% gross margin to the
        billable overage; actual hosted W7S pricing can differ.
      </p>
    </section>
  );
}
