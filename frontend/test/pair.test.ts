import assert from "node:assert/strict";
import { test } from "node:test";
import { approveUrl, displayCode, normalizeCode, pollPairing, startPairing, toAuthData } from "../src/pair.ts";
import { qrPath } from "../src/qr.ts";

test("codes are shown in two halves and read back however they're typed", () => {
  assert.equal(displayCode("KQ7M4TXP"), "KQ7M-4TXP");
  assert.equal(normalizeCode(" kq7m-4txp "), "KQ7M4TXP");
  assert.equal(normalizeCode("kq7m 4txp"), "KQ7M4TXP");
});

test("the QR code opens the approving page with the code filled in", () => {
  assert.equal(approveUrl("https://ha.example:8123", "KQ7M4TXP"), "https://ha.example:8123/mydashlight?pair=KQ7M4TXP");
  const { size, d } = qrPath(approveUrl("https://ha.example:8123", "KQ7M4TXP"));
  assert.ok(size >= 21 && (size - 17) % 4 === 0, `a real QR size, got ${size}`);
  // The three finder squares are dark in their corners.
  for (const [x, y] of [
    [0, 0],
    [size - 1, 0],
    [0, size - 1],
  ]) {
    assert.ok(d.includes(`M${x} ${y}h1v1h-1z`), `corner ${x},${y}`);
  }
});

test("the collected sign-in is saved the way Home Assistant's pages save theirs", () => {
  const auth = toAuthData(
    "https://ha.example:8123",
    { access_token: "a", refresh_token: "r", expires_in: 1800, client_id: "https://ha.example:8123/mydashlight-kitchen" },
    1_000,
  );
  assert.deepEqual(auth, {
    hassUrl: "https://ha.example:8123",
    clientId: "https://ha.example:8123/mydashlight-kitchen",
    access_token: "a",
    refresh_token: "r",
    expires_in: 1800,
    expires: 1_801_000,
  });
});

function fakeFetch(status: number, body: unknown): typeof fetch {
  return (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
}

test("asking for a code, and the answers while waiting", async () => {
  const started = await startPairing(fakeFetch(200, { code: "KQ7M4TXP", secret: "s", expires_in: 600, interval: 2 }));
  assert.equal(started.code, "KQ7M4TXP");
  await assert.rejects(startPairing(fakeFetch(429, { error: "busy" })), (err: Error & { busy?: boolean }) => err.busy === true);

  assert.deepEqual(await pollPairing("s", "https://ha", fakeFetch(200, { status: "pending" })), { status: "pending" });
  assert.deepEqual(await pollPairing("s", "https://ha", fakeFetch(404, { status: "expired" })), { status: "expired" });
  const paired = await pollPairing(
    "s",
    "https://ha",
    fakeFetch(200, { status: "paired", auth: { access_token: "a", refresh_token: "r", expires_in: 1800, client_id: "https://ha/x" } }),
  );
  assert.equal(paired.status, "paired");
  assert.equal(paired.status === "paired" && paired.auth.refresh_token, "r");
  await assert.rejects(pollPairing("s", "https://ha", fakeFetch(500, {})));
});
