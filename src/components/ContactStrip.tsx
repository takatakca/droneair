import { ArrowRight } from "lucide-react";

import svcInspection from "@/assets/svc-inspection.jpg";
import { LocalLink } from "@/components/LocalLink";
import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";

export function ContactStrip() {
  const { t } = useLang();

  return (
    <section className="relative isolate overflow-hidden border-t border-border">
      <img
        src={svcInspection}
        alt=""
        width={1280}
        height={960}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-center opacity-30"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,oklch(0.11_0.004_264/.98),oklch(0.11_0.004_264/.82)_55%,oklch(0.11_0.004_264/.55))]"
      />
      <div className="mx-auto flex min-h-[58svh] max-w-[92rem] flex-col justify-between px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
            {t.strip.plan}
          </p>
          <h2 className="mt-6 text-[clamp(3rem,8vw,8rem)] font-display font-semibold leading-[0.88] tracking-[-0.055em] text-white">
            {t.experience.closingTitle}
          </h2>
          <LocalLink to="/contact" className="link-arrow mt-10 text-white">
            {t.cta.primary}
            <ArrowRight className="size-4" />
          </LocalLink>
        </div>

        <div className="mt-14 grid gap-5 border-t border-white/20 pt-6 text-sm text-white/80 sm:grid-cols-2">
          <a href={COMPANY.phoneHref} className="hover:text-white">
            {COMPANY.phoneDisplay}
          </a>
          <a href={COMPANY.emailHref} className="break-all hover:text-white sm:text-right">
            {COMPANY.email}
          </a>
        </div>
      </div>
    </section>
  );
}
