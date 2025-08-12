"use client";

import React from "react";

// PUBLIC_INTERFACE
export default function ExtractionProgress({ progress }: { progress: number }) {
  /** Simple progress bar for extraction status. */
  return (
    <div className="w-full">
      <div className="mb-1 text-xs text-black/70 dark:text-white/70">Extracting... {progress}%</div>
      <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
        <div
          className="h-2 rounded-full bg-[var(--color-primary)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
