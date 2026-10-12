import type { ReactNode } from "react";
import Avatar, { AvatarGroup } from "./Avatar";
import Dropdown from "./Dropdown";
import type { DropdownItem } from "./Dropdown";
import { DotsIcon, EyeIcon, HeartIcon, PinIcon, ShareIcon, StarIcon } from "./icons";

export const unsplash = (id: string, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop`;

const shell = "group overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-0.5";

function Media({ src, alt, ratio = "aspect-[3/2]", className = "", children }: { src: string; alt: string; ratio?: string; className?: string; children?: ReactNode }) {
  return (
    <div className={`relative ${ratio} overflow-hidden bg-navy/5 ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      {children}
    </div>
  );
}

const glassChip = "inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-black/60";

function Overlay({ onShare, onMore, menu }: { onShare?: () => void; onMore?: () => void; menu?: DropdownItem[] }) {
  return (
    <div className="absolute right-3 top-3 flex items-center gap-2">
      <button type="button" onClick={onShare} className={glassChip}><ShareIcon size={12} />Share</button>
      {menu ? (
        <Dropdown align="right" items={menu} trigger={<span aria-label="Trip actions" className="grid h-7 w-7 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60"><DotsIcon size={14} /></span>} />
      ) : (
        <button type="button" aria-label="More" onClick={onMore} className="grid h-7 w-7 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60"><DotsIcon size={14} /></button>
      )}
    </div>
  );
}

const Stat = ({ icon, n }: { icon: ReactNode; n: number }) => <span className="inline-flex items-center gap-1">{icon}{n}</span>;

type TripProps = {
  image: string; title: string; dates: string; places: string; owner?: string;
  destination?: string; collaborators?: string[]; menu?: DropdownItem[];
  variant?: "card" | "row"; href?: string; onShare?: () => void; onMore?: () => void;
};

export function TripCard({ image, title, dates, places, owner = "M", destination, collaborators, menu, variant = "card", href = "#", onShare, onMore }: TripProps) {
  const rich = !!(destination || collaborators);
  const meta = rich ? (
    <>
      {destination && <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-navy/60"><PinIcon size={14} />{destination}</p>}
      <p className="mt-2 text-sm text-navy/60">{dates} • {places}</p>
    </>
  ) : (
    <p className="mt-2 flex items-center gap-2 text-sm text-navy/60"><Avatar name={owner} size="sm" />• {dates} • {places}</p>
  );
  if (variant === "row") {
    return (
      <div className="group flex items-center gap-3 py-4 sm:gap-4">
        <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20" />
        <a href={href} className="min-w-0 flex-1"><h3 className="truncate text-base font-semibold">{title}</h3>{meta}</a>
        {collaborators && <span className="hidden sm:block"><AvatarGroup names={collaborators} /></span>}
        <div className="flex gap-1 text-navy/55">
          <button type="button" aria-label="Share" onClick={onShare} className="grid h-8 w-8 place-items-center rounded-full hover:bg-navy/5"><ShareIcon /></button>
          {menu ? <Dropdown align="right" items={menu} trigger={<span aria-label="Trip actions" className="grid h-8 w-8 place-items-center rounded-full hover:bg-navy/5"><DotsIcon /></span>} />
            : <button type="button" aria-label="More" onClick={onMore} className="grid h-8 w-8 place-items-center rounded-full hover:bg-navy/5"><DotsIcon /></button>}
        </div>
      </div>
    );
  }
  if (rich) {
    return (
      <article className="group rounded-2xl bg-white shadow-card transition hover:shadow-pop">
        <div className="relative">
          <Media src={image} alt={title} className="rounded-t-2xl"><span /></Media>
          <Overlay onShare={onShare} menu={menu} />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <a href={href} className="min-w-0 flex-1"><h3 className="truncate text-base font-semibold">{title}</h3>{meta}</a>
            {collaborators && <span className="mt-0.5 shrink-0"><AvatarGroup names={collaborators} /></span>}
          </div>
        </div>
      </article>
    );
  }
  return (
    <article className={shell}>
      <Media src={image} alt={title}><Overlay onShare={onShare} onMore={onMore} /></Media>
      <a href={href} className="block p-4"><h3 className="text-base font-semibold">{title}</h3>{meta}</a>
    </article>
  );
}

type GuideProps = {
  image: string; title: string; blurb?: string; author: string; authorImage?: string;
  likes: number; views: number; href?: string; onShare?: () => void; onMore?: () => void;
};

export function GuideCard({ image, title, blurb, author, authorImage, likes, views, href = "#", onShare, onMore }: GuideProps) {
  return (
    <article className={shell}>
      <Media src={image} alt={title}><Overlay onShare={onShare} onMore={onMore} /></Media>
      <a href={href} className="block p-4">
        <h3 className="truncate text-base font-semibold">{title}</h3>
        {blurb && <p className="mt-2 line-clamp-2 text-sm text-navy/60">{blurb}</p>}
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Avatar name={author} src={authorImage} size="sm" />
          <span className="flex-1 truncate">{author}</span>
          <span className="flex items-center gap-3 text-navy/70"><Stat icon={<HeartIcon />} n={likes} /><Stat icon={<EyeIcon />} n={views} /></span>
        </div>
      </a>
    </article>
  );
}

type PlaceProps = {
  image: string; name: string; category: string; location: string; rating?: number;
  saved?: boolean; onSave?: () => void; href?: string;
};

export function PlaceCard({ image, name, category, location, rating, saved = false, onSave, href = "#" }: PlaceProps) {
  return (
    <article className={shell}>
      <Media src={image} alt={name} ratio="aspect-[4/3]">
        <button type="button" aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save place"} onClick={onSave}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur transition ${saved ? "bg-white text-red-500" : "bg-black/45 text-white hover:bg-black/60"}`}>
          <HeartIcon size={16} />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">{category}</span>
      </Media>
      <a href={href} className="block p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold">{name}</h3>
          {rating !== undefined && <span className="inline-flex items-center gap-1 text-sm font-bold"><span className="text-amber-500"><StarIcon size={14} /></span>{rating.toFixed(1)}</span>}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-navy/60"><PinIcon size={14} />{location}</p>
      </a>
    </article>
  );
}
