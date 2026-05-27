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

type ProfileId = 'static' | 'fullstack' | 'data' | 'realtime';

type CostLine = {
  label: string;
  usage: number;
  usageLabel: string;
  unitSize: number;
  unitPrice: number;
  priceLabel: string;
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

const PROFILE_VALUES: Record<ProfileId, Inputs> = {
  static: {
    visitorsPerDay: 5_000,
    pageViewsPerVisitor: 2,
    staticAssetsPerPage: 12,
    backendRequestsPerPage: 0,
    averageCpuMs: 1,
    staticCacheHitRate: 95,
    keyValueReadsPerVisitor: 0,
    keyValueWritesPer100Visitors: 0,
    sqlRowsReadPerVisitor: 0,
    sqlRowsWrittenPer100Visitors: 0,
    objectReadsPer100Visitors: 0,
    objectWritesPer100Visitors: 0,
    queueMessagesPer100Visitors: 0,
    statefulObjectCallsPer100Visitors: 0,
    statefulObjectActiveSecondsPerDay: 0,
    logEventsPerVisitor: 0,
    staticStorageGb: 1,
    keyValueStorageGb: 0,
    sqlStorageGb: 0,
    objectStorageGb: 0,
    statefulObjectStorageGb: 0,
    runtimeScripts: 1,
  },
  fullstack: {
    visitorsPerDay: 10_000,
    pageViewsPerVisitor: 2,
    staticAssetsPerPage: 10,
    backendRequestsPerPage: 1.5,
    averageCpuMs: 8,
    staticCacheHitRate: 90,
    keyValueReadsPerVisitor: 1,
    keyValueWritesPer100Visitors: 2,
    sqlRowsReadPerVisitor: 30,
    sqlRowsWrittenPer100Visitors: 2,
    objectReadsPer100Visitors: 0,
    objectWritesPer100Visitors: 0,
    queueMessagesPer100Visitors: 1,
    statefulObjectCallsPer100Visitors: 0,
    statefulObjectActiveSecondsPerDay: 0,
    logEventsPerVisitor: 0.4,
    staticStorageGb: 2,
    keyValueStorageGb: 0.2,
    sqlStorageGb: 1,
    objectStorageGb: 0,
    statefulObjectStorageGb: 0,
    runtimeScripts: 1,
  },
  data: {
    visitorsPerDay: 50_000,
    pageViewsPerVisitor: 3,
    staticAssetsPerPage: 10,
    backendRequestsPerPage: 3,
    averageCpuMs: 14,
    staticCacheHitRate: 88,
    keyValueReadsPerVisitor: 2,
    keyValueWritesPer100Visitors: 10,
    sqlRowsReadPerVisitor: 120,
    sqlRowsWrittenPer100Visitors: 15,
    objectReadsPer100Visitors: 10,
    objectWritesPer100Visitors: 1,
    queueMessagesPer100Visitors: 8,
    statefulObjectCallsPer100Visitors: 2,
    statefulObjectActiveSecondsPerDay: 1_200,
    logEventsPerVisitor: 1,
    staticStorageGb: 5,
    keyValueStorageGb: 1,
    sqlStorageGb: 8,
    objectStorageGb: 50,
    statefulObjectStorageGb: 1,
    runtimeScripts: 4,
  },
  realtime: {
    visitorsPerDay: 100_000,
    pageViewsPerVisitor: 4,
    staticAssetsPerPage: 8,
    backendRequestsPerPage: 4,
    averageCpuMs: 18,
    staticCacheHitRate: 85,
    keyValueReadsPerVisitor: 2,
    keyValueWritesPer100Visitors: 20,
    sqlRowsReadPerVisitor: 80,
    sqlRowsWrittenPer100Visitors: 20,
    objectReadsPer100Visitors: 5,
    objectWritesPer100Visitors: 1,
    queueMessagesPer100Visitors: 20,
    statefulObjectCallsPer100Visitors: 40,
    statefulObjectActiveSecondsPerDay: 28_800,
    logEventsPerVisitor: 1.5,
    staticStorageGb: 6,
    keyValueStorageGb: 2,
    sqlStorageGb: 12,
    objectStorageGb: 100,
    statefulObjectStorageGb: 4,
    runtimeScripts: 8,
  },
};

const PROFILE_LABELS: Record<ProfileId, string> = {
  static: 'Static',
  fullstack: 'Full-stack',
  data: 'Data app',
  realtime: 'Realtime',
};

const numberFormatter = new Intl.NumberFormat('en-US');
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const decimalFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
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

const formatDecimal = (value: number) => decimalFormatter.format(value);

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
  const [profile, setProfile] = useState<ProfileId>('fullstack');
  const [inputs, setInputs] = useState<Inputs>(PROFILE_VALUES.fullstack);

  const updateInput = (id: keyof Inputs, value: number) => {
    setInputs((current) => ({...current, [id]: value}));
  };

  const selectProfile = (nextProfile: ProfileId) => {
    setProfile(nextProfile);
    setInputs(PROFILE_VALUES[nextProfile]);
  };

  const estimate = useMemo(() => {
    const monthlyVisitors = inputs.visitorsPerDay * DAYS_PER_MONTH;
    const pageViews = monthlyVisitors * inputs.pageViewsPerVisitor;
    const staticAssetRequests = pageViews * inputs.staticAssetsPerPage;
    const backendRequests = pageViews * inputs.backendRequestsPerPage;
    const queueMessages = (monthlyVisitors * inputs.queueMessagesPer100Visitors) / 100;
    const statefulObjectRequests = (monthlyVisitors * inputs.statefulObjectCallsPer100Visitors) / 100;
    const objectAppReads = (monthlyVisitors * inputs.objectReadsPer100Visitors) / 100;
    const objectAppWrites = (monthlyVisitors * inputs.objectWritesPer100Visitors) / 100;
    const cacheMissRatio = Math.max(0, Math.min(100, 100 - inputs.staticCacheHitRate)) / 100;
    const staticObjectReads = staticAssetRequests * cacheMissRatio;
    const keyValueReads = monthlyVisitors * inputs.keyValueReadsPerVisitor;
    const keyValueWrites = (monthlyVisitors * inputs.keyValueWritesPer100Visitors) / 100;
    const sqlRowsRead = monthlyVisitors * inputs.sqlRowsReadPerVisitor;
    const sqlRowsWritten = (monthlyVisitors * inputs.sqlRowsWrittenPer100Visitors) / 100;
    const queueOps = queueMessages * 3;
    const logEvents = monthlyVisitors * inputs.logEventsPerVisitor;
    const runtimeRequests =
      pageViews +
      staticAssetRequests +
      backendRequests +
      queueMessages +
      statefulObjectRequests;
    const runtimeCpuMs =
      pageViews * 0.25 +
      staticAssetRequests * 0.1 +
      backendRequests * inputs.averageCpuMs +
      queueMessages * Math.max(1, inputs.averageCpuMs * 0.5) +
      statefulObjectRequests * Math.max(1, inputs.averageCpuMs * 0.25);
    const statefulObjectGbSeconds =
      inputs.statefulObjectActiveSecondsPerDay * DAYS_PER_MONTH * 0.125;
    const objectStorageGb = inputs.staticStorageGb + inputs.objectStorageGb;
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

    const operatingLines = [
      makeLine(
        'Runtime requests',
        runtimeRequests,
        formatCompact(runtimeRequests),
        1_000_000,
        PRICING.runtimeRequestPricePerMillion,
        '$0.30 / 1M',
      ),
      makeLine(
        'Runtime CPU',
        runtimeCpuMs,
        `${formatCompact(runtimeCpuMs)} ms`,
        1_000_000,
        PRICING.runtimeCpuPricePerMillionMs,
        '$0.02 / 1M ms',
      ),
      makeLine(
        'Deployed runtimes',
        inputs.runtimeScripts,
        formatNumber(inputs.runtimeScripts),
        1,
        PRICING.runtimeScriptPrice,
        '$0.02 / runtime',
      ),
      makeLine(
        'Asset and object storage',
        objectStorageGb,
        `${formatDecimal(objectStorageGb)} GB`,
        1,
        PRICING.objectStoragePricePerGb,
        '$0.015 / GB',
      ),
      makeLine(
        'Object write operations',
        objectWriteOperations,
        formatCompact(objectWriteOperations),
        1_000_000,
        PRICING.objectWriteOperationsPricePerMillion,
        '$4.50 / 1M',
      ),
      makeLine(
        'Object read operations',
        objectReadOperations,
        formatCompact(objectReadOperations),
        1_000_000,
        PRICING.objectReadOperationsPricePerMillion,
        '$0.36 / 1M',
      ),
      makeLine(
        'Key-value reads',
        keyValueReads,
        formatCompact(keyValueReads),
        1_000_000,
        PRICING.keyValueReadPricePerMillion,
        '$0.50 / 1M',
      ),
      makeLine(
        'Key-value writes',
        keyValueWrites,
        formatCompact(keyValueWrites),
        1_000_000,
        PRICING.keyValueWritePricePerMillion,
        '$5.00 / 1M',
      ),
      makeLine(
        'Key-value storage',
        inputs.keyValueStorageGb,
        `${formatDecimal(inputs.keyValueStorageGb)} GB`,
        1,
        PRICING.keyValueStoragePricePerGb,
        '$0.50 / GB',
      ),
      makeLine(
        'SQL rows read',
        sqlRowsRead,
        formatCompact(sqlRowsRead),
        1_000_000,
        PRICING.sqlRowsReadPricePerMillion,
        '$0.001 / 1M',
      ),
      makeLine(
        'SQL rows written',
        sqlRowsWritten,
        formatCompact(sqlRowsWritten),
        1_000_000,
        PRICING.sqlRowsWrittenPricePerMillion,
        '$1.00 / 1M',
      ),
      makeLine(
        'SQL storage',
        inputs.sqlStorageGb,
        `${formatDecimal(inputs.sqlStorageGb)} GB`,
        1,
        PRICING.sqlStoragePricePerGb,
        '$0.75 / GB',
      ),
      makeLine(
        'Queue operations',
        queueOps,
        formatCompact(queueOps),
        1_000_000,
        PRICING.queueOpsPricePerMillion,
        '$0.40 / 1M',
      ),
      makeLine(
        'Stateful object requests',
        statefulObjectRequests,
        formatCompact(statefulObjectRequests),
        1_000_000,
        PRICING.statefulObjectRequestPricePerMillion,
        '$0.15 / 1M',
      ),
      makeLine(
        'Stateful object duration',
        statefulObjectGbSeconds,
        `${formatCompact(statefulObjectGbSeconds)} GB-s`,
        1_000_000,
        PRICING.statefulObjectDurationPricePerMillionGbSeconds,
        '$12.50 / 1M GB-s',
      ),
      makeLine(
        'Stateful object storage',
        inputs.statefulObjectStorageGb,
        `${formatDecimal(inputs.statefulObjectStorageGb)} GB`,
        1,
        PRICING.statefulObjectStoragePricePerGb,
        '$0.20 / GB',
      ),
      makeLine(
        'App logs',
        logEvents,
        formatCompact(logEvents),
        1_000_000,
        PRICING.logsPricePerMillion,
        '$0.60 / 1M',
      ),
      makeLine(
        'W7S routing executions',
        platformExecutions,
        formatCompact(platformExecutions),
        1_000_000,
        PRICING.runtimeRequestPricePerMillion,
        '$0.30 / 1M',
      ),
      makeLine(
        'W7S routing CPU',
        platformCpuMs,
        `${formatCompact(platformCpuMs)} ms`,
        1_000_000,
        PRICING.runtimeCpuPricePerMillionMs,
        '$0.02 / 1M ms',
      ),
      makeLine(
        'W7S usage guard reads',
        usageGuardReads,
        formatCompact(usageGuardReads),
        1_000_000,
        PRICING.keyValueReadPricePerMillion,
        '$0.50 / 1M',
      ),
      makeLine(
        'W7S usage counter writes',
        usageCounterWrites,
        formatCompact(usageCounterWrites),
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
      monthlyVisitors,
      pageViews,
      staticAssetRequests,
      backendRequests,
      runtimeRequests,
      runtimeCpuMs,
      queueMessages,
      statefulObjectRequests,
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
          <h2>Move the traffic slider first.</h2>
          <p>
            Start with visitors per day, then open the infrastructure sliders when
            the app needs storage, queues, logs, or stateful backends.
          </p>
        </div>
        <div className={styles.totalPanel}>
          <span>Estimated monthly cost</span>
          <strong>{formatMoney(estimate.totalCost)}</strong>
          <small>
            Includes W7S overhead and 50% gross margin.
          </small>
        </div>
      </div>

      <div className={styles.profileGroup} role="group" aria-label="App profile">
        {(Object.keys(PROFILE_VALUES) as ProfileId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={profile === id ? styles.profileButtonActive : styles.profileButton}
            aria-pressed={profile === id}
            onClick={() => selectProfile(id)}
          >
            {PROFILE_LABELS[id]}
          </button>
        ))}
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
          min={0}
          max={100_000}
          step={1_000}
          value={inputs.visitorsPerDay}
          valueLabel={formatNumber(inputs.visitorsPerDay)}
          onChange={updateInput}
        />
        <SliderField
          id="pageViewsPerVisitor"
          label="Page views per visitor"
          help="Used to estimate HTML requests and asset delivery."
          min={1}
          max={20}
          step={0.5}
          value={inputs.pageViewsPerVisitor}
          valueLabel={formatDecimal(inputs.pageViewsPerVisitor)}
          onChange={updateInput}
        />
        <SliderField
          id="staticAssetsPerPage"
          label="Static assets per page"
          help="Scripts, CSS files, images, fonts, and generated files."
          min={0}
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
          min={0}
          max={20}
          step={0.25}
          value={inputs.backendRequestsPerPage}
          valueLabel={formatDecimal(inputs.backendRequestsPerPage)}
          onChange={updateInput}
        />
        <SliderField
          id="averageCpuMs"
          label="Average backend CPU"
          help="W7S caps backend CPU, but heavier handlers still cost more."
          min={1}
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
          min={0}
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
            min={0}
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
            min={0}
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
            min={0}
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
            min={0}
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
            min={0}
            max={1_000}
            step={5}
            value={inputs.objectReadsPer100Visitors}
            valueLabel={formatNumber(inputs.objectReadsPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="objectWritesPer100Visitors"
            label="Object writes per 100 visitors"
            help="Uploads or generated files written to object storage."
            min={0}
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
            min={0}
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
            min={0}
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
            min={0}
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
            min={0}
            max={20}
            step={0.1}
            value={inputs.logEventsPerVisitor}
            valueLabel={formatDecimal(inputs.logEventsPerVisitor)}
            onChange={updateInput}
          />
          <SliderField
            id="staticStorageGb"
            label="Static asset storage"
            help="Built frontend files and immutable deploy assets."
            min={0}
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
            min={0}
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
            min={0}
            max={100}
            step={0.1}
            value={inputs.keyValueStorageGb}
            valueLabel={`${formatDecimal(inputs.keyValueStorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="sqlStorageGb"
            label="SQL storage"
            help="SQLite-backed relational data."
            min={0}
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
            min={0}
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
            min={1}
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
                <th>Usage</th>
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
        This is a planning estimate, not a bill. It estimates app usage, W7S
        routing and usage-accounting overhead, then applies a 50% gross margin
        without subtracting included or free-tier allowances; actual hosted W7S
        pricing can differ.
      </p>
    </section>
  );
}
