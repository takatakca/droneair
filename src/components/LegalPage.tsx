import { SiteLayout } from "@/components/SiteLayout";

export function LegalPage({ title, body }: { title: string; body: readonly string[] }) {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{title}</h1>
        <span className="rule-gold mt-6 block max-w-24 opacity-70" />
        <div className="mt-8 space-y-5">
          {body.map((p) => (
            <p key={p} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {p}
            </p>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
