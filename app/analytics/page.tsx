"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpDown, Calendar, Clock, Download, Star } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type TrendPoint = { day: string; value: number; lower: number; upper: number; range: [number, number] };

const TREND: TrendPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 42 + 18 * Math.sin(i / 4.5) + i * 0.6;
  const value = Math.round(base);
  const lower = Math.round(base - 7);
  const upper = Math.round(base + 7);
  return { day: `D${i + 1}`, value, lower, upper, range: [lower, upper] };
});

const PIE_VALUES = [38, 24, 17, 13, 8];
const PIE_CELL_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--foreground))",
];
const PIE_LEGEND_CLASSES = ["bg-primary", "bg-accent", "bg-secondary", "bg-muted-foreground", "bg-foreground"];

type CampaignStatus = "Active" | "Paused" | "Completed";
type CampaignRow = {
  id: string;
  name: string;
  source: string;
  clicks: number;
  conversions: number;
  revenue: number;
  status: CampaignStatus;
};

const CAMPAIGNS: CampaignRow[] = [
  { id: "c1", name: "Spring Launch", source: "Paid Search", clicks: 18420, conversions: 742, revenue: 48210, status: "Active" },
  { id: "c2", name: "Retarget Pro", source: "Paid Social", clicks: 9650, conversions: 388, revenue: 21560, status: "Active" },
  { id: "c3", name: "Newsletter Drip", source: "Email", clicks: 14200, conversions: 910, revenue: 33780, status: "Completed" },
  { id: "c4", name: "Partner Referral", source: "Referral", clicks: 5230, conversions: 201, revenue: 12040, status: "Paused" },
  { id: "c5", name: "Organic Content", source: "Organic Search", clicks: 22310, conversions: 1180, revenue: 52990, status: "Active" },
  { id: "c6", name: "Influencer Push", source: "Social", clicks: 7840, conversions: 290, revenue: 15870, status: "Completed" },
];

const PRESET_DAYS = [1, 7, 30, 90];
const PAGE_SIZE = 4;

type SortKey = "name" | "source" | "clicks" | "conversions" | "revenue" | "status";

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

function statusTone(status: CampaignStatus): string {
  if (status === "Active") return "bg-primary text-primary-foreground";
  if (status === "Paused") return "bg-muted text-muted-foreground";
  return "bg-secondary text-foreground";
}

