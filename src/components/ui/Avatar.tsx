const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-8 w-8 text-xs", lg: "h-12 w-12 text-base" };

type Props = { name: string; src?: string; size?: keyof typeof sizes; tone?: "soft" | "solid"; className?: string };

export default function Avatar({ name, src, size = "md", tone = "soft", className = "" }: Props) {
  const tones = { soft: "bg-navy/10 text-navy", solid: "bg-navy text-white" };
  return src ? (
    <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />
  ) : (
    <span role="img" aria-label={name} className={`grid shrink-0 place-items-center rounded-full font-bold ${sizes[size]} ${tones[tone]} ${className}`}>
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export function AvatarGroup({ names, max = 3, size = "sm" }: { names: string[]; max?: number; size?: keyof typeof sizes }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <span role="group" aria-label={`Travelers: ${names.join(", ")}`} className="flex -space-x-2">
      {shown.map((n, i) => <Avatar key={`${n}-${i}`} name={n} size={size} tone={i === 0 ? "solid" : "soft"} className="ring-2 ring-white" />)}
      {extra > 0 && <span className={`grid place-items-center rounded-full bg-ocean-100 font-bold text-navy ring-2 ring-white ${sizes[size]}`}>+{extra}</span>}
    </span>
  );
}
