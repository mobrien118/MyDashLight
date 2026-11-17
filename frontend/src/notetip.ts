// The notes bubble: what people wrote in an event's notes, shown over the board.
//
// Anything on the board with a `data-note` attribute has notes. With a mouse, resting on it
// shows them. On a touchscreen, holding a finger on it does, and the tap that lets go doesn't
// also open the event: a quick tap still does exactly what it always did. From the keyboard,
// tabbing to it shows them. Scrolling, pressing anywhere, or Escape puts the bubble away.

/** How long the mouse rests on something before its notes show. */
export const HOVER_MS = 400;
/** How long a finger holds still on something before its notes show. */
export const HOLD_MS = 500;
/** How far a finger can wander, in pixels, and still be holding rather than scrolling. */
export const SLOP = 10;
/** The gap between the bubble and the pointer or what it's about, and from the screen's edge. */
const GAP = 14;
const EDGE = 8;
/** A finger covers what's under it, so a held bubble goes this far above the touch. */
const FINGER = 36;
/** After a hold, how long the release's click can take to arrive and still be eaten. */
const EAT_MS = 700;

export interface Size {
  w: number;
  h: number;
}

export interface Placement {
  left: number;
  top: number;
  /** Shown above the point, rather than below it. */
  above: boolean;
}

/**
 * Where the bubble goes: centred on `x`, above or below the span from `top` to `bottom` (a
 * point, or the box it's about), on the side asked for when it fits there, else on the side
 * with more room. It always stays on screen.
 */
export function placeTip(
  at: { x: number; top: number; bottom: number },
  tip: Size,
  view: Size,
  preferAbove: boolean,
  gap: number = GAP,
): Placement {
  const roomAbove = at.top - gap - EDGE;
  const roomBelow = view.h - at.bottom - gap - EDGE;
  const fitsAbove = tip.h <= roomAbove;
  const fitsBelow = tip.h <= roomBelow;
  const above = preferAbove ? fitsAbove || (!fitsBelow && roomAbove > roomBelow) : !fitsBelow && (fitsAbove || roomAbove > roomBelow);
  const rawTop = above ? at.top - gap - tip.h : at.bottom + gap;
  const top = Math.max(EDGE, Math.min(rawTop, view.h - EDGE - tip.h));
  const left = Math.max(EDGE, Math.min(at.x - tip.w / 2, view.w - EDGE - tip.w));
  return { left: Math.round(left), top: Math.round(top), above };
}

/** The nearest element with notes along an event's path, inside `host`. */
function notedIn(e: Event, host: HTMLElement): HTMLElement | null {
  for (const node of e.composedPath()) {
    if (node === host) break;
    if (node instanceof HTMLElement && node.dataset.note) return node;
  }
  return null;
}

type Timer = ReturnType<typeof setTimeout>;

/** Shows the notes bubble for the board's `host`, drawn in `root`. */
export class NoteTip {
  private tip: HTMLDivElement | null = null;
  /** What the bubble is showing the notes of. */
  private anchor: HTMLElement | null = null;
  /** The bubble came from a held finger: it stays after the finger lifts. */
  private held = false;
  private hoverTimer: Timer | null = null;
  private hideTimer: Timer | null = null;
  /** Where the mouse is while waiting to show, so the bubble comes up beside it. */
  private hoverAt = { x: 0, y: 0 };
  private hoverEl: HTMLElement | null = null;
  private press: { id: number; x: number; y: number; el: HTMLElement; timer: Timer; done: boolean } | null = null;
  /** The click that ends a hold arrives before this time, and is eaten. */
  private eatUntil = 0;

  private readonly host: HTMLElement;
  private readonly root: ShadowRoot | HTMLElement;

  constructor(host: HTMLElement, root: ShadowRoot | HTMLElement) {
    this.host = host;
    this.root = root;
  }

