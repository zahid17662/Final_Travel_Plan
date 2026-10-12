import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "glass";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-500 disabled:pointer-events-none disabled:opacity-50";
const variants: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-navy-900 hover:shadow-card",
  secondary: "border border-navy/15 bg-white text-navy hover:bg-navy/5 hover:border-navy/30",
  ghost: "text-navy hover:bg-navy/5 active:bg-navy/10",
  glass: "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20",
};
const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-sm",
};

type Common = { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode; className?: string; children?: ReactNode; loading?: boolean };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", icon, className = "", children, loading = false, disabled, ...rest } = props;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const spinner = (
    <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
  const content = <>{loading ? spinner : icon}{children}</>;
  if (props.href !== undefined) {
    return <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} aria-disabled={loading || disabled} className={cls}>{content}</a>;
  }
  return <button type="button" disabled={loading || disabled} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>{content}</button>;
}
