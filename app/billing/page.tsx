"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Download, Check, FileText, AlertCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InvoiceStatus = "Paid" | "Pending";

type InvoiceItem = {
  date: string;
  amount: string;
  status: InvoiceStatus;
};

function statusTone(status: InvoiceStatus): string {
  if (status === "Paid") return "bg-primary text-primary-foreground";
  return "bg-secondary text-foreground";
}

export default function BillingPage() {
  const t = useTranslations();

  const features = (
    Array.isArray(t.raw("billing.currentPlan.features")) ? t.raw("billing.currentPlan.features") : []
  ) as string[];

  const invoiceColumns = (
    Array.isArray(t.raw("billing.invoices.columns")) ? t.raw("billing.invoices.columns") : []
  ) as string[];

  const invoiceItems = (
    Array.isArray(t.raw("billing.invoices.items")) ? t.raw("billing.invoices.items") : []
  ) as InvoiceItem[];

  const [cancelRequested, setCancelRequested] = useState(false);

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden bg-mesh">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80">
                <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
                {t("billing.hero.eyebrow")}
              </span>
              <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                {t("billing.hero.title")}
              </h1>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {t("billing.hero.subtitle")}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Current plan + Payment method */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-xl">{t("billing.currentPlan.name")}</CardTitle>
                    <CardDescription className="mt-1">{t("billing.currentPlan.description")}</CardDescription>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">{t("billing.currentPlan.badge")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold tracking-tight">{t("billing.currentPlan.price")}</span>
                  <span className="text-sm text-muted-foreground">{t("billing.currentPlan.period")}</span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("billing.currentPlan.renewalNote")}
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {features.map((feature, i) => (
                    <li key={i} className="flex gap-2">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button type="button">{t("billing.currentPlan.changePlanLabel")}</Button>
                  <Button type="button" variant="outline" onClick={() => setCancelRequested(true)}>
                    {t("billing.currentPlan.cancelLabel")}
                  </Button>
                </div>
                {cancelRequested && (
                  <p role="status" className="mt-4 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                    {t("billing.currentPlan.cancelConfirmMessage")}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-display text-xl">{t("billing.paymentMethod.title")}</CardTitle>
                <CardDescription className="mt-1">{t("billing.paymentMethod.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/40 p-4">
                  <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <CreditCard className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {t("billing.paymentMethod.brand")} •••• {t("billing.paymentMethod.last4")}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("billing.paymentMethod.expiryLabel")} {t("billing.paymentMethod.expiry")}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button type="button" variant="outline">{t("billing.paymentMethod.updateLabel")}</Button>
                  <Button type="button" variant="ghost">{t("billing.paymentMethod.addLabel")}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </Reveal>

      {/* Invoice history */}
      <Reveal>
        <section className="bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {t("billing.invoices.title")}
              </h2>
              <p className="mt-3 text-muted-foreground">{t("billing.invoices.subtitle")}</p>
            </div>

            <Card className="mt-10 overflow-hidden">
              <div className="hidden grid-cols-[1.5fr_1fr_1fr_auto] gap-4 border-b border-border bg-muted/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
                {invoiceColumns.map((col, i) => (
                  <span key={i} className={i === invoiceColumns.length - 1 ? "text-right" : undefined}>
                    {col}
                  </span>
                ))}
              </div>
              <ul>
                {invoiceItems.map((invoice, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-2 items-center gap-4 border-b border-border px-6 py-4 last:border-b-0 sm:grid-cols-[1.5fr_1fr_1fr_auto]"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      {invoice.date}
                    </span>
                    <span className="text-sm text-muted-foreground">{invoice.amount}</span>
                    <span>
                      <Badge className={cn("border-0", statusTone(invoice.status))}>{invoice.status}</Badge>
                    </span>
                    <span className="flex justify-end">
                      <Button type="button" variant="ghost" size="sm" aria-label={t("billing.invoices.downloadLabel")}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
