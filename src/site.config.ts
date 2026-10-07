/**
 * SEO + consent kit: the ONE settings file per site.
 *
 * Rules:
 * - Only facts already present in this repo. Never invent an address, hours, phone, rating or review.
 * - Unknown values stay `undefined` with a `TODO(owner)` comment; the JSON-LD builder skips them.
 * - `url` is the real production domain, never *.lovable.app.
 */
import { COMPANY, SITE_URL } from "@/lib/company";

export type SchemaType =
  "Organization" | "LocalBusiness" | "Restaurant" | "NGO" | "SportsOrganization" | "Event";

export type PostalAddress = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string | undefined;
  addressCountry: string;
};

export type SiteConfig = {
  name: string;
  legalName?: string | undefined;
  url: string;
  lang: "fr-CA";
  locale: "fr_CA";
  defaultTitle: string;
  defaultDescription: string;
  ogImage?: string | undefined;
  logo?: string | undefined;
  schemaType: SchemaType;
  email?: string | undefined;
  phone?: string | undefined;
  address?: PostalAddress | undefined;
  sameAs: string[];
  privacyPath?: string | undefined;
  privacyOfficer: { name?: string | undefined; email?: string | undefined };
};

export const SITE: SiteConfig = {
  name: COMPANY.name,
  url: SITE_URL,
  lang: "fr-CA",
  locale: "fr_CA",
  defaultTitle: "DRONE AIR | Inspection, cartographie et données aériennes",
  defaultDescription:
    "DRONE AIR offre des solutions d’inspection aérienne, de planification par points de passage, de cartographie et de collecte de données pour les terrains, propriétés et infrastructures.",
  ogImage: "/og-drone-air.jpg",
  logo: "/apple-touch-icon.png",
  schemaType: "LocalBusiness",
  email: COMPANY.email,
  phone: COMPANY.phoneE164,
  address: {
    streetAddress: COMPANY.street,
    addressLocality: "Lachine",
    addressRegion: "QC",
    postalCode: "H8T 1B7",
    addressCountry: "CA",
  },
  // TODO(owner): add real Facebook / Instagram / LinkedIn profile URLs when they exist.
  sameAs: [],
  privacyPath: "/privacy",
  // TODO(owner): name of the person responsible for personal information (Law 25).
  privacyOfficer: { name: undefined, email: COMPANY.email },
};
