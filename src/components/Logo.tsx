import mark from "@/assets/drone-air-mark.png";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { img: string; name: string; tag: string; gap: string }> = {
  sm: { img: "h-8 w-8", name: "text-base", tag: "text-[0.4rem]", gap: "gap-2.5" },
  md: { img: "h-12 w-12", name: "text-2xl", tag: "text-[0.5rem]", gap: "gap-3" },
  lg: { img: "h-24 w-24 sm:h-32 sm:w-32", name: "text-4xl sm:text-6xl", tag: "text-[0.6rem] sm:text-xs", gap: "gap-4" },
};

export function Logo({
  size = "sm",
  stacked = false,
  className,
}: {
  size?: Size;
  stacked?: boolean;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <span
      className={cn(
        "flex items-center",
        stacked ? "flex-col gap-3 text-center" : s.gap,
        className,
      )}
    >
      <img
        src={mark}
        alt={`${COMPANY.name} — ${COMPANY.tagline}`}
        width={1024}
        height={1024}
        className={cn(s.img, "shrink-0 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]")}
      />
      <span className={cn("flex flex-col", stacked ? "items-center" : "items-start")}>
        <span
          className={cn(
            "text-silver font-display font-bold leading-none tracking-[0.14em]",
            s.name,
          )}
        >
          {COMPANY.name}
        </span>
        <span className="rule-gold my-1 opacity-70" />
        <span
          className={cn("font-mono uppercase leading-none tracking-[0.3em] text-muted-foreground", s.tag)}
        >
          {COMPANY.tagline}
        </span>
      </span>
    </span>
  );
}