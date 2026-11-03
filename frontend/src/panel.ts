// The "Rides" item in Home Assistant's sidebar. Home Assistant hands the panel a signed-in
// connection, so this works in the HA app on a phone with no extra sign-in.

import { LitElement, css, html, type PropertyValues, type TemplateResult } from "lit";
import { HassBackend, type HassConnection } from "./backend.ts";
import "./board.ts";

interface Hass {
  connection: HassConnection;
  dockedSidebar?: "docked" | "always_hidden" | "auto";
}

class MyDashLightPanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100%;
    }
    mydashlight-board {
      height: 100%;
    }
  `;

  static override properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    backend: { state: true },
  };

  declare hass: Hass | undefined;
  declare narrow: boolean;
  declare backend: HassBackend | null;
  private conn: HassConnection | null = null;

  constructor() {
    super();
    this.hass = undefined;
    this.narrow = false;
    this.backend = null;
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
    return html`<mydashlight-board .backend=${this.backend} ?show-menu=${menu}></mydashlight-board>`;
  }
}

if (!customElements.get("mydashlight-panel")) customElements.define("mydashlight-panel", MyDashLightPanel);
