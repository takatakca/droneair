import { useRef, useState } from "react";

import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";
import {
  ATTACHMENT_ACCEPT,
  EMAIL_RE,
  MAX_ATTACHMENT_BYTES,
  isAllowedAttachment,
} from "@/lib/mission-request";

type FieldKey =
  | "name"
  | "email"
  | "phone"
  | "location"
  | "service"
  | "message"
  | "consent"
  | "attachment";
type Errors = Partial<Record<FieldKey, string>>;

const field =
  "w-full border-0 border-b border-input bg-transparent px-0 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:border-primary";

export function MissionForm() {
  const { lang, t } = useLang();
  const f = t.contact.form;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>(f.errorBody);
  const [errors, setErrors] = useState<Errors>({});
  const startedAt = useRef<number>(Date.now());

  function validate(data: FormData): Errors {
    const e: Errors = {};
    const req = ["name", "phone", "location", "service", "message"] as const;
    req.forEach((k) => {
      if (!String(data.get(k) ?? "").trim()) e[k] = f.required;
    });
    const email = String(data.get("email") ?? "").trim();
    if (!email) e.email = f.required;
    else if (!EMAIL_RE.test(email)) e.email = f.invalidEmail;
    if (!data.get("consent")) e.consent = f.consentRequired;

    const file = data.get("attachment");
    if (file instanceof File && file.size > 0) {
      if (!isAllowedAttachment(file.type)) e.attachment = f.fileType;
      else if (file.size > MAX_ATTACHMENT_BYTES) e.attachment = f.fileTooLarge;
    }
    return e;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    data.set("elapsedMs", String(Date.now() - startedAt.current));
    data.set("sourcePage", window.location.pathname);

    setStatus("sending");
    try {
      const response = await fetch("/api/public/mission-request", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (response.ok && payload?.ok) {
        setStatus("sent");
        return;
      }

      setErrorMessage(
        payload?.error === "rate_limited"
          ? f.rateLimited
          : payload?.error === "attachment_failed"
            ? f.attachmentFailed
            : payload?.error === "attachment_type"
              ? f.fileType
              : payload?.error === "attachment_size"
                ? f.fileTooLarge
                : f.errorBody,
      );
      setStatus("error");
    } catch {
      setErrorMessage(f.errorBody);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div aria-live="polite" role="status">
        <p className="label-tech text-primary">{f.confirmLabel}</p>
        <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
          {f.confirmTitle}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {f.confirmBody}
        </p>
        <p className="mt-4 max-w-md text-xs leading-relaxed text-muted-foreground">{f.noBackend}</p>
        <div className="hairline mt-8 space-y-2 pt-6 font-mono text-sm">
          <a href={COMPANY.phoneHref} className="block text-foreground hover:text-primary">
            {COMPANY.phoneDisplay}
          </a>
          <a href={COMPANY.emailHref} className="block break-all text-foreground hover:text-primary">
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
            startedAt.current = Date.now();
          }}
          className="link-arrow mt-8"
        >
          {f.again}
        </button>
      </div>
    );
  }

  const err = (key: FieldKey) =>
    errors[key] ? (
      <span
        id={`${key}-error`}
        className="mt-2 block font-mono text-[0.65rem] text-destructive"
      >
        {errors[key]}
      </span>
    ) : null;

  const described = (key: FieldKey) => (errors[key] ? `${key}-error` : undefined);

  return (
    <form className="space-y-8" onSubmit={onSubmit} noValidate>
      {/* Honeypot: hidden from humans, commonly filled by bots. */}
      <div aria-hidden className="absolute left-[-9999px] size-0 overflow-hidden">
        <label>
          Website
          <input name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="label-tech mb-1 block">{f.name}</span>
          <input
            name="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={described("name")}
            className={field}
          />
          {err("name")}
        </label>
        <label className="block">
          <span className="label-tech mb-1 block">{f.company}</span>
          <input name="company" autoComplete="organization" className={field} />
        </label>
        <label className="block">
          <span className="label-tech mb-1 block">{f.email}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={described("email")}
            className={field}
          />
          {err("email")}
        </label>
        <label className="block">
          <span className="label-tech mb-1 block">{f.phone}</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={described("phone")}
            className={field}
          />
          {err("phone")}
        </label>
        <label className="block">
          <span className="label-tech mb-1 block">{f.prefLang}</span>
          <select name="preferredLanguage" defaultValue={lang} className={field}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="block">
          <span className="label-tech mb-1 block">{f.location}</span>
          <input
            name="location"
            aria-invalid={!!errors.location}
            aria-describedby={described("location")}
            className={field}
          />
          {err("location")}
        </label>
        <label className="block">
          <span className="label-tech mb-1 block">{f.service}</span>
          <select
            name="service"
            defaultValue=""
            aria-invalid={!!errors.service}
            aria-describedby={described("service")}
            className={field}
          >
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
          <span className="label-tech mb-1 block">{f.area}</span>
          <input name="area" className={field} />
        </label>
        <label className="block">
          <span className="label-tech mb-1 block">{f.date}</span>
          <input name="date" type="date" className={field} />
        </label>
        <label className="block">
          <span className="label-tech mb-1 block">{f.file}</span>
          <input
            name="attachment"
            type="file"
            accept={ATTACHMENT_ACCEPT}
            aria-invalid={!!errors.attachment}
            aria-describedby={described("attachment")}
            className="w-full border-b border-input py-2.5 text-xs text-muted-foreground file:mr-4 file:border-0 file:bg-transparent file:font-mono file:text-[0.65rem] file:uppercase file:tracking-[0.18em] file:text-primary"
          />
          <span className="mt-2 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
            {f.fileHint}
          </span>
          {err("attachment")}
        </label>
      </div>

      <label className="block">
        <span className="label-tech mb-1 block">{f.message}</span>
        <textarea
          name="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={described("message")}
          className={field}
        />
        {err("message")}
      </label>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          name="consent"
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
          aria-invalid={!!errors.consent}
          aria-describedby={described("consent")}
        />
        <span>
          {f.consent}
          {err("consent")}
        </span>
      </label>

      <p className="text-xs leading-relaxed text-muted-foreground">{f.noBackend}</p>

      {status === "error" && (
        <div role="alert" aria-live="assertive" className="border-l-2 border-destructive pl-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-destructive">
            {f.errorTitle}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="btn-solid disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? f.sending : f.submit}
      </button>
    </form>
  );
}
