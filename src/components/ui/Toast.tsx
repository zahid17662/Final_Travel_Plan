import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { CheckIcon, CloseIcon, InfoIcon } from "./icons";

type Tone = "success" | "info" | "error";
type ToastInput = { title: string; description?: string; tone?: Tone };
type ToastItem = ToastInput & { id: number };

const Ctx = createContext<{ show: (t: ToastInput) => void } | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast must be used inside <ToastProvider>");
  return c;
}

const dot: Record<Tone, string> = { success: "bg-ocean-500", info: "bg-navy", error: "bg-red-500" };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const show = useCallback((t: ToastInput) => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { ...t, id }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col gap-3">
        {items.map((t) => (
          <div key={t.id} role="status" className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-navy p-4 text-white shadow-pop">
            <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${dot[t.tone ?? "info"]}`}>
              {t.tone === "success" ? <CheckIcon size={14} /> : <InfoIcon size={14} />}
            </span>
            <div className="flex-1 text-sm">
              <p className="font-bold">{t.title}</p>
              {t.description && <p className="mt-0.5 text-white/75">{t.description}</p>}
            </div>
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)} className="text-white/60 hover:text-white"><CloseIcon size={14} /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
