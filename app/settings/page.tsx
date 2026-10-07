"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { User, Mail, Lock, Settings as SettingsIcon, Bell, Save, Check, Clock, Sparkles } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type SelectOption = { value: string; label: string };
type NotificationItem = { title: string; description: string };
type NotificationChannels = { email: boolean; inApp: boolean; push: boolean };
type ThemeChoice = "light" | "dark" | "system";

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <motion.span
        className="absolute left-1 top-1 h-4 w-4 rounded-full bg-card shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const t = useTranslations();

  const languageOptions = (
    Array.isArray(t.raw("settings.preferences.languageOptions"))
      ? t.raw("settings.preferences.languageOptions")
      : []
  ) as SelectOption[];
  const timezoneOptions = (
    Array.isArray(t.raw("settings.preferences.timezoneOptions"))
      ? t.raw("settings.preferences.timezoneOptions")
      : []
  ) as SelectOption[];
  const dateFormatOptions = (
    Array.isArray(t.raw("settings.preferences.dateFormatOptions"))
      ? t.raw("settings.preferences.dateFormatOptions")
      : []
  ) as SelectOption[];
  const notificationItems = (
    Array.isArray(t.raw("settings.notifications.items")) ? t.raw("settings.notifications.items") : []
  ) as NotificationItem[];

  const [profile, setProfile] = useState({
    name: "Jordan Avery",
    email: "jordan@pulsemetrics.io",
    password: "",
  });
  const [prefs, setPrefs] = useState({
    language: languageOptions[0]?.value ?? "en",
    timezone: timezoneOptions[1]?.value ?? "utc-5",
    dateFormat: dateFormatOptions[0]?.value ?? "mdy",
  });
  const [theme, setTheme] = useState<ThemeChoice>("light");
  const [savedVisible, setSavedVisible] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotificationChannels[]>(() =>
    notificationItems.map((_, i) => ({
      email: true,
      inApp: i !== 2,
      push: i % 2 === 0,
    }))
  );

  const flashSaved = () => {
    setSavedVisible(true);
    window.setTimeout(() => setSavedVisible(false), 2500);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    flashSaved();
  };

  const toggleNotification = (index: number, channel: keyof NotificationChannels) => {
    setNotifPrefs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [channel]: !item[channel] } : item))
    );
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring";
  const selectClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground";

  const themeOptions: { key: ThemeChoice; label: string }[] = [
    { key: "light", label: t("settings.theme.light") },
    { key: "dark", label: t("settings.theme.dark") },
    { key: "system", label: t("settings.theme.system") },
  ];

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Reveal>
          <div className="mb-10 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <SettingsIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("settings.header.eyebrow")}
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("settings.header.title")}
              </h1>
            </div>
          </div>
          <p className="-mt-6 mb-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("settings.header.subtitle")}
          </p>
        </Reveal>

        <div className="mt-10 space-y-8">
          {/* Account settings */}
          <Reveal delay={0.05}>
            <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] md:p-8">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-card-foreground">
                  <User className="h-5 w-5 text-primary" aria-hidden="true" />
                  {t("settings.account.title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("settings.account.subtitle")}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-[1fr_260px]">
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="settings-name" className={labelClass}>
                      <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {t("settings.account.nameLabel")}
                    </label>
                    <input
                      id="settings-name"
                      type="text"
                      value={profile.name}
                      placeholder={t("settings.account.namePlaceholder")}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="settings-email" className={labelClass}>
                      <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {t("settings.account.emailLabel")}
                    </label>
                    <input
                      id="settings-email"
                      type="email"
                      value={profile.email}
                      placeholder={t("settings.account.emailPlaceholder")}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="settings-password" className={labelClass}>
                      <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {t("settings.account.passwordLabel")}
                    </label>
                    <input
                      id="settings-password"
                      type="password"
                      value={profile.password}
                      placeholder={t("settings.account.passwordPlaceholder")}
                      onChange={(e) => setProfile((p) => ({ ...p, password: e.target.value }))}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Save className="h-4 w-4" aria-hidden="true" />
                      {t("settings.account.saveButton")}
                    </motion.button>
                    {savedVisible && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        <Check className="h-4 w-4" aria-hidden="true" />
                        {t("settings.account.savedMessage")}
                      </span>
                    )}
                  </div>
                </form>

                <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-background p-6 text-center">
                  <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-border">
                    <img
                      src="https://cdn.stocksnap.io/img-thumbs/960w/VZQ1VAMJS4.jpg"
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("settings.account.avatarTitle")}</p>
                    <p className="text-sm text-muted-foreground">{t("settings.account.avatarRole")}</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("settings.account.avatarPlan")}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t("settings.account.uploadButton")}
                  </button>
                  <p className="text-xs text-muted-foreground">{t("settings.account.avatarHint")}</p>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Preferences */}
          <Reveal delay={0.1}>
            <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] md:p-8">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-card-foreground">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                  {t("settings.preferences.title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("settings.preferences.subtitle")}</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="settings-language" className={labelClass}>
                    {t("settings.preferences.languageLabel")}
                  </label>
                  <select
                    id="settings-language"
                    value={prefs.language}
                    onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
                    className={selectClass}
                  >
                    {languageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="settings-timezone" className={labelClass}>
                    {t("settings.preferences.timezoneLabel")}
                  </label>
                  <select
                    id="settings-timezone"
                    value={prefs.timezone}
                    onChange={(e) => setPrefs((p) => ({ ...p, timezone: e.target.value }))}
                    className={selectClass}
                  >
                    {timezoneOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="settings-dateformat" className={labelClass}>
                    {t("settings.preferences.dateFormatLabel")}
                  </label>
                  <select
                    id="settings-dateformat"
                    value={prefs.dateFormat}
                    onChange={(e) => setPrefs((p) => ({ ...p, dateFormat: e.target.value }))}
                    className={selectClass}
                  >
                    {dateFormatOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Theme toggle */}
          <Reveal delay={0.15}>
            <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:justify-between md:p-8">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-card-foreground">
                  {t("settings.theme.title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("settings.theme.subtitle")}</p>
              </div>
              <div className="inline-flex rounded-lg border border-border bg-background p-1">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setTheme(opt.key)}
                    aria-pressed={theme === opt.key}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      theme === opt.key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Notifications */}
          <Reveal delay={0.2}>
            <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] md:p-8">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-card-foreground">
                  <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
                  {t("settings.notifications.title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("settings.notifications.subtitle")}</p>
              </div>

              <div className="hidden grid-cols-[1fr_72px_72px_72px] gap-2 border-b border-border pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
                <span>&nbsp;</span>
                <span className="text-center">{t("settings.notifications.columnEmail")}</span>
                <span className="text-center">{t("settings.notifications.columnInApp")}</span>
                <span className="text-center">{t("settings.notifications.columnPush")}</span>
              </div>

              <ul className="divide-y divide-border">
                {notificationItems.map((item, i) => {
                  const channels = notifPrefs[i] ?? { email: false, inApp: false, push: false };
                  return (
                    <li
                      key={item.title}
                      className="grid grid-cols-1 items-center gap-3 py-4 sm:grid-cols-[1fr_72px_72px_72px]"
                    >
                      <div>
                        <p className="font-medium text-card-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-xs font-medium text-muted-foreground sm:hidden">
                          {t("settings.notifications.columnEmail")}
                        </span>
                        <Switch
                          checked={channels.email}
                          onChange={() => toggleNotification(i, "email")}
                          label={`${item.title} ${t("settings.notifications.columnEmail")}`}
                        />
                      </div>
                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-xs font-medium text-muted-foreground sm:hidden">
                          {t("settings.notifications.columnInApp")}
                        </span>
                        <Switch
                          checked={channels.inApp}
                          onChange={() => toggleNotification(i, "inApp")}
                          label={`${item.title} ${t("settings.notifications.columnInApp")}`}
                        />
                      </div>
                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-xs font-medium text-muted-foreground sm:hidden">
                          {t("settings.notifications.columnPush")}
                        </span>
                        <Switch
                          checked={channels.push}
                          onChange={() => toggleNotification(i, "push")}
                          label={`${item.title} ${t("settings.notifications.columnPush")}`}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </Reveal>

          {/* Save bar */}
          <Reveal delay={0.25}>
            <section className="flex flex-col items-start gap-4 rounded-2xl bg-primary px-6 py-6 text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center sm:justify-between md:px-8">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{t("settings.save.title")}</h2>
                <p className="mt-1 text-sm text-primary-foreground/80">{t("settings.save.subtitle")}</p>
              </div>
              <motion.button
                type="button"
                onClick={flashSaved}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors duration-200 hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {t("settings.save.button")}
              </motion.button>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}