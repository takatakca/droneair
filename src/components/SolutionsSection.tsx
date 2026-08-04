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
const coords = [
  "45.4413 N / 73.6890 W",
  "45.4587 N / 73.7104 W",
  "45.4302 N / 73.6721 W",
  "45.4675 N / 73.6534 W",
  "45.4218 N / 73.7392 W",
  "45.4491 N / 73.6248 W",
];

export function SolutionsSection() {
  const { t } = useLang();

  return (
    <section id="solutions" className="scroll-mt-16">
      <div className="mx-auto max-w-[92rem] px-5 pb-6 pt-24 sm:px-8 sm:pt-32">
        <Reveal>
          <p className="label-tech">{t.solutions.label}</p>
          <h2 className="display-lg mt-5 max-w-2xl text-foreground">{t.solutions.title}</h2>
        </Reveal>
      </div>

      {t.solutions.items.map((item, i) => (
        <article key={item.title} className="hairline">
          <div
            className={cn(
              "mx-auto grid max-w-[92rem] items-center gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16",
            )}
          >
            <Reveal className={cn("min-w-0", i % 2 === 1 && "lg:order-2")}>
              <p className="font-mono text-[0.7rem] tracking-[0.24em] text-primary">
                {String(i + 1).padStart(2, "0")} — {t.solutions.chapter}
              </p>
              <h3 className="mt-5 max-w-lg font-display text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
                {item.title}
              </h3>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.body}
              </p>
              <p className="mt-8 font-mono text-[0.62rem] tracking-[0.2em] text-muted-foreground">
                {coords[i]}
              </p>
            </Reveal>

            <Reveal delay={120} className={cn("min-w-0", i % 2 === 1 && "lg:order-1")}>
              <div className="relative overflow-hidden">
                <img
                  src={visuals[i]}
                  alt=""
                  width={1280}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="waypoint-dot absolute bottom-5 left-5 size-1.5 animate-pulse-way"
                />
              </div>
            </Reveal>
          </div>
        </article>
      ))}

      <div className="hairline mx-auto max-w-[92rem] px-5 py-10 sm:px-8">
        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">{t.solutions.note}</p>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const { t } = useLang();

  return (
    <section id="process" className="relative isolate scroll-mt-16 overflow-hidden">
      <img
        src={svcMapping}
        alt=""
        width={1280}
        height={960}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover opacity-40"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.15 0.006 264 / 0.96), oklch(0.15 0.006 264 / 0.78), oklch(0.15 0.006 264 / 0.97))",
        }}
      />

      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="label-tech">{t.process.label}</p>
          <h2 className="display-lg mt-5 max-w-2xl text-foreground">{t.process.title}</h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.process.lead}
          </p>
        </Reveal>

        <ol className="relative mt-16 max-w-3xl">
          {/* one continuous line linking every stage */}
          <span
            aria-hidden
            className="absolute bottom-6 left-[7px] top-3 w-px bg-border"
            style={{ background: "var(--gradient-gold)", opacity: 0.35 }}
          />
          {t.process.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 90} className="relative pb-12 pl-12 last:pb-0">
              <span
                aria-hidden
                className="waypoint-dot absolute left-0 top-2 size-4 animate-pulse-way"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
              <p className="font-mono text-[0.7rem] tracking-[0.24em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
