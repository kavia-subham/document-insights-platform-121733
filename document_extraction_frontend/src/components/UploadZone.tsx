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
    <div className="rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-white/80 dark:from-purple-900/20 dark:to-gray-800/50 p-6 transition-all hover:border-purple-300 dark:hover:border-purple-700">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-base font-semibold text-[var(--color-primary)] dark:text-white mb-2">Upload documents</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Drag & drop or click to select PDF, DOCX files</p>
        </div>
        <div className="flex justify-center">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <button
            className="rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-purple-600 px-6 py-3 text-sm font-medium text-white hover:shadow-lg hover:scale-105 focus-ring transition-all duration-200"
            onClick={() => inputRef.current?.click()}
          >
            Choose files
          </button>
        </div>
      </div>
    </div>
  );
}
