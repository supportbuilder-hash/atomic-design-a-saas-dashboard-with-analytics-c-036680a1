"use client";

import { useTranslations } from "next-intl";
import Hero from "@/components/blocks/Hero";
import FAQ, { type FAQItem } from "@/components/blocks/FAQ";
import ContactForm, { type ContactDetail } from "@/components/blocks/ContactForm";

export default function HelpPage() {
  const t = useTranslations();

  const faqItems = (Array.isArray(t.raw("help.faq.items")) ? t.raw("help.faq.items") : []) as FAQItem[];
  const contactDetails = (Array.isArray(t.raw("help.contact.details")) ? t.raw("help.contact.details") : []) as ContactDetail[];

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
  };

  return (
    <main>
      <Hero
        id="help-hero"
        eyebrow={t("help.hero.eyebrow")}
        title={t("help.hero.title")}
        subtitle={t("help.hero.subtitle")}
        variant="mesh"
      />
      <FAQ
        id="help-faq"
        eyebrow={t("help.faq.eyebrow")}
        title={t("help.faq.title")}
        subtitle={t("help.faq.subtitle")}
        items={faqItems}
        variant="card"
      />
      <ContactForm
        id="help-contact"
        eyebrow={t("help.contact.eyebrow")}
        title={t("help.contact.title")}
        subtitle={t("help.contact.subtitle")}
        nameLabel={t("help.contact.nameLabel")}
        emailLabel={t("help.contact.emailLabel")}
        messageLabel={t("help.contact.messageLabel")}
        submitLabel={t("help.contact.submitLabel")}
        successMessage={t("help.contact.successMessage")}
        details={contactDetails}
        onSubmit={handleSubmit}
        variant="split"
      />
    </main>
  );
}
