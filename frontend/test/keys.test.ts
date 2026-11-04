import assert from "node:assert/strict";
import { test } from "node:test";
import { autoShift, backspace, insert } from "../src/keys.ts";

test("typing goes in at the caret, or over a selection", () => {
  assert.deepEqual(insert("Gran", 4, 4, "d"), { value: "Grand", caret: 5 });
  assert.deepEqual(insert("Grnd", 2, 2, "a"), { value: "Grand", caret: 3 });
  assert.deepEqual(insert("Grandpa", 5, 7, "ma"), { value: "Grandma", caret: 7 });
  assert.deepEqual(insert("", 9, 9, "A"), { value: "A", caret: 1 });
});

test("backspace deletes the character before the caret, or the selection", () => {
  assert.deepEqual(backspace("Grandma", 7, 7), { value: "Grandm", caret: 6 });
  assert.deepEqual(backspace("Grandma", 0, 0), { value: "Grandma", caret: 0 });
  assert.deepEqual(backspace("Grandma", 0, 5), { value: "ma", caret: 0 });
  assert.deepEqual(backspace("Hi 👋", 5, 5), { value: "Hi ", caret: 3 });
});

test("the first letter of each word starts as a capital, for names", () => {
  assert.equal(autoShift("", 0), true);
  assert.equal(autoShift("Aunt ", 5), true);
  assert.equal(autoShift("Aunt", 4), false);
  assert.equal(autoShift("Aunt B", 2), false);
});
