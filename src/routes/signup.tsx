import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell, fieldClass, labelClass } from "@/components/portal/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { absUrl } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "Créer un accès client — DRONE AIR";
const description =
  "Créez votre accès à l’espace client DRONE AIR pour suivre vos missions et recevoir vos livrables en toute sécurité.";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: absUrl("/signup") }],
  }),
});

function SignupPage() {
  const { t, lang } = useLang();
  const p = t.portal.auth;
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (form.password.length < 8) {
      setError(p.passwordRule);
      return;
    }
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + "/login",
        data: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          preferred_language: lang,
        },
      },
    });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setDone(true);
  }

  return (
    <AuthShell
      title={p.signupTitle}
      intro={p.signupIntro}
      footer={
        <span>
          {p.haveAccount}{" "}
          <Link to="/login" className="text-primary underline-offset-4 hover:underline">
            {p.signIn}
          </Link>
        </span>
      }
    >
      {done ? (
        <p className="hairline pt-6 text-sm leading-relaxed text-foreground">{p.confirmEmail}</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="firstName">
                {p.firstName}
              </label>
              <input
                id="firstName"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="lastName">
                {p.lastName}
              </label>
              <input
                id="lastName"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={fieldClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              {p.email}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">
              {p.password}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={fieldClass}
            />
            <p className="mt-2 text-xs text-muted-foreground">{p.passwordRule}</p>
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy} className="btn-solid w-full justify-center">
            {busy ? p.working : p.signUp}
          </button>
        </form>
      )}
    </AuthShell>
  );
}