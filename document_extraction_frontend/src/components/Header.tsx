"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

// PUBLIC_INTERFACE
export default function Header() {
  /** Top header showing brand and user controls. */
  const { user, logout } = useApp();
  return (
    <header className="w-full border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 shadow-sm" aria-hidden />
          <span className="text-base font-semibold text-[var(--color-primary)] dark:text-white tracking-tight">Document Insights</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
              </div>
              <button
                className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus-ring transition-colors"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">Guest</span>
          )}
        </div>
      </div>
    </header>
  );
}