  connect(): void {
    const h = this.host;
    // Hover is followed from every move, not from pointerover: inside a scrolling area in a
    // shadow root, Chromium can leave out the over and out events as the pointer moves along.
    window.addEventListener("pointermove", this.onHover, { passive: true });
    document.documentElement.addEventListener("pointerleave", this.onLeave);
    h.addEventListener("pointerdown", this.onDown, { capture: true });
    h.addEventListener("pointermove", this.onMove, { capture: true, passive: true });
    h.addEventListener("pointerup", this.onUp, { capture: true });
    h.addEventListener("pointercancel", this.onCancel, { capture: true });
    h.addEventListener("click", this.onClick, { capture: true });
    h.addEventListener("contextmenu", this.onContextMenu, { capture: true });
    h.addEventListener("wheel", this.hide, { passive: true });
    h.addEventListener("focusin", this.onFocusIn);
    h.addEventListener("focusout", this.onFocusOut);
    h.addEventListener("keydown", this.onKey, { capture: true });
    window.addEventListener("resize", this.hide);
    window.addEventListener("blur", this.hide);
  }

  disconnect(): void {
    const h = this.host;
    window.removeEventListener("pointermove", this.onHover);
    document.documentElement.removeEventListener("pointerleave", this.onLeave);
    h.removeEventListener("pointerdown", this.onDown, { capture: true });
    h.removeEventListener("pointermove", this.onMove, { capture: true });
    h.removeEventListener("pointerup", this.onUp, { capture: true });
    h.removeEventListener("pointercancel", this.onCancel, { capture: true });
    h.removeEventListener("click", this.onClick, { capture: true });
    h.removeEventListener("contextmenu", this.onContextMenu, { capture: true });
    h.removeEventListener("wheel", this.hide);
    h.removeEventListener("focusin", this.onFocusIn);
    h.removeEventListener("focusout", this.onFocusOut);
    h.removeEventListener("keydown", this.onKey, { capture: true });
    window.removeEventListener("resize", this.hide);
    window.removeEventListener("blur", this.hide);
    this.endPress();
    this.hide();
  }

  /** Whether the bubble is showing. */
  get shown(): boolean {
    return this.anchor !== null;
  }

  /** Puts the bubble away, if it's showing, and forgets any wait to show it. */
  readonly hide = (): void => {
    this.clearHover();
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = null;
    if (this.anchor) {
      this.anchor.removeAttribute("aria-describedby");
      this.anchor.classList.remove("noting");
    }
    this.anchor = null;
    this.held = false;
    this.tip?.classList.remove("on");
  };

  /** After the board draws: what the bubble was about may be gone, or its notes changed. */
  sync(): void {
    const a = this.anchor;
    if (!a) return;
    if (!a.isConnected || !a.dataset.note) this.hide();
    else if (this.tip && this.tip.textContent !== a.dataset.note) this.tip.textContent = a.dataset.note;
  }

  private ensureTip(): HTMLDivElement {
    if (this.tip?.isConnected) return this.tip;
    const tip = document.createElement("div");
    tip.className = "note-tip";
    tip.id = "note-tip";
    tip.setAttribute("role", "tooltip");
    this.root.appendChild(tip);
    this.tip = tip;
    return tip;
  }

  private show(el: HTMLElement, at: { x: number; top: number; bottom: number }, preferAbove: boolean, gap?: number): void {
    const text = el.dataset.note;
    if (!text) return;
    this.clearHover();
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = null;
    if (this.anchor && this.anchor !== el) {
      this.anchor.removeAttribute("aria-describedby");
      this.anchor.classList.remove("noting");
    }
    const tip = this.ensureTip();
    tip.textContent = text;
    // Measured where it is, off to the side and unseen, then put in place.
    tip.classList.remove("on");
    tip.style.left = "0px";
    tip.style.top = "0px";
    const size = { w: tip.offsetWidth, h: tip.offsetHeight };
    const view = { w: window.innerWidth, h: window.innerHeight };
    const p = placeTip(at, size, view, preferAbove, gap);
    tip.style.left = `${p.left}px`;
    tip.style.top = `${p.top}px`;
    tip.classList.toggle("above", p.above);
    tip.classList.add("on");
    el.setAttribute("aria-describedby", tip.id);
    el.classList.add("noting");
    this.anchor = el;
  }

  private clearHover(): void {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    this.hoverTimer = null;
    this.hoverEl = null;
  }

