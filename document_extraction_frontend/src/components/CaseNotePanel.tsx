"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

// PUBLIC_INTERFACE
export default function CaseNotePanel({ docId }: { docId: string }) {
  /** Panel to generate and edit case notes for a document. */
  const { documents, generateCaseNote, saveCaseNote } = useApp();
  const doc = documents.find((d) => d.id === docId);
  const [value, setValue] = useState(doc?.caseNote ?? "");
  const [copied, setCopied] = useState(false);

  if (!doc) return null;

  const onGenerate = () => {
    generateCaseNote(docId);
    setValue(doc.caseNote ?? "");
    setTimeout(() => {
      const updated = documents.find((d) => d.id === docId);
      setValue(updated?.caseNote ?? "");
    }, 0);
  };

  const onSave = () => saveCaseNote(docId, value);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <section aria-labelledby="case-note-title" className="card-container p-6 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 id="case-note-title" className="text-lg font-semibold text-gray-900 dark:text-white">Case note</h3>
        <div className="flex items-center gap-3">
          <button 
            className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors" 
            onClick={onGenerate}
          >
            Generate
          </button>
          <button 
            className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors" 
            onClick={onSave}
          >
            Save
          </button>
          <button 
            className={`rounded-lg border px-4 py-2 text-sm focus-ring transition-colors ${
              copied 
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300" 
                : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`} 
            onClick={onCopy}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div className="flex-1">
        <textarea
          aria-label="Case note editor"
          className="w-full h-full min-h-[200px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 text-sm focus-ring resize-none leading-relaxed"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Click Generate to automatically create a case note, or write your own summary here..."
        />
      </div>
    </section>
  );
}
