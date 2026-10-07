"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FileText, Eye, Edit, Trash2, Download, Calendar, Plus, Check, Activity } from 'lucide-react';

type ReportItem = {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  format: string;
};

type RawReportItem = {
  title: string;
  description: string;
  lastUpdated: string;
  format: string;
};

export default function ReportsPage() {
  const t = useTranslations();

  const rawItems = (Array.isArray(t.raw("reports.list.items")) ? t.raw("reports.list.items") : []) as RawReportItem[];
  const dateRangeOptions = (Array.isArray(t.raw("reports.builder.dateRangeOptions"))
    ? t.raw("reports.builder.dateRangeOptions")
    : []) as string[];
  const metricsOptions = (Array.isArray(t.raw("reports.builder.metricsOptions"))
    ? t.raw("reports.builder.metricsOptions")
    : []) as string[];
  const formatOptions = (Array.isArray(t.raw("reports.builder.formatOptions"))
    ? t.raw("reports.builder.formatOptions")
    : []) as string[];

  const [reports, setReports] = useState<ReportItem[]>(() =>
    rawItems.map((item, i) => ({
      id: `seed-${i}`,
      title: item.title,
      description: item.description,
      lastUpdated: item.lastUpdated,
      format: item.format,
    }))
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const counterRef = useRef(rawItems.length);

  const [reportName, setReportName] = useState("");
  const [dateRange, setDateRange] = useState(dateRangeOptions[0] ?? "");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    metricsOptions.slice(0, 2)
  );
  const [exportFormat, setExportFormat] = useState(formatOptions[0] ?? "CSV");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const handleView = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const startEdit = (report: ReportItem) => {
    setEditingId(report.id);
    setEditValue(report.title);
  };

  const saveEdit = (id: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, title: trimmed } : r)));
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = reportName.trim();
    if (!trimmed) return;
    counterRef.current += 1;
    const newReport: ReportItem = {
      id: `new-${counterRef.current}`,
      title: trimmed,
      description: `${dateRange} • ${selectedMetrics.join(", ") || t("reports.builder.noMetrics")}`,
      lastUpdated: t("reports.builder.justNow"),
      format: exportFormat,
    };
    setReports((prev) => [newReport, ...prev]);
    setReportName("");
    setShowSuccess(true);
  };

  return (
    <main className="bg-background text-foreground">
      <Reveal>
        <section id="report-list" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              {t("reports.hero.eyebrow")}
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t("reports.hero.title")}
            </h1>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {t("reports.hero.subtitle")}
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="mx-auto mt-16 max-w-md rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold">{t("reports.empty.title")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("reports.empty.subtitle")}</p>
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report, i) => {
                const isExpanded = expandedId === report.id;
                const isEditing = editingId === report.id;
                return (
                  <Reveal key={report.id} delay={i * 0.06}>
                    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_16px_32px_-12px_rgba(0,0,0,0.18)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                          {report.format}
                        </span>
                      </div>

                      <div className="mt-4 flex-1">
                        {isEditing ? (
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            aria-label={t("reports.card.editLabel")}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        ) : (
                          <h3 className="text-lg font-semibold tracking-tight">{report.title}</h3>
                        )}
                        <p
                          className={cn(
                            "mt-2 text-sm leading-relaxed text-muted-foreground",
                            !isExpanded && "line-clamp-2"
                          )}
                        >
                          {report.description}
                        </p>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{report.lastUpdated}</span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(report.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              {t("reports.card.saveLabel")}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-300 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {t("reports.card.cancelLabel")}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleView(report.id)}
                              aria-label={t("reports.card.viewLabel")}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors duration-300 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                              {t("reports.card.viewLabel")}
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(report)}
                              aria-label={t("reports.card.editLabel")}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors duration-300 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                              {t("reports.card.editLabel")}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(report.id)}
                              aria-label={t("reports.card.deleteLabel")}
                              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-destructive transition-colors duration-300 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>
      </Reveal>

      <Reveal>
        <section id="report-builder" className="w-full bg-muted py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("reports.builder.eyebrow")}
                </span>
                <h2 className="mt-5 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("reports.builder.title")}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {t("reports.builder.subtitle")}
                </p>
                {showSuccess && (
                  <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground">
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                    {t("reports.builder.successMessage")}
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="report-name" className="block text-sm font-medium">
                      {t("reports.builder.nameLabel")}
                    </label>
                    <input
                      id="report-name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder={t("reports.builder.namePlaceholder")}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="report-range" className="block text-sm font-medium">
                      {t("reports.builder.dateRangeLabel")}
                    </label>
                    <select
                      id="report-range"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {dateRangeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <fieldset>
                    <legend className="block text-sm font-medium">{t("reports.builder.formatLabel")}</legend>
                    <div className="mt-2 flex gap-3">
                      {formatOptions.map((option) => (
                        <label
                          key={option}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors duration-300",
                            exportFormat === option
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <input
                            type="radio"
                            name="export-format"
                            value={option}
                            checked={exportFormat === option}
                            onChange={() => setExportFormat(option)}
                            className="sr-only"
                          />
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="sm:col-span-2">
                    <legend className="block text-sm font-medium">{t("reports.builder.metricsLabel")}</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {metricsOptions.map((metric) => {
                        const active = selectedMetrics.includes(metric);
                        return (
                          <button
                            type="button"
                            key={metric}
                            onClick={() => toggleMetric(metric)}
                            aria-pressed={active}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground hover:bg-muted"
                            )}
                          >
                            {active && <Check className="h-3 w-3" aria-hidden="true" />}
                            {metric}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>

                <button
                  type="submit"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {t("reports.builder.submitLabel")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}