  private laterHide(): void {
    if (this.hideTimer || !this.anchor || this.held) return;
    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      this.hide();
    }, 120);
  }

  // The mouse

  private readonly onHover = (e: PointerEvent): void => {
    if (e.pointerType === "touch" || e.buttons) return;
    const el = e.composedPath().includes(this.host) ? notedIn(e, this.host) : null;
    if (!el) {
      this.clearHover();
      this.laterHide();
      return;
    }
    if (el === this.anchor) {
      if (this.hideTimer) clearTimeout(this.hideTimer);
      this.hideTimer = null;
      return;
    }
    this.hoverAt = { x: e.clientX, y: e.clientY };
    if (this.hoverEl === el) return;
    if (this.anchor && !this.held) {
      // Already reading notes: moving to the next thing shows its notes straight away.
      this.show(el, this.pointAt(this.hoverAt), false);
      return;
    }
    this.clearHover();
    this.hoverEl = el;
    this.hoverTimer = setTimeout(() => {
      this.hoverTimer = null;
      if (this.hoverEl === el && el.isConnected) this.show(el, this.pointAt(this.hoverAt), false);
    }, HOVER_MS);
  };

  private readonly onLeave = (e: PointerEvent): void => {
    if (e.pointerType === "touch") return;
    this.clearHover();
    if (!this.held) this.hide();
  };

  private pointAt(p: { x: number; y: number }): { x: number; top: number; bottom: number } {
    // Below the mouse pointer, clear of its arrow.
    return { x: p.x, top: p.y - 4, bottom: p.y + 10 };
  }

  // Pressing: a mouse button puts the bubble away; a finger held still brings it up

  private readonly onDown = (e: PointerEvent): void => {
    this.eatUntil = 0;
    this.endPress();
    if (this.anchor) this.hide();
    this.clearHover();
    if (e.pointerType !== "touch" || !e.isPrimary) return;
    const el = notedIn(e, this.host);
    if (!el) return;
    const at = { x: e.clientX, y: e.clientY };
    const timer = setTimeout(() => {
      const p = this.press;
      if (!p || p.el !== el || !el.isConnected) return;
      p.done = true;
      this.show(el, { x: at.x, top: at.y, bottom: at.y }, true, FINGER);
      this.held = true;
    }, HOLD_MS);
    this.press = { id: e.pointerId, x: at.x, y: at.y, el, timer, done: false };
  };

  private readonly onMove = (e: PointerEvent): void => {
    const p = this.press;
    if (p && e.pointerId === p.id && !p.done && Math.hypot(e.clientX - p.x, e.clientY - p.y) > SLOP) this.endPress();
  };

  private readonly onUp = (e: PointerEvent): void => {
    const p = this.press;
    if (!p || e.pointerId !== p.id) return;
    // Lifting the finger after a hold isn't a tap: the click it makes is eaten.
    if (p.done) this.eatUntil = performance.now() + EAT_MS;
    this.endPress();
  };

  private readonly onCancel = (e: PointerEvent): void => {
    const p = this.press;
    if (!p || e.pointerId !== p.id) return;
    // The page took the touch to scroll it.
    if (!p.done) this.endPress();
    else {
      this.endPress();
      this.hide();
    }
  };

  private endPress(): void {
    if (this.press) clearTimeout(this.press.timer);
    this.press = null;
  }

  private readonly onClick = (e: MouseEvent): void => {
    if (!this.eatUntil) return;
    const eat = performance.now() < this.eatUntil;
    this.eatUntil = 0;
    if (!eat) return;
    e.stopPropagation();
    e.preventDefault();
  };

  /** A held finger would bring up the browser's own menu, or select text, instead. */
  private readonly onContextMenu = (e: Event): void => {
    const touch = (e as PointerEvent).pointerType === "touch";
    if (this.press || (this.held && this.anchor) || (touch && notedIn(e, this.host))) e.preventDefault();
  };

  // The keyboard

  private readonly onFocusIn = (e: FocusEvent): void => {
    const el = notedIn(e, this.host);
    if (!el || !el.matches(":focus-visible")) return;
    const r = el.getBoundingClientRect();
    this.show(el, { x: r.left + Math.min(r.width / 2, 120), top: r.top, bottom: r.bottom }, false, 8);
  };

  private readonly onFocusOut = (e: FocusEvent): void => {
    if (this.anchor && notedIn(e, this.host) === this.anchor && !this.held) this.hide();
  };

  /** Escape puts the bubble away, and only that: the panel behind it stays open. */
  private readonly onKey = (e: KeyboardEvent): void => {
    if (e.key !== "Escape" || !this.anchor) return;
    this.hide();
    e.stopImmediatePropagation();
  };
}
