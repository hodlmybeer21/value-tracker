import type { ItemComparison } from "./generations";
import { fmtUnit, yearLabel } from "./generations";
import { formatPctSigned } from "./era";
import { DATA_FETCHED } from "../data/generations";

/** Draws a 1200x675 share card on a canvas (client-side, no services). */
export function drawShareCard(kidYear: number, comps: ItemComparison[]): HTMLCanvasElement {
  const W = 1200;
  const H = 675;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const font = (w: number, s: number, fam = "Inter, system-ui, sans-serif") => `${w} ${s}px ${fam}`;

  // background
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#0b1120");
  g.addColorStop(1, "#111827");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(59,130,246,0.12)";
  ctx.beginPath();
  ctx.arc(W - 120, 80, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#60a5fa";
  ctx.font = font(600, 22, "ui-monospace, monospace");
  ctx.fillText("WHAT DID THE YEAR MY KID WAS BORN REALLY COST?", 60, 72);

  const home = comps.find((x) => x.item.id === "home");
  ctx.fillStyle = "#f8fafc";
  ctx.font = font(800, 56);
  ctx.fillText(`Born in ${kidYear}`, 60, 145);

  if (home && home.status === "ok" && home.units.usd.kind === "ok") {
    const u = home.units.usd;
    ctx.font = font(800, 96);
    ctx.fillStyle = u.change >= 0 ? "#f87171" : "#4ade80";
    const big = formatPctSigned(u.change);
    ctx.fillText(big, 60, 255);
    const bw = ctx.measureText(big).width;
    ctx.font = font(500, 28);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(`dollars for a median U.S. home`, 80 + bw, 215);
    ctx.fillText(`${fmtUnit("usd", u.then)} (${yearLabel(home.then!.year)}) → ${fmtUnit("usd", u.now)} (${yearLabel(home.now!.year)})`, 80 + bw, 252);
  }

  // rows
  const rows = comps.filter((x) => x.status === "ok").slice(0, 5);
  let y = 320;
  ctx.font = font(600, 18, "ui-monospace, monospace");
  ctx.fillStyle = "#94a3b8";
  const cols = [60, 420, 620, 820, 1010];
  ["ITEM, THEN → NOW", "USD", "GOLD", "BITCOIN", "S&P 500"].forEach((h, i) => ctx.fillText(h, cols[i], y));
  y += 18;
  ctx.strokeStyle = "rgba(148,163,184,0.25)";
  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.lineTo(W - 60, y);
  ctx.stroke();
  for (const r of rows) {
    y += 46;
    ctx.font = font(600, 26);
    ctx.fillStyle = "#f1f5f9";
    ctx.fillText(`${r.item.emoji} ${r.item.name}`, cols[0], y);
    (["usd", "gold", "btc", "spy"] as const).forEach((k, i) => {
      const cell = r.units[k];
      ctx.font = font(700, 26);
      if (cell.kind === "ok") {
        ctx.fillStyle = cell.change >= 0 ? "#f87171" : "#4ade80";
        ctx.fillText(formatPctSigned(cell.change), cols[i + 1], y);
      } else {
        ctx.fillStyle = "#64748b";
        ctx.font = font(500, 18);
        ctx.fillText(cell.kind === "not-invented" ? "not invented yet" : cell.kind === "no-market" ? "no market yet" : "—", cols[i + 1], y);
      }
    });
  }

  ctx.font = font(500, 16);
  ctx.fillStyle = "#64748b";
  ctx.fillText(
    `Sources: Census/HUD & BLS via FRED, Census ACS, World Bank, StatMuse, Yahoo Finance. Latest = 2026 YTD unless noted. Pulled ${DATA_FETCHED}.`,
    60,
    H - 56,
  );
  ctx.font = font(700, 22);
  ctx.fillStyle = "#60a5fa";
  ctx.fillText("tracker.goodbotai.tech/generations", 60, H - 24);
  return c;
}

export async function shareOrDownload(canvas: HTMLCanvasElement, kidYear: number): Promise<"shared" | "downloaded" | "cancelled"> {
  const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"));
  const file = new File([blob], `my-kids-number-${kidYear}.png`, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: `What did ${kidYear} really cost?`, text: "tracker.goodbotai.tech/generations" });
      return "shared";
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return "cancelled";
      /* share failed -> fall through to download */
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "downloaded";
}
