type Props = { checked: boolean; onChange: (v: boolean) => void; label?: string; description?: string; disabled?: boolean };

export default function Toggle({ checked, onChange, label, description, disabled }: Props) {
  const sw = (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-50 ${checked ? "bg-navy" : "bg-navy/20"}`}>
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
  if (!label) return sw;
  return (
    <div className="flex items-center justify-between gap-4">
      <div><p className="text-sm font-semibold">{label}</p>{description && <p className="text-xs text-navy/60">{description}</p>}</div>
      {sw}
    </div>
  );
}
