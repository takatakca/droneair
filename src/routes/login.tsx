import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell, fieldClass, labelClass } from "@/components/portal/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { absUrl } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "Connexion — Espace client DRONE AIR";
const description =
  "Connectez-vous à l’espace client DRONE AIR pour consulter vos projets et télécharger vos livrables aériens.";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: absUrl("/login") }],
  }),
});

function LoginPage() {
  const { t } = useLang();
  const p = t.portal.auth;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError) {
      setError(authError.message);
      setBusy(false);
      return;
    }
    await navigate({ to: "/client", replace: true });
  }

  return (
    <AuthShell
      title={p.loginTitle}
      intro={p.loginIntro}
      footer={
        <div className="flex flex-col gap-2">
          <Link to="/forgot-password" className="link-arrow">
            {p.forgot}
          </Link>
          <span>
            {p.noAccount}{" "}
            <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
              {p.signUp}
            </Link>
          </span>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <label className={labelClass} htmlFor="email">
            {p.email}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy} className="btn-solid w-full justify-center">
          {busy ? p.working : p.signIn}
        </button>
      </form>
    </AuthShell>
  );
}