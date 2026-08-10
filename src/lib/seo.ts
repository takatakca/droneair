/** Bilingual head metadata for the public marketing routes. */
import { OG_IMAGE, SITE_URL } from "@/lib/company";
import type { Lang } from "@/lib/i18n";

export type PublicPath = "/" | "/solutions" | "/contact" | "/privacy" | "/terms";

const SEO: Record<PublicPath, Record<Lang, { title: string; description: string }>> = {
  "/": {
    fr: {
      title: "DRONE AIR | Inspection, cartographie et données aériennes",
      description:
        "DRONE AIR offre des solutions d’inspection aérienne, de planification par points de passage, de cartographie et de collecte de données pour les terrains, propriétés et infrastructures.",
    },
    en: {
      title: "DRONE AIR | Aerial Inspection, Mapping and Data",
      description:
        "DRONE AIR delivers aerial inspection, waypoint mission planning, mapping and data collection for land, properties and infrastructure in Quebec.",
    },
  },
  "/solutions": {
    fr: {
      title: "Solutions | DRONE AIR — Missions par points de passage et données aériennes",
      description:
        "Inspection de bâtiments, cartographie de terrains, suivi de chantier et livrables de données aériennes par DRONE AIR.",
    },
    en: {
      title: "Solutions | DRONE AIR — Waypoint Missions and Aerial Data",
      description:
        "Building inspection, land mapping, construction monitoring and organized aerial data deliverables by DRONE AIR.",
    },
  },
  "/contact": {
    fr: {
      title: "Planifier une mission | DRONE AIR",
      description:
        "Planifiez une mission avec DRONE AIR : inspection aérienne, points de passage, cartographie et collecte de données. Lachine, Québec — (514) 448-2825.",
    },
    en: {
      title: "Plan a Mission | DRONE AIR",
      description:
        "Plan an aerial mission with DRONE AIR: inspection, waypoint planning, mapping and data collection. Lachine, Quebec — (514) 448-2825.",
    },
  },
  "/privacy": {
    fr: {
      title: "Politique de confidentialité | DRONE AIR",
      description:
        "Politique de confidentialité de DRONE AIR : renseignements recueillis dans le formulaire de demande de mission et utilisation de ces renseignements.",
    },
    en: {
      title: "Privacy Policy | DRONE AIR",
      description:
        "DRONE AIR privacy policy: the information collected through the mission request form and how it is used.",
    },
  },
  "/terms": {
    fr: {
      title: "Conditions d’utilisation | DRONE AIR",
      description:
        "Conditions d’utilisation du site de DRONE AIR : portée du contenu, évaluation des missions et limites des livrables aériens.",
    },
    en: {
      title: "Terms of Use | DRONE AIR",
      description:
        "DRONE AIR terms of use: scope of the site content, mission evaluation and the limits of aerial deliverables.",
    },
  },
};

function url(path: PublicPath, lang: Lang): string {
  if (lang === "fr") return `${SITE_URL}${path === "/" ? "/" : path}`;
  return path === "/" ? `${SITE_URL}/en` : `${SITE_URL}/en${path}`;
}

/** Canonical + hreflang alternates + Open Graph for a bilingual public page. */
export function publicHead(path: PublicPath, lang: Lang) {
  const { title, description } = SEO[path][lang];
  const canonical = url(path, lang);
  const frUrl = url(path, "fr");
  const enUrl = url(path, "en");

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: lang === "fr" ? "fr_CA" : "en_CA" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", hrefLang: "fr-CA", href: frUrl },
      { rel: "alternate", hrefLang: "en-CA", href: enUrl },
      { rel: "alternate", hrefLang: "x-default", href: frUrl },
    ],
  };
}

/** Head metadata for account/portal routes: never indexed. */
export function privateHead(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  };
}
