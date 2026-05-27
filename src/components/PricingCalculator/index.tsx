import React, {useMemo, useState} from 'react';
import styles from './styles.module.css';

type Inputs = {
  visitorsPerDay: number;
  pageViewsPerVisitor: number;
  staticAssetsPerPage: number;
  backendRequestsPerPage: number;
  averageCpuMs: number;
  staticCacheHitRate: number;
  kvReadsPerVisitor: number;
  kvWritesPer100Visitors: number;
  d1RowsReadPerVisitor: number;
  d1RowsWrittenPer100Visitors: number;
  r2ReadsPer100Visitors: number;
  r2WritesPer100Visitors: number;
  queueMessagesPer100Visitors: number;
  durableObjectCallsPer100Visitors: number;
  durableObjectActiveSecondsPerDay: number;
  logEventsPerVisitor: number;
  staticStorageGb: number;
  kvStorageGb: number;
  d1StorageGb: number;
  r2StorageGb: number;
  durableObjectStorageGb: number;
  workerScripts: number;
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

const PRICING = {
  wfpRequestPricePerMillion: 0.3,
  wfpCpuPricePerMillionMs: 0.02,
  wfpScriptPrice: 0.02,
  r2StoragePricePerGb: 0.015,
  r2ClassAPricePerMillion: 4.5,
  r2ClassBPricePerMillion: 0.36,
  kvReadPricePerMillion: 0.5,
  kvWritePricePerMillion: 5,
  kvStoragePricePerGb: 0.5,
  d1RowsReadPricePerMillion: 0.001,
  d1RowsWrittenPricePerMillion: 1,
  d1StoragePricePerGb: 0.75,
  queueOpsPricePerMillion: 0.4,
  durableObjectRequestPricePerMillion: 0.15,
  durableObjectDurationPricePerMillionGbSeconds: 12.5,
  durableObjectStoragePricePerGb: 0.2,
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
    kvReadsPerVisitor: 0,
    kvWritesPer100Visitors: 0,
    d1RowsReadPerVisitor: 0,
    d1RowsWrittenPer100Visitors: 0,
    r2ReadsPer100Visitors: 0,
    r2WritesPer100Visitors: 0,
    queueMessagesPer100Visitors: 0,
    durableObjectCallsPer100Visitors: 0,
    durableObjectActiveSecondsPerDay: 0,
    logEventsPerVisitor: 0,
    staticStorageGb: 1,
    kvStorageGb: 0,
    d1StorageGb: 0,
    r2StorageGb: 0,
    durableObjectStorageGb: 0,
    workerScripts: 1,
  },
  fullstack: {
    visitorsPerDay: 10_000,
    pageViewsPerVisitor: 2,
    staticAssetsPerPage: 10,
    backendRequestsPerPage: 1.5,
    averageCpuMs: 8,
    staticCacheHitRate: 90,
    kvReadsPerVisitor: 1,
    kvWritesPer100Visitors: 2,
    d1RowsReadPerVisitor: 30,
    d1RowsWrittenPer100Visitors: 2,
    r2ReadsPer100Visitors: 0,
    r2WritesPer100Visitors: 0,
    queueMessagesPer100Visitors: 1,
    durableObjectCallsPer100Visitors: 0,
    durableObjectActiveSecondsPerDay: 0,
    logEventsPerVisitor: 0.4,
    staticStorageGb: 2,
    kvStorageGb: 0.2,
    d1StorageGb: 1,
    r2StorageGb: 0,
    durableObjectStorageGb: 0,
    workerScripts: 1,
  },
  data: {
    visitorsPerDay: 50_000,
    pageViewsPerVisitor: 3,
    staticAssetsPerPage: 10,
    backendRequestsPerPage: 3,
    averageCpuMs: 14,
    staticCacheHitRate: 88,
    kvReadsPerVisitor: 2,
    kvWritesPer100Visitors: 10,
    d1RowsReadPerVisitor: 120,
    d1RowsWrittenPer100Visitors: 15,
    r2ReadsPer100Visitors: 10,
    r2WritesPer100Visitors: 1,
    queueMessagesPer100Visitors: 8,
    durableObjectCallsPer100Visitors: 2,
    durableObjectActiveSecondsPerDay: 1_200,
    logEventsPerVisitor: 1,
    staticStorageGb: 5,
    kvStorageGb: 1,
    d1StorageGb: 8,
    r2StorageGb: 50,
    durableObjectStorageGb: 1,
    workerScripts: 4,
  },
  realtime: {
    visitorsPerDay: 100_000,
    pageViewsPerVisitor: 4,
    staticAssetsPerPage: 8,
    backendRequestsPerPage: 4,
    averageCpuMs: 18,
    staticCacheHitRate: 85,
    kvReadsPerVisitor: 2,
    kvWritesPer100Visitors: 20,
    d1RowsReadPerVisitor: 80,
    d1RowsWrittenPer100Visitors: 20,
    r2ReadsPer100Visitors: 5,
    r2WritesPer100Visitors: 1,
    queueMessagesPer100Visitors: 20,
    durableObjectCallsPer100Visitors: 40,
    durableObjectActiveSecondsPerDay: 28_800,
    logEventsPerVisitor: 1.5,
    staticStorageGb: 6,
    kvStorageGb: 2,
    d1StorageGb: 12,
    r2StorageGb: 100,
    durableObjectStorageGb: 4,
    workerScripts: 8,
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
    const durableObjectRequests = (monthlyVisitors * inputs.durableObjectCallsPer100Visitors) / 100;
    const r2AppReads = (monthlyVisitors * inputs.r2ReadsPer100Visitors) / 100;
    const r2AppWrites = (monthlyVisitors * inputs.r2WritesPer100Visitors) / 100;
    const cacheMissRatio = Math.max(0, Math.min(100, 100 - inputs.staticCacheHitRate)) / 100;
    const staticR2Reads = staticAssetRequests * cacheMissRatio;
    const kvReads = monthlyVisitors * inputs.kvReadsPerVisitor;
    const kvWrites = (monthlyVisitors * inputs.kvWritesPer100Visitors) / 100;
    const d1RowsRead = monthlyVisitors * inputs.d1RowsReadPerVisitor;
    const d1RowsWritten = (monthlyVisitors * inputs.d1RowsWrittenPer100Visitors) / 100;
    const queueOps = queueMessages * 3;
    const logEvents = monthlyVisitors * inputs.logEventsPerVisitor;
    const workerRequests =
      pageViews +
      staticAssetRequests +
      backendRequests +
      queueMessages +
      durableObjectRequests;
    const workerCpuMs =
      pageViews * 0.25 +
      staticAssetRequests * 0.1 +
      backendRequests * inputs.averageCpuMs +
      queueMessages * Math.max(1, inputs.averageCpuMs * 0.5) +
      durableObjectRequests * Math.max(1, inputs.averageCpuMs * 0.25);
    const durableObjectGbSeconds =
      inputs.durableObjectActiveSecondsPerDay * DAYS_PER_MONTH * 0.125;
    const r2StorageGb = inputs.staticStorageGb + inputs.r2StorageGb;
    const r2ClassB = staticR2Reads + r2AppReads;
    const r2ClassA = r2AppWrites;

    const lines = [
      makeLine(
        'Workers for Platforms requests',
        workerRequests,
        formatCompact(workerRequests),
        1_000_000,
        PRICING.wfpRequestPricePerMillion,
        '$0.30 / 1M',
      ),
      makeLine(
        'Workers for Platforms CPU',
        workerCpuMs,
        `${formatCompact(workerCpuMs)} ms`,
        1_000_000,
        PRICING.wfpCpuPricePerMillionMs,
        '$0.02 / 1M ms',
      ),
      makeLine(
        'Workers for Platforms scripts',
        inputs.workerScripts,
        formatNumber(inputs.workerScripts),
        1,
        PRICING.wfpScriptPrice,
        '$0.02 / script',
      ),
      makeLine(
        'R2 storage',
        r2StorageGb,
        `${formatDecimal(r2StorageGb)} GB`,
        1,
        PRICING.r2StoragePricePerGb,
        '$0.015 / GB',
      ),
      makeLine(
        'R2 Class A',
        r2ClassA,
        formatCompact(r2ClassA),
        1_000_000,
        PRICING.r2ClassAPricePerMillion,
        '$4.50 / 1M',
      ),
      makeLine(
        'R2 Class B',
        r2ClassB,
        formatCompact(r2ClassB),
        1_000_000,
        PRICING.r2ClassBPricePerMillion,
        '$0.36 / 1M',
      ),
      makeLine(
        'KV reads',
        kvReads,
        formatCompact(kvReads),
        1_000_000,
        PRICING.kvReadPricePerMillion,
        '$0.50 / 1M',
      ),
      makeLine(
        'KV writes',
        kvWrites,
        formatCompact(kvWrites),
        1_000_000,
        PRICING.kvWritePricePerMillion,
        '$5.00 / 1M',
      ),
      makeLine(
        'KV storage',
        inputs.kvStorageGb,
        `${formatDecimal(inputs.kvStorageGb)} GB`,
        1,
        PRICING.kvStoragePricePerGb,
        '$0.50 / GB',
      ),
      makeLine(
        'D1 rows read',
        d1RowsRead,
        formatCompact(d1RowsRead),
        1_000_000,
        PRICING.d1RowsReadPricePerMillion,
        '$0.001 / 1M',
      ),
      makeLine(
        'D1 rows written',
        d1RowsWritten,
        formatCompact(d1RowsWritten),
        1_000_000,
        PRICING.d1RowsWrittenPricePerMillion,
        '$1.00 / 1M',
      ),
      makeLine(
        'D1 storage',
        inputs.d1StorageGb,
        `${formatDecimal(inputs.d1StorageGb)} GB`,
        1,
        PRICING.d1StoragePricePerGb,
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
        'Durable Object requests',
        durableObjectRequests,
        formatCompact(durableObjectRequests),
        1_000_000,
        PRICING.durableObjectRequestPricePerMillion,
        '$0.15 / 1M',
      ),
      makeLine(
        'Durable Object duration',
        durableObjectGbSeconds,
        `${formatCompact(durableObjectGbSeconds)} GB-s`,
        1_000_000,
        PRICING.durableObjectDurationPricePerMillionGbSeconds,
        '$12.50 / 1M GB-s',
      ),
      makeLine(
        'Durable Object storage',
        inputs.durableObjectStorageGb,
        `${formatDecimal(inputs.durableObjectStorageGb)} GB`,
        1,
        PRICING.durableObjectStoragePricePerGb,
        '$0.20 / GB',
      ),
      makeLine(
        'Worker logs',
        logEvents,
        formatCompact(logEvents),
        1_000_000,
        PRICING.logsPricePerMillion,
        '$0.60 / 1M',
      ),
    ];

    const usageCost = lines.reduce(
      (total, line) => total + lineCost(line),
      0,
    );

    return {
      lines,
      monthlyVisitors,
      pageViews,
      staticAssetRequests,
      backendRequests,
      workerRequests,
      workerCpuMs,
      queueMessages,
      durableObjectRequests,
      usageCost,
      totalCost: usageCost,
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
            Raw usage estimate without included/free-tier allowances.
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
          <span>Worker requests</span>
          <strong>{formatCompact(estimate.workerRequests)}</strong>
        </div>
        <div>
          <span>Backend requests</span>
          <strong>{formatCompact(estimate.backendRequests)}</strong>
        </div>
        <div>
          <span>CPU time</span>
          <strong>{formatCompact(estimate.workerCpuMs)} ms</strong>
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
          help="W7S caps user Worker CPU, but heavier handlers still cost more."
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
          help="Higher cache hits reduce R2 Class B reads for immutable assets."
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
            id="kvReadsPerVisitor"
            label="KV reads per visitor"
            help="Sessions, feature flags, config, or cache lookups."
            min={0}
            max={100}
            step={1}
            value={inputs.kvReadsPerVisitor}
            valueLabel={formatNumber(inputs.kvReadsPerVisitor)}
            onChange={updateInput}
          />
          <SliderField
            id="kvWritesPer100Visitors"
            label="KV writes per 100 visitors"
            help="Light session or state writes."
            min={0}
            max={100}
            step={1}
            value={inputs.kvWritesPer100Visitors}
            valueLabel={formatNumber(inputs.kvWritesPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="d1RowsReadPerVisitor"
            label="D1 rows read per visitor"
            help="Rows scanned by queries, not just rows returned."
            min={0}
            max={2_000}
            step={10}
            value={inputs.d1RowsReadPerVisitor}
            valueLabel={formatNumber(inputs.d1RowsReadPerVisitor)}
            onChange={updateInput}
          />
          <SliderField
            id="d1RowsWrittenPer100Visitors"
            label="D1 rows written per 100 visitors"
            help="Inserts, updates, deletes, and index writes."
            min={0}
            max={1_000}
            step={1}
            value={inputs.d1RowsWrittenPer100Visitors}
            valueLabel={formatNumber(inputs.d1RowsWrittenPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="r2ReadsPer100Visitors"
            label="R2 reads per 100 visitors"
            help="App object reads outside the static asset cache."
            min={0}
            max={1_000}
            step={5}
            value={inputs.r2ReadsPer100Visitors}
            valueLabel={formatNumber(inputs.r2ReadsPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="r2WritesPer100Visitors"
            label="R2 writes per 100 visitors"
            help="Uploads or generated files written to R2."
            min={0}
            max={500}
            step={1}
            value={inputs.r2WritesPer100Visitors}
            valueLabel={formatNumber(inputs.r2WritesPer100Visitors)}
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
            id="durableObjectCallsPer100Visitors"
            label="Durable Object calls per 100 visitors"
            help="Stateful coordination, counters, rooms, locks, or sessions."
            min={0}
            max={2_000}
            step={1}
            value={inputs.durableObjectCallsPer100Visitors}
            valueLabel={formatNumber(inputs.durableObjectCallsPer100Visitors)}
            onChange={updateInput}
          />
          <SliderField
            id="durableObjectActiveSecondsPerDay"
            label="Durable Object active seconds per day"
            help="Only active non-hibernated wall-clock time is estimated here."
            min={0}
            max={86_400}
            step={300}
            value={inputs.durableObjectActiveSecondsPerDay}
            valueLabel={`${formatCompact(inputs.durableObjectActiveSecondsPerDay)} sec`}
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
            id="r2StorageGb"
            label="App R2 storage"
            help="User uploads, generated files, or blobs."
            min={0}
            max={10_000}
            step={10}
            value={inputs.r2StorageGb}
            valueLabel={`${formatNumber(inputs.r2StorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="kvStorageGb"
            label="KV storage"
            help="Key-value data stored by the app."
            min={0}
            max={100}
            step={0.1}
            value={inputs.kvStorageGb}
            valueLabel={`${formatDecimal(inputs.kvStorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="d1StorageGb"
            label="D1 storage"
            help="SQLite-backed relational data."
            min={0}
            max={500}
            step={1}
            value={inputs.d1StorageGb}
            valueLabel={`${formatNumber(inputs.d1StorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="durableObjectStorageGb"
            label="Durable Object storage"
            help="SQLite-backed Durable Object data."
            min={0}
            max={500}
            step={1}
            value={inputs.durableObjectStorageGb}
            valueLabel={`${formatNumber(inputs.durableObjectStorageGb)} GB`}
            onChange={updateInput}
          />
          <SliderField
            id="workerScripts"
            label="Deployed Worker scripts"
            help="Usually one script per deployed backend/environment."
            min={1}
            max={5_000}
            step={1}
            value={inputs.workerScripts}
            valueLabel={formatNumber(inputs.workerScripts)}
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
        This is a planning estimate, not a bill. It applies published usage
        rates to the selected traffic shape without subtracting included or
        free-tier allowances; actual hosted W7S pricing can differ.
      </p>
    </section>
  );
}
