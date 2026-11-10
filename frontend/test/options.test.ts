import assert from "node:assert/strict";
import { test } from "node:test";
import { pageOptions, withoutAuthParams } from "../src/options.ts";

test("the view can be set in the address", () => {
  assert.deepEqual(pageOptions("?view=compact"), { view: "compact" });
  assert.deepEqual(pageOptions("?view=timeline"), { view: "timeline" });
  assert.deepEqual(pageOptions("?view=full"), { view: "timeline" });
  assert.deepEqual(pageOptions("?View=x&view=Compact"), { view: "compact" });
  assert.deepEqual(pageOptions("?view=%20compact%20"), { view: "compact" });
});

test("the on-screen keyboard can be turned off in the address", () => {
  assert.deepEqual(pageOptions("?keyboard=off"), { keyboard: false });
  assert.deepEqual(pageOptions("?view=compact&keyboard=No"), { view: "compact", keyboard: false });
  assert.deepEqual(pageOptions("?keyboard=on"), {});
});

test("the mouse pointer can be kept on screen in the address", () => {
  assert.deepEqual(pageOptions("?cursor=show"), { cursor: "show" });
  assert.deepEqual(pageOptions("?cursor=Show&keyboard=off"), { cursor: "show", keyboard: false });
  assert.deepEqual(pageOptions("?cursor=hide"), {});
});

test("the page can be set in the address", () => {
  assert.deepEqual(pageOptions("?page=chores"), { page: "chores" });
  assert.deepEqual(pageOptions("?page=Rides&view=compact"), { page: "rides", view: "compact" });
  assert.deepEqual(pageOptions("?page=lunch"), { page: "lunch" });
  assert.deepEqual(pageOptions("?page=menu"), {});
});

test("the day picker at the board's edge can be turned off in the address", () => {
  assert.deepEqual(pageOptions("?daypicker=off"), { daypicker: false });
  assert.deepEqual(pageOptions("?view=compact&daypicker=No"), { view: "compact", daypicker: false });
  assert.deepEqual(pageOptions("?daypicker=on"), {});
});

test("unknown or missing settings leave the defaults", () => {
  assert.deepEqual(pageOptions(""), {});
  assert.deepEqual(pageOptions("?view=week"), {});
  assert.deepEqual(pageOptions("?theme=dark"), {});
});

test("sign-in leftovers are removed and the screen's settings kept", () => {
  assert.equal(withoutAuthParams("?view=compact&auth_callback=1&code=abc&state=xyz"), "?view=compact");
  assert.equal(withoutAuthParams("?auth_callback=1&code=abc&state=xyz"), "");
  assert.equal(withoutAuthParams(""), "");
});
