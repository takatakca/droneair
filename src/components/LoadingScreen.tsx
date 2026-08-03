import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { useLang } from "@/lib/i18n";

export function LoadingScreen() {
  const { t } = useLang();
  const [done, setDone] = useState(true);

  useEffect(() => {
    let seen = true;
    try {
      seen = window.sessionStorage.getItem("drone-air-intro") === "1";
      window.sessionStorage.setItem("drone-air-intro", "1");
    } catch {
      /* storage unavailable */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) return;
    setDone(false);
    const id = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(id);
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500"
      style={{ background: "var(--background)" }}
    >
      <div className="animate-hover-drone">
        <Logo size="lg" stacked />
      </div>
      <div className="mt-10 h-px w-56 overflow-hidden bg-border">
        <div className="h-px w-1/3 animate-[route-draw_1.4s_linear] bg-primary" style={{ animation: "drift 1.4s linear infinite" }} />
      </div>
      <p className="label-tech mt-4">{t.loading}</p>
    </div>
  );
}