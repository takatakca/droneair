export const COMPANY = {
  name: "DRONE AIR",
  tagline: "PRECISION. WAYPOINT. SOLUTIONS.",
  street: "4625 Rue Fairway",
  cityFr: "Lachine, Québec H8T 1B7",
  cityEn: "Lachine, Quebec H8T 1B7",
  country: "Canada",
  phoneDisplay: "(514) 448-2825",
  phoneHref: "tel:+15144482825",
  phoneE164: "+1-514-448-2825",
  email: "info@dronair.ca",
  emailHref: "mailto:info@dronair.ca",
  website: "https://dronair.ca",
} as const;

export const localBusinessJsonLd = (lang: "fr" | "en") => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: COMPANY.name,
  description:
    lang === "fr"
      ? "Services professionnels de drone et solutions de données aériennes."
      : "Professional drone services and aerial data solutions",
  telephone: COMPANY.phoneE164,
  email: COMPANY.email,
  url: COMPANY.website,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.street,
    addressLocality: "Lachine",
    addressRegion: "QC",
    postalCode: "H8T 1B7",
    addressCountry: "CA",
  },
});
