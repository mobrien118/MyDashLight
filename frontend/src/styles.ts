import { css } from "lit";

export const styles = css`
  :host {
    --bg: #f4f3ef;
    --surface: #ffffff;
    --surface-2: #f9f8f5;
    --ink: #1c1e22;
    --ink-2: #3d434b;
    --muted: #5a6069;
    --faint: #6b717a;
    --line: #e3e1db;
    --line-2: #efede8;
    --control: #e5e3dd;
    --border: #cfccc4;
    --dark: #23272e;
    --bad: #c42b2b;
    --bad-ink: #b42318;
    --warn-ink: #8a5a00;
    --ok: #1f6b3a;
    --now: #e5484d;
    --night: #1b1f26;
    --night-2: #2c323c;
    --shadow: 0 1px 2px rgba(28, 30, 34, 0.06), 0 2px 8px rgba(28, 30, 34, 0.06);
    display: block;
    height: 100%;
    background: var(--bg);
    color: var(--ink);
    font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
    font-variant-numeric: tabular-nums;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  button {
    font: inherit;
    color: inherit;
    margin: 0;
    cursor: pointer;
  }
  button:disabled {
    cursor: default;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 3px solid #2d5fc4;
    outline-offset: 2px;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px 28px 24px;
    gap: 16px;
    min-height: 0;
  }
  .app.narrow {
    padding: 12px 12px 12px;
    gap: 10px;
  }

  header {
    flex: none;
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 64px;
  }
  .narrow header {
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 12px;
  }
  .titles {
    flex: none;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .phone .titles {
    flex: 1 1 auto;
  }
  .narrow .controls {
    flex: none;
  }
  .clock {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 52px;
    line-height: 52px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .clock .ampm {
    font-size: 20px;
    line-height: 20px;
    font-weight: 700;
    letter-spacing: 0;
    color: var(--muted);
  }
  .narrow .clock {
    font-size: 34px;
    line-height: 36px;
  }
  .narrow .clock .ampm {
    font-size: 15px;
  }
  .today-line {
    margin: 0;
    font-size: 17px;
    line-height: 22px;
    font-weight: 600;
    color: var(--ink-2);
  }
  .narrow .today-line {
    font-size: 14px;
    line-height: 18px;
  }
  .status {
    margin: 0;
    font-size: 13px;
    line-height: 18px;
    color: var(--muted);
  }
  .titles .bad {
    color: var(--bad-ink);
    font-weight: 600;
  }

  .next {
    flex: 1 1 auto;
    min-width: 0;
    max-width: 560px;
    margin-right: auto;
    padding: 12px 18px 13px;
    border-radius: 18px;
    border: 0;
    background: linear-gradient(160deg, var(--night-2), var(--night));
    color: #fff;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 6px 20px rgba(27, 31, 38, 0.22);
    position: relative;
    overflow: hidden;
  }
  .narrow .next {
    padding: 9px 14px 10px;
    border-radius: 14px;
    gap: 2px;
  }
  .phone .next {
    flex: 1 1 100%;
    max-width: none;
    order: 5;
  }
  .next::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 6px;
    background: #8b93a1;
  }
  .next.soon::before {
    background: #f5a524;
  }
  .next.ongoing::before {
    background: #3ecf8e;
  }
  .next.idle {
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow);
    border: 1px solid var(--line);
  }
  .next.idle::before {
    background: var(--ok);
  }
  .next.needs::before {
    background: #e09a1a;
  }
  .next.idle.needs .next-eyebrow {
    color: var(--warn-ink);
  }
  .next-eyebrow {
    font-size: 12.5px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #b7bdc7;
  }
  .next.soon .next-eyebrow {
    color: #ffc768;
  }
  .next.ongoing .next-eyebrow {
    color: #7ee2b4;
  }
  .next.idle .next-eyebrow {
    color: var(--ok);
  }
  .next-main {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .next-lead {
    font-size: 24px;
    line-height: 30px;
    font-weight: 800;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .narrow .next-lead {
    font-size: 19px;
    line-height: 24px;
  }
  .narrow .next-stop {
    font-size: 13.5px;
    line-height: 18px;
  }
  .narrow .next-eyebrow {
    font-size: 11.5px;
  }
  .next-kids {
    display: inline-flex;
    gap: 5px;
    flex: none;
  }
  .next-kids .kid-dot {
    width: 13px;
    height: 13px;
    border-radius: 7px;
  }
  .next-stop {
    font-size: 15px;
    line-height: 20px;
    color: #d5d8dd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .next.idle .next-stop {
    color: var(--muted);
  }
  .next-stop.warn {
    color: #ff9c94;
    font-weight: 600;
  }
  .next .avatar.driver {
    background: #fff;
    color: var(--night);
    width: 30px;
    height: 30px;
    font-size: 15px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--c, var(--dark));
    color: #fff;
    font-size: 17px;
    font-weight: 800;
    box-shadow: 0 0 0 3px rgba(var(--rgb, 35, 39, 46), 0.16);
  }
  .avatar.driver {
    background: var(--dark);
    box-shadow: none;
  }

  .week {
    flex: none;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 10px;
  }
  .narrow .week {
    gap: 6px;
  }
  .day-tile {
    position: relative;
    min-height: 68px;
    padding: 7px 6px 8px;
    border-radius: 14px;
    border: 1px solid var(--line);
    background: var(--surface);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  .day-tile:active {
    transform: scale(0.97);
  }
  .day-tile.in-view:not(.today) {
    border-color: var(--ink-2);
    box-shadow: 0 0 0 1px var(--ink-2), var(--shadow);
  }
  .day-tile.today {
    background: linear-gradient(160deg, var(--night-2), var(--night));
    border-color: var(--night);
    color: #fff;
  }
  .dt-wd {
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .today .dt-wd {
    color: #f5a524;
  }
  .dt-num {
    font-size: 24px;
    line-height: 28px;
    font-weight: 800;
  }
  .dt-dots {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 4px;
    min-height: 14px;
  }
  .dt-dot {
    width: 9px;
    height: 9px;
    border-radius: 5px;
  }
  .today .dt-dot {
    box-shadow: 0 0 0 1.5px var(--night);
  }
  .dt-free,
  .dt-more {
    font-size: 11px;
    line-height: 14px;
    font-weight: 600;
    color: var(--faint);
  }
  .today .dt-free,
  .today .dt-more {
    color: #b7bdc7;
  }
  .dt-badge {
    position: absolute;
    top: -6px;
    right: -4px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: var(--bad);
    color: #fff;
    font-size: 12.5px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 2px var(--bg);
  }
  .phone .day-tile {
    min-height: 58px;
    padding: 5px 2px 6px;
    border-radius: 11px;
  }
  .phone .dt-wd {
    font-size: 10px;
    line-height: 13px;
    letter-spacing: 0.02em;
  }
  .phone .dt-num {
    font-size: 18px;
    line-height: 22px;
  }
  .phone .dt-dot {
    width: 6px;
    height: 6px;
  }
  .phone .dt-dots {
    gap: 2px;
  }
  .phone .dt-free {
    display: none;
  }
  .phone .dt-badge {
    top: -5px;
    right: -3px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    font-size: 10.5px;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: none;
  }
  .narrow .controls {
    gap: 8px;
  }
  .seg {
    display: inline-flex;
    padding: 4px;
    gap: 4px;
    border-radius: 14px;
    background: var(--control);
  }
  .seg-btn {
    min-height: 44px;
    padding: 0 18px 0 14px;
    border-radius: 10px;
    border: 0;
    background: transparent;
    font-size: 15px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 9px;
  }
  .narrow .seg-btn {
    padding: 0 12px;
    font-size: 14px;
  }
  .narrow .seg-btn svg {
    display: none;
  }
  .phone .seg-btn {
    padding: 0 12px;
  }
  .phone .seg-btn svg {
    display: block;
  }
  .phone .seg-btn .seg-label,
  .phone .attn-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  .phone .attn-btn {
    padding: 0 8px;
  }
  .phone .clock {
    font-size: 30px;
    line-height: 32px;
  }
  .phone .today-line {
    font-size: 13px;
    line-height: 17px;
  }
  .phone .status {
    font-size: 12px;
    line-height: 16px;
  }
  .seg-btn[aria-pressed="true"] {
    background: var(--surface);
    color: var(--ink);
    box-shadow: 0 1px 3px rgba(28, 30, 34, 0.16);
  }
  .icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    border: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }
  .attn-btn {
    min-height: 44px;
    padding: 0 8px 0 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .attn-btn .count,
  .count-pill {
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    border-radius: 14px;
    background: var(--ok);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .attn-btn.has .count,
  .count-pill.bad {
    background: var(--bad);
  }

  .banner {
    flex: none;
    padding: 10px 14px;
    border-radius: 10px;
    background: #fff8e8;
    border: 1px solid #ebcb7e;
    color: #5c3d00;
    font-size: 14px;
  }

  main {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    gap: 24px;
    position: relative;
  }
  .board-area {
    flex: 1 1 auto;
    min-width: 0;
    position: relative;
    display: flex;
  }

  .scroller {
    flex: 1 1 auto;
    min-width: 0;
    overflow: auto;
    overscroll-behavior: contain;
    touch-action: pan-x pan-y;
    cursor: grab;
    scrollbar-width: thin;
    border-radius: 12px;
    position: relative;
  }
  .scroller.dragging {
    cursor: grabbing;
    user-select: none;
  }
  .heads {
    position: sticky;
    top: 0;
    z-index: 6;
    height: 72px;
    background: var(--bg);
  }
  .col-head {
    position: absolute;
    top: 0;
    height: 66px;
    padding: 4px 8px 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .col-head.kid::after {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 0;
    height: 4px;
    border-radius: 2px;
    background: var(--c);
  }
  .col-head.driver::after {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 0;
    height: 4px;
    border-radius: 2px;
    background: repeating-linear-gradient(90deg, var(--dark) 0 10px, transparent 10px 16px);
    opacity: 0.55;
  }
  .ch-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .col-head .name {
    font-size: 18px;
    line-height: 23px;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .narrow .col-head .avatar {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    flex: none;
    display: inline-block;
  }
  .col-head .sub {
    font-size: 12px;
    line-height: 16px;
    color: var(--muted);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .col-head .sub.warn {
    color: var(--warn-ink);
  }
  .pinned,
  .day-head {
    height: 36px;
    padding: 0 4px;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pinned {
    position: sticky;
    top: 72px;
    z-index: 5;
    margin-bottom: -36px;
    pointer-events: none;
    border-radius: 12px 0 0 0;
  }
  .day-head {
    position: absolute;
    left: 0;
    z-index: 1;
  }
  .pinned .label,
  .day-head .label {
    font-size: 17px;
    line-height: 20px;
    font-weight: 800;
    white-space: nowrap;
  }
  .tag {
    padding: 2px 9px;
    border-radius: 10px;
    background: var(--night);
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .tag[hidden] {
    display: none;
  }
  .pinned .sub,
  .day-head .sub {
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--muted);
    white-space: nowrap;
  }
  .pinned .sub.warn,
  .day-head .sub.warn {
    color: var(--bad-ink);
  }
  .canvas {
    position: relative;
  }
  .canvas > * {
    position: absolute;
  }
  .col-bg {
    top: 0;
    background: linear-gradient(rgba(var(--rgb), 0.04), rgba(var(--rgb), 0.04)), var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
  }
  .col-bg.driver {
    background: var(--surface-2);
  }
  .sep {
    top: 0;
    width: 1px;
    background: #d6d3cb;
  }
  .empty {
    left: 72px;
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--faint);
  }
  .grid {
    left: 60px;
    height: 1px;
    background: var(--line-2);
  }
  .grid.strong {
    background: var(--line);
  }
  .hour {
    left: 0;
    width: 52px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: var(--muted);
  }
  .band {
    border-top: 1px solid;
    border-bottom: 1px solid;
    pointer-events: none;
  }
  .busy {
    border-radius: 10px;
    background: repeating-linear-gradient(
      135deg,
      rgba(90, 96, 105, 0.16) 0px,
      rgba(90, 96, 105, 0.16) 6px,
      rgba(90, 96, 105, 0.05) 6px,
      rgba(90, 96, 105, 0.05) 12px
    );
  }
  .busy span {
    position: absolute;
    left: 10px;
    right: 6px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: #4a5059;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .prep {
    border: 1.5px dashed;
    border-bottom: 0;
    border-radius: 10px 10px 0 0;
    padding: 2px 9px;
    overflow: hidden;
    font-size: 11.5px;
    line-height: 15px;
    font-weight: 700;
    white-space: nowrap;
  }
  .card {
    padding: 6px 9px 6px 13px;
    border-radius: 10px;
    border: 1px solid;
    text-align: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2px;
    box-shadow: inset 5px 0 0 var(--c), var(--shadow);
  }
  .card.clash {
    border-width: 2px;
  }
  .card.sel {
    box-shadow: inset 5px 0 0 var(--c), 0 0 0 3px var(--ring);
    z-index: 2;
  }
  .card .top {
    display: flex;
    flex-direction: column;
    gap: 1px;
    max-width: 100%;
  }
  .card .title {
    font-size: 14.5px;
    line-height: 18px;
    font-weight: 800;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card .time {
    font-size: 12px;
    line-height: 16px;
    color: var(--ink-2);
  }
  .card .line {
    font-size: 11.5px;
    line-height: 15px;
    font-weight: 600;
    color: var(--ink-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .card.wrap .line {
    white-space: normal;
    font-size: 12px;
    line-height: 16px;
  }
  .card .tone-pending {
    color: var(--warn-ink);
  }
  .card .tone-problem {
    color: var(--bad-ink);
  }
  .card .tone-muted {
    color: var(--faint);
  }
  .ride {
    padding: 3px 8px;
    border-radius: 8px;
    background: var(--surface);
    border: 1.5px solid var(--dark);
    box-shadow: var(--shadow);
    text-align: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1px;
  }
  .ride.dashed {
    border-style: dashed;
  }
  .ride.clash {
    box-shadow: 0 0 0 2px var(--bad);
  }
  .ride .l1 {
    font-size: 12px;
    line-height: 15px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .ride .l2 {
    font-size: 11.5px;
    line-height: 15px;
    color: #4a5059;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .stay {
    border-radius: 9px;
    border: 1.5px solid;
    padding: 6px 9px;
    text-align: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  .stay .l1,
  .stay .l2 {
    background: #fff;
    padding: 0 3px;
    border-radius: 3px;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .stay .l1 {
    font-size: 12.5px;
    line-height: 16px;
    font-weight: 700;
  }
  .stay .l2 {
    font-size: 11.5px;
    line-height: 15px;
    color: var(--ink-2);
  }
  .trip {
    border-radius: 10px;
    border: 0;
    background: linear-gradient(160deg, var(--night-2), var(--night));
    color: #fff;
    box-shadow: 0 3px 10px rgba(27, 31, 38, 0.22);
    padding: 4px 10px;
    overflow: hidden;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1px;
  }
  .trip.list {
    padding: 6px 10px;
    justify-content: flex-start;
  }
  .trip.bad {
    box-shadow: 0 0 0 2px var(--bad);
  }
  .trip .l1 {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;
    white-space: nowrap;
  }
  .kid-dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    box-shadow: 0 0 0 1.5px #fff;
    flex: none;
  }
  .trip .l2 {
    font-size: 11.5px;
    line-height: 15px;
    color: #d5d8dd;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .trip .stop {
    font-size: 12px;
    line-height: 16px;
    color: #d5d8dd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .trip .stop.warn {
    color: #ff9c94;
  }
  .trip .l3 {
    font-size: 11.5px;
    line-height: 15px;
    color: #d5d8dd;
    white-space: nowrap;
  }
  .overlap {
    border: 2px solid var(--bad);
    border-radius: 6px;
    background: repeating-linear-gradient(
      135deg,
      rgba(196, 43, 43, 0.55) 0px,
      rgba(196, 43, 43, 0.55) 4px,
      rgba(196, 43, 43, 0.15) 4px,
      rgba(196, 43, 43, 0.15) 8px
    );
    pointer-events: none;
    z-index: 3;
  }
  .mark {
    padding: 1px 6px;
    border-radius: 6px;
    background: var(--bad);
    color: #fff;
    font-size: 11.5px;
    line-height: 16px;
    font-weight: 700;
    white-space: nowrap;
    pointer-events: none;
    z-index: 3;
  }
  .now-line {
    left: 56px;
    height: 3px;
    border-radius: 2px;
    background: var(--now);
    box-shadow: 0 0 8px rgba(229, 72, 77, 0.45);
    pointer-events: none;
    z-index: 4;
  }
  .now-line::before {
    content: "";
    position: absolute;
    left: 0;
    top: -4.5px;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background: var(--now);
    box-shadow: 0 0 0 3px rgba(229, 72, 77, 0.25);
  }
  .now-label {
    left: 0;
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--now);
    color: #fff;
    font-size: 11.5px;
    line-height: 16px;
    font-weight: 700;
    pointer-events: none;
    z-index: 4;
  }

  .empty-state {
    margin: auto;
    max-width: 460px;
    text-align: center;
    color: var(--muted);
    font-size: 15px;
    line-height: 22px;
  }
  .quiet-week {
    flex: 1 1 auto;
    overflow-y: auto;
    border-radius: 18px;
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
  .narrow .quiet-week {
    padding: 24px 16px;
    gap: 24px;
  }
  .qw-hero {
    max-width: 560px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .qw-art {
    width: 136px;
    height: 102px;
  }
  .qw-hero h2 {
    margin: 4px 0 0;
    font-size: 30px;
    line-height: 36px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .narrow .qw-hero h2 {
    font-size: 22px;
    line-height: 28px;
  }
  .qw-hero p {
    margin: 0;
    font-size: 17px;
    line-height: 26px;
    color: var(--ink-2);
  }
  .narrow .qw-hero p {
    font-size: 15px;
    line-height: 22px;
  }
  .qw-people {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
  .qw-person {
    width: 132px;
    padding: 16px 10px 14px;
    border-radius: 16px;
    background: linear-gradient(rgba(var(--rgb), 0.08), rgba(var(--rgb), 0.08)), var(--surface);
    border: 1px solid rgba(var(--rgb), 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .qw-person.driver {
    --rgb: 35, 39, 46;
    background: var(--surface-2);
    border-color: var(--line);
  }
  .qw-person .avatar {
    width: 48px;
    height: 48px;
    font-size: 22px;
    margin-bottom: 4px;
  }
  .narrow .qw-person {
    width: 104px;
    padding: 12px 6px;
  }
  .qw-name {
    font-size: 16px;
    font-weight: 800;
  }
  .qw-sub {
    font-size: 13px;
    color: var(--muted);
  }
  .qw-steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    max-width: 900px;
    width: 100%;
  }
  .phone .qw-steps {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .qw-steps li {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px;
    border-radius: 14px;
    background: var(--bg);
    font-size: 14px;
    line-height: 20px;
    color: var(--ink-2);
  }
  .qw-steps strong {
    display: block;
    font-size: 15px;
    color: var(--ink);
    margin-bottom: 2px;
  }
  .qw-num {
    width: 28px;
    height: 28px;
    border-radius: 14px;
    flex: none;
    background: var(--night);
    color: #fff;
    font-weight: 800;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .big {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 0 0 6px;
  }
  .empty-state p {
    margin: 0 0 12px;
  }

  .panel {
    width: 360px;
    flex: none;
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    border-radius: 18px;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overscroll-behavior: contain;
  }
  .narrow .panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(400px, 100%);
    border-radius: 16px 0 0 16px;
    z-index: 21;
    padding: 20px 18px calc(20px + env(safe-area-inset-bottom));
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.18);
  }
  .phone .panel {
    top: auto;
    left: 0;
    width: auto;
    max-height: 85%;
    border-radius: 18px 18px 0 0;
    padding: 18px 16px calc(18px + env(safe-area-inset-bottom));
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(28, 30, 34, 0.35);
    z-index: 20;
  }
  .panel-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .panel-head h2 {
    margin: 0;
    font-size: 20px;
    line-height: 26px;
    font-weight: 700;
    flex: 1 1 auto;
  }
  .all-clear {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 14px;
    border-radius: 14px;
    background: #ecf6ef;
    border: 1px solid #b9dcc4;
    font-size: 14px;
    line-height: 20px;
    color: var(--ink-2);
  }
  .all-clear strong {
    display: block;
    font-size: 16px;
    color: var(--ok);
  }
  .check {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    flex: none;
    background: var(--ok);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .issue {
    border: 1px solid #f0c2be;
    background: #fdf1f0;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .issue.unassigned {
    border-color: #ebcb7e;
    background: #fff8e8;
  }
  .issue.heads_up {
    border-color: #e1e4e8;
    background: #f6f7f9;
  }
  .issue-main {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .glyph {
    width: 22px;
    height: 22px;
    border-radius: 11px;
    background: var(--bad);
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    margin-top: 1px;
  }
  .unassigned .glyph {
    background: #9a6700;
  }
  .heads_up .glyph {
    background: #4a5568;
  }
  .issue-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .issue-title {
    font-size: 15px;
    line-height: 20px;
    font-weight: 700;
    text-align: left;
    padding: 0;
    border: 0;
    background: none;
  }
  button.issue-title {
    text-decoration: underline;
    text-decoration-color: rgba(28, 30, 34, 0.25);
    text-underline-offset: 3px;
  }
  .issue-body {
    font-size: 13px;
    line-height: 18px;
    color: var(--ink-2);
  }
  .fixes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 32px;
  }
  .fix {
    text-align: left;
    min-height: 44px;
    padding: 7px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .fix:disabled {
    opacity: 0.6;
  }
  .fix-label {
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
  }
  .fix-note {
    font-size: 12px;
    line-height: 16px;
    color: var(--muted);
  }
  .legend {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 14px;
    border-top: 1px solid #eceae5;
  }
  .legend > span {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--ink-2);
  }
  .sw {
    width: 26px;
    height: 14px;
    border-radius: 4px;
    flex: none;
  }
  .trip-sw {
    background: var(--dark);
  }
  .ride-sw {
    border: 1.5px solid var(--dark);
    background: #fff;
  }
  .band-sw {
    border-radius: 0;
    border-top: 1px solid rgba(45, 95, 196, 0.45);
    border-bottom: 1px solid rgba(45, 95, 196, 0.45);
    background: rgba(45, 95, 196, 0.1);
  }
  .stay-sw {
    border: 1.5px solid #12877a;
    background: repeating-linear-gradient(135deg, rgba(18, 135, 122, 0.35) 0px, rgba(18, 135, 122, 0.35) 4px, #fff 4px, #fff 8px);
  }
  .busy-sw {
    background: repeating-linear-gradient(135deg, rgba(90, 96, 105, 0.25) 0px, rgba(90, 96, 105, 0.25) 4px, rgba(90, 96, 105, 0.06) 4px, rgba(90, 96, 105, 0.06) 8px);
  }
  .overlap-sw {
    border: 2px solid var(--bad);
    background: rgba(196, 43, 43, 0.35);
  }

  .ed-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .ed-titles {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  .ed-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    line-height: 26px;
    font-weight: 700;
  }
  .ed-meta {
    font-size: 14px;
    color: var(--muted);
  }
  .btn {
    min-height: 44px;
    padding: 0 16px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 14px;
    font-weight: 600;
    flex: none;
  }
  .btn.dark {
    border-color: var(--ink);
    background: var(--ink);
    color: #fff;
  }
  .saving {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .field-label {
    font-size: 14px;
    font-weight: 700;
  }
  .nobody {
    font-weight: 500;
    color: var(--warn-ink);
  }
  .field-hint {
    margin: 0;
    font-size: 12px;
    line-height: 17px;
    font-weight: 400;
    color: var(--muted);
  }
  .field-label .field-hint {
    margin-left: 6px;
  }
  .field-hint.bad {
    color: var(--bad-ink);
  }
  .choices {
    display: grid;
    gap: 8px;
  }
  .choice {
    min-height: 44px;
    padding: 0 8px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 14px;
    font-weight: 600;
  }
  .choice.wide {
    width: 100%;
  }
  .choice[aria-pressed="true"],
  .chip[aria-pressed="true"] {
    background: var(--ink);
    border-color: var(--ink);
    color: #fff;
  }
  .choice:disabled:not([aria-pressed="true"]),
  .chip:disabled:not([aria-pressed="true"]),
  .step:disabled {
    color: var(--faint);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    min-height: 36px;
    padding: 0 12px;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 13px;
    font-weight: 600;
  }
  .chip.clear {
    align-self: flex-end;
  }
  input[type="text"] {
    min-height: 44px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font: inherit;
    font-size: 14px;
    color: var(--ink);
  }
  .arrive {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .arrive-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stepper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .step {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 20px;
    font-weight: 600;
  }
  .arrive-value {
    min-width: 64px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
  }
  .notes {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    border-radius: 10px;
    background: var(--bg);
  }
  .notes-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
  }
  .notes-body {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 20px;
    white-space: pre-line;
  }

  .toast {
    position: fixed;
    left: 50%;
    bottom: 28px;
    transform: translateX(-50%);
    max-width: min(560px, calc(100% - 32px));
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--ink);
    color: #fff;
    font-size: 14px;
    line-height: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    z-index: 30;
  }
`;
