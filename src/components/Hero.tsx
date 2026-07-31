import { Link } from "@tanstack/react-router";

import heroTerrain from "@/assets/hero-terrain.jpg";
import { Logo } from "@/components/Logo";
import { useLang } from "@/lib/i18n";

const waypoints = [
  { x: 14, y: 68 },
  { x: 33, y: 44 },
  { x: 52, y: 30 },
  { x: 72, y: 42 },
  { x: 88, y: 60 },
];

export function Hero() {
  const { t } = useLang();
  const path = waypoints.map((w, i) => `${i === 0 ? "M" : "L"}${w.x} ${w.y}`).join(" ");

  return (
    <section className="relative isolate overflow-hidden">
      {/* cinematic terrain plate */}
      <img
        src={heroTerrain}
        alt=""
        width={1920}
        height={1088}
        className="absolute inset-0 -z-20 size-full animate-drift object-cover opacity-70"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.13 0.006 264 / 0.82), oklch(0.13 0.006 264 / 0.55) 45%, oklch(0.13 0.006 264 / 0.96)), var(--gradient-depth)",
        }}
      />

      {/* planned flight route + waypoints */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 -z-10 size-full"
      >
        <path
          d={path}
          fill="none"
          stroke="var(--waypoint)"
          strokeWidth="0.22"
          strokeDasharray="220"
          strokeDashoffset="220"
          style={{ animation: "route-draw 5s ease-in-out infinite alternate" }}
          opacity="0.85"
        />
        <rect
          x="26"
          y="52"
          width="48"
          height="34"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="0.14"
          strokeDasharray="1.2 1.2"
          opacity="0.55"
        />
      </svg>
      {waypoints.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="waypoint-dot absolute -z-10 size-2 animate-pulse-way"
          style={{ left: `${w.x}%`, top: `${w.y}%`, animationDelay: `${i * 0.35}s` }}
        />
      ))}

      {/* land scanning sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 animate-scan"
        style={{
          background:
            "linear-gradient(to bottom, transparent, oklch(0.7 0.2 252 / 0.16), transparent)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="animate-fade-up">
          <p className="label-tech">{t.hero.eyebrow}</p>
          <div className="mt-6">
            <Logo size="lg" />
          </div>
          <h1 className="mt-8 max-w-2xl text-3xl font-semibold leading-[1.15] text-foreground sm:text-[2.6rem]">
            {t.hero.statement}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.hero.lead}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-sm bg-primary px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground shadow-[0_18px_40px_-22px_oklch(0.79_0.13_84/0.9)] transition-opacity hover:opacity-90"
            >
              {t.cta.primary}
            </Link>
            <Link
              to="/solutions"
              className="rounded-sm border border-border px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {t.cta.secondary}
            </Link>
          </div>
        </div>

        {/* mission telemetry panel */}
        <div className="panel animate-fade-up rounded-md p-5" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between">
            <p className="label-tech">{t.hero.hud.route}</p>
            <span className="waypoint-dot size-1.5 animate-pulse-way" />
          </div>
          <dl className="mt-5 space-y-4 font-mono text-sm">
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <dt className="label-tech">{t.hero.hud.altitude}</dt>
              <dd className="text-silver text-lg">123.4 m</dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <dt className="label-tech">{t.hero.hud.waypoints}</dt>
              <dd className="text-accent text-lg">05 / 12</dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <dt className="label-tech">GPS</dt>
              <dd className="text-muted-foreground">45.4413 / -73.6890</dd>
            </div>
          </dl>
          <div className="mt-5">
            <p className="label-tech mb-2">{t.hero.hud.scan}</p>
            <div className="relative h-24 overflow-hidden rounded-sm border border-border bg-graphite">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(oklch(0.7 0.2 252 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.2 252 / 0.35) 1px, transparent 1px)",
                  backgroundSize: "18px 12px",
                }}
              />
              <div
                className="absolute inset-x-0 h-10 animate-scan"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, oklch(0.7 0.2 252 / 0.4), transparent)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}