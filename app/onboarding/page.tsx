"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Lightbulb, Sparkles } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StepItem = { title: string; description: string };
type TipItem = { title: string; description: string };

export default function OnboardingPage() {
  const t = useTranslations("onboarding");

  const steps = (Array.isArray(t.raw("steps.items")) ? t.raw("steps.items") : []) as StepItem[];
  const tips = (Array.isArray(t.raw("tips.items")) ? t.raw("tips.items") : []) as TipItem[];

  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const totalSteps = steps.length;
  const activeStep = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      setFinished(true);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const progressPct = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden bg-mesh">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              <span className="text-gradient">{t("hero.title")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </div>
        </section>
      </Reveal>

      {/* Step-by-step wizard */}
      <Reveal>
        <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          {!finished ? (
            <>
              {/* Stepper progress */}
              <div className="mb-12">
                <div className="flex items-center">
                  {steps.map((step, i) => {
                    const completed = i < currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step.title} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300",
                              completed
                                ? "border-primary bg-primary text-primary-foreground"
                                : active
                                  ? "border-primary text-primary"
                                  : "border-border text-muted-foreground",
                            )}
                            aria-current={active ? "step" : undefined}
                          >
                            {completed ? <Check className="h-5 w-5" aria-hidden="true" /> : i + 1}
                          </div>
                          <span
                            className={cn(
                              "mt-2 hidden max-w-[7rem] text-center text-xs font-medium sm:block",
                              active || completed ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {step.title}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className="mx-2 h-0.5 flex-1 rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-0.5 rounded-full transition-all duration-500 ease-out",
                                i < currentStep ? "w-full bg-primary" : "w-0 bg-primary",
                              )}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Active step card */}
              {activeStep && (
                <Card className="surface-elevated rounded-2xl p-8 md:p-12">
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {t("steps.stepLabel", { default: `Step ${currentStep + 1} of ${totalSteps}` } as never) ||
                      `${currentStep + 1} / ${totalSteps}`}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {activeStep.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{activeStep.description}</p>

                  <div className="mt-10 flex items-center justify-between gap-4">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                      {t("steps.back")}
                    </Button>
                    <Button onClick={handleNext}>{isLastStep ? t("steps.finish") : t("steps.next")}</Button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="surface-elevated flex flex-col items-center rounded-2xl p-10 text-center md:p-16">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
                <Check className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
                {t("steps.completeTitle")}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                {t("steps.completeSubtitle")}
              </p>
              <Button className="mt-8" onClick={() => { setFinished(false); setCurrentStep(0); }}>
                {t("steps.restart")}
              </Button>
            </Card>
          )}
        </section>
      </Reveal>

      {/* Tips */}
      <Reveal>
        <section className="bg-muted/40">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
            <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {t("tips.title")}
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {tips.map((tip, i) => (
                <Card key={tip.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {i % 2 === 0 ? (
                      <Lightbulb className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{tip.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
