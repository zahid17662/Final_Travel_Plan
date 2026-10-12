import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CheckIcon, Chip, Input, PinIcon, SearchIcon, unsplash } from "../../components/ui";
import { destinations, homeCities, travelStyles } from "../../data";
import AuthLayout from "./AuthLayout";

const steps = [
  { title: "How do you like to travel?", sub: "Pick as many as you like. We'll tailor guides and ideas to your style." },
  { title: "Where do you dream of going?", sub: "Choose the destinations you'd love to visit." },
  { title: "Where's home?", sub: "We'll use it to suggest flights and nearby trips." },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [styles, setStyles] = useState<string[]>([]);
  const [dests, setDests] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [step]);

  const toggle = (list: string[], set: (l: string[]) => void, x: string) => set(list.includes(x) ? list.filter((i) => i !== x) : [...list, x]);
  const ready = [styles.length > 0, dests.length > 0, city.trim().length > 1][step];
  const last = step === steps.length - 1;
  const finish = () => {
    localStorage.setItem("tp_onboarding", JSON.stringify({ styles, dests, city }));
    navigate("/home");
  };
  const matches = homeCities.filter((c) => c.toLowerCase().includes(city.trim().toLowerCase()));

  return (
    <AuthLayout headline="Make it yours" tagline="Three quick questions so Travel Plan feels made for you.">
      <div className="flex items-center justify-between text-xs font-semibold text-navy/60">
        <span aria-live="polite">Step {step + 1} of {steps.length}</span>
        <a href="#/home" className="underline-offset-2 hover:text-navy hover:underline">Skip for now</a>
      </div>
      <div className="mt-3 flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step + 1}>
        {steps.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-navy" : "bg-navy/10"}`} />)}
      </div>

      <h2 ref={heading} tabIndex={-1} className="mt-8 text-3xl font-extrabold tracking-tight outline-none">{steps[step].title}</h2>
      <p className="mt-2 text-sm text-navy/60">{steps[step].sub}</p>

      <div className="mt-7 min-h-[16rem]">
        {step === 0 && (
          <div className="flex flex-wrap gap-2.5">
            {travelStyles.map((s) => <Chip key={s} selected={styles.includes(s)} onClick={() => toggle(styles, setStyles, s)} className="!px-4 !py-2.5 !text-sm">{s}</Chip>)}
          </div>
        )}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {destinations.map((d) => {
              const on = dests.includes(d.slug);
              return (
                <button key={d.slug} type="button" aria-pressed={on} onClick={() => toggle(dests, setDests, d.slug)}
                  className={`group relative aspect-[4/5] overflow-hidden rounded-card bg-navy/5 text-left outline-offset-2 transition focus-visible:outline-2 focus-visible:outline-navy ${on ? "ring-2 ring-navy ring-offset-2" : ""}`}>
                  <img src={unsplash(d.photo, 400)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 text-white"><span className="block text-sm font-bold">{d.name}</span><span className="block text-[11px] text-white/80">{d.country}</span></span>
                  {on && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-navy"><CheckIcon size={14} /></span>}
                </button>
              );
            })}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <Input label="Home city" leading={<SearchIcon size={16} />} placeholder="Search or type your city" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              {matches.slice(0, 8).map((c) => <Chip key={c} selected={city === c} icon={<PinIcon size={12} />} onClick={() => setCity(c)}>{c}</Chip>)}
              {!matches.length && <p className="text-sm text-navy/60">No match. We'll use “{city}” as typed.</p>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="ghost" className={step === 0 ? "invisible" : ""} onClick={() => setStep((s) => s - 1)}>Back</Button>
        <Button size="lg" disabled={!ready} onClick={() => (last ? finish() : setStep((s) => s + 1))}>{last ? "Finish" : "Continue"}</Button>
      </div>
    </AuthLayout>
  );
}
