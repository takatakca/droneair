import { test } from "bun:test";
import { strict as assert } from "node:assert";

import {
  MAX_MISSION_BODY_BYTES,
  matchesAttachmentSignature,
} from "../src/lib/mission-request";
import {
  MissionBodyTooLargeError,
  readBoundedMissionForm,
} from "../src/lib/mission-body.server";

test("valid multipart form parses with an ordinary file attachment", async () => {
  const data = new FormData();
  data.set("name", "Demande test");
  data.set("attachment", new Blob(["%PDF-1.7\nexample"], { type: "application/pdf" }), "report.pdf");
  const request = new Request("https://local.test/api/public/mission-request", {
    method: "POST",
    body: data,
  });
  const parsed = await readBoundedMissionForm(request);
  assert.equal(parsed.get("name"), "Demande test");
  const file = parsed.get("attachment");
  assert.ok(file instanceof File);
  assert.equal(file.name, "report.pdf");
});

test("rejects a declared multipart body over the limit before parsing", async () => {
  const request = new Request("https://local.test/api/public/mission-request", {
    method: "POST",
    headers: {
      "content-type": "multipart/form-data; boundary=x",
      "content-length": String(MAX_MISSION_BODY_BYTES + 1),
    },
    body: "--x--",
  });
  await assert.rejects(readBoundedMissionForm(request), MissionBodyTooLargeError);
});

test("rejects oversized streaming body with absent content-length", async () => {
  const oversized = new Uint8Array(MAX_MISSION_BODY_BYTES + 1);
  const request = new Request("https://local.test/api/public/mission-request", {
    method: "POST",
    headers: { "content-type": "multipart/form-data; boundary=x" },
    body: new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(oversized);
        controller.close();
      },
    }),
    duplex: "half",
  } as RequestInit & { duplex: "half" });
  await assert.rejects(readBoundedMissionForm(request), MissionBodyTooLargeError);
});

test("invalid content types are rejected", async () => {
  const request = new Request("https://local.test/api/public/mission-request", {
    method: "POST",
    body: "json is not multipart",
  });
  await assert.rejects(readBoundedMissionForm(request), TypeError);
});

test("file signatures must match their MIME types, including WebP RIFF", () => {
  assert.ok(matchesAttachmentSignature("application/pdf", new TextEncoder().encode("%PDF-1.7")));
  assert.ok(matchesAttachmentSignature("image/jpeg", Uint8Array.from([0xff, 0xd8, 0xff, 0x00])));
  assert.ok(matchesAttachmentSignature("image/png", Uint8Array.from([137,80,78,71,13,10,26,10])));
  assert.ok(matchesAttachmentSignature("image/webp", new TextEncoder().encode("RIFF1234WEBP")));
  assert.equal(matchesAttachmentSignature("application/pdf", new TextEncoder().encode("<script>")), false);
  assert.equal(matchesAttachmentSignature("image/png", new TextEncoder().encode("%PDF-1.7")), false);
  assert.equal(matchesAttachmentSignature("image/jpeg", new Uint8Array()), false);
  assert.equal(matchesAttachmentSignature("text/html", new TextEncoder().encode("%PDF-1.7")), false);
});
