import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export type DateRange = { start?: Date; end?: Date };

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const same = (a?: Date, b?: Date) => !!a && !!b && a.getTime() === b.getTime();
const monthName = (d: Date) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
export const formatRange = ({ start, end }: DateRange) => {
  if (!start) return "";
  const f = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(d.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}) });
  return end && !same(start, end) ? `${f(start)} – ${f(end)}` : f(start);
};

function Month({ month, value, hover, onPick, onHover, min }: { month: Date; value: DateRange; hover?: Date; onPick: (d: Date) => void; onHover: (d?: Date) => void; min: Date }) {
  const lead = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const edge = value.end ?? hover;
  return (
    <div>
      <p className="mb-2 text-center text-sm font-bold text-navy">{monthName(month)}</p>
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-navy/50">{["S", "M", "T", "W", "T", "F", "S"].map((w, i) => <span key={i} className="py-1">{w}</span>)}</div>
      <div className="grid grid-cols-7" onMouseLeave={() => onHover(undefined)}>
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const disabled = d < min;
          const isStart = same(d, value.start);
          const isEnd = same(d, value.end);
          const lo = value.start && edge && (edge < value.start ? edge : value.start);
          const hi = value.start && edge && (edge < value.start ? value.start : edge);
          const inRange = !!(lo && hi && d > lo && d < hi);
          const cap = isStart || isEnd;
          return (
            <button key={i} type="button" disabled={disabled} aria-pressed={cap} aria-label={d.toLocaleDateString("en-US", { dateStyle: "full" })}
              onClick={() => onPick(d)} onMouseEnter={() => onHover(d)}
              className={`relative h-9 text-xs font-semibold transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-navy ${disabled ? "cursor-not-allowed text-navy/25" : "text-navy"} ${inRange ? "bg-ocean-100" : ""} ${cap ? "rounded-full bg-navy !text-white" : !disabled && !inRange ? "rounded-full hover:bg-navy/8" : ""}`}>
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  const today = day(new Date());
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [hover, setHover] = useState<Date>();
  const next = new Date(view.getFullYear(), view.getMonth() + 1, 1);
  const shift = (n: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));
  const canBack = view > new Date(today.getFullYear(), today.getMonth(), 1);

  const pick = (d: Date) => {
    if (!value.start || value.end) onChange({ start: d });
    else if (d < value.start) onChange({ start: d });
    else onChange({ start: value.start, end: d });
  };
  const nav = "grid h-8 w-8 place-items-center rounded-full hover:bg-navy/5 disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className="relative rounded-xl border border-navy/10 bg-white p-4">
      <button type="button" aria-label="Previous month" disabled={!canBack} onClick={() => shift(-1)} className={`${nav} absolute left-3 top-3.5`}><ChevronLeftIcon size={16} /></button>
      <button type="button" aria-label="Next month" onClick={() => shift(1)} className={`${nav} absolute right-3 top-3.5`}><ChevronRightIcon size={16} /></button>
      <div className="grid gap-6 sm:grid-cols-2">
        <Month month={view} value={value} hover={value.start && !value.end ? hover : undefined} onPick={pick} onHover={setHover} min={today} />
        <div className="hidden sm:block"><Month month={next} value={value} hover={value.start && !value.end ? hover : undefined} onPick={pick} onHover={setHover} min={today} /></div>
      </div>
    </div>
  );
}
