export type TabItem = { id: string; label: string; count?: number };

type Props = { items: TabItem[]; value: string; onChange: (id: string) => void; variant?: "underline" | "pill"; className?: string };

export default function Tabs({ items, value, onChange, variant = "underline", className = "" }: Props) {
  const wrap = variant === "underline" ? "gap-6 border-b border-navy/10 overflow-x-auto" : "gap-1 rounded-full bg-surface p-1 w-fit max-w-full overflow-x-auto";
  return (
    <div role="tablist" className={`flex ${wrap} ${className}`}>
      {items.map((t) => {
        const active = t.id === value;
        const cls =
          variant === "underline"
            ? `-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition ${active ? "border-navy text-navy" : "border-transparent text-navy/55 hover:text-navy"}`
            : `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-navy ${active ? "bg-navy text-white shadow-card" : "text-navy/70 hover:text-navy"}`;
        return (
          <button key={t.id} role="tab" type="button" aria-selected={active} onClick={() => onChange(t.id)} className={cls}>
            {t.label}{t.count !== undefined && <span className="ml-1.5 text-xs opacity-60">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
