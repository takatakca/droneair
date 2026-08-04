import { useState } from "react";

import base from "@/assets/svc-mapping.jpg";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";

/** Annotated overlay drawn over the aerial plate: outlines, capture points, measurement. */
function Annotations() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 75"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
    >
      <polygon
        points="18,20 62,14 70,48 26,56"
        fill="oklch(0.7 0.2 252 / 0.1)"
        stroke="var(--waypoint)"
        strokeWidth="0.35"
      />
      <line
        x1="18"
        y1="20"
        x2="70"
        y2="48"
        stroke="var(--gold)"
        strokeWidth="0.25"
        strokeDasharray="1.6 1.2"
      />
      {[
        [24, 24],
        [44, 19],
        [58, 22],
        [64, 40],
        [40, 50],
        [28, 48],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="var(--gold)" />
      ))}
      <text x="19" y="62" fill="oklch(0.86 0.005 264)" fontSize="2.4" fontFamily="monospace">
        45.4413 N / 73.6890 W
      </text>
    </svg>
  );
}

export function DataSection() {
  const { t } = useLang();
  const [pos, setPos] = useState(55);

  return (
    <section className="hairline">
      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="min-w-0">
            <p className="label-tech">{t.tech.label}</p>
            <h2 className="display-lg mt-5 text-foreground">{t.tech.title}</h2>
          </div>
          <div className="min-w-0 lg:pt-14">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.tech.lead}
            </p>
            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {t.tech.overlays.map((o) => (
                <li
                  key={o}
                  className="hairline flex items-center gap-3 pt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground"
                >
                  <span className="waypoint-dot size-1" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal className="relative">
        <div className="relative isolate select-none overflow-hidden">
          <img
            src={base}
            alt=""
            width={1280}
            height={960}
            loading="lazy"
            decoding="async"
            className="h-[52vh] min-h-[320px] w-full object-cover sm:h-[70vh]"
          />
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            aria-hidden
          >
            <Annotations />
          </div>
          <span
            aria-hidden
            className="absolute inset-y-0 w-px bg-primary"
            style={{ left: `${pos}%` }}
          />
          <p className="label-tech absolute left-5 top-5">{t.tech.before}</p>
          <p className="label-tech absolute right-5 top-5 text-primary">{t.tech.after}</p>
        </div>

        <div className="mx-auto max-w-[92rem] px-5 pt-6 sm:px-8">
          <label className="block">
            <span className="label-tech">{t.tech.hint}</span>
            <input
              type="range"
              min={5}
              max={95}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              className="mt-3 h-1 w-full max-w-md cursor-pointer appearance-none bg-border accent-[var(--primary)]"
            />
          </label>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            {t.tech.note}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
