/**
 * Server-only mission triage. The AI layer only classifies and summarizes; it
 * never confirms a mission, quotes a price, promises availability, or asserts
 * regulatory compliance. Any failure degrades to human review.
 */
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = process.env["MISSION_AI_MODEL"] ?? "google/gemini-2.5-flash";

export const LEAD_TYPES = [
  "inspection",
  "waypoint",
  "mapping",
  "construction",
  "agriculture",
  "aerial_media",
  "data_extraction",
  "thermal_interest",
  "other",
] as const;

export interface MissionTriage {
  leadPriority: "low" | "normal" | "high";
  leadType: (typeof LEAD_TYPES)[number];
  summary: string;
  followUpQuestions: string[];
  customerParagraph: string | null;
  humanReviewRequired: boolean;
  ok: boolean;
  errorSummary?: string;
}

const FALLBACK: MissionTriage = {
  leadPriority: "normal",
  leadType: "other",
  summary: "",
  followUpQuestions: [],
  customerParagraph: null,
  humanReviewRequired: true,
  ok: false,
};

const SYSTEM = `You triage inbound drone-service mission requests for DRONE AIR (Lachine, Québec).
Strict rules:
- Never confirm, schedule, or guarantee a mission, price, timeline, or availability.
- Never state that a flight is legal, permitted, or compliant.
- Never invent facts that are not in the request.
- Stay factual, professional, and concise. No marketing language, no emojis.
- The customer paragraph must be neutral, must state that the request is under review, and must not commit to anything.
- Write the customer paragraph in the requester's preferred language (fr or en).
Return only the requested structured data.`;

const schema = {
  name: "triage_mission_request",
  description: "Classify and summarize a mission request",
  parameters: {
    type: "object",
    properties: {
      lead_priority: { type: "string", enum: ["low", "normal", "high"] },
      lead_type: { type: "string", enum: [...LEAD_TYPES] },
      summary: { type: "string", description: "2-4 sentence internal summary" },
      follow_up_questions: {
        type: "array",
        items: { type: "string" },
        description: "Up to 4 clarifying questions the DRONE AIR team should ask",
      },
      customer_paragraph: {
        type: "string",
        description: "One neutral paragraph for the customer acknowledgment email",
      },
    },
    required: ["lead_priority", "lead_type", "summary", "follow_up_questions", "customer_paragraph"],
    additionalProperties: false,
  },
} as const;

export async function triageMissionRequest(input: {
  name: string;
  company: string | null;
  preferredLanguage: "fr" | "en";
  location: string;
  service: string;
  area: string | null;
  desiredDate: string | null;
  description: string;
}): Promise<MissionTriage> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { ...FALLBACK, errorSummary: "LOVABLE_API_KEY is not configured" };

  const userContent = JSON.stringify(input);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    const response = await fetch(GATEWAY, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userContent },
        ],
        tools: [{ type: "function", function: schema }],
        tool_choice: { type: "function", function: { name: schema.name } },
      }),
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      const body = await response.text();
      console.error(`mission triage failed [${response.status}]: ${body.slice(0, 300)}`);
      return { ...FALLBACK, errorSummary: `ai_${response.status}` };
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: { tool_calls?: Array<{ function?: { arguments?: string } }> };
      }>;
    };
    const args = payload.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return { ...FALLBACK, errorSummary: "ai_empty_response" };

    const parsed = JSON.parse(args) as {
      lead_priority?: string;
      lead_type?: string;
      summary?: string;
      follow_up_questions?: unknown;
      customer_paragraph?: string;
    };

    const priority =
      parsed.lead_priority === "high" || parsed.lead_priority === "low" ? parsed.lead_priority : "normal";
    const leadType = (LEAD_TYPES as readonly string[]).includes(parsed.lead_type ?? "")
      ? (parsed.lead_type as MissionTriage["leadType"])
      : "other";
    const questions = Array.isArray(parsed.follow_up_questions)
      ? parsed.follow_up_questions.filter((q): q is string => typeof q === "string").slice(0, 4)
      : [];
    const paragraph = typeof parsed.customer_paragraph === "string" ? parsed.customer_paragraph.slice(0, 900) : null;

    return {
      leadPriority: priority,
      leadType,
      summary: (parsed.summary ?? "").slice(0, 1500),
      followUpQuestions: questions,
      customerParagraph: paragraph,
      // Every request is still reviewed by a human before any commitment.
      humanReviewRequired: true,
      ok: true,
    };
  } catch (error) {
    console.error("mission triage error", error instanceof Error ? error.message : error);
    return { ...FALLBACK, errorSummary: "ai_exception" };
  }
}