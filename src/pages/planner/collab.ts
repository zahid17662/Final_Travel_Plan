import { currentUser } from "../../data";
import type { Trip } from "../../data";
import { seedDoc } from "./seed";
import type { Doc } from "./seed";

export type Role = "edit" | "view";
export type Member = { name: string; email: string; role: Role | "owner" };
export type Share = { members: Member[]; link: boolean; linkRole: Role; public: boolean };

const palette = ["#e0574f", "#3b8fd0", "#3aa6a0", "#e0a43a", "#8a63d2", "#d86b7f", "#4f9d5d"];
export const colorFor = (name: string) => { let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0; return palette[h % palette.length]; };
export const firstName = (n: string) => n.split(" ")[0];

export const shareUrl = (id: string) => `${location.origin}${location.pathname}#/trip/${id}/share`;

export function loadShare(t: Trip): Share {
  try { const raw = localStorage.getItem(`tp_share_${t.id}`); if (raw) return JSON.parse(raw) as Share; } catch { /* ignore */ }
  const first = firstName(currentUser.name);
  return {
    members: [{ name: currentUser.name, email: currentUser.email, role: "owner" },
      ...(t.collaborators ?? []).filter((n) => n !== first && n !== currentUser.name).map((n) => ({ name: n, email: `${n.toLowerCase()}@example.com`, role: "edit" as Role }))],
    link: t.status !== "draft", linkRole: "view", public: t.privacy === "Public",
  };
}
export const saveShare = (id: string, s: Share) => { try { localStorage.setItem(`tp_share_${id}`, JSON.stringify(s)); } catch { /* ignore */ } };
export const canView = (s: Share) => s.link || s.public;

export function loadDoc(t: Trip): Doc {
  try { const raw = localStorage.getItem(`tp_plan_${t.id}`); if (raw) return JSON.parse(raw) as Doc; } catch { /* ignore */ }
  return seedDoc(t);
}
