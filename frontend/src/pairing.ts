// The kitchen screen's pairing page: a code and a QR code for someone to approve from their
// phone. Once approved, it fires `paired` with the sign-in, and the kitchen page carries on.

import type { AuthData } from "home-assistant-js-websocket";
import { LitElement, css, html, nothing, svg, type TemplateResult } from "lit";
import { APPROVE_PATH, APPROVE_PARAM, PairError, approveUrl, displayCode, pollPairing, startPairing } from "./pair.ts";
import { qrPath } from "./qr.ts";

/** How long to wait before trying again when Home Assistant can't be reached. */
const RETRY_MS = 10_000;

export class MyDashLightPairing extends LitElement {
  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 40;
      display: grid;
      place-items: center;
      padding: 24px;
      background: #f4f3ef;
      color: #1c1e22;
      font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    :host([hidden]) {
      display: none;
    }
    .card {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 48px;
      align-items: center;
      width: min(920px, 100%);
      padding: 44px 48px;
      border-radius: 24px;
      background: #fff;
      border: 1px solid #e3e1db;
      box-shadow: 0 1px 2px rgba(28, 30, 34, 0.06), 0 8px 24px rgba(28, 30, 34, 0.06);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 30px;
      line-height: 38px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .lead {
      margin: 0 0 28px;
      font-size: 18px;
      line-height: 27px;
      color: #3d434b;
    }
    .code {
      margin: 0;
      font-size: 64px;
      line-height: 72px;
      font-weight: 700;
      letter-spacing: 0.06em;
      font-variant-numeric: tabular-nums;
      font-feature-settings: "zero" 1;
    }
    .code.wait {
      color: #b8b5ad;
    }
    .steps {
      margin: 24px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 10px;
      font-size: 16px;
      line-height: 24px;
      color: #3d434b;
    }
    .steps b {
      color: #1c1e22;
    }
    .addr {
      font-weight: 600;
      color: #1c1e22;
      overflow-wrap: anywhere;
    }
    .qr {
      width: 280px;
      height: 280px;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #e3e1db;
      background: #fff;
    }
    .qr svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    .foot {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding-top: 20px;
      border-top: 1px solid #efede8;
      font-size: 14px;
      line-height: 20px;
      color: #5a6069;
    }
    .problem {
      color: #b42318;
      font-weight: 600;
    }
    button.link {
      border: 0;
      padding: 8px 0;
      background: none;
      font: inherit;
      color: #2d5fc4;
      cursor: pointer;
    }
    @media (max-width: 760px) {
      .card {
        grid-template-columns: 1fr;
        gap: 28px;
        padding: 28px 24px;
      }
      .code {
        font-size: 44px;
        line-height: 52px;
      }
      .qr {
        width: 220px;
        height: 220px;
      }
    }
  `;

  static override properties = {
    code: { state: true },
    problem: { state: true },
    remaining: { state: true },
  };

  declare code: string | null;
  declare problem: string | null;
  declare remaining: number;

  private secret: string | null = null;
  private expiresAt = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private ticker: ReturnType<typeof setInterval> | undefined;
  private running = false;

  constructor() {
    super();
    this.code = null;
    this.problem = null;
    this.remaining = 0;
  }

  /** Shows a code and waits for it to be approved. */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.hidden = false;
    this.ticker = setInterval(() => {
      this.remaining = Math.max(0, Math.round((this.expiresAt - Date.now()) / 1000));
    }, 1000);
    void this.newCode();
  }

  stop(): void {
    this.running = false;
    clearTimeout(this.timer);
    clearInterval(this.ticker);
    this.secret = null;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stop();
  }

  private later(fn: () => void, ms: number): void {
    clearTimeout(this.timer);
    if (this.running) this.timer = setTimeout(fn, ms);
  }

  private async newCode(): Promise<void> {
    try {
      const started = await startPairing();
      if (!this.running) return;
      this.code = started.code;
      this.secret = started.secret;
      this.expiresAt = Date.now() + started.expires_in * 1000;
      this.remaining = started.expires_in;
      this.problem = null;
      this.later(() => void this.poll(started.interval * 1000), started.interval * 1000);
    } catch (err) {
      this.code = null;
      this.problem =
        err instanceof PairError && err.busy
          ? "Too many screens are asking to pair. Trying again shortly."
          : "Can’t reach Home Assistant. Trying again shortly.";
      this.later(() => void this.newCode(), RETRY_MS);
    }
  }

  private async poll(interval: number): Promise<void> {
    const secret = this.secret;
    if (!secret) return;
    try {
      const result = await pollPairing(secret, location.origin);
      if (!this.running || secret !== this.secret) return;
      this.problem = null;
      if (result.status === "paired") {
        this.stop();
        this.dispatchEvent(new CustomEvent<AuthData>("paired", { detail: result.auth }));
        return;
      }
      if (result.status === "expired" || Date.now() >= this.expiresAt) {
        void this.newCode();
        return;
      }
      this.later(() => void this.poll(interval), interval);
    } catch {
      // A blip: keep the code on screen and ask again a little later.
      this.problem = "Can’t reach Home Assistant. Trying again shortly.";
      this.later(() => void this.poll(interval), Math.max(interval, 5000));
    }
  }

  private qr(): TemplateResult | typeof nothing {
    if (!this.code) return nothing;
    const { size, d } = qrPath(approveUrl(location.origin, this.code));
    return html`<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${svg`<path d=${d} fill="#1c1e22" />`}
    </svg>`;
  }

  override render(): TemplateResult {
    const minutes = Math.ceil(this.remaining / 60);
    return html`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code ? "" : "wait"}" aria-live="polite">${this.code ? displayCode(this.code) : "····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${APPROVE_PATH}?${APPROVE_PARAM}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem
          ? html`<span class="problem" role="alert">${this.problem}</span>`
          : html`<span>${this.code ? `A new code appears in ${minutes} minute${minutes === 1 ? "" : "s"}.` : "Getting a code…"}</span>`}
        <button type="button" class="link" @click=${() => this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`;
  }
}

if (!customElements.get("mydashlight-pairing")) customElements.define("mydashlight-pairing", MyDashLightPairing);

declare global {
  interface HTMLElementTagNameMap {
    "mydashlight-pairing": MyDashLightPairing;
  }
}
