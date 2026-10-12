import { useState } from "react";
import { Badge, Button, PinIcon, Modal, Select, StarIcon } from "../../components/ui";
import { ClockIcon } from "./glyphs";
import { placeInfo } from "./itineraryData";
import { unsplash } from "../../components/ui";

export type Candidate = { id?: string; name: string; category: string; rating?: number; x: number; y: number; day?: number };

function MiniMap({ x, y }: { x: number; y: number }) {
  return (
    <svg viewBox="0 0 100 60" className="h-40 w-full rounded-2xl bg-ocean-100" role="img" aria-label="Location on map" preserveAspectRatio="xMidYMid slice">
      <rect width="100" height="60" fill="#e8eef5" />
      <path d="M0 40 C 25 30, 45 52, 100 36 L100 60 L0 60Z" fill="#cfe6f2" />
      {[10, 30, 50].map((v) => <path key={v} d={`M0 ${v} H100`} stroke="#fff" strokeWidth="1.4" />)}
      {[20, 45, 70, 90].map((v) => <path key={v} d={`M${v} 0 V60`} stroke="#fff" strokeWidth="1.4" />)}
      <g transform={`translate(${x} ${y * 0.6})`}><circle r="6" fill="#1F2B5E" opacity=".15" /><circle r="3" fill="#1F2B5E" stroke="#fff" strokeWidth="1" /></g>
    </svg>
  );
}

export default function PlaceDetail({ place, city, days, onClose, onSubmit }: {
  place: Candidate; city: string; days: number; onClose: () => void; onSubmit: (day: number | undefined) => void;
}) {
  const info = placeInfo(place.name, place.category, city);
  const [photo, setPhoto] = useState(0);
  const [day, setDay] = useState(place.day ? String(place.day) : "1");
  const inTrip = !!place.id;
  const opts = [...Array.from({ length: days }, (_, i) => ({ value: String(i + 1), label: `Day ${i + 1}` })), ...(inTrip ? [{ value: "0", label: "Unscheduled" }] : [])];
  return (
    <Modal open onClose={onClose} size="lg" title={place.name}
      footer={<>
        <Select aria-label="Add to trip day" className="w-40" value={day} onChange={(e) => setDay(e.target.value)} options={opts} />
        <Button onClick={() => { onSubmit(day === "0" ? undefined : Number(day)); onClose(); }}>{inTrip ? "Move to day" : "Add to trip day"}</Button>
      </>}>
      <div className="space-y-6">
        <div>
          <img src={unsplash(info.photos[photo], 1000)} alt={`${place.name}, photo ${photo + 1}`} className="aspect-[16/9] w-full rounded-2xl object-cover" />
          <div className="mt-2 grid grid-cols-4 gap-2">
            {info.photos.map((p, i) => (
              <button key={p} type="button" aria-label={`Show photo ${i + 1}`} aria-pressed={i === photo} onClick={() => setPhoto(i)} className={`overflow-hidden rounded-xl ring-offset-2 ${i === photo ? "ring-2 ring-navy" : "opacity-75 hover:opacity-100"}`}>
                <img src={unsplash(p, 300)} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="ocean">{place.category}</Badge>
          {place.rating && <span className="inline-flex items-center gap-1 text-sm font-semibold"><span className="text-amber-500"><StarIcon size={14} /></span>{place.rating.toFixed(1)} <span className="font-normal text-navy/55">· {info.reviews.length * 128} reviews</span></span>}
        </div>
        <p className="text-sm leading-relaxed text-navy/80">{info.desc}</p>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex gap-2"><dt className="mt-0.5 text-navy/55"><PinIcon size={16} /><span className="sr-only">Address</span></dt><dd>{info.address}</dd></div>
          <div className="flex gap-2"><dt className="mt-0.5 text-navy/55"><ClockIcon size={16} /><span className="sr-only">Hours</span></dt><dd>{info.hours}</dd></div>
        </dl>
        <MiniMap x={place.x} y={place.y} />
        <section aria-label="Reviews">
          <h3 className="mb-3 text-sm font-extrabold">Reviews</h3>
          <ul className="space-y-3">
            {info.reviews.map((r) => (
              <li key={r.author} className="rounded-2xl bg-surface p-4 text-sm">
                <div className="flex items-center justify-between"><strong>{r.author}</strong><span className="inline-flex items-center gap-1 text-xs font-semibold"><span className="text-amber-500"><StarIcon size={12} /></span>{r.rating.toFixed(1)}</span></div>
                <p className="mt-1 text-navy/75">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Modal>
  );
}
