import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, StarIcon, useToast } from "../../components/ui";
import { loadTrips } from "../../data";
import type { Reservation } from "../planner/seed";
import { loadDoc } from "../planner/collab";
import { uid } from "../planner/seed";

export const Stars = ({ n }: { n: number }) => <span className="inline-flex text-amber-500" role="img" aria-label={`${n} stars`}>{Array.from({ length: n }, (_, i) => <StarIcon key={i} size={12} />)}</span>;
export const ScoreBadge = ({ n }: { n: number }) => <span className="inline-grid h-8 min-w-8 place-items-center rounded-lg rounded-bl-none bg-navy px-1.5 text-xs font-bold text-white">{n.toFixed(1)}</span>;
export const scoreWord = (n: number) => (n >= 9 ? "Exceptional" : n >= 8.5 ? "Excellent" : n >= 8 ? "Very good" : n >= 7 ? "Good" : "Fair");
export const PlaneIcon = ({ size = 16 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 16l20-6-3-2-6 1-4-5-2 1 2 5-5 1-2-2-1 1 2 4z" /></svg>;

export function AddToTripModal({ open, onClose, reservation }: { open: boolean; onClose: () => void; reservation: Omit<Reservation, "id"> }) {
  const { show } = useToast();
  const nav = useNavigate();
  const trips = loadTrips().filter((t) => t.status !== "past");
  const [sel, setSel] = useState(trips[0]?.id ?? "");
  const add = () => {
    const t = trips.find((x) => x.id === sel); if (!t) return;
    const doc = loadDoc(t);
    try { localStorage.setItem(`tp_plan_${t.id}`, JSON.stringify({ ...doc, reservations: [{ ...reservation, id: uid() }, ...doc.reservations] })); } catch { /* ignore */ }
    show({ title: `Added to ${t.title}`, description: reservation.name, tone: "success" }); onClose(); nav(`/trip/${t.id}`);
  };
  return (
    <Modal open={open} onClose={onClose} title="Add to trip" footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={add} disabled={!sel}>Add to trip</Button></>}>
      <p className="text-sm text-navy/70">Saved as a reservation in your trip: <strong>{reservation.name}</strong></p>
      {trips.length ? (
        <fieldset className="mt-4 space-y-2"><legend className="sr-only">Choose a trip</legend>
          {trips.map((t) => (
            <label key={t.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm transition ${sel === t.id ? "border-navy bg-ocean-100/40" : "border-navy/10 hover:border-navy/30"}`}>
              <input type="radio" name="trip" className="accent-navy" checked={sel === t.id} onChange={() => setSel(t.id)} />
              <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{t.title}</span><span className="text-xs text-navy/55">{t.destination} · {t.dates}</span></span>
            </label>
          ))}
        </fieldset>
      ) : <p className="mt-4 text-sm text-navy/60">You have no upcoming trips yet. Create one from the Trips page first.</p>}
    </Modal>
  );
}
