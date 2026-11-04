// The kitchen screen's own on-screen keyboard. The screen has no keyboard, so this slides up when
// a text box is clicked or tapped and types into it. It works the same with a mouse or a finger.

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { LETTERS, SYMBOLS, autoShift, backspace, insert, type Key, type Layout } from "./keys.ts";

type TextField = HTMLInputElement | HTMLTextAreaElement;

const TEXT_TYPES = new Set(["text", "search", "email", "url", "tel", "number", "password"]);

/** Whether an element is a text box this keyboard can type into. */
export function isTextField(el: unknown): el is TextField {
  if (el instanceof HTMLTextAreaElement) return !el.readOnly && !el.disabled;
  return el instanceof HTMLInputElement && TEXT_TYPES.has(el.type) && !el.readOnly && !el.disabled;
}

const LABELS: Partial<Record<Key, string>> = {
  shift: "⇧",
  backspace: "⌫",
  space: "space",
  done: "Done",
};

const NAMES: Partial<Record<Key, string>> = {
  shift: "Shift",
  backspace: "Delete",
  space: "Space",
  done: "Done",
  layout: "Switch letters and symbols",
  hide: "Hide keyboard",
};

export class MyDashLightKeyboard extends LitElement {
  static override styles = css`
    :host {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 60;
      display: block;
      padding: 10px 12px 14px;
      background: #d9d7d1;
      border-top: 1px solid #c8c5bd;
      box-shadow: 0 -6px 20px rgba(28, 30, 34, 0.12);
      font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      transform: translateY(0);
      transition: transform 160ms ease-out;
    }
    :host([hidden]) {
      display: none;
    }
    .rows {
      display: grid;
      gap: 8px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .row {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    button {
      flex: 1 1 0;
      max-width: 96px;
      height: 58px;
      border: 0;
      border-radius: 10px;
      background: #fff;
      color: #1c1e22;
      font: inherit;
      font-size: 22px;
      box-shadow: 0 1px 0 rgba(28, 30, 34, 0.25);
      cursor: pointer;
    }
    button:active,
    button[aria-pressed="true"] {
      background: #c4c1b9;
    }
    button.wide {
      flex-grow: 1.5;
      max-width: 144px;
      font-size: 17px;
      font-weight: 600;
      background: #eceae5;
    }
    button.space {
      flex-grow: 5;
      max-width: 520px;
      font-size: 16px;
      color: #5a6069;
    }
    button.done {
      flex-grow: 1.8;
      max-width: 170px;
      background: #23272e;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
    button.done:active {
      background: #000;
    }
    .top {
      display: flex;
      justify-content: flex-end;
      max-width: 1100px;
      margin: 0 auto 6px;
    }
    .top button {
      flex: none;
      width: auto;
      max-width: none;
      height: 36px;
      padding: 0 14px;
      font-size: 15px;
      font-weight: 600;
      background: transparent;
      box-shadow: none;
      color: #3d434b;
    }
  `;

  static override properties = {
    layout: { state: true },
    shift: { state: true },
  };

  declare layout: Layout;
  declare shift: boolean;

  private field: TextField | null = null;
  /** The value when the box last changed, so leaving it can tell the page it changed. */
  private committed = "";
  /** Whether this keyboard typed anything; a real keyboard's typing fires its own change. */
  private typed = false;
  private shiftLocked = false;

  constructor() {
    super();
    this.layout = "letters";
    this.shift = false;
    this.hidden = true;
    // Keep the text box focused when a key is pressed: no key takes focus.
    const keep = (ev: Event): void => ev.preventDefault();
    this.addEventListener("mousedown", keep);
    this.addEventListener("pointerdown", keep);
  }

  /** The text box being typed into, if any. */
  get target(): TextField | null {
    return this.field;
  }