export default function AnalyticsPage() {
  const t = useTranslations();

  const headerStats = (Array.isArray(t.raw("analytics.header.stats")) ? t.raw("analytics.header.stats") : []) as {
    label: string;
  }[];
  const presets = (Array.isArray(t.raw("analytics.filters.presets")) ? t.raw("analytics.filters.presets") : []) as string[];
  const pieSegments = (Array.isArray(t.raw("analytics.charts.pieSegments")) ? t.raw("analytics.charts.pieSegments") : []) as {
    label: string;
  }[];

  const PIE_DATA = pieSegments.map((seg, i) => ({ name: seg.label, value: PIE_VALUES[i] ?? 0 }));

  const firstValue = TREND[0]?.value ?? 0;
  const lastTrendPoint = TREND[TREND.length - 1];
  const lastValue = lastTrendPoint?.value ?? 0;
  const avgValue = Math.round(TREND.reduce((sum, p) => sum + p.value, 0) / TREND.length);
  const peakValue = Math.max(...TREND.map((p) => p.value));
  const growthPct = firstValue !== 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

  const statValues = [
    formatNumber(avgValue * 1240),
    formatNumber(avgValue),
    formatNumber(peakValue),
    `${growthPct >= 0 ? "+" : ""}${growthPct}%`,
  ];
  const statIcons = [Activity, Clock, Star, growthPct >= 0 ? ArrowUp : ArrowDown];

  const [activePreset, setActivePreset] = useState(1);
  const [fromDate, setFromDate] = useState("2024-05-01");
  const [toDate, setToDate] = useState("2024-05-31");

  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const sortedCampaigns = useMemo(() => {
    const rows = [...CAMPAIGNS];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedCampaigns.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedCampaigns = sortedCampaigns.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  }

  function handleExport() {
    const header = [
      t("analytics.table.columns.name"),
      t("analytics.table.columns.source"),
      t("analytics.table.columns.clicks"),
      t("analytics.table.columns.conversions"),
      t("analytics.table.columns.revenue"),
      t("analytics.table.columns.status"),
    ];
    const rows = sortedCampaigns.map((r) => [r.name, r.source, String(r.clicks), String(r.conversions), String(r.revenue), r.status]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function SortHeader({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) {
    const active = sortKey === sortKeyName;
    return (
      <button
        type="button"
        onClick={() => toggleSort(sortKeyName)}
        className="flex items-center gap-1 rounded text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
        )}
      </button>
    );
  }

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-16 md:pt-20">
        <Reveal>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t("analytics.title")}</h1>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground">{t("analytics.subtitle")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {headerStats.map((stat, i) => {
              const Icon = statIcons[i] ?? Activity;
              return (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</span>
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-2xl font-bold text-foreground">{statValues[i] ?? "--"}</div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="mx-auto max-w-7xl px-6 pb-10">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("analytics.filters.title")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("analytics.filters.subtitle")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, i) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setActivePreset(i)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      activePreset === i
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">
                  {PRESET_DAYS[activePreset] ?? 7} {t("analytics.filters.daysSuffix")}
                </span>
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  {t("analytics.filters.fromLabel")}
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  {t("analytics.filters.toLabel")}
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <button
                  type="button"
                  className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("analytics.filters.apply")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="charts" className="mx-auto max-w-7xl px-6 pb-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{t("analytics.charts.trendTitle")}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t("analytics.charts.trendSubtitle")}</p>
                </div>
                <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {t("analytics.charts.trendLegendValue")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary/30" />
                  {t("analytics.charts.trendLegendBand")}
                </span>
              </div>
              <div className="mt-4 h-80 w-full">
                <svg viewBox="0 0 600 280" className="h-full w-full" role="img" aria-label={t("analytics.charts.trendTitle")}>
                  <defs>
                    <linearGradient id="trendBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={i} x1={0} x2={600} y1={i * 60 + 10} y2={i * 60 + 10} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  ))}
                  {(() => {
                    const minV = Math.min(...TREND.map((p) => p.lower));
                    const maxV = Math.max(...TREND.map((p) => p.upper));
                    const span = Math.max(1, maxV - minV);
                    const xFor = (i: number) => (i / (TREND.length - 1)) * 580 + 10;
                    const yFor = (v: number) => 260 - ((v - minV) / span) * 240;
                    const upperPath = TREND.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.upper)}`).join(" ");
                    const lowerPath = [...TREND]
                      .reverse()
                      .map((p, i) => `L${xFor(TREND.length - 1 - i)},${yFor(p.lower)}`)
                      .join(" ");
                    const bandPath = `${upperPath} ${lowerPath} Z`;
                    const linePath = TREND.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.value)}`).join(" ");
                    return (
                      <>
                        <path d={bandPath} fill="url(#trendBand)" stroke="none" />
                        <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("analytics.charts.pieTitle")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("analytics.charts.pieSubtitle")}</p>
              </div>
              <div className="mt-4 flex h-56 w-full items-center justify-center">
                <svg viewBox="0 0 200 200" className="h-48 w-48" role="img" aria-label={t("analytics.charts.pieTitle")}>
                  {(() => {
                    const total = PIE_DATA.reduce((sum, d) => sum + d.value, 0) || 1;
                    const cx = 100;
                    const cy = 100;
                    const rOuter = 85;
                    const rInner = 55;
                    let angle = -90;
                    return PIE_DATA.map((entry, i) => {
                      const sweep = (entry.value / total) * 360;
                      const start = angle;
                      const end = angle + sweep;
                      angle = end;
                      const toRad = (deg: number) => (deg * Math.PI) / 180;
                      const x1o = cx + rOuter * Math.cos(toRad(start));
                      const y1o = cy + rOuter * Math.sin(toRad(start));
                      const x2o = cx + rOuter * Math.cos(toRad(end));
                      const y2o = cy + rOuter * Math.sin(toRad(end));
                      const x1i = cx + rInner * Math.cos(toRad(end));
                      const y1i = cy + rInner * Math.sin(toRad(end));
                      const x2i = cx + rInner * Math.cos(toRad(start));
                      const y2i = cy + rInner * Math.sin(toRad(start));
                      const largeArc = sweep > 180 ? 1 : 0;
                      const d = `M${x1o},${y1o} A${rOuter},${rOuter} 0 ${largeArc} 1 ${x2o},${y2o} L${x1i},${y1i} A${rInner},${rInner} 0 ${largeArc} 0 ${x2i},${y2i} Z`;
                      return <path key={entry.name} d={d} fill={PIE_CELL_COLORS[i % PIE_CELL_COLORS.length] ?? "hsl(var(--primary))"} />;
                    });
                  })()}
                </svg>
              </div>
              <ul className="mt-4 space-y-2">
                {PIE_DATA.map((entry, i) => (
                  <li key={entry.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className={cn("h-2.5 w-2.5 rounded-full", PIE_LEGEND_CLASSES[i % PIE_LEGEND_CLASSES.length] ?? "bg-primary")} />
                      {entry.name}
                    </span>
                    <span className="font-semibold text-foreground">{entry.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="data-table" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("analytics.table.title")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("analytics.table.subtitle")}</p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={t("analytics.table.export")}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("analytics.table.export")}
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4">
                      <SortHeader label={t("analytics.table.columns.name")} sortKeyName="name" />
                    </th>
                    <th className="pb-3 pr-4">
                      <SortHeader label={t("analytics.table.columns.source")} sortKeyName="source" />
                    </th>
                    <th className="pb-3 pr-4">
                      <SortHeader label={t("analytics.table.columns.clicks")} sortKeyName="clicks" />
                    </th>
                    <th className="pb-3 pr-4">
                      <SortHeader label={t("analytics.table.columns.conversions")} sortKeyName="conversions" />
                    </th>
                    <th className="pb-3 pr-4">
                      <SortHeader label={t("analytics.table.columns.revenue")} sortKeyName="revenue" />
                    </th>
                    <th className="pb-3">
                      <SortHeader label={t("analytics.table.columns.status")} sortKeyName="status" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedCampaigns.map((row) => (
                    <tr key={row.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 font-medium text-foreground">{row.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{row.source}</td>
                      <td className="py-3 pr-4 text-foreground">{formatNumber(row.clicks)}</td>
                      <td className="py-3 pr-4 text-foreground">{formatNumber(row.conversions)}</td>
                      <td className="py-3 pr-4 font-semibold text-foreground">{formatCurrency(row.revenue)}</td>
                      <td className="py-3">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", statusTone(row.status))}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("analytics.table.pageLabel", { current: currentPage, total: totalPages })}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("analytics.table.prev")}
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("analytics.table.next")}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}