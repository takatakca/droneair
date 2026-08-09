import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

const STORAGE_KEY = "drone-air-lang";

export const copy = {
  fr: {
    htmlLang: "fr-CA",
    nav: {
      home: "Accueil",
      solutions: "Solutions",
      contact: "Contact",
      privacy: "Politique de confidentialité",
      terms: "Conditions d’utilisation",
    },
    cta: { primary: "Planifier une mission", secondary: "Découvrir nos solutions" },
    strip: { call: "Appelez-nous", email: "Envoyez un courriel", plan: "Planifier une mission" },
    loading: "Initialisation de la mission",
    hero: {
      eyebrow: "INSPECTION • CARTOGRAPHIE • DONNÉES AÉRIENNES",
      heading: "Voyez votre terrain sous un nouvel angle.",
      statement:
        "Des missions aériennes précises. Des données organisées. Des décisions mieux informées.",
      lead: "DRONE AIR planifie des missions aériennes précises pour inspecter, cartographier, mesurer et documenter vos terrains, propriétés et infrastructures.",
      scroll: "Faites défiler",
      example: "Données de mission — exemple",
      hud: {
        altitude: "Altitude",
        route: "Trajectoire planifiée",
        waypoints: "Points de passage",
        scan: "Balayage du terrain",
        progress: "Progression de la mission",
        capture: "Captures d’images",
        area: "Zone balayée",
        duration: "Durée du vol",
        status: "Traitement",
        statusValue: "Terminé",
      },
    },
    solutions: {
      label: "Nos solutions",
      title: "Ce que nous documentons",
      chapter: "Service",
      note: "Les technologies spécialisées (thermique, LiDAR, capteurs additionnels) sont offertes selon l’équipement, les exigences de la mission, l’emplacement et après confirmation.",
      items: [
        {
          title: "Inspection de terrains et propriétés",
          body: "Toitures, façades, structures et terrains documentés en imagerie haute définition, sans échafaudage.",
        },
        {
          title: "Missions par points de passage",
          body: "Vols planifiés avec points de passage, altitude et couverture définis pour des résultats répétables.",
        },
        {
          title: "Cartographie et mesures",
          body: "Vues d’ensemble, orthophotos et mesures approximatives issues des images captées (sans arpentage légal).",
        },
        {
          title: "Suivi de chantier",
          body: "Séries d’images comparables dans le temps pour suivre l’avancement des travaux.",
        },
        {
          title: "Observation agricole et environnementale",
          body: "Survols de parcelles et de zones naturelles pour observer l’état du couvert et repérer les secteurs à vérifier.",
        },
        {
          title: "Extraction de données aériennes",
          body: "Images, orthophotos et rapports visuels organisés, prêts à être partagés avec vos équipes.",
        },
      ],
    },
    process: {
      label: "Déroulement",
      title: "De la demande aux données",
      lead: "Une seule mission, cinq étapes contrôlées, du repérage de la zone jusqu’à la remise des livrables.",
      steps: [
        { title: "Définition de la zone", body: "Emplacement, limites de la zone, objectifs et conditions de sécurité." },
        { title: "Planification des points de passage", body: "Points de passage, altitude, couverture et paramètres de capture." },
        { title: "Collecte des images et données", body: "Mission exécutée selon le plan approuvé et les restrictions applicables." },
        { title: "Traitement et organisation", body: "Tri, assemblage et contrôle de qualité des images et des données." },
        { title: "Livraison des résultats", body: "Livrables transmis avec un sommaire clair et exploitable." },
      ],
    },
    tech: {
      label: "Données aériennes",
      title: "De l’image brute au document annoté.",
      lead: "Chaque mission produit une série d’images géolocalisées. Le traitement les assemble en une vue d’ensemble sur laquelle les limites, les repères et les mesures approximatives peuvent être annotés.",
      before: "Capture brute",
      after: "Résultat annoté",
      hint: "Glissez pour comparer",
      note: "Vue de démonstration produite à partir de données de mission données à titre d’exemple. Les mesures aériennes sont approximatives et ne remplacent pas un arpentage légal.",
      overlays: [
        "Limites de la propriété",
        "Points de capture",
        "Ligne de mesure",
        "Coordonnées de référence",
      ],
    },
    contact: {
      title: "Parlez-nous de votre mission",
      intro:
        "Vous avez un terrain, une propriété, un bâtiment ou une zone à inspecter? Expliquez-nous votre projet. L’équipe de DRONE AIR pourra évaluer l’emplacement, les objectifs de la mission et les données dont vous avez besoin.",
      details: "Coordonnées",
      phoneLabel: "Téléphone",
      emailLabel: "Courriel",
      form: {
        name: "Nom",
        company: "Entreprise (facultatif)",
        email: "Courriel",
        phone: "Téléphone",
        prefLang: "Langue préférée",
        location: "Emplacement du projet",
        service: "Type de service",
        servicePlaceholder: "Choisir un service",
        area: "Superficie approximative (facultatif)",
        date: "Date souhaitée (facultatif)",
        message: "Description du projet",
        file: "Pièce jointe ou image (facultatif)",
        consent:
          "J’accepte que DRONE AIR utilise ces renseignements pour évaluer ma demande de mission.",
        submit: "Envoyer la demande",
        sending: "Transmission…",
        required: "Ce champ est requis.",
        invalidEmail: "Adresse courriel invalide.",
        consentRequired: "Votre consentement est requis.",
        fileTooLarge: "Le fichier dépasse 10 Mo.",
        fileType: "Formats acceptés : PDF, JPG, PNG ou WEBP.",
        fileHint: "PDF, JPG, PNG ou WEBP — 10 Mo maximum.",
        errorTitle: "La demande n’a pas pu être transmise",
        errorBody: "Veuillez réessayer, ou nous joindre directement par téléphone ou courriel.",
        rateLimited:
          "Trop de demandes ont été envoyées depuis cet appareil. Réessayez dans quelques minutes ou joignez-nous par téléphone.",
        attachmentFailed:
          "La pièce jointe n’a pas pu être téléversée. Réessayez, ou envoyez la demande sans pièce jointe.",
        noBackend:
          "Votre demande est enregistrée de façon sécurisée et consultée par DRONE AIR. Pour une réponse immédiate, appelez-nous.",
        confirmTitle: "Demande de mission reçue",
        confirmLabel: "Statut de la demande",
        confirmBody:
          "Merci. Votre demande de mission a été transmise à DRONE AIR et une confirmation vous est envoyée par courriel. Notre équipe examinera les renseignements fournis et communiquera avec vous concernant les prochaines étapes.",
        again: "Envoyer une autre demande",
        services: [
          "Inspection de terrain",
          "Inspection de propriété",
          "Mission par points de passage",
          "Cartographie",
          "Mesures",
          "Suivi de chantier",
          "Observation agricole",
          "Inspection thermique",
          "Photographie ou vidéo aérienne",
          "Extraction de données",
          "Autre",
        ],
      },
    },
    footer: {
      description:
        "DRONE AIR utilise la planification par points de passage, l’imagerie aérienne et les technologies de collecte de données pour inspecter, documenter et mieux comprendre les terrains, propriétés et infrastructures.",
      legalLabel: "Avis de sécurité",
      legal:
        "La disponibilité des services dépend de l’emplacement, des conditions météorologiques, de l’espace aérien, des restrictions applicables et des exigences de sécurité. Chaque demande de mission doit être évaluée avant le vol.",
      contactLabel: "Coordonnées",
      navLabel: "Navigation",
      servicesLabel: "Services",
      langLabel: "Langue",
      websiteLabel: "Site Web",
    },
    privacy: {
      title: "Politique de confidentialité",
      body: [
        "DRONE AIR recueille uniquement les renseignements que vous fournissez dans le formulaire de demande de mission : nom, entreprise, courriel, téléphone, emplacement du projet et description du projet.",
        "Ces renseignements servent exclusivement à évaluer votre demande, à planifier la mission et à communiquer avec vous. Ils ne sont ni vendus, ni loués, ni échangés.",
        "Les images et données captées lors d’une mission demeurent liées au mandat convenu avec le client.",
        "Après l’envoi du formulaire, un courriel de confirmation vous est transmis et une notification interne est envoyée à DRONE AIR. Un traitement automatisé peut résumer et classer votre demande afin d’en accélérer l’évaluation; aucune mission, aucun prix et aucune disponibilité ne sont confirmés automatiquement. Chaque demande est révisée par une personne.",
        "Pour toute question ou pour demander la suppression de vos renseignements, écrivez à info@drone-air.ca ou téléphonez au (514) 448-2825.",
      ],
    },
    terms: {
      title: "Conditions d’utilisation",
      body: [
        "Le contenu de ce site est fourni à titre informatif. Il ne constitue ni une offre contractuelle, ni une garantie de disponibilité de service.",
        "Chaque mission est soumise à une évaluation préalable : emplacement, espace aérien, conditions météorologiques, restrictions applicables et exigences de sécurité.",
        "Les livrables aériens ne remplacent pas un arpentage légal, une expertise d’ingénierie ou une certification cadastrale.",
        "Les textes, images et éléments visuels de ce site appartiennent à DRONE AIR.",
      ],
    },
    notFound: {
      label: "Erreur 404",
      title: "Page introuvable",
      body: "Cette trajectoire ne mène à aucune page. Le lien est peut-être expiré ou mal saisi.",
      home: "Retour à l’accueil",
      contact: "Planifier une mission",
    },
    portal: {
      nav: { account: "Espace client", admin: "Administration", signIn: "Connexion", signOut: "Déconnexion" },
      auth: {
        loginTitle: "Connexion à l’espace client",
        loginIntro: "Accédez à vos projets et à vos livrables DRONE AIR.",
        signupTitle: "Créer un accès client",
        signupIntro:
          "Créez votre accès. Un membre de DRONE AIR associera ensuite votre compte à votre dossier client.",
        email: "Courriel",
        password: "Mot de passe",
        firstName: "Prénom",
        lastName: "Nom",
        signIn: "Se connecter",
        signUp: "Créer le compte",
        working: "Traitement…",
        forgot: "Mot de passe oublié?",
        noAccount: "Pas encore de compte?",
        haveAccount: "Vous avez déjà un compte?",
        resetTitle: "Réinitialiser le mot de passe",
        resetIntro: "Indiquez votre courriel; un lien de réinitialisation vous sera envoyé.",
        resetSend: "Envoyer le lien",
        resetSent: "Si un compte existe pour ce courriel, un lien de réinitialisation vient d’être envoyé.",
        newPasswordTitle: "Nouveau mot de passe",
        newPassword: "Nouveau mot de passe",
        updatePassword: "Mettre à jour",
        passwordUpdated: "Mot de passe mis à jour.",
        confirmEmail:
          "Compte créé. Vérifiez votre boîte de réception et confirmez votre courriel avant de vous connecter.",
        passwordRule: "Minimum 8 caractères.",
        genericError: "La demande n’a pas pu être complétée.",
      },
      client: {
        title: "Espace client",
        welcome: "Bonjour",
        noClient:
          "Votre compte n’est pas encore associé à un dossier client. DRONE AIR activera votre accès sous peu.",
        projects: "Projets",
        files: "Classeur de documents",
        noFiles: "Aucun document n’a encore été publié.",
        allProjects: "Tous les projets",
        download: "Télécharger",
        preparing: "Préparation…",
        category: "Catégorie",
        size: "Taille",
        published: "Publié le",
        version: "Version",
        downloadNote: "Les liens de téléchargement sont privés et expirent après quelques minutes.",
      },
      admin: {
        title: "Administration",
        clients: "Dossiers clients",
        newClient: "Nouveau dossier client",
        clientName: "Nom du client",
        create: "Créer",
        members: "Accès",
        addMember: "Associer un compte (courriel)",
        add: "Associer",
        projects: "Projets",
        newProject: "Nouveau projet",
        projectTitle: "Titre du projet",
        reference: "Référence",
        location: "Emplacement",
        status: "Statut",
        files: "Documents",
        upload: "Téléverser un document",
        uploading: "Téléversement…",
        fileName: "Nom affiché",
        description: "Description",
        project: "Projet",
        none: "Aucun",
        publish: "Publier",
        unpublish: "Retirer",
        archive: "Archiver",
        restore: "Restaurer",
        pending: "Téléversement incomplet",
        visible: "Visible par le client",
        hidden: "Interne",
        missions: "Demandes de mission récentes",
        select: "Ouvrir",
        back: "Retour",
        empty: "Aucun dossier client pour le moment.",
      },
    },
  },
  en: {
    htmlLang: "en-CA",
    nav: {
      home: "Home",
      solutions: "Solutions",
      contact: "Contact",
      privacy: "Privacy policy",
      terms: "Terms of use",
    },
    cta: { primary: "Plan a Mission", secondary: "Explore Our Solutions" },
    strip: { call: "Call Us", email: "Send an Email", plan: "Plan a Mission" },
    loading: "Initializing mission",
    hero: {
      eyebrow: "INSPECTION • MAPPING • AERIAL DATA",
      heading: "See your land from a new perspective.",
      statement: "Precise aerial missions. Organized data. Better-informed decisions.",
      lead: "DRONE AIR plans precise aerial missions to inspect, map, measure, and document land, properties, and infrastructure.",
      scroll: "Scroll",
      example: "Example mission data",
      hud: {
        altitude: "Altitude",
        route: "Planned route",
        waypoints: "Waypoints",
        scan: "Terrain scan",
        progress: "Mission progress",
        capture: "Image capture",
        area: "Area scanned",
        duration: "Flight duration",
        status: "Processing",
        statusValue: "Complete",
      },
    },
    solutions: {
      label: "Our solutions",
      title: "What we document",
      chapter: "Service",
      note: "Specialized technologies (thermal, LiDAR, additional sensors) are available depending on equipment, mission requirements, location, and confirmation.",
      items: [
        {
          title: "Land and Property Inspection",
          body: "Roofs, façades, structures, and land documented in high-definition imagery, without scaffolding.",
        },
        {
          title: "Waypoint Missions",
          body: "Flights planned with defined waypoints, altitude, and coverage for repeatable results.",
        },
        {
          title: "Mapping and Measurements",
          body: "Overviews, orthophotos, and approximate measurements derived from captured imagery (not legal surveying).",
        },
        {
          title: "Construction Monitoring",
          body: "Repeatable image sets over time so construction progress stays comparable.",
        },
        {
          title: "Agricultural and Environmental Observation",
          body: "Flights over parcels and natural areas to observe ground cover and flag zones to verify.",
        },
        {
          title: "Aerial Data Extraction",
          body: "Images, orthophotos, and organized visual reports ready to share with your teams.",
        },
      ],
    },
    process: {
      label: "Process",
      title: "From request to data",
      lead: "One mission, five controlled stages, from defining the area to handing over the deliverables.",
      steps: [
        { title: "Area Definition", body: "Location, area boundaries, objectives, and safety conditions." },
        { title: "Waypoint Planning", body: "Waypoints, altitude, coverage, and capture parameters." },
        { title: "Image and Data Capture", body: "Mission flown to the approved plan and applicable restrictions." },
        { title: "Processing and Organization", body: "Sorting, assembly, and quality control of images and data." },
        { title: "Delivery of Results", body: "Deliverables handed over with a clear, usable summary." },
      ],
    },
    tech: {
      label: "Aerial data",
      title: "From raw capture to annotated document.",
      lead: "Every mission produces a series of geolocated images. Processing assembles them into a single overview where boundaries, reference points, and approximate measurements can be annotated.",
      before: "Raw capture",
      after: "Annotated result",
      hint: "Drag to compare",
      note: "Demonstration view built from mission data shown as an example. Aerial measurements are approximate and do not replace legal land surveying.",
      overlays: [
        "Property boundaries",
        "Capture points",
        "Measurement line",
        "Reference coordinates",
      ],
    },
    contact: {
      title: "Tell Us About Your Mission",
      intro:
        "Do you have land, a property, a building, or a specific area that needs to be inspected? Tell us about your project. The DRONE AIR team can evaluate the location, mission objectives, and the type of information you need.",
      details: "Company details",
      phoneLabel: "Telephone",
      emailLabel: "Email",
      form: {
        name: "Name",
        company: "Company (optional)",
        email: "Email",
        phone: "Telephone",
        prefLang: "Preferred language",
        location: "Project location",
        service: "Service type",
        servicePlaceholder: "Select a service",
        area: "Approximate area or property size (optional)",
        date: "Desired date (optional)",
        message: "Project description",
        file: "File or image attachment (optional)",
        consent:
          "I agree that DRONE AIR may use this information to evaluate my mission request.",
        submit: "Send request",
        sending: "Sending…",
        required: "This field is required.",
        invalidEmail: "Invalid email address.",
        consentRequired: "Your consent is required.",
        fileTooLarge: "The file exceeds 10 MB.",
        fileType: "Accepted formats: PDF, JPG, PNG or WEBP.",
        fileHint: "PDF, JPG, PNG or WEBP — 10 MB maximum.",
        errorTitle: "The request could not be sent",
        errorBody: "Please try again, or reach us directly by telephone or email.",
        rateLimited:
          "Too many requests have been sent from this device. Try again in a few minutes, or call us.",
        attachmentFailed:
          "The attachment could not be uploaded. Try again, or send the request without an attachment.",
        noBackend:
          "Your request is stored securely and reviewed by DRONE AIR. For an immediate answer, call us.",
        confirmTitle: "Mission request received",
        confirmLabel: "Request status",
        confirmBody:
          "Thank you. Your mission request has been sent to DRONE AIR and a confirmation email is on its way to you. Our team will review the information provided and contact you regarding the next steps.",
        again: "Send another request",
        services: [
          "Land inspection",
          "Property inspection",
          "Waypoint mission",
          "Mapping",
          "Measurements",
          "Construction monitoring",
          "Agricultural observation",
          "Thermal inspection",
          "Aerial photography or video",
          "Data extraction",
          "Other",
        ],
      },
    },
    footer: {
      description:
        "DRONE AIR uses waypoint planning, aerial imaging, and data-collection technology to inspect, document, and better understand land, properties, and infrastructure.",
      legalLabel: "Safety notice",
      legal:
        "Service availability depends on location, weather conditions, airspace, applicable restrictions, and safety requirements. Every mission request must be evaluated before flight.",
      contactLabel: "Contact",
      navLabel: "Navigation",
      servicesLabel: "Services",
      langLabel: "Language",
      websiteLabel: "Website",
    },
    privacy: {
      title: "Privacy policy",
      body: [
        "DRONE AIR collects only the information you provide in the mission request form: name, company, email, telephone, project location, and project description.",
        "This information is used solely to evaluate your request, plan the mission, and contact you. It is never sold, rented, or traded.",
        "Images and data captured during a mission remain tied to the mandate agreed with the client.",
        "After the form is submitted, a confirmation email is sent to you and an internal notification is sent to DRONE AIR. Automated processing may summarize and classify your request to speed up evaluation; no mission, price, or availability is ever confirmed automatically. Every request is reviewed by a person.",
        "For any question, or to request deletion of your information, write to info@drone-air.ca or call (514) 448-2825.",
      ],
    },
    terms: {
      title: "Terms of use",
      body: [
        "The content of this site is provided for information purposes. It is not a contractual offer nor a guarantee of service availability.",
        "Every mission is subject to prior evaluation: location, airspace, weather conditions, applicable restrictions, and safety requirements.",
        "Aerial deliverables do not replace legal land surveying, engineering expertise, or cadastral certification.",
        "Text, images, and visual elements on this site belong to DRONE AIR.",
      ],
    },
    notFound: {
      label: "Error 404",
      title: "Page not found",
      body: "This route does not lead to a page. The link may have expired or been mistyped.",
      home: "Back to home",
      contact: "Plan a Mission",
    },
    portal: {
      nav: { account: "Client area", admin: "Administration", signIn: "Sign in", signOut: "Sign out" },
      auth: {
        loginTitle: "Sign in to the client area",
        loginIntro: "Access your DRONE AIR projects and deliverables.",
        signupTitle: "Create client access",
        signupIntro:
          "Create your access. A DRONE AIR team member will then link your account to your client file.",
        email: "Email",
        password: "Password",
        firstName: "First name",
        lastName: "Last name",
        signIn: "Sign in",
        signUp: "Create account",
        working: "Working…",
        forgot: "Forgot your password?",
        noAccount: "No account yet?",
        haveAccount: "Already have an account?",
        resetTitle: "Reset your password",
        resetIntro: "Enter your email and we will send you a reset link.",
        resetSend: "Send the link",
        resetSent: "If an account exists for that email, a reset link has just been sent.",
        newPasswordTitle: "New password",
        newPassword: "New password",
        updatePassword: "Update",
        passwordUpdated: "Password updated.",
        confirmEmail: "Account created. Check your inbox and confirm your email before signing in.",
        passwordRule: "Minimum 8 characters.",
        genericError: "The request could not be completed.",
      },
      client: {
        title: "Client area",
        welcome: "Hello",
        noClient:
          "Your account is not linked to a client file yet. DRONE AIR will activate your access shortly.",
        projects: "Projects",
        files: "File cabinet",
        noFiles: "No documents have been published yet.",
        allProjects: "All projects",
        download: "Download",
        preparing: "Preparing…",
        category: "Category",
        size: "Size",
        published: "Published",
        version: "Version",
        downloadNote: "Download links are private and expire after a few minutes.",
      },
      admin: {
        title: "Administration",
        clients: "Client files",
        newClient: "New client file",
        clientName: "Client name",
        create: "Create",
        members: "Access",
        addMember: "Link an account (email)",
        add: "Link",
        projects: "Projects",
        newProject: "New project",
        projectTitle: "Project title",
        reference: "Reference",
        location: "Location",
        status: "Status",
        files: "Documents",
        upload: "Upload a document",
        uploading: "Uploading…",
        fileName: "Display name",
        description: "Description",
        project: "Project",
        none: "None",
        publish: "Publish",
        unpublish: "Unpublish",
        archive: "Archive",
        restore: "Restore",
        pending: "Upload incomplete",
        visible: "Visible to client",
        hidden: "Internal",
        missions: "Recent mission requests",
        select: "Open",
        back: "Back",
        empty: "No client files yet.",
      },
    },
  },
} as const;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (typeof copy)["fr"] };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = copy[lang].htmlLang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

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
