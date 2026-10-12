export const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
const perUsd: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150, CAD: 1.36, AUD: 1.52 };
export const convert = (n: number, from: string, to: string) => (n / (perUsd[from] ?? 1)) * (perUsd[to] ?? 1);
export const fmt = (n: number, cur = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: cur === "JPY" || Number.isInteger(n) ? 0 : 2, minimumFractionDigits: 0 }).format(n);

export type Debt = { from: string; to: string; amount: number };
export function settle(balances: Record<string, number>): Debt[] {
  const cents = Object.entries(balances).map(([n, v]) => [n, Math.round(v * 100)] as [string, number]);
  const cr = cents.filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const db = cents.filter(([, v]) => v < 0).map(([n, v]) => [n, -v] as [string, number]).sort((a, b) => b[1] - a[1]);
  const out: Debt[] = []; let i = 0, j = 0;
  while (i < cr.length && j < db.length) {
    const m = Math.min(cr[i][1], db[j][1]);
    if (m > 0) out.push({ from: db[j][0], to: cr[i][0], amount: m / 100 });
    cr[i][1] -= m; db[j][1] -= m;
    if (cr[i][1] === 0) i++;
    if (db[j][1] === 0) j++;
  }
  return out;
}
