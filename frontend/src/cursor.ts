// Hides the mouse pointer on the kitchen screen after a few seconds without movement, and shows it
// again as soon as the mouse moves. A finger never shows it.

/** How long the pointer stays after the mouse stops. */
export const CURSOR_IDLE_MS = 3000;

/** Every place a style must reach: the page, and each element's own shadow root inside it. */
function roots(): (Document | ShadowRoot)[] {
  const out: (Document | ShadowRoot)[] = [document];
  for (const el of document.querySelectorAll("*")) if (el.shadowRoot) out.push(el.shadowRoot);
  return out;
}

export function autoHideCursor(idleMs = CURSOR_IDLE_MS): void {
  const hide = new CSSStyleSheet();
  hide.replaceSync("*, *::before, *::after { cursor: none !important; }");
  hide.disabled = true;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const setHidden = (hidden: boolean): void => {
    if (hidden) {
      // Elements draw their own styles in their own shadow roots, so each gets the rule too.
      for (const root of roots()) {
        if (!root.adoptedStyleSheets.includes(hide)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, hide];
      }
    }
    hide.disabled = !hidden;
  };

  const moved = (ev: PointerEvent): void => {
    clearTimeout(timer);
    if (ev.pointerType === "touch") {
      setHidden(true);
      return;
    }
    setHidden(false);
    timer = setTimeout(() => setHidden(true), idleMs);
  };

  window.addEventListener("pointermove", moved, { passive: true });
  window.addEventListener("pointerdown", moved, { passive: true });
  timer = setTimeout(() => setHidden(true), idleMs);
}
