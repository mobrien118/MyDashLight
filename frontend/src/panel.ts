// The "Rides" item in Home Assistant's sidebar. Home Assistant hands the panel a signed-in
// connection, so this works in the HA app on a phone with no extra sign-in.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { pairParam } from "./approve.ts";
import { HassBackend, type HassConnection } from "./backend.ts";
import "./board.ts";
import { APPROVE_PARAM } from "./pair.ts";

interface Hass {
  connection: HassConnection;
  dockedSidebar?: "docked" | "always_hidden" | "auto";
  user?: { name: string; is_admin: boolean };
}

class MyDashLightPanel extends LitElement {
  static override styles = css`
    /* Home Assistant's panel container has no height of its own, so 100% would let the board grow
       as tall as its content and the whole page would scroll. Fill the screen instead, less the
       safe-area padding HA puts around the panel on phones. Then the board scrolls on its own,
       by finger, mouse drag and wheel, and the side panel scrolls separately. */
    :host {
      display: block;
      height: calc(100vh - var(--safe-area-inset-top, 0px) - var(--safe-area-inset-bottom, 0px));
      height: calc(100dvh - var(--safe-area-inset-top, 0px) - var(--safe-area-inset-bottom, 0px));
      overflow: hidden;
    }
    mydashlight-board {
      height: 100%;
    }
  `;

  static override properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    backend: { state: true },
    pairing: { state: true },
  };

  declare hass: Hass | undefined;
  declare narrow: boolean;
  declare backend: HassBackend | null;
  /** A screen's pairing code to approve, from `?pair=…`; "" to type one; null when not pairing. */
  declare pairing: string | null;
  private conn: HassConnection | null = null;

  constructor() {
    super();
    this.hass = undefined;
    this.narrow = false;
    this.backend = null;
    this.pairing = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.pairing = pairParam(location.search);
  }

  private closePairing(): void {
    this.pairing = null;
    const q = new URLSearchParams(location.search);
    q.delete(APPROVE_PARAM);
    const search = q.toString();
    history.replaceState(history.state, "", `${location.pathname}${search ? `?${search}` : ""}`);
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    // Home Assistant sets hass on every state change; only a new connection needs a new backend.
    if (changed.has("hass") && this.hass && this.hass.connection !== this.conn) {
      this.conn = this.hass.connection;
      this.backend = new HassBackend(this.conn);
    }
  }

  override render(): TemplateResult {
    const menu = this.narrow || this.hass?.dockedSidebar === "always_hidden";
    return html`<mydashlight-board .backend=${this.backend} ?show-menu=${menu}></mydashlight-board>
      ${this.pairing !== null
        ? html`<mydashlight-pair-approve
            .connection=${this.hass?.connection ?? null}
            .userName=${this.hass?.user?.name ?? ""}
            .isAdmin=${this.hass?.user?.is_admin ?? true}
            .code=${this.pairing}
            @close=${() => this.closePairing()}
          ></mydashlight-pair-approve>`
        : nothing}`;
  }
}

if (!customElements.get("mydashlight-panel")) customElements.define("mydashlight-panel", MyDashLightPanel);
