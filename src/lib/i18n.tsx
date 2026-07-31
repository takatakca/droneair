import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

export const copy = {
  fr: {
    nav: { home: "Accueil", solutions: "Solutions", contact: "Contact" },
    cta: { primary: "Planifier une mission", secondary: "Découvrir nos solutions" },
    strip: { call: "Appelez-nous", email: "Envoyez un courriel", plan: "Planifier une mission" },
    loading: "Initialisation de la mission",
    hero: {
      eyebrow: "Missions par points de passage",
      statement:
        "Des missions aériennes précises. Des données organisées. Des décisions mieux informées.",
      lead: "Planification de vol, imagerie aérienne et collecte de données pour terrains, propriétés et infrastructures.",
      hud: {
        altitude: "Altitude",
        route: "Trajectoire planifiée",
        waypoints: "Points de passage",
        scan: "Balayage du terrain",
      },
    },
    solutions: {
      label: "Nos solutions",
      title: "Ce que nous documentons",
      items: [
        {
          title: "Inspection de bâtiments",
          body: "Toitures, façades et structures documentées en imagerie haute définition, sans échafaudage.",
        },
        {
          title: "Cartographie de terrains",
          body: "Relevés de terrain, limites de propriété et modèles visuels issus de vols par points de passage.",
        },
        {
          title: "Suivi de chantier",
          body: "Séries d’images comparables dans le temps pour suivre l’avancement des travaux.",
        },
        {
          title: "Données et livrables",
          body: "Images, orthophotos et rapports organisés, prêts à être partagés avec vos équipes.",
        },
      ],
    },
    process: {
      label: "Déroulement",
      title: "De la demande aux données",
      steps: [
        { title: "Évaluation", body: "Emplacement, objectifs, espace aérien et conditions de sécurité." },
        { title: "Planification", body: "Points de passage, altitude, couverture et paramètres de capture." },
        { title: "Vol", body: "Mission exécutée selon le plan approuvé et les restrictions applicables." },
        { title: "Livraison", body: "Données traitées, organisées et transmises avec un sommaire clair." },
      ],
    },
    contact: {
      title: "Parlez-nous de votre mission",
      intro:
        "Vous avez un terrain, une propriété, un bâtiment ou une zone à inspecter? Expliquez-nous votre projet. L’équipe de DRONE R’AIR pourra évaluer l’emplacement, les objectifs de la mission et les données dont vous avez besoin.",
      details: "Coordonnées",
      phoneLabel: "Téléphone",
      emailLabel: "Courriel",
      form: {
        name: "Nom",
        email: "Courriel",
        phone: "Téléphone",
        location: "Emplacement de la mission",
        message: "Décrivez votre projet",
        submit: "Envoyer la demande",
        confirmTitle: "Demande de mission reçue",
        confirmBody:
          "Merci. Votre demande a été enregistrée. Pour une réponse plus rapide, contactez-nous directement :",
        again: "Envoyer une autre demande",
      },
    },
    footer: {
      description:
        "DRONE R’AIR utilise la planification par points de passage, l’imagerie aérienne et les technologies de collecte de données pour inspecter, documenter et mieux comprendre les terrains, propriétés et infrastructures.",
      legalLabel: "Avis légal et sécurité",
      legal:
        "La disponibilité des services dépend de l’emplacement, des conditions météorologiques, de l’espace aérien, des restrictions applicables et des exigences de sécurité. Chaque demande de mission doit être évaluée avant le vol.",
      contactLabel: "Coordonnées",
    },
  },
  en: {
    nav: { home: "Home", solutions: "Solutions", contact: "Contact" },
    cta: { primary: "Plan a Mission", secondary: "Explore Our Solutions" },
    strip: { call: "Call Us", email: "Send an Email", plan: "Plan a Mission" },
    loading: "Initializing mission",
    hero: {
      eyebrow: "Waypoint missions",
      statement: "Precise aerial missions. Organized data. Better-informed decisions.",
      lead: "Flight planning, aerial imaging, and data collection for land, properties, and infrastructure.",
      hud: {
        altitude: "Altitude",
        route: "Planned route",
        waypoints: "Waypoints",
        scan: "Terrain scan",
      },
    },
    solutions: {
      label: "Our solutions",
      title: "What we document",
      items: [
        {
          title: "Building inspection",
          body: "Roofs, façades, and structures documented in high-definition imagery, without scaffolding.",
        },
        {
          title: "Land mapping",
          body: "Terrain surveys, property boundaries, and visual models produced from waypoint flights.",
        },
        {
          title: "Site progress",
          body: "Repeatable image sets over time so construction progress stays comparable.",
        },
        {
          title: "Data and deliverables",
          body: "Images, orthophotos, and organized reports ready to share with your teams.",
        },
      ],
    },
    process: {
      label: "Process",
      title: "From request to data",
      steps: [
        { title: "Evaluation", body: "Location, objectives, airspace, and safety conditions." },
        { title: "Planning", body: "Waypoints, altitude, coverage, and capture parameters." },
        { title: "Flight", body: "Mission flown to the approved plan and applicable restrictions." },
        { title: "Delivery", body: "Processed data, organized and delivered with a clear summary." },
      ],
    },
    contact: {
      title: "Tell Us About Your Mission",
      intro:
        "Do you have land, a property, a building, or a specific area that needs to be inspected? Tell us about your project. The DRONE R’AIR team can evaluate the location, mission objectives, and the type of information you need.",
      details: "Company details",
      phoneLabel: "Telephone",
      emailLabel: "Email",
      form: {
        name: "Name",
        email: "Email",
        phone: "Telephone",
        location: "Mission location",
        message: "Describe your project",
        submit: "Send request",
        confirmTitle: "Mission request received",
        confirmBody:
          "Thank you. Your request has been recorded. For a faster reply, reach us directly:",
        again: "Send another request",
      },
    },
    footer: {
      description:
        "DRONE R’AIR uses waypoint planning, aerial imaging, and data-collection technology to inspect, document, and better understand land, properties, and infrastructure.",
      legalLabel: "Legal and safety notice",
      legal:
        "Service availability depends on location, weather conditions, airspace, applicable restrictions, and safety requirements. Every mission request must be evaluated before flight.",
      contactLabel: "Contact",
    },
  },
} as const;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (typeof copy)["fr"] };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: copy[lang] as (typeof copy)["fr"] }),
    [lang, setLang],
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}