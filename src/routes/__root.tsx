import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider, langFromPath } from "../lib/i18n";
import { NotFoundPage } from "../components/NotFoundPage";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const english = langFromPath(pathname) === "en";
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <div className="w-full max-w-3xl border-t border-border pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          DRONE AIR / ERROR
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-6xl">
          {english ? "This route is temporarily unavailable." : "Cette trajectoire est temporairement indisponible."}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {english
            ? "The page could not be loaded. Try again, or return to the main site."
            : "La page n’a pas pu être chargée. Réessayez ou revenez au site principal."}
        </p>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="link-arrow"
          >
            {english ? "Try again" : "Réessayer"}
          </button>
          <a href={english ? "/en" : "/"} className="link-arrow">
            {english ? "Return home" : "Retour à l’accueil"}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "DRONE AIR" },
      { property: "og:site_name", content: "DRONE AIR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const htmlLang = langFromPath(pathname) === "en" ? "en-CA" : "fr-CA";
  return (
    <html lang={htmlLang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
