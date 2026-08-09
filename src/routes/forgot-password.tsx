import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell, fieldClass, labelClass } from "@/components/portal/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { absUrl } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "Réinitialiser le mot de passe — DRONE AIR";
const description = "Réinitialisez le mot de passe de votre accès à l’espace client DRONE AIR.";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: absUrl("/forgot-password") }],
  }),
});

function ForgotPasswordPage() {
  const { t } = useLang();
  const p = t.portal.auth;
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/reset-password",
    });
    setBusy(false);
    setSent(true);
  }

  return (
    <AuthShell
      title={p.resetTitle}
      intro={p.resetIntro}
      footer={
        <Link to="/login" className="text-primary underline-offset-4 hover:underline">
          {p.signIn}
        </Link>
      }
    >
      {sent ? (
        <p className="hairline pt-6 text-sm leading-relaxed text-foreground">{p.resetSent}</p>
      ) : (
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
          <button type="submit" disabled={busy} className="btn-solid w-full justify-center">
            {busy ? p.working : p.resetSend}
          </button>
        </form>
      )}
    </AuthShell>
  );
}