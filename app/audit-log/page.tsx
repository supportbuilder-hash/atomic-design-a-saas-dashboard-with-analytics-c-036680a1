"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, User, Shield, Database, CreditCard, type LucideIcon } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type AuditCategory = "Account" | "Data" | "Security" | "Billing";

type AuditLogItem = {
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  category: AuditCategory;
};

const CATEGORY_ICONS: Record<AuditCategory, LucideIcon> = {
  Account: User,
  Data: Database,
  Security: Shield,
  Billing: CreditCard,
};

function categoryBadgeClass(category: AuditCategory): string {
  switch (category) {
    case "Account":
      return "bg-primary/10 text-primary";
    case "Data":
      return "bg-accent/10 text-accent";
    case "Security":
      return "bg-destructive/10 text-destructive";
    case "Billing":
      return "bg-secondary text-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

const LOAD_MORE_STEP = 8;

export default function AuditLogPage() {
  const t = useTranslations();

  const actionOptions = (
    Array.isArray(t.raw("auditLog.filters.actionOptions")) ? t.raw("auditLog.filters.actionOptions") : []
  ) as string[];

  const columns = (
    Array.isArray(t.raw("auditLog.log.columns")) ? t.raw("auditLog.log.columns") : []
  ) as string[];

  const logItems = (
    Array.isArray(t.raw("auditLog.log.items")) ? t.raw("auditLog.log.items") : []
  ) as AuditLogItem[];

  const filters = ["All", ...actionOptions.filter((f) => f !== "All")];
  const [activeFilter, setActiveFilter] = useState<string>(filters[0] ?? "All");
  const [visibleCount, setVisibleCount] = useState(LOAD_MORE_STEP);

  const filteredItems =
    activeFilter === "All" ? logItems : logItems.filter((item) => item.category === activeFilter);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setVisibleCount(LOAD_MORE_STEP);
  };

  const [timestampCol, actorCol, actionCol, detailsCol] = [
    columns[0] ?? "Timestamp",
    columns[1] ?? "Actor",
    columns[2] ?? "Action",
    columns[3] ?? "Details",
  ];

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden bg-mesh">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              {t("auditLog.hero.eyebrow")}
            </span>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight md:text-5xl">
              {t("auditLog.hero.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("auditLog.hero.subtitle")}
            </p>
          </div>
        </section>
      </Reveal>

      {/* Filter bar */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 pt-12">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("auditLog.filters.label")}>
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                aria-pressed={activeFilter === filter}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                  activeFilter === filter
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:text-foreground motion-reduce:hover:translate-y-0",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Log list */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {visibleItems.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              {t("auditLog.log.empty")}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th scope="col" className="px-6 py-4">
                        {timestampCol}
                      </th>
                      <th scope="col" className="px-6 py-4">
                        {actorCol}
                      </th>
                      <th scope="col" className="px-6 py-4">
                        {actionCol}
                      </th>
                      <th scope="col" className="px-6 py-4">
                        {detailsCol}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item, i) => {
                      const Icon = CATEGORY_ICONS[item.category] ?? Clock;
                      return (
                        <tr key={`${item.timestamp}-${item.actor}-${i}`} className="border-b border-border last:border-b-0">
                          <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              {item.timestamp}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-medium">{item.actor}</td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                                categoryBadgeClass(item.category),
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                              {item.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{item.details}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <ul className="space-y-4 md:hidden">
                {visibleItems.map((item, i) => {
                  const Icon = CATEGORY_ICONS[item.category] ?? Clock;
                  return (
                    <li
                      key={`${item.timestamp}-${item.actor}-${i}`}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                            categoryBadgeClass(item.category),
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {item.action}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium">{item.actor}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.details}</p>
                    </li>
                  );
                })}
              </ul>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  >
                    {t("auditLog.log.loadMore")}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </Reveal>
    </main>
  );
}
