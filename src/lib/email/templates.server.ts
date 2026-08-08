/** Server-only HTML + plain-text email bodies for DRONE AIR mission requests. */
import { COMPANY, SITE_URL } from "@/lib/company";

export type Lang = "fr" | "en";

export interface MissionEmailData {
  id: string;
  createdAt: string;
  name: string;
  company: string | null;
  email: string;
  telephone: string;
  preferredLanguage: Lang;
  location: string;
  service: string;
  area: string | null;
  desiredDate: string | null;
  description: string;
  hasAttachment: boolean;
  attachmentLink: string | null;
  status: string;
  sourcePage: string;
  leadPriority: string;
  leadType: string;
  aiSummary?: string | null;
  aiQuestions?: string[] | null;
}

/** Escapes every user-provided value before it enters an HTML email. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const FOOTER_TEXT = [
  COMPANY.name,
  COMPANY.street,
  "Lachine, Québec H8T 1B7",
  COMPANY.country,
  "",
  COMPANY.phoneDisplay,
  COMPANY.email,
  SITE_URL,
  "",
  "Precision. Waypoint. Solutions.",
].join("\n");

function footerHtml(): string {
  return `<tr><td style="padding:24px 28px 28px;border-top:1px solid #d8d8d8;font:12px/1.7 Arial,Helvetica,sans-serif;color:#5a5a5a">
    <strong style="color:#111111">${esc(COMPANY.name)}</strong><br>
    ${esc(COMPANY.street)}<br>Lachine, Québec H8T 1B7<br>${esc(COMPANY.country)}<br><br>
    <a href="${COMPANY.phoneHref}" style="color:#111111;text-decoration:none">${esc(COMPANY.phoneDisplay)}</a><br>
    <a href="${COMPANY.emailHref}" style="color:#111111;text-decoration:none">${esc(COMPANY.email)}</a><br>
    <a href="${SITE_URL}" style="color:#111111;text-decoration:none">${esc(COMPANY.websiteDisplay)}</a><br><br>
    <span style="letter-spacing:.16em;font-size:10px;text-transform:uppercase;color:#8a7a4a">Precision. Waypoint. Solutions.</span>
  </td></tr>`;
}

/** Text-first shell: readable with images blocked, no external assets. */
function shell(title: string, bodyHtml: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background-color:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border:1px solid #e4e4e4">
  <tr><td style="background-color:#0b0b0c;padding:20px 28px">
    <span style="font:700 16px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.22em;color:#e9e9ec">DRONE&nbsp;AIR</span>
    <span style="display:block;margin-top:6px;font:400 10px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.2em;color:#8a7a4a;text-transform:uppercase">Precision. Waypoint. Solutions.</span>
  </td></tr>
  <tr><td style="height:2px;background-color:#2d6cf6"></td></tr>
  <tr><td style="padding:28px;font:14px/1.75 Arial,Helvetica,sans-serif;color:#1b1b1b">${bodyHtml}</td></tr>
  ${footerHtml()}
</table>
</td></tr></table></body></html>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;font:11px/1.6 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#6b6b6b;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:6px 0;font:14px/1.7 Arial,Helvetica,sans-serif;color:#111111">${esc(value)}</td></tr>`;
}

