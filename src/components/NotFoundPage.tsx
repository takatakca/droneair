import { Link } from "@tanstack/react-router";

import { LocalLink } from "@/components/LocalLink";
import { ArrowRight } from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";
import { useLang } from "@/lib/i18n";

export function NotFoundPage() {
  const { t } = useLang();

  return (
    <SiteLayout>
      <section className="relative mx-auto flex min-h-[78vh] max-w-[92rem] flex-col justify-center px-5 py-24 sm:px-8">
        {/* Decorative waypoint trace, consistent with the mission visual system. */}
        <svg
          aria-hidden
          viewBox="0 0 400 200"
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-56 w-full -translate-y-1/2 opacity-40"
          preserveAspectRatio="none"
        >
          <path
            d="M-10 150 L80 120 L170 140 L250 70 L330 92 L410 40"
            fill="none"
            stroke="var(--waypoint)"
            strokeWidth="0.6"
            strokeDasharray="4 5"
          />
          {[
            [80, 120],
            [170, 140],
            [250, 70],
            [330, 92],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.2" fill="var(--waypoint)" />
          ))}
        </svg>

        <p className="label-tech text-primary">{t.notFound.label}</p>
        <h1 className="display-lg mt-6 max-w-3xl text-foreground">{t.notFound.title}</h1>
        <span className="rule-gold mt-8 block max-w-24 opacity-70" />
        <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.notFound.body}
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
          <LocalLink to="/" className="btn-solid">
            {t.notFound.home}
          </LocalLink>
          <LocalLink to="/contact" className="link-arrow">
            {t.notFound.contact}
            <ArrowRight className="size-3.5" />
          </LocalLink>
        </div>
      </section>
    </SiteLayout>
  );
}
