import L from 'leaflet';

// ── HTML generators (match prototype exactly) ─────────────────────────────

function pulseHtml(col: string, sz: number): string {
  const ring = Math.round(sz * 0.6);
  return (
    `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${col};position:relative">` +
    `<div class="pulse-ring" style="inset:-${ring}px;border:2px solid ${col}"></div>` +
    `</div>`
  );
}

function dotHtml(col: string, sz: number): string {
  return (
    `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${col};` +
    `border:2px solid rgba(0,0,0,0.5);box-shadow:0 0 8px ${col}80"></div>`
  );
}

function diamondHtml(col: string, sz: number): string {
  return (
    `<div style="width:${sz}px;height:${sz}px;background:${col};transform:rotate(45deg);` +
    `border:1.5px solid rgba(0,0,0,0.4);box-shadow:0 0 6px ${col}60"></div>`
  );
}

function triangleHtml(col: string, sz: number): string {
  const half = sz / 2;
  return (
    `<div style="width:0;height:0;border-left:${half}px solid transparent;` +
    `border-right:${half}px solid transparent;border-bottom:${sz}px solid ${col};` +
    `filter:drop-shadow(0 0 4px ${col}80)"></div>`
  );
}

function squareHtml(col: string, sz: number): string {
  return (
    `<div style="width:${sz}px;height:${sz}px;background:${col};` +
    `border:1.5px solid rgba(0,0,0,0.3);box-shadow:0 0 6px ${col}60"></div>`
  );
}

function makeDivIcon(html: string, outerSz: number): L.DivIcon {
  return L.divIcon({
    html,
    className: '',
    iconSize: [outerSz, outerSz],
    iconAnchor: [outerSz / 2, outerSz / 2],
  });
}

// ── Public icon factories ──────────────────────────────────────────────────
// outerSz defaults to sz + 14 for pulse; callers can override (e.g. nuclear).

export function createPulseIcon(col: string, sz: number, outerSz?: number): L.DivIcon {
  return makeDivIcon(pulseHtml(col, sz), outerSz ?? sz + 14);
}

export function createDotIcon(col: string, sz: number): L.DivIcon {
  return makeDivIcon(dotHtml(col, sz), sz + 6);
}

export function createDiamondIcon(col: string, sz: number): L.DivIcon {
  return makeDivIcon(diamondHtml(col, sz), sz + 6);
}

export function createTriangleIcon(col: string, sz: number): L.DivIcon {
  return makeDivIcon(triangleHtml(col, sz), sz + 6);
}

export function createSquareIcon(col: string, sz: number): L.DivIcon {
  return makeDivIcon(squareHtml(col, sz), sz + 6);
}

// ── Popup HTML builder ────────────────────────────────────────────────────

export function createPopupHTML(
  title: string,
  detail: string,
  status?: string,
  statusColor?: string,
): string {
  let html =
    `<div class="wim-popup-title">${title}</div>` +
    `<div class="wim-popup-detail">${detail}</div>`;
  if (status) {
    const col = statusColor ?? '#FF2040';
    html += `<div class="wim-popup-status" style="background:${col}22;color:${col}">${status}</div>`;
  }
  return html;
}
