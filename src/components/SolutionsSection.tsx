import svcAgri from "@/assets/svc-agri.jpg";
import svcConstruction from "@/assets/svc-construction.jpg";
import svcData from "@/assets/svc-data.jpg";
import svcInspection from "@/assets/svc-inspection.jpg";
import svcMapping from "@/assets/svc-mapping.jpg";
import svcWaypoint from "@/assets/svc-waypoint.jpg";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const visuals = [svcInspection, svcWaypoint, svcMapping, svcConstruction, svcAgri, svcData];

const chapterLayouts = [
  { text: "lg:col-span-4 lg:col-start-2", image: "lg:col-span-7 lg:col-start-6", imageFirst: false },
  { text: "lg:col-span-4 lg:col-start-8", image: "lg:col-span-6 lg:col-start-1", imageFirst: true },
  { text: "", image: "", imageFirst: false },
  { text: "lg:col-span-4 lg:col-start-2", image: "lg:col-span-6 lg:col-start-7", imageFirst: false },
  { text: "lg:col-span-4 lg:col-start-8", image: "lg:col-span-6 lg:col-start-1", imageFirst: true },
  { text: "", image: "", imageFirst: false },
] as const;

export function SolutionsSection() {
  const { t } = useLang();

  return (
    <section id="solutions" className="scroll-mt-16 border-t border-border">
      <header className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.solutions.label}
          </p>
          <h2 className="mt-6 max-w-4xl text-[clamp(3rem,7vw,7rem)] font-display font-semibold leading-[0.9] tracking-[-0.05em] text-foreground">
            {t.solutions.title}
          </h2>
        </Reveal>
      </header>

      {t.solutions.items.map((item, i) => {
        const layout = chapterLayouts[i]!;
        const fullBleed = i === 2 || i === 5;

        if (fullBleed) {
          return (
            <article
              key={item.title}
              className="relative isolate flex min-h-[76svh] items-end overflow-hidden border-t border-border"
            >
              <img
                src={visuals[i]}
                alt=""
                width={1280}
                height={960}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-[1600ms] ease-out hover:scale-[1.02]"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,oklch(0.11_0.004_264/.97),oklch(0.11_0.004_264/.22)_72%)]"
              />
              <Reveal className="mx-auto w-full max-w-[92rem] px-5 pb-14 pt-32 sm:px-8 sm:pb-20">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.7fr] lg:items-end">
                  <h3 className="max-w-4xl text-[clamp(2.4rem,5vw,5.4rem)] font-display font-semibold leading-[0.92] tracking-[-0.045em] text-white">
                    {item.title}
                  </h3>
                  <p className="max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            </article>
          );
        }

        return (
          <article key={item.title} className="border-t border-border">
            <div className="mx-auto grid max-w-[92rem] grid-cols-1 gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-x-8">
              <Reveal
                className={cn(
                  "min-w-0",
                  layout.text,
                  layout.imageFirst ? "lg:order-2" : "lg:order-1",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 max-w-2xl text-[clamp(2.2rem,4.2vw,4.8rem)] font-display font-semibold leading-[0.94] tracking-[-0.045em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.body}
                </p>
              </Reveal>

              <Reveal
                delay={100}
                className={cn(
                  "min-w-0",
                  layout.image,
                  layout.imageFirst ? "lg:order-1" : "lg:order-2",
                )}
              >
                <div
                  className={cn(
                    "relative overflow-hidden",
                    i === 0 && "lg:-mr-8",
                    i === 1 && "lg:-ml-8",
                    i === 3 && "lg:translate-y-10",
                    i === 4 && "lg:-translate-y-6",
                  )}
                >
                  <img
                    src={visuals[i]}
                    alt=""
                    width={1280}
                    height={960}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "w-full object-cover transition-transform duration-[1600ms] ease-out hover:scale-[1.025]",
                      i === 0 ? "aspect-[5/4]" : "aspect-[4/3]",
                    )}
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px w-24 bg-primary/80"
                  />
                </div>
              </Reveal>
            </div>
          </article>
        );
      })}

      <div className="mx-auto max-w-[92rem] border-t border-border px-5 py-10 sm:px-8">
        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">{t.solutions.note}</p>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const { t } = useLang();

  return (
    <section id="process" className="relative isolate scroll-mt-16 overflow-hidden border-t border-border">
      <img
        src={svcWaypoint}
        alt=""
        width={1280}
        height={960}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover opacity-25"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,oklch(0.12_0.005_264/.99),oklch(0.12_0.005_264/.82),oklch(0.12_0.005_264/.98))]"
      />

      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.process.label}
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.7fr] lg:items-end">
            <h2 className="max-w-4xl text-[clamp(3rem,7vw,7rem)] font-display font-semibold leading-[0.9] tracking-[-0.05em] text-foreground">
              {t.process.title}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.process.lead}
            </p>
          </div>
        </Reveal>

        <ol className="mt-16 grid border-y border-white/15 lg:grid-cols-5">
          {t.process.steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 70}
              className="relative border-b border-white/15 py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <p className="text-xs tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
