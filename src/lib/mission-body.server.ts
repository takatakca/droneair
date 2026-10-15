import { MAX_MISSION_BODY_BYTES } from "@/lib/mission-request";

/** Thrown before parsing or storing an oversized public multipart request. */
export class MissionBodyTooLargeError extends Error {
  constructor() {
    super("Mission request body exceeds the allowed size");
    this.name = "MissionBodyTooLargeError";
  }
}

/**
 * Read a bounded multipart body even when Content-Length is missing or false.
 * The request must not be parsed by request.formData() before this limit.
 */
export async function readBoundedMissionForm(request: Request): Promise<FormData> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!/^multipart\/form-data\s*;/i.test(contentType)) {
    throw new TypeError("Expected multipart/form-data");
  }

  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader !== null) {
    const length = Number(lengthHeader);
    if (!Number.isSafeInteger(length) || length < 0) {
      throw new TypeError("Invalid content length");
    }
    if (length > MAX_MISSION_BODY_BYTES) throw new MissionBodyTooLargeError();
  }

  if (!request.body) throw new TypeError("Empty request body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_MISSION_BODY_BYTES) {
        // Cancellation is best effort: do not retain the oversize body.
        void reader.cancel().catch(() => {});
        throw new MissionBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  // Web standard multipart parser accepts the original boundary in Content-Type.
  return new Response(new Blob(chunks), {
    headers: { "content-type": contentType },
  }).formData();
}
