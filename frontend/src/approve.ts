// Approving a screen that's asking to pair, on the Rides page in Home Assistant. It opens when the
// page's address has `?pair` in it: from the screen's QR code with the code filled in, or typed.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import type { HassConnection } from "./backend.ts";
import { APPROVE_PARAM, DOMAIN, displayCode, normalizeCode } from "./pair.ts";

interface Waiting {
  found: boolean;
  code?: string;
  address?: string;
  age?: number;
}

type Step = "enter" | "checking" | "confirm" | "approving" | "done";

/** The code in the page's address, or "" when `?pair` is there with no code. Null: not pairing. */
export function pairParam(search: string): string | null {
  const q = new URLSearchParams(search);
  return q.has(APPROVE_PARAM) ? normalizeCode(q.get(APPROVE_PARAM) ?? "") : null;
}

function ago(seconds: number): string {
  if (seconds < 60) return "just now";
  const m = Math.round(seconds / 60);
  return `${m} minute${m === 1 ? "" : "s"} ago`;
}

export class MyDashLightPairApprove extends LitElement {
  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(28, 30, 34, 0.45);
      font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
      color: #1c1e22;
    }
    .card {
      width: min(440px, 100%);
      padding: 24px;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 12px 40px rgba(28, 30, 34, 0.25);
    }
    h2 {
      margin: 0 0 8px;
      font-size: 21px;
      line-height: 28px;
    }
    p {
      margin: 0 0 16px;
      font-size: 15px;
      line-height: 22px;
      color: #3d434b;
    }
    .code {
      font-size: 30px;
      line-height: 38px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #1c1e22;
      font-variant-numeric: tabular-nums;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      min-height: 52px;
      padding: 0 14px;
      margin-bottom: 16px;
      border: 1px solid #cfccc4;
      border-radius: 10px;
      font: inherit;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .error {
      color: #b42318;
      font-weight: 600;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    button {
      min-height: 44px;
      padding: 0 18px;
      border-radius: 10px;
      border: 1px solid #cfccc4;
      background: #fff;
      font: inherit;
      font-size: 15px;
      font-weight: 600;
      color: inherit;
      cursor: pointer;
    }
    button.dark {
      border-color: #1c1e22;
      background: #1c1e22;
      color: #fff;
    }
    button:disabled {
      opacity: 0.55;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 3px solid #2d5fc4;
      outline-offset: 2px;
    }
  `;

  static override properties = {
    connection: { attribute: false },
    userName: { attribute: false },
    isAdmin: { attribute: false },
    code: {},
    step: { state: true },
    error: { state: true },
    waiting: { state: true },
  };

  declare connection: HassConnection | null;
  declare userName: string;
  declare isAdmin: boolean;
  declare code: string;
  declare step: Step;
  declare error: string | null;
  declare waiting: Waiting | null;
  private typed = "";

  constructor() {
    super();
    this.connection = null;
    this.userName = "";
    this.isAdmin = true;
    this.code = "";
    this.step = "enter";
    this.error = null;
    this.waiting = null;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if ((changed.has("code") || changed.has("connection")) && this.connection && this.code && this.step === "enter") {
      void this.check(this.code);
    }
  }

  private close(): void {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async check(code: string): Promise<void> {
    if (!this.connection) return;
    this.step = "checking";
    this.error = null;
    try {
      const res = await this.connection.sendMessagePromise<Waiting>({ type: `${DOMAIN}/pair/check`, code });
      if (res.found) {
        this.waiting = res;
        this.step = "confirm";
      } else {
        this.error = "No screen is showing that code. Codes change every 10 minutes; check the screen.";
        this.step = "enter";
      }
    } catch (err) {
      this.error = this.message(err);
      this.step = "enter";
    }
  }

  private async approve(): Promise<void> {
    if (!this.connection || !this.waiting?.code) return;
    this.step = "approving";
    this.error = null;
    try {
      await this.connection.sendMessagePromise({ type: `${DOMAIN}/pair/approve`, code: this.waiting.code });
      this.step = "done";
    } catch (err) {
      this.error = this.message(err);
      this.step = "enter";
    }
  }

  private message(err: unknown): string {
    const code = (err as { code?: string } | null)?.code;
    if (code === "unauthorized") return "Only a Home Assistant admin can pair a screen.";
    if (code === "not_found") return "That code isn’t waiting any more. Check the screen for a new one.";
    if (code === "unknown_command") return "This version of MyDashLight can’t pair screens. Update it in HACS.";
    return "Something went wrong. Try again.";
  }

  private enter(): TemplateResult {
    const busy = this.step === "checking";
    const submit = (ev: Event): void => {
      ev.preventDefault();
      const code = normalizeCode(this.typed);
      if (code) void this.check(code);
    };
    return html`<form @submit=${submit}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      <input
        aria-label="Code"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        placeholder="ABCD-1234"
        .value=${this.typed}
        @input=${(ev: Event) => (this.typed = (ev.target as HTMLInputElement).value)}
        ?disabled=${busy}
      />
      <div class="actions">
        <button type="button" @click=${() => this.close()}>Cancel</button>
        <button type="submit" class="dark" ?disabled=${busy}>${busy ? "Checking…" : "Next"}</button>
      </div>
    </form>`;
  }

  private confirm(): TemplateResult {
    const w = this.waiting!;
    const busy = this.step === "approving";
    return html`<h2>Allow this screen?</h2>
      <p class="code">${displayCode(w.code ?? "")}</p>
      <p>
        A screen at ${w.address} asked ${ago(w.age ?? 0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName || "you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${() => this.close()} ?disabled=${busy}>Cancel</button>
        <button type="button" class="dark" @click=${() => void this.approve()} ?disabled=${busy}>
          ${busy ? "Allowing…" : "Allow"}
        </button>
      </div>`;
  }

  override render(): TemplateResult {
    let body: TemplateResult;
    if (!this.isAdmin) {
      body = html`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${() => this.close()}>Close</button></div>`;
    } else if (this.step === "done") {
      body = html`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${() => this.close()}>Done</button></div>`;
    } else if (this.step === "confirm" || this.step === "approving") {
      body = this.confirm();
    } else {
      body = this.enter();
    }
    return html`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${body}</div>`;
  }
}

if (!customElements.get("mydashlight-pair-approve")) customElements.define("mydashlight-pair-approve", MyDashLightPairApprove);

declare global {
  interface HTMLElementTagNameMap {
    "mydashlight-pair-approve": MyDashLightPairApprove;
  }
}
