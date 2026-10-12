import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

type Props = { children: ReactNode; selected?: boolean; onClick?: () => void; onRemove?: () => void; icon?: ReactNode; className?: string };

export default function Chip({ children, selected = false, onClick, onRemove, icon, className = "" }: Props) {
  const cls = `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition duration-200 active:scale-95 ${
    selected ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:bg-navy/5"
  } ${className}`;
  const body = <>{icon}{children}</>;
  return (
    <span className="inline-flex items-center">
      {onClick ? (
        <button type="button" aria-pressed={selected} onClick={onClick} className={cls}>{body}</button>
      ) : (
        <span className={cls}>{body}</span>
      )}
      {onRemove && (
        <button type="button" aria-label="Remove" onClick={onRemove} className="-ml-7 mr-1 grid h-5 w-5 place-items-center rounded-full hover:bg-navy/10"><CloseIcon size={12} /></button>
      )}
    </span>
  );
}
