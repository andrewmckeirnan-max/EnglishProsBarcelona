"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface UnlockState {
  unlocked: boolean;
  unlock: () => void;
}

const UnlockCtx = createContext<UnlockState | undefined>(undefined);

/**
 * Shares "has this visitor unlocked the full list" state between the lead
 * form and the professionals list on the same category page, which
 * otherwise render in two disconnected places: without this, submitting
 * the form reveals the full list only inside the form's own success view,
 * while the separate locked/blurred cards further down the page stay
 * locked forever, since they're static output with no link back to the
 * form's client state. Wrap both in this provider so one flips the other.
 */
export function UnlockProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  return <UnlockCtx.Provider value={{ unlocked, unlock: () => setUnlocked(true) }}>{children}</UnlockCtx.Provider>;
}

export function useUnlock(): UnlockState {
  const ctx = useContext(UnlockCtx);
  // Falls back to a local, non-shared unlock state when used outside a
  // provider (homepage / area page forms, which don't have a separate
  // list to sync with) rather than throwing, so the same components work
  // in both contexts.
  const [localUnlocked, setLocalUnlocked] = useState(false);
  if (ctx) return ctx;
  return { unlocked: localUnlocked, unlock: () => setLocalUnlocked(true) };
}