/** Internal notification to info@drone-air.ca. */
export function internalNotification(d: MissionEmailData) {
  const fr = d.preferredLanguage === "fr";
  const subject = fr
    ? `Nouvelle demande de mission DRONE AIR — ${d.name} — ${d.service}`
    : `New DRONE AIR Mission Request — ${d.name} — ${d.service}`;

  const fields: Array<[string, string]> = [
    ["ID", d.id],
    [fr ? "Reçue le" : "Received", d.createdAt],
    [fr ? "Nom" : "Name", d.name],
    [fr ? "Entreprise" : "Company", d.company ?? "—"],
    ["Email", d.email],
    [fr ? "Téléphone" : "Telephone", d.telephone],
    [fr ? "Langue" : "Language", d.preferredLanguage.toUpperCase()],
    [fr ? "Emplacement" : "Location", d.location],
    ["Service", d.service],
    [fr ? "Superficie" : "Area", d.area ?? "—"],
    [fr ? "Date souhaitée" : "Desired date", d.desiredDate ?? "—"],
    [fr ? "Pièce jointe" : "Attachment", d.hasAttachment ? (fr ? "Oui" : "Yes") : fr ? "Non" : "No"],
    [fr ? "Priorité" : "Priority", d.leadPriority],
    ["Type", d.leadType],
    ["Statut", d.status],
    ["Source", d.sourcePage],
  ];

  const attachmentHtml = d.attachmentLink
    ? `<p style="margin:16px 0 0"><a href="${esc(d.attachmentLink)}" style="color:#2d6cf6">${fr ? "Ouvrir la pièce jointe (lien temporaire sécurisé)" : "Open attachment (secure temporary link)"}</a></p>`
    : "";

  const aiHtml = d.aiSummary
    ? `<h3 style="margin:28px 0 8px;font:700 13px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6b6b6b">${fr ? "Résumé assisté" : "Assisted summary"}</h3><p style="margin:0;white-space:pre-line">${esc(d.aiSummary)}</p>${
        d.aiQuestions && d.aiQuestions.length > 0
          ? `<ul style="margin:12px 0 0;padding-left:20px">${d.aiQuestions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>`
          : ""
      }`
    : "";

  const html = shell(
    subject,
    `<h1 style="margin:0 0 20px;font:700 20px/1.3 Arial,Helvetica,sans-serif;color:#111111">${esc(subject)}</h1>
     <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${fields.map(([l, v]) => row(l, v)).join("")}</table>
     <h3 style="margin:28px 0 8px;font:700 13px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6b6b6b">${fr ? "Description" : "Description"}</h3>
     <p style="margin:0;white-space:pre-line">${esc(d.description)}</p>
     ${attachmentHtml}${aiHtml}`,
  );

  const text = [
    subject,
    "",
    ...fields.map(([l, v]) => `${l}: ${v}`),
    "",
    `${fr ? "Description" : "Description"}:`,
    d.description,
    d.attachmentLink ? `\n${fr ? "Pièce jointe" : "Attachment"}: ${d.attachmentLink}` : "",
    d.aiSummary ? `\n${fr ? "Résumé assisté" : "Assisted summary"}: ${d.aiSummary}` : "",
    ...(d.aiQuestions ?? []).map((q) => `- ${q}`),
    "",
    FOOTER_TEXT,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

/** Customer acknowledgment in the requester's language. */
export function customerAcknowledgment(d: MissionEmailData, aiParagraph?: string | null) {
  const fr = d.preferredLanguage === "fr";
  const firstName = d.name.trim().split(/\s+/)[0] ?? d.name;
  const subject = fr
    ? "Nous avons reçu votre demande de mission — DRONE AIR"
    : "We received your mission request — DRONE AIR";

  const paragraphs = fr
    ? [
        `Bonjour ${firstName},`,
        "Merci d’avoir communiqué avec DRONE AIR.",
        `Nous avons bien reçu votre demande concernant ${d.service} à ${d.location}.`,
        "Les informations de votre projet ont été transmises à notre équipe pour évaluation.",
        "Avant de confirmer une mission, nous devons notamment examiner l’emplacement, les objectifs du projet, les conditions opérationnelles et les exigences applicables au vol.",
        ...(aiParagraph ? [aiParagraph] : []),
        "Si nous avons besoin de renseignements supplémentaires, nous communiquerons avec vous.",
        `Votre référence :\n${d.id}`,
      ]
    : [
        `Hello ${firstName},`,
        "Thank you for contacting DRONE AIR.",
        `We received your request regarding ${d.service} at ${d.location}.`,
        "Your project information has been forwarded to our team for review.",
        "Before confirming a mission, we need to review factors including the location, project objectives, operational conditions, and applicable flight requirements.",
        ...(aiParagraph ? [aiParagraph] : []),
        "If additional information is required, we will contact you.",
        `Reference:\n${d.id}`,
      ];

  const html = shell(
    subject,
    paragraphs
      .map(
        (p) =>
          `<p style="margin:0 0 16px;white-space:pre-line">${esc(p)}</p>`,
      )
      .join(""),
  );

  const text = [...paragraphs, "", FOOTER_TEXT].join("\n\n");
  return { subject, html, text };
}