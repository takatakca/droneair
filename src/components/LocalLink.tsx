import { Link, type LinkComponentProps } from "@tanstack/react-router";

import { useLocalizedPath } from "@/lib/i18n";

type Props = Omit<LinkComponentProps<"a">, "to" | "params" | "search"> & { to: string };

/** Link that keeps the visitor in the current language (French at the root, English under /en). */
export function LocalLink({ to, ...rest }: Props) {
  const localize = useLocalizedPath();
  return <Link to={localize(to) as never} {...rest} />;
}
