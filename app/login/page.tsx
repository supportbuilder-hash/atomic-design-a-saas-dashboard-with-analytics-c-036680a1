"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, ArrowRight, AlertCircle, Sparkles, Activity, GitBranch, Check } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/data";

type FeatureItem = { title: string; description: string };
type FooterLink = { label: string; href: string };

const FEATURE_ICONS = [Activity, GitBranch, Sparkles];

// Small decorative dataset for the hero preview chart -- purely illustrative,
// not a claimed metric.
const CHART_POINTS = Array.from({ length: 12 }, (_, i) => ({
  x: i,
  value: 28 + Math.round(22 * Math.sin(i / 2.1) + 22),
}));

export default function LoginPage() {
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotMessage, setShowForgotMessage] = useState(false);

  const rawFeatures = t.raw("login.hero.features");
  const features: FeatureItem[] = Array.isArray(rawFeatures) ? rawFeatures : [];

  const rawFooterLinks = t.raw("login.footer.links");
  const footerLinks: FooterLink[] = Array.isArray(rawFooterLinks) ? rawFooterLinks : [];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError(t("login.form.errorEmpty"));
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    window.location.href = "/analytics";
  }

  function handleDemoLogin() {
    setError("");
    setEmail("demo@pulsemetrics.io");
    setPassword("demo1234");
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/analytics";
    }, 700);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Hero / branding panel */}
      <Reveal className="relative hidden flex-col justify-between overflow-hidden bg-mesh p-10 lg:flex xl:p-16">
        <div className="flex items-center gap-2 text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">{BRAND.name}</span>
        </div>

        <div className="max-w-md">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t("login.hero.eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance text-foreground xl:text-5xl">
            {t("login.hero.titlePrefix")} <span className="text-gradient">{t("login.hero.titleHighlight")}</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("login.hero.subtitle")}</p>

          <ul className="mt-8 space-y-4">
            {features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <motion.li
                  key={feature.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Decorative analytics preview */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("login.hero.previewLabel")}
            </p>
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" aria-hidden="true" />
              {t("login.hero.previewStatus")}
            </span>
          </div>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {CHART_POINTS.map((point) => (
              <div
                key={point.x}
                className="flex-1 rounded-t-sm bg-gradient-brand"
                style={{ height: `${point.value}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Form panel */}
      <Reveal className="flex flex-col justify-center bg-background px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">{BRAND.name}</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-glow">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">{t("login.form.eyebrow")}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
              {t("login.form.title")}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("login.form.subtitle")}</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("login.form.emailLabel")}
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("login.form.emailPlaceholder")}
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-all duration-300 ease-out placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
                    {t("login.form.passwordLabel")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotMessage((v) => !v)}
                    className="text-xs font-medium text-primary underline-offset-2 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t("login.form.forgotLabel")}
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.form.passwordPlaceholder")}
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-all duration-300 ease-out placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={t("login.form.togglePasswordLabel")}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground ${showPassword ? "text-primary" : ""}`}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                {showForgotMessage && (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("login.form.forgotMessage")}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={remember}
                  onClick={() => setRemember((v) => !v)}
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors duration-300 ease-out ${
                    remember ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                  }`}
                >
                  {remember && <Check className="h-3 w-3" aria-hidden="true" />}
                </button>
                {t("login.form.rememberLabel")}
              </label>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
              >
                {loading ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                      aria-hidden="true"
                    />
                    {t("login.form.submitLoadingLabel")}
                  </>
                ) : (
                  <>
                    {t("login.form.submitLabel")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("login.form.dividerLabel")}
              </span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
            >
              {t("login.form.demoButtonLabel")}
            </button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("login.form.signupPrompt")}{" "}
              <Link
                href="mailto:sales@pulsemetrics.io"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {t("login.form.signupCta")}
              </Link>
            </p>
          </div>

          <nav aria-label={t("login.footer.navLabel")} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-3 text-center text-xs text-muted-foreground">{t("login.footer.copyright")}</p>
        </div>
      </Reveal>
    </main>
  );
}