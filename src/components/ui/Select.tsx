import { useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "./icons";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string; hint?: string; error?: string; options: { value: string; label: string }[]; placeholder?: string;
};

export default function Select({ label, hint, error, options, placeholder, className = "", id, ...rest }: Props) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      {label && <label htmlFor={fid} className="mb-1.5 block text-xs font-bold">{label}</label>}
      <div className={`relative rounded-xl border bg-white transition focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/15 ${error ? "border-red-500" : "border-navy/15"}`}>
        <select id={fid} aria-invalid={!!error} className="w-full appearance-none bg-transparent py-2.5 pl-4 pr-10 text-sm text-navy outline-none" {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy/50"><ChevronDownIcon size={16} /></span>
      </div>
      {(error || hint) && <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-navy/60"}`}>{error ?? hint}</p>}
    </div>
  );
}
