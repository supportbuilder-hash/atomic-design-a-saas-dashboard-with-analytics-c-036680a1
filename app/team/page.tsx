"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { UserPlus, Shield, Mail, Trash2 } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type MemberStatus = "Active" | "Pending";

type MemberItem = {
  name: string;
  email: string;
  avatarInitials: string;
  role: string;
  permissions: string;
  status: MemberStatus;
};

type MemberRow = MemberItem & { id: string };

type RoleOption = { value: string; label: string };

type RoleItem = { name: string; description: string };

function statusTone(status: MemberStatus): string {
  return status === "Active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground";
}

export default function TeamPage() {
  const t = useTranslations("team");

  const rawMembers = (Array.isArray(t.raw("members.items")) ? t.raw("members.items") : []) as MemberItem[];
  const columns = (Array.isArray(t.raw("members.columns")) ? t.raw("members.columns") : []) as string[];
  const roleOptions = (Array.isArray(t.raw("invite.roleOptions")) ? t.raw("invite.roleOptions") : []) as RoleOption[];
  const roleItems = (Array.isArray(t.raw("roles.items")) ? t.raw("roles.items") : []) as RoleItem[];

  const [members, setMembers] = useState<MemberRow[]>(() =>
    rawMembers.map((item, i) => ({ ...item, id: `seed-${i}` }))
  );

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(roleOptions[0]?.value ?? "");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const initialsFromName = (name: string): string => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
    return letters.join("") || "??";
  };

  const handleInviteSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = inviteName.trim();
    const trimmedEmail = inviteEmail.trim();
    if (!trimmedName || !trimmedEmail) return;

    const selectedRole = roleOptions.find((r) => r.value === inviteRole);
    const newMember: MemberRow = {
      id: `new-${Date.now()}-${trimmedEmail}`,
      name: trimmedName,
      email: trimmedEmail,
      avatarInitials: initialsFromName(trimmedName),
      role: selectedRole?.label ?? inviteRole,
      permissions: t("invite.defaultPermissions"),
      status: "Pending",
    };
    setMembers((prev) => [newMember, ...prev]);
    setInviteName("");
    setInviteEmail("");
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>
        </section>
      </Reveal>

      {/* Members list */}
      <Reveal>
        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-4">{columns[0] ?? "Member"}</th>
                    <th className="px-5 py-4">{columns[1] ?? "Role"}</th>
                    <th className="px-5 py-4">{columns[2] ?? "Permissions"}</th>
                    <th className="px-5 py-4">{columns[3] ?? "Status"}</th>
                    <th className="px-5 py-4 text-right">{columns[4] ?? "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map((member) => (
                    <tr key={member.id} className="align-middle">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar alt={member.name} fallback={member.avatarInitials} size="md" />
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" aria-hidden="true" />
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="secondary">{member.role}</Badge>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{member.permissions}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusTone(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(member.id)}
                          aria-label={`${t("members.removeLabel")} ${member.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                        {t("members.emptyLabel")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Invite flow */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80">
                <UserPlus className="h-4 w-4 text-primary" aria-hidden="true" />
                {t("invite.eyebrow")}
              </span>
              <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight text-foreground">
                {t("invite.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("invite.subtitle")}</p>
            </div>

            <form
              onSubmit={handleInviteSubmit}
              className="rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invite-name">{t("invite.nameLabel")}</Label>
                  <Input
                    id="invite-name"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder={t("invite.namePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-email">{t("invite.emailLabel")}</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder={t("invite.emailPlaceholder")}
                    required
                  />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Label htmlFor="invite-role">{t("invite.roleLabel")}</Label>
                <Select
                  id="invite-role"
                  options={roleOptions}
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                />
              </div>
              {showSuccess && (
                <p role="status" className="mt-5 rounded-lg border border-border bg-muted p-4 text-sm font-medium text-foreground">
                  {t("invite.successMessage")}
                </p>
              )}
              <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
                {t("invite.submitLabel")}
              </Button>
            </form>
          </div>
        </section>
      </Reveal>

      {/* Roles & permissions explainer */}
      <Reveal>
        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground">
                {t("roles.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("roles.subtitle")}</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roleItems.map((role, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Shield className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle>{role.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
