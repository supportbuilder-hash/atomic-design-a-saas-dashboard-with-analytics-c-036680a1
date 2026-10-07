"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plug, Check, X, Settings as SettingsIcon } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type IntegrationItem = {
  name: string;
  category: string;
  description: string;
  connected: boolean;
};

const CARD_ICONS = [Plug, SettingsIcon, Check, X];

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

export default function IntegrationsPage() {
  const t = useTranslations("integrations");

  const categories = (
    Array.isArray(t.raw("categories.items")) ? t.raw("categories.items") : []
  ) as string[];

  const gridItems = (
    Array.isArray(t.raw("grid.items")) ? t.raw("grid.items") : []
  ) as IntegrationItem[];

  const allLabel = t("categories.all");
  const [activeCategory, setActiveCategory] = useState<string>(allLabel);

  const [connections, setConnections] = useState<boolean[]>(() =>
    gridItems.map((item) => item.connected)
  );

  const toggleConnection = (index: number) => {
    setConnections((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  const filteredIndexes = gridItems.reduce<number[]>((acc, item, i) => {
    if (activeCategory === allLabel || item.category === activeCategory) acc.push(i);
    return acc;
  }, []);

  const pillClass = (active: boolean) =>
    cn(
      "inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
      active
        ? "border-primary bg-primary text-primary-foreground shadow-glow"
        : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
    );

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden bg-mesh">
          <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80">
              <Plug className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </div>
        </section>
      </Reveal>

      {/* Category filters */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" className={pillClass(activeCategory === allLabel)} onClick={() => setActiveCategory(allLabel)}>
              {allLabel}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={pillClass(activeCategory === category)}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Integration grid */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIndexes.map((index) => {
              const item = gridItems[index];
              if (!item) return null;
              const Icon = CARD_ICONS[index % CARD_ICONS.length] ?? Plug;
              const connected = connections[index] ?? false;
              return (
                <Card key={item.name} className="flex flex-col justify-between transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-6">
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        {connected ? (
                          <>
                            <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                            {t("grid.connectedLabel")}
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            {t("grid.disconnectedLabel")}
                          </>
                        )}
                      </span>
                      <Switch checked={connected} onChange={() => toggleConnection(index)} label={item.name} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </Reveal>
    </main>
  );
}
