import { useAuth } from "../../context/AuthContext";
import Avatar from "./Avatar";
import Button from "./Button";
import Dropdown from "./Dropdown";
import { SearchBar } from "./Field";
import { MenuIcon } from "./icons";
import NotificationsMenu from "./NotificationsMenu";

export const SITE_NAME = "Travel Plan";

export const defaultLinks = [
  { label: "Home", href: "#/home" },
  { label: "Explore", href: "#/explore" },
  { label: "Guides", href: "#/guides" },
  { label: "Hotels", href: "#/hotels" },
  { label: "Flights", href: "#/flights" },
];

export function Logo({ overlay = false, inline = false }: { overlay?: boolean; inline?: boolean }) {
  return (
    <a href="#/" aria-label={SITE_NAME} className={`${inline ? "inline-block" : "absolute left-1/2 -translate-x-1/2"} text-center ${overlay ? "text-white" : "text-navy"}`}>
      <svg className="mx-auto" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12c5 0 5-6 9-6s4 6 9 6M3 12c5 0 5 6 9 6s4-6 9-6" /></svg>
      <div className="mt-1 text-[10px] font-semibold tracking-[0.3em]">{SITE_NAME.toUpperCase()}</div>
    </a>
  );
}

type Props = {
  loggedIn?: boolean;
  overlay?: boolean;
  activeHref?: string;
  links?: { label: string; href: string }[];
  user?: { name: string; image?: string };
  onSearch?: (q: string) => void;
};

export default function Navbar({ loggedIn, overlay = false, activeHref, links = defaultLinks, user, onSearch }: Props) {
  let authContext: ReturnType<typeof useAuth> | null = null;
  try {
    authContext = useAuth();
  } catch {
    authContext = null;
  }

  const isUserLoggedIn = loggedIn ?? authContext?.isAuthenticated ?? false;
  const displayUser = user ?? (authContext?.user ? { name: authContext.user.name, image: authContext.user.avatar } : { name: "M" });

  const linkCls = (active: boolean) =>
    overlay
      ? `rounded-full px-3 py-2 text-xs transition hover:bg-white/10 hover:text-white ${active ? "text-white" : "text-white/80"}`
      : `rounded-full px-3 py-2 text-xs font-medium transition hover:bg-navy/5 hover:text-navy focus-visible:outline-2 focus-visible:outline-navy ${active ? "text-navy" : "text-navy/60"}`;

  return (
    <header className={`relative z-30 ${overlay ? "text-white" : "sticky top-0 border-b border-navy/10 bg-white/90 text-navy backdrop-blur"}`}>
      <div className="relative flex items-center justify-between px-6 py-4 md:px-10">
        <nav aria-label="Primary" className="hidden gap-2 md:flex">
          {links.map((l) => <a key={l.href} href={l.href} aria-current={l.href === activeHref ? "page" : undefined} className={linkCls(l.href === activeHref)}>{l.label}</a>)}
        </nav>
        <div className="md:hidden">
          <Dropdown trigger={<span className={`grid h-9 w-9 place-items-center rounded-full ${overlay ? "bg-white/10" : "bg-surface"}`}><MenuIcon size={18} /></span>} items={[...links.map((l) => ({ label: l.label, href: l.href })), ...(isUserLoggedIn ? [] : [{ label: "Login", href: "#/login" }, { label: "Pricing", href: "#/pricing" }])]} />
        </div>
        <Logo overlay={overlay} />
        {isUserLoggedIn ? (
          <div className="flex items-center gap-3">
            <SearchBar tone={overlay ? "glass" : "light"} className="hidden w-56 sm:flex" onChange={(e) => onSearch?.(e.target.value)} />
            <NotificationsMenu />
            <Dropdown align="right" trigger={<Avatar name={displayUser.name} src={displayUser.image} tone={overlay ? "soft" : "solid"} className={overlay ? "!bg-white/90" : ""} />}
              items={[
                { label: "My trips", href: "#/trips" },
                { label: "Profile", href: "#/profile" },
                { label: "Settings", href: "#/settings/account" },
                { label: "Help", href: "#/help" },
                {
                  label: "Log out",
                  danger: true,
                  onSelect: () => {
                    authContext?.logout();
                    window.location.hash = "#/";
                  },
                },
              ]} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <a href="#/login" className={`${linkCls(false)} hidden sm:inline`}>Login</a>
            <Button href="#/signup" size="sm" variant={overlay ? "glass" : "primary"}>Signup</Button>
          </div>
        )}
      </div>
    </header>
  );
}
