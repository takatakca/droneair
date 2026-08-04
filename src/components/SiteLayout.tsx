import type { ReactNode } from "react";

import { ContactStrip } from "@/components/ContactStrip";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteLayout({
  children,
  overlayHeader = false,
}: {
  children: ReactNode;
  overlayHeader?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LoadingScreen />
      <SiteHeader overlay={overlayHeader} />
      <main className={overlayHeader ? "flex-1" : "flex-1 pt-16"}>{children}</main>
      <ContactStrip />
      <SiteFooter />
    </div>
  );
}
