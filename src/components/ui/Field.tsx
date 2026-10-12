import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { SearchIcon } from "./icons";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string; leading?: ReactNode; trailing?: ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leading, trailing, className = "", id, ...rest },
  ref
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      {label && <label htmlFor={fid} className="mb-1.5 block text-xs font-bold">{label}</label>}
      <div className={`flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 transition focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/15 ${error ? "border-red-500" : "border-navy/15"}`}>
        {leading && <span className="text-navy/50">{leading}</span>}
        <input ref={ref} id={fid} aria-invalid={!!error} className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-navy/40" {...rest} />
        {trailing}
      </div>
      {(error || hint) && <p role={error ? "alert" : undefined} className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-navy/60"}`}>{error ?? hint}</p>}
    </div>
  );
});

type SearchProps = InputHTMLAttributes<HTMLInputElement> & { tone?: "light" | "glass" };

export function SearchBar({ tone = "light", className = "", placeholder = "Enter place or user", ...rest }: SearchProps) {
  const tones = {
    light: "bg-surface text-navy placeholder:text-navy/50 border-transparent focus-within:border-navy/30",
    glass: "border-white/25 bg-white/10 text-white backdrop-blur placeholder:text-white/70",
  };
  return (
    <label className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${tones[tone]} ${className}`}>
      <SearchIcon size={14} />
      <input type="search" placeholder={placeholder} className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-current placeholder:opacity-70" {...rest} />
    </label>
  );
}

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export const Textarea = forwardRef<HTMLTextAreaElement, AreaProps>(function Textarea(
  { label, className = "", id, rows = 4, ...rest },
  ref
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      {label && <label htmlFor={fid} className="mb-1.5 block text-xs font-bold">{label}</label>}
      <textarea ref={ref} id={fid} rows={rows} className="w-full resize-y rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-navy/40 focus:border-navy focus:ring-2 focus:ring-navy/15" {...rest} />
    </div>
  );
});
