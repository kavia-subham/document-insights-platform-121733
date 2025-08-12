"use client";

import React, { useRef } from "react";
import { useApp } from "@/context/AppContext";

// PUBLIC_INTERFACE
export default function UploadZone() {
  /** File upload component that accepts PDF and DOCX. */
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { addDocuments } = useApp();

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).filter((f) => /\.(pdf|docx)$/i.test(f.name));
    if (arr.length) addDocuments(arr);
  };

  return (
    <div className="rounded-lg border border-dashed border-black/15 dark:border-white/15 bg-white/60 dark:bg-white/5 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-[var(--color-primary)] dark:text-white">Upload documents</div>
          <p className="text-xs text-black/60 dark:text-white/60">Supported: PDF, DOCX</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <button
            className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs text-white hover:opacity-90 focus-ring"
            onClick={() => inputRef.current?.click()}
          >
            Choose files
          </button>
        </div>
      </div>
    </div>
  );
}
