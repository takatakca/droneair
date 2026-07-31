import { useLang } from "@/lib/i18n";

export function SolutionsSection() {
  const { t } = useLang();
  return (
    <section id="solutions" className="mx-auto max-w-6xl px-5 py-20">
      <p className="label-tech">{t.solutions.label}</p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
        {t.solutions.title}
      </h2>
      <span className="rule-gold mt-6 block max-w-24 opacity-70" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {t.solutions.items.map((item, i) => (
          <article
            key={item.title}
            className="panel group rounded-md p-6 transition-colors hover:border-accent/50"
          >
            <div className="flex items-center gap-3">
              <span className="waypoint-dot size-1.5" />
              <span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground">
                WP-{String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProcessSection() {
  const { t } = useLang();
  return (
    <section className="border-t border-border bg-graphite/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <p className="label-tech">{t.process.label}</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
          {t.process.title}
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.process.steps.map((step, i) => (
            <li key={step.title} className="border-t border-border pt-5">
              <span className="text-gold font-display text-3xl font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}