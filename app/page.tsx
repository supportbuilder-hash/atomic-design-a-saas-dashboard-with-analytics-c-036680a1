"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Activity, Bell, User, FileText, Lock, GitBranch, ArrowRight, Check, Clock } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp } from "@/lib/motion";

type HourPoint = { hour: number; value: number };
type DayPoint = { day: string; sessions: number };
type HeroChip = { label: string; value: string };
type FeatureItem = { title: string; description: string };
type StepItem = { title: string; description: string };
type SourceRow = { source: string; status: string; lastSynced: string };
type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLabel: string;
};

const REQUEST_VOLUME: HourPoint[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  value: 220 + Math.round(90 * Math.sin(i / 3) + 40 * Math.cos(i / 5)),
}));

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKLY_SESSIONS: DayPoint[] = WEEKDAYS.map((day, i) => ({
  day,
  sessions: 480 + Math.round(120 * Math.sin(i / 1.5)),
}));

const FEATURE_ICONS = [Activity, Bell, User, FileText, Lock, GitBranch];

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none";

const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none";

const ghostPillBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground motion-reduce:transition-none";

export default function Home() {
  const t = useTranslations();

  const heroChips = (
    Array.isArray(t.raw("home.hero.chips")) ? t.raw("home.hero.chips") : []
  ) as HeroChip[];

  const features = (
    Array.isArray(t.raw("home.features.items")) ? t.raw("home.features.items") : []
  ) as FeatureItem[];

  const steps = (
    Array.isArray(t.raw("home.howItWorks.steps")) ? t.raw("home.howItWorks.steps") : []
  ) as StepItem[];

  const sourceRows = (
    Array.isArray(t.raw("home.dashboardPreview.rows")) ? t.raw("home.dashboardPreview.rows") : []
  ) as SourceRow[];

  const plans = (
    Array.isArray(t.raw("home.pricing.plans")) ? t.raw("home.pricing.plans") : []
  ) as PricingPlan[];

  return (
    <main>
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden bg-mesh">
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80">
                  <span className="h-2 w-2 rounded-full bg-primary motion-safe:animate-pulse" aria-hidden="true" />
                  {t("home.hero.eyebrow")}
                </span>
                <h1 className="mt-6 text-balance text-4xl font-display font-semibold tracking-tight text-foreground md:text-6xl">
                  {t("home.hero.titleStart")}{" "}
                  <span className="text-gradient">{t("home.hero.titleAccent")}</span>
                </h1>
                <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-foreground/70">
                  {t("home.hero.subtitle")}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/login" className={primaryBtn}>
                    {t("home.hero.primaryCta")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link href="/analytics" className={secondaryBtn}>
                    {t("home.hero.secondaryCta")}
                  </Link>
                </div>
              </div>

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="glass-strong rounded-2xl border border-border p-6 shadow-glow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("home.hero.chartTitle")}</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{t("home.hero.chartValue")}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {t("home.hero.chartTrend")}
                  </span>
                </div>
                <div className="mt-6 flex h-48 items-end gap-1.5" role="img" aria-label={t("home.hero.chartTitle")}>
                  {REQUEST_VOLUME.map((point) => {
                    const max = Math.max(...REQUEST_VOLUME.map((p) => p.value));
                    const min = Math.min(...REQUEST_VOLUME.map((p) => p.value));
                    const range = max - min || 1;
                    const heightPct = 15 + ((point.value - min) / range) * 85;
                    return (
                      <div
                        key={point.hour}
                        className="flex-1 rounded-t-sm bg-primary/70 transition-colors duration-300 ease-out hover:bg-primary"
                        style={{ height: `${heightPct}%` }}
                        title={`${point.hour}:00 — ${point.value}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
                  {heroChips.map((chip, i) => (
                    <div key={i}>
                      <p className="text-lg font-semibold text-foreground">{chip.value}</p>
                      <p className="text-xs text-muted-foreground">{chip.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Features - asymmetric bento grid */}
      <section id="features" className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("home.features.eyebrow")}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-display font-semibold tracking-tight text-foreground md:text-4xl">
                {t("home.features.title")}
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("home.features.subtitle")}
              </p>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <Reveal key={feature.title} delay={i * 0.06}>
                  <div
                    className={
                      i === 0
                        ? "surface-elevated h-full rounded-2xl border border-border bg-card p-8 sm:col-span-2"
                        : "surface-elevated h-full rounded-2xl border border-border bg-card p-8"
                    }
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works - numbered list on tinted band */}
      <section id="how-it-works" className="bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {t("home.howItWorks.eyebrow")}
                </span>
                <h2 className="mt-4 text-balance text-3xl font-display font-semibold tracking-tight text-foreground md:text-4xl">
                  {t("home.howItWorks.title")}
                </h2>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {t("home.howItWorks.subtitle")}
                </p>
              </div>
            </Reveal>
            <div className="divide-y divide-border">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.06}>
                  <div className="flex gap-6 py-6 first:pt-0 last:pb-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard preview - chart + data table split */}
      <section id="dashboard" className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("home.dashboardPreview.eyebrow")}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-display font-semibold tracking-tight text-foreground md:text-4xl">
                {t("home.dashboardPreview.title")}
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("home.dashboardPreview.subtitle")}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-5">
            <Reveal className="lg:col-span-2" delay={0.05}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("home.dashboardPreview.chartLabel")}
                </p>
                <div className="mt-6 flex h-64 items-end gap-4" role="img" aria-label={t("home.dashboardPreview.chartLabel")}>
                  {WEEKLY_SESSIONS.map((point) => {
                    const max = Math.max(...WEEKLY_SESSIONS.map((p) => p.sessions));
                    const heightPct = 10 + (point.sessions / max) * 90;
                    return (
                      <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex h-full w-full items-end">
                          <div
                            className="w-full rounded-t-md bg-primary transition-colors duration-300 ease-out hover:bg-primary/80"
                            style={{ height: `${heightPct}%` }}
                            title={`${point.day}: ${point.sessions}`}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{point.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-3" delay={0.1}>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="border-b border-border text-left text-muted-foreground">
                    <tr>
                      <th className="p-4 font-medium">{t("home.dashboardPreview.tableSourceLabel")}</th>
                      <th className="p-4 font-medium">{t("home.dashboardPreview.tableStatusLabel")}</th>
                      <th className="p-4 font-medium">{t("home.dashboardPreview.tableSyncLabel")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sourceRows.map((row) => (
                      <tr key={row.source}>
                        <td className="p-4 font-medium text-foreground">{row.source}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            {row.status === "Connected" ? (
                              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                            ) : (
                              <Clock className="h-4 w-4" aria-hidden="true" />
                            )}
                            {row.status}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{row.lastSynced}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("home.pricing.eyebrow")}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-display font-semibold tracking-tight text-foreground md:text-4xl">
                {t("home.pricing.title")}
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("home.pricing.subtitle")}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => {
              const highlighted = i === 1;
              return (
                <Reveal key={plan.name} delay={i * 0.08}>
                  <div
                    className={
                      highlighted
                        ? "surface-elevated relative flex h-full flex-col rounded-2xl border-2 border-primary bg-card p-8 shadow-glow"
                        : "surface-elevated flex h-full flex-col rounded-2xl border border-border bg-card p-8"
                    }
                  >
                    {highlighted && (
                      <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        {t("home.pricing.mostPopular")}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-display font-semibold tracking-tight text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <ul className="mt-6 flex-1 space-y-3">
                      {plan.features.map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm text-foreground/80">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/login"
                      className={highlighted ? `${primaryBtn} mt-8 w-full` : `${secondaryBtn} mt-8 w-full`}
                    >
                      {plan.ctaLabel}
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section id="get-started" className="bg-gradient-brand">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28 lg:px-8">
            <h2 className="text-balance text-3xl font-display font-semibold tracking-tight text-primary-foreground md:text-4xl">
              {t("home.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
              {t("home.cta.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/login" className="rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground motion-reduce:transition-none">
                {t("home.cta.primaryCta")}
              </Link>
              <Link href="/reports" className={ghostPillBtn}>
                {t("home.cta.secondaryCta")}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}