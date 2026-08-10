import { LocalLink } from "@/components/LocalLink";
import { ArrowRight } from "lucide-react";

import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";

export function ContactStrip() {
  const { t } = useLang();
  return (
    <div className="hairline">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-12">
          <a href={COMPANY.phoneHref} className="group min-w-0">
            <span className="label-tech block">{t.strip.call}</span>
            <span className="mt-1 block font-mono text-base text-foreground transition-colors group-hover:text-primary">
              {COMPANY.phoneDisplay}
            </span>
          </a>
          <a href={COMPANY.emailHref} className="group min-w-0">
            <span className="label-tech block">{t.strip.email}</span>
            <span className="mt-1 block break-all font-mono text-base text-foreground transition-colors group-hover:text-primary">
              {COMPANY.email}
            </span>
          </a>
        </div>
        <LocalLink to="/contact" className="link-arrow self-start md:self-auto">
          {t.strip.plan}
          <ArrowRight className="size-3.5" />
        </LocalLink>
      </div>
    </div>
  );
}
