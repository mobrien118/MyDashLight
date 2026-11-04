// The on-screen keyboard's layouts and what a key press does to a text box's value.

export type Layout = "letters" | "symbols";

/** A key: a character to type, or one of the named keys. */
export type Key = string | "shift" | "backspace" | "space" | "done" | "layout" | "hide";

export const LETTERS: Key[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["shift", "z", "x", "c", "v", "b", "n", "m", "backspace"],
  ["layout", ",", "space", ".", "done"],
];

export const SYMBOLS: Key[][] = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["-", "/", ":", ";", "(", ")", "&", "@", "'", '"'],
  ["#", "+", "=", "?", "!", "%", "*", "backspace"],
  ["layout", ",", "space", ".", "done"],
];

export interface Edit {
  value: string;
  /** Where the caret goes afterwards. */
  caret: number;
}

/** Types `text` over the selection from `start` to `end`. */
export function insert(value: string, start: number, end: number, text: string): Edit {
  const a = Math.max(0, Math.min(start, value.length));
  const b = Math.max(a, Math.min(end, value.length));
  return { value: value.slice(0, a) + text + value.slice(b), caret: a + text.length };
}

/** Backspace: deletes the selection, or the character before the caret. */
export function backspace(value: string, start: number, end: number): Edit {
  const a = Math.max(0, Math.min(start, value.length));
  const b = Math.max(a, Math.min(end, value.length));
  if (a !== b) return { value: value.slice(0, a) + value.slice(b), caret: a };
  if (a === 0) return { value, caret: 0 };
  // Step back over a whole character, including emoji and other surrogate pairs.
  const before = Array.from(value.slice(0, a));
  before.pop();
  const kept = before.join("");
  return { value: kept + value.slice(a), caret: kept.length };
}

/** Whether the next letter should be a capital: at the start, and after a space (names). */
export function autoShift(value: string, caret: number): boolean {
  return caret === 0 || /\s$/.test(value.slice(0, caret));
}
