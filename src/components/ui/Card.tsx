import type { ElementType, ReactNode } from "react";

type Props = { children?: ReactNode; image?: string; imageAlt?: string; ratio?: string; padded?: boolean; hover?: boolean; as?: ElementType; className?: string };

export default function Card({ children, image, imageAlt = "", ratio = "aspect-[3/2]", padded = true, hover = false, as: Tag = "div", className = "" }: Props) {
  return (
    <Tag className={`overflow-hidden rounded-card bg-white shadow-card ${hover ? "transition hover:-translate-y-0.5" : ""} ${className}`}>
      {image && <div className={`${ratio} overflow-hidden bg-navy/5`}><img src={image} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" /></div>}
      {children && <div className={padded ? "p-5" : ""}>{children}</div>}
    </Tag>
  );
}
