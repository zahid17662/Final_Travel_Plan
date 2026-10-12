import { useState } from "react";
import Button from "./Button";

const KEY = "tp_cookie_consent";

export default function CookieBanner() {
  const [shown, setShown] = useState(() => !localStorage.getItem(KEY));
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  if (!shown) return null;
  const choose = (v: string) => { localStorage.setItem(KEY, v); setShown(false); };
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl bg-navy p-5 text-white shadow-pop sm:bottom-5">
      <p className="text-sm font-bold">We use cookies</p>
      <p className="mt-1 text-xs leading-relaxed text-white/75">Essential cookies keep you signed in. Optional analytics cookies help us improve Travel Plan. Read our <a href="#/privacy" className="underline">privacy policy</a>.</p>
      {custom && (
        <div className="mt-3 space-y-2 rounded-xl bg-white/10 p-3 text-xs">
          <label className="flex items-center justify-between gap-3"><span>Essential <span className="text-white/60">(always on)</span></span><input type="checkbox" checked disabled className="h-4 w-4" /></label>
          <label className="flex items-center justify-between gap-3"><span>Analytics</span><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="h-4 w-4 accent-[#7cc4ee]" /></label>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="glass" onClick={() => choose(custom ? (analytics ? "all" : "essential") : "all")}>{custom ? "Save choices" : "Accept all"}</Button>
        <Button size="sm" variant="ghost" className="!text-white hover:!bg-white/10" onClick={() => choose("essential")}>Essential only</Button>
        {!custom && <Button size="sm" variant="ghost" className="!text-white hover:!bg-white/10" onClick={() => setCustom(true)}>Customise</Button>}
      </div>
    </div>
  );
}
