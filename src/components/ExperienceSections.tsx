import { ArrowRight } from "lucide-react";

import svcData from "@/assets/svc-data.jpg";
import { LocalLink } from "@/components/LocalLink";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";

export function PurposeSection() {
  const { t } = useLang();

  return (
    <section className="border-t border-border bg-[oklch(0.115_0.004_264)]">
      <div className="mx-auto flex min-h-[72svh] max-w-[92rem] items-center px-5 py-24 sm:px-8">
        <Reveal className="max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.experience.purposeLabel}
          </p>
          <h2 className="mt-8 text-[clamp(3.2rem,9vw,8.5rem)] font-display font-semibold leading-[0.88] tracking-[-0.055em] text-foreground">
            {t.experience.purposeTitle}
          </h2>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.experience.purposeBody}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function DeliverySection() {
  const { t } = useLang();
  const rows = [t.experience.report, t.experience.imagery, t.experience.data];

  return (
    <section className="relative isolate overflow-hidden border-t border-border">
      <img
        src={svcData}
        alt=""
        width={1280}
        height={960}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-center opacity-35"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,oklch(0.12_0.005_264/.98)_0%,oklch(0.12_0.005_264/.9)_45%,oklch(0.12_0.005_264/.45)_100%)]"
      />
      <div className="mx-auto grid min-h-[78svh] max-w-[92rem] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.experience.deliveryLabel}
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2.8rem,6vw,6.2rem)] font-display font-semibold leading-[0.92] tracking-[-0.05em] text-foreground">
            {t.experience.deliveryTitle}
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t.experience.deliveryBody}
          </p>
          <LocalLink to="/login" className="link-arrow mt-9">
            {t.experience.clientAccess}
            <ArrowRight className="size-3.5" />
          </LocalLink>
        </Reveal>

        <Reveal delay={100} className="lg:self-end lg:pb-8">
          <div className="border-y border-white/20">
            {rows.map((row, index) => (
              <div
                key={row}
                className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/20 py-5 last:border-b-0"
              >
                <span className="text-xs tabular-nums text-white/45">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-white">{row}</span>
                <span className="text-xs uppercase tracking-[0.12em] text-white/55">
                  DRONE AIR
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
