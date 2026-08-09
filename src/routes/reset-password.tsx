import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell, fieldClass, labelClass } from "@/components/portal/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { absUrl } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "Nouveau mot de passe — DRONE AIR";
const description = "Choisissez un nouveau mot de passe pour votre accès à l’espace client DRONE AIR.";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: absUrl("/reset-password") }],
  }),
});

function ResetPasswordPage() {
  const { t } = useLang();
  const p = t.portal.auth;
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setError(p.passwordRule);
      return;
    }
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setDone(true);
  }

  return (
    <AuthShell
      title={p.newPasswordTitle}
      intro={p.resetIntro}
      footer={
        <Link to="/login" className="text-primary underline-offset-4 hover:underline">
          {p.signIn}
        </Link>
      }
    >
      {done ? (
        <p className="hairline pt-6 text-sm leading-relaxed text-foreground">{p.passwordUpdated}</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div>
            <label className={labelClass} htmlFor="password">
              {p.newPassword}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {busy ? p.working : p.updatePassword}
          </button>
        </form>
      )}
    </AuthShell>
  );
}