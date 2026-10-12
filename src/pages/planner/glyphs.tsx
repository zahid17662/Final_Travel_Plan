import type { ReactNode } from "react";

const g = (d: ReactNode) => ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

export const WalkIcon = g(<><circle cx="13" cy="4.5" r="1.6" /><path d="M9 21l2.5-6.5L9.5 12l1-4.5 3 2 3 1M13.5 9.5L12 15l3 2.5 1 3.5M8 12L6 14" /></>);
export const CarIcon = g(<><path d="M5 16V12l1.6-4.5A2 2 0 018.5 6h7a2 2 0 011.9 1.5L19 12v4M3.5 16h17M5 16v2.5M19 16v2.5" /><circle cx="7.5" cy="13.5" r=".6" /><circle cx="16.5" cy="13.5" r=".6" /></>);
export const TransitIcon = g(<><rect x="5" y="3.5" width="14" height="14" rx="3" /><path d="M5 11h14M9 21l2-3.5M15 21l-2-3.5" /><circle cx="9" cy="14.2" r=".6" /><circle cx="15" cy="14.2" r=".6" /></>);
export const ClockIcon = g(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const CoinIcon = g(<><circle cx="12" cy="12" r="8.5" /><path d="M14.5 9.2c-.6-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2-.4-2.6-1.3M12 6.5V8m0 8v1.5" /></>);
export const GripIcon = g(<>{[8, 12, 16].map((y) => [9, 15].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="currentColor" />))}</>);
export const RouteIcon = g(<><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h6.5a3 3 0 000-6h-5a3 3 0 010-6H16" /></>);
export const LandmarkIcon = g(<><path d="M3.5 9.5L12 4l8.5 5.5M5.5 10v7M9.5 10v7M14.5 10v7M18.5 10v7M3.5 20h17M4.5 17h15" /></>);
export const ForkIcon = g(<><path d="M7 3v8a2 2 0 002 2v8M11 3v6a2 2 0 01-2 2M17 21V3c-2 1.5-3 4-3 7v3h3" /></>);
export const CoffeeIcon = g(<><path d="M4.5 9h11v5a4 4 0 01-4 4h-3a4 4 0 01-4-4V9zM15.5 10h1.5a2.5 2.5 0 010 5h-1.5M8 3.5v2M11.5 3.5v2" /></>);
export const BedIcon = g(<><path d="M3.5 18V6M3.5 14h17v4M20.5 14v-2a3 3 0 00-3-3H11v5" /><circle cx="7" cy="11" r="1.6" /></>);
export const BagIcon = g(<><path d="M5.5 8h13l1 12h-15l1-12zM9 8V6.5a3 3 0 016 0V8" /></>);
export const MoonIcon = g(<><path d="M19.5 14.5A8 8 0 019.5 4.5a8 8 0 1010 10z" /></>);
export const WandIcon = g(<><path d="M5 19L15 9M14 5l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 12l.6-1.2.6 1.2 1.2.6-1.2.6-.6 1.2-.6-1.2-1.2-.6L19 12z" /></>);
export const PlaneIcon = g(<><path d="M10.5 13.5L3.5 11l1-1.8 8 1.2 4.5-5a1.7 1.7 0 012.5 2.4l-5 4.5 1.2 8-1.8 1-2.5-7-3.4 3.4.4 2.6-1.4.8-1.8-3.2-3.2-1.8.8-1.4 2.6.4 3.6-3.4z" /></>);
export const TrainIcon = g(<><rect x="5.5" y="3.5" width="13" height="13" rx="3" /><path d="M5.5 11h13M8 20l1.8-3.5M16 20l-1.8-3.5" /><circle cx="9" cy="14" r=".6" /><circle cx="15" cy="14" r=".6" /></>);
export const ImageIcon = g(<><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4" /></>);
export const MailIcon = g(<><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4 7.5l8 6 8-6" /></>);
export const PaperclipIcon = g(<><path d="M19.5 11.5l-7 7a4.5 4.5 0 01-6.4-6.4l7.4-7.4a3 3 0 014.2 4.2l-7.3 7.3a1.5 1.5 0 01-2.1-2.1l6.6-6.6" /></>);
export const WalletIcon = g(<><path d="M4 7.5A2.5 2.5 0 016.5 5H18v3M4 7.5V17a2 2 0 002 2h13a1 1 0 001-1V9a1 1 0 00-1-1H6.5A2.5 2.5 0 014 7.5z" /><circle cx="16" cy="13.5" r="1" fill="currentColor" /></>);
