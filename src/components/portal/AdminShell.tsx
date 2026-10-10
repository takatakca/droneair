import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";
import { getAdminAccess } from "@/lib/portal/admin-ops.functions";
import { portalCopy } from "@/lib/portal/copy";

const nav = [
  { to: "/admin", key: "home" },
  { to: "/admin/clients", key: "clients" },
  { to: "/admin/projects", key: "projects" },
  { to: "/admin/missions", key: "missions" },
  { to: "/admin/files", key: "files" },
] as const;

export function AdminShell() {
  const { lang, t } = useLang();
  const copy = portalCopy(lang).admin;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const checkAccess = useServerFn(getAdminAccess);

  const access = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => checkAccess({}),
    retry: false,
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  }

  if (access.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5">
        <p className="text-sm text-muted-foreground">{copy.loading}</p>
      </main>
    );
  }

  if (access.isError || !access.data?.isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5">
        <div className="max-w-xl">
          <Logo size="sm" />
          <h1 className="mt-8 text-3xl font-semibold text-foreground">{copy.denied}</h1>
          <Link to="/client" className="link-arrow mt-8">
            {t.portal.nav.account}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex min-h-16 max-w-[96rem] items-center justify-between gap-5 px-5 py-3 sm:px-8">
          <Link to="/" aria-label={COMPANY.name}>
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-5">
            <LanguageToggle />
            <button
              type="button"
              onClick={signOut}
              className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              {t.portal.nav.signOut}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[96rem] gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-12">
        <aside>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {copy.console}
          </p>
          <nav className="mt-6 divide-y divide-border border-y border-border">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/admin" }}
                className="block py-3 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-primary"
              >
                {copy.nav[item.key]}
              </Link>
            ))}
          </nav>
          <p className="mt-6 break-all text-xs leading-relaxed text-muted-foreground">
            {access.data.email ?? ""}
          </p>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