  attach(field: TextField): void {
    if (this.field === field) return;
    this.detach();
    this.field = field;
    this.committed = field.value;
    this.typed = false;
    this.layout = field instanceof HTMLInputElement && (field.type === "number" || field.type === "tel") ? "symbols" : "letters";
    field.addEventListener("change", this.onNativeChange);
    this.hidden = false;
    this.refreshShift();
    void this.updateComplete.then(() => {
      document.documentElement.style.setProperty("--keyboard-height", `${this.offsetHeight}px`);
      requestAnimationFrame(() => field.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }

  /** Puts the keyboard away, telling the page if the box's text changed. */
  detach(): void {
    const field = this.field;
    if (!field) return;
    this.commit();
    field.removeEventListener("change", this.onNativeChange);
    this.field = null;
    this.hidden = true;
    document.documentElement.style.removeProperty("--keyboard-height");
  }

  private onNativeChange = (): void => {
    if (this.field) this.committed = this.field.value;
    this.typed = false;
  };

  private commit(): void {
    const field = this.field;
    if (!field || !this.typed || field.value === this.committed) return;
    this.committed = field.value;
    this.typed = false;
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }

  private selection(field: TextField): [number, number] {
    try {
      const start = field.selectionStart;
      const end = field.selectionEnd;
      if (start !== null && end !== null) return [start, end];
    } catch {
      // Number boxes have no selection.
    }
    return [field.value.length, field.value.length];
  }

  private apply(field: TextField, value: string, caret: number): void {
    field.value = value;
    try {
      field.setSelectionRange(caret, caret);
    } catch {
      // Number boxes have no selection.
    }
    this.typed = true;
    field.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
  }

  private refreshShift(): void {
    if (this.shiftLocked || !this.field || this.layout !== "letters") return;
    const [start] = this.selection(this.field);
    this.shift = autoShift(this.field.value, start);
  }

  private press(key: Key): void {
    const field = this.field;
    if (!field) return;
    switch (key) {
      case "hide":
        field.blur();
        return;
      case "done":
        this.commit();
        field.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));
        field.blur();
        return;
      case "shift":
        this.shiftLocked = !this.shift;
        this.shift = !this.shift;
        return;
      case "layout":
        this.layout = this.layout === "letters" ? "symbols" : "letters";
        this.shiftLocked = false;
        this.refreshShift();
        return;
      case "backspace": {
        const [start, end] = this.selection(field);
        const edit = backspace(field.value, start, end);
        this.apply(field, edit.value, edit.caret);
        break;
      }
      default: {
        const text = key === "space" ? " " : this.shift ? key.toUpperCase() : key;
        const [start, end] = this.selection(field);
        const edit = insert(field.value, start, end, text);
        this.apply(field, edit.value, edit.caret);
        this.shiftLocked = false;
      }
    }
    this.refreshShift();
  }

  private key(key: Key): TemplateResult {
    const named = key.length > 1;
    const label = key === "layout" ? (this.layout === "letters" ? "123" : "ABC") : (LABELS[key] ?? (this.shift ? key.toUpperCase() : key));
    const cls = key === "space" ? "space" : key === "done" ? "done" : named ? "wide" : "";
    return html`<button
      type="button"
      tabindex="-1"
      class=${cls}
      aria-label=${NAMES[key] ?? label}
      aria-pressed=${key === "shift" ? String(this.shift) : nothing}
      @click=${() => this.press(key)}
    >
      ${label}
    </button>`;
  }

  override render(): TemplateResult {
    const rows = this.layout === "letters" ? LETTERS : SYMBOLS;
    return html`<div class="top">
        <button type="button" tabindex="-1" @click=${() => this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${rows.map((row) => html`<div class="row">${row.map((k) => this.key(k))}</div>`)}
      </div>`;
  }
}

if (!customElements.get("mydashlight-keyboard")) customElements.define("mydashlight-keyboard", MyDashLightKeyboard);

/** The element that really has focus, looking inside shadow roots. */
function deepActive(): Element | null {
  let el = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}

/** Shows the keyboard whenever a text box anywhere on the page, even inside the board, gets focus. */
export function useKeyboard(keyboard: MyDashLightKeyboard): void {
  document.addEventListener("focusin", (ev) => {
    const el = ev.composedPath()[0];
    if (isTextField(el)) keyboard.attach(el);
  });
  document.addEventListener("focusout", () => {
    // Focus moves after focusout; look once it has landed.
    setTimeout(() => {
      const el = deepActive();
      if (!keyboard.target || el === keyboard.target) return;
      if (isTextField(el)) keyboard.attach(el);
      else keyboard.detach();
    }, 0);
  });
  // A text box that disappears while focused (its panel closed) may not say it lost focus.
  setInterval(() => {
    if (keyboard.target && !keyboard.target.isConnected) keyboard.detach();
  }, 1000);
}

declare global {
  interface HTMLElementTagNameMap {
    "mydashlight-keyboard": MyDashLightKeyboard;
  }
}
