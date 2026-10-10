import { LocalLink } from "@/components/LocalLink";
import { ArrowRight } from "lucide-react";

import heroTerrain from "@/assets/hero-terrain.jpg";
import { useLang } from "@/lib/i18n";

const waypoints = [
  { x: 12, y: 70 },
  { x: 31, y: 46 },
  { x: 50, y: 31 },
  { x: 71, y: 44 },
  { x: 89, y: 62 },
];

export function Hero() {
  const { t } = useLang();
  const path = waypoints.map((w, i) => `${i === 0 ? "M" : "L"}${w.x} ${w.y}`).join(" ");

  const telemetry = [
    { label: t.hero.hud.waypoints, value: "05 / 12" },
    { label: t.hero.hud.altitude, value: "123.4 m" },
    { label: t.hero.hud.area, value: "18.6 ha" },
  ];

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <img
        src={heroTerrain}
        alt=""
        width={1920}
        height={1088}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 size-full animate-drift object-cover"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.13 0.006 264 / 0.9), oklch(0.13 0.006 264 / 0.45) 42%, oklch(0.13 0.006 264 / 0.97))",
        }}
      />

      {/* planned flight route + waypoints */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 -z-10 size-full opacity-55"
      >
        <path
          d={path}
          fill="none"
          stroke="var(--waypoint)"
          strokeWidth="0.18"
          strokeDasharray="220"
          strokeDashoffset="220"
          style={{ animation: "route-draw 6s ease-in-out infinite alternate" }}
          opacity="0.8"
        />
        <rect
          x="24"
          y="50"
          width="52"
          height="34"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="0.1"
          strokeDasharray="1.4 1.4"
          opacity="0.4"
        />
      </svg>
      {waypoints.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="waypoint-dot absolute -z-10 size-1.5 animate-pulse-way"
          style={{ left: `${w.x}%`, top: `${w.y}%`, animationDelay: `${i * 0.35}s` }}
        />
      ))}

      <div className="mx-auto w-full max-w-[92rem] px-5 pb-10 pt-32 sm:px-8">
        <div className="animate-fade-up max-w-4xl">
          <p className="label-tech text-silver">{t.hero.eyebrow}</p>
          <h1 className="display-xl mt-7 max-w-3xl text-foreground">{t.hero.heading}</h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.hero.lead}
          </p>
          <div className="mt-11 flex flex-wrap items-center gap-x-10 gap-y-5">
            <LocalLink to="/contact" className="btn-solid">
              {t.cta.primary}
            </LocalLink>
            <a href="#solutions" className="link-arrow">
              {t.cta.secondary}
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* mission telemetry, integrated as a hairline data row */}
        <dl className="mt-16 grid max-w-3xl grid-cols-3 gap-x-8 border-t border-white/20 pt-5">
          {telemetry.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="label-tech truncate">{item.label}</dt>
              <dd className="mt-2 font-mono text-sm text-white/85 sm:text-base">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[0.65rem] uppercase tracking-[0.12em] text-white/45">
          {t.hero.example}
        </p>
      </div>
    </section>
  );
}
