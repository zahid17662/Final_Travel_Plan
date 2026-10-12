import { useCallback, useState } from "react";

export function useHistory<T>(init: () => T) {
  const [h, setH] = useState(() => ({ past: [] as T[], present: init(), future: [] as T[] }));
  const set = useCallback((fn: (d: T) => T) => setH((s) => {
    const next = fn(s.present);
    return next === s.present ? s : { past: [...s.past.slice(-49), s.present], present: next, future: [] };
  }), []);
  const undo = useCallback(() => setH((s) => (s.past.length ? { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future] } : s)), []);
  const redo = useCallback(() => setH((s) => (s.future.length ? { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) } : s)), []);
  return { doc: h.present, set, undo, redo, canUndo: h.past.length > 0, canRedo: h.future.length > 0 };
}
