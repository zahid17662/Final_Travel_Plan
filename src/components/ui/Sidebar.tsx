import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export type SidebarItem = { label: string; to: string; icon?: ReactNode; badge?: ReactNode };

export default function Sidebar({ items, title }: { items: SidebarItem[]; title?: string }) {
  return (
    <aside aria-label={title ?? "Section navigation"} className="lg:sticky lg:top-24 lg:self-start">
      {title && <p className="mb-3 hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-navy/50 lg:block">{title}</p>}
      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-col lg:gap-1 lg:overflow-visible">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} end
            className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition lg:rounded-xl ${isActive ? "bg-navy text-white shadow-card" : "bg-white text-navy/70 hover:bg-navy/5 hover:text-navy lg:bg-transparent"}`}>
            {i.icon}<span className="flex-1 whitespace-nowrap">{i.label}</span>{i.badge}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
