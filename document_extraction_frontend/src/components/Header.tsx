"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

// PUBLIC_INTERFACE
export default function Header() {
  /** Top header showing brand and user controls. */
  const { user, logout } = useApp();
  return (
    <header className="w-full border-b border-black/10 dark:border-white/10 bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-[var(--color-primary)]" aria-hidden />
          <span className="text-sm font-semibold text-[var(--color-primary)] dark:text-white">Document Insights</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-black/70 dark:text-white/70">
                {user.name} • {user.email}
              </span>
              <button
                className="rounded-md border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs hover:bg-black/5 focus-ring"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <span className="text-xs text-black/60 dark:text-white/60">Guest</span>
          )}
        </div>
      </div>
    </header>
  );
}
