import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { COMPANY } from "@/lib/company";

export function AuthShell({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-5 sm:px-8">
          <Link to="/" aria-label={COMPANY.name}>
            <Logo size="sm" />
          </Link>
          <LanguageToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>
          <div className="mt-9">{children}</div>
          {footer ? <div className="mt-8 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}

export const fieldClass =
  "mt-2 w-full rounded-sm border border-border bg-secondary/40 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
export const labelClass = "label-tech block text-muted-foreground";