import { test } from "bun:test";
import { strict as assert } from "node:assert";
import { isSameClientProject } from "../src/lib/portal/replacement";

test("replacement is permitted only for the same customer and project", () => {
  const file = { client_id: "client-a", project_id: "project-1" };
  assert.equal(isSameClientProject(file, { client_id: "client-a", project_id: "project-1" }), true);
  assert.equal(isSameClientProject(file, { client_id: "client-b", project_id: "project-1" }), false);
  assert.equal(isSameClientProject(file, { client_id: "client-a", project_id: "project-2" }), false);
  assert.equal(isSameClientProject(file, { client_id: "client-a", project_id: null }), false);
});

test("unassigned general documents can only replace unassigned documents for the same client", () => {
  const general = { client_id: "client-a", project_id: null };
  assert.equal(isSameClientProject(general, { client_id: "client-a", project_id: null }), true);
  assert.equal(isSameClientProject(general, { client_id: "client-b", project_id: null }), false);
});
