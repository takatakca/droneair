import { test } from "bun:test";
import { strict as assert } from "node:assert";

test("production deploy pipeline is opt-in and refuses unverified releases", async () => {
  const workflow = await Bun.file(
    new URL("../.github/workflows/deploy-coolify.yml", import.meta.url),
  ).text();

  assert.ok(workflow.includes("DRONE_AIR_PRODUCTION_DEPLOY_ENABLED == 'true'"));
  assert.ok(workflow.includes("steps.current.outputs.deployable == 'true'"));
  assert.ok(workflow.includes("DRONE_AIR_PRODUCTION_ORIGIN"));
  assert.ok(workflow.includes('https://drone-air.ca'));
  assert.ok(workflow.includes('"$PRODUCTION_ORIGIN/api/health"'));
  assert.ok(workflow.includes('"$PRODUCTION_ORIGIN/api/ready"'));
  assert.ok(workflow.includes('"$REVISION" == "$VALIDATED_SHA"'));
  assert.ok(workflow.includes('if [[ "$verified" != true ]]'));
  assert.ok(workflow.includes('exit 1'));
});
