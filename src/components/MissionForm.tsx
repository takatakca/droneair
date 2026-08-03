import { useState } from "react";

import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";

type Errors = Partial<Record<"name" | "email" | "phone" | "location" | "service" | "message" | "consent", string>>;

const field =
  "w-full rounded-sm border border-input bg-graphite/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/50";

export function MissionForm() {
  const { lang, t } = useLang();
  const f = t.contact.form;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  function validate(data: FormData): Errors {
    const e: Errors = {};
    const req = ["name", "phone", "location", "service", "message"] as const;
    req.forEach((k) => {
      if (!String(data.get(k) ?? "").trim()) e[k] = f.required;
    });
    const email = String(data.get("email") ?? "").trim();
    if (!email) e.email = f.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = f.invalidEmail;
    if (!data.get("consent")) e.consent = f.consentRequired;
    return e;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      // No backend is connected yet: the request is only kept in this browser session.
      const payload = Object.fromEntries(
        Array.from(data.entries()).filter(([, v]) => typeof v === "string"),
      );
      window.sessionStorage.setItem("drone-air-mission-request", JSON.stringify(payload));
      await new Promise((r) => setTimeout(r, 600));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="panel rounded-md p-6" aria-live="polite">
        <p className="label-tech">{f.confirmTitle}</p>
        <h2 className="mt-3 text-xl font-semibold text-foreground">{f.confirmTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.confirmBody}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{f.noBackend}</p>
        <div className="mt-5 space-y-2 font-mono text-sm">
          <a href={COMPANY.phoneHref} className="block text-primary">
            {COMPANY.phoneDisplay}
          </a>
          <a href={COMPANY.emailHref} className="block break-all text-primary">
            {COMPANY.email}
          </a>
          <address className="not-italic leading-relaxed text-muted-foreground">
            {COMPANY.name}
            <br />
            {COMPANY.street}
            <br />
            {lang === "fr" ? COMPANY.cityFr : COMPANY.cityEn}
            <br />
            {COMPANY.country}
          </address>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setErrors({});
          }}
          className="mt-6 rounded-sm border border-border px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-foreground hover:border-accent hover:text-accent"
        >
          {f.again}
        </button>
      </div>
    );
  }

  const err = (key: keyof Errors) =>
    errors[key] ? (
      <span className="mt-1 block font-mono text-[0.65rem] text-destructive">{errors[key]}</span>
    ) : null;

  return (
    <form className="panel space-y-4 rounded-md p-6" onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label-tech mb-2 block">{f.name}</span>
          <input name="name" autoComplete="name" aria-invalid={!!errors.name} className={field} />
          {err("name")}
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.company}</span>
          <input name="company" autoComplete="organization" className={field} />
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.email}</span>
          <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
          {err("email")}
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.phone}</span>
          <input name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} className={field} />
          {err("phone")}
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.prefLang}</span>
          <select name="preferredLanguage" defaultValue={lang} className={field}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.location}</span>
          <input name="location" aria-invalid={!!errors.location} className={field} />
          {err("location")}
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.service}</span>
          <select name="service" defaultValue="" aria-invalid={!!errors.service} className={field}>
            <option value="" disabled>
              {f.servicePlaceholder}
            </option>
            {f.services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err("service")}
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.area}</span>
          <input name="area" className={field} />
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.date}</span>
          <input name="date" type="date" className={field} />
        </label>
        <label className="block">
          <span className="label-tech mb-2 block">{f.file}</span>
          <input name="attachment" type="file" accept="image/*,.pdf" className={field} />
        </label>
      </div>

      <label className="block">
        <span className="label-tech mb-2 block">{f.message}</span>
        <textarea name="message" rows={5} aria-invalid={!!errors.message} className={field} />
        {err("message")}
      </label>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          name="consent"
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
          aria-invalid={!!errors.consent}
        />
        <span>
          {f.consent}
          {err("consent")}
        </span>
      </label>

      <p className="text-xs leading-relaxed text-muted-foreground">{f.noBackend}</p>

      {status === "error" && (
        <div role="alert" className="rounded-sm border border-destructive/50 p-3">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-destructive">
            {f.errorTitle}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.errorBody}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="min-h-11 rounded-sm bg-primary px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? f.sending : f.submit}
      </button>
    </form>
  );
}
