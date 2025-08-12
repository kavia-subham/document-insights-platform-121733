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
    <section aria-labelledby="case-note-title" className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 id="case-note-title" className="text-sm font-semibold">Case note</h3>
        <div className="flex items-center gap-2">
          <button className="rounded-md border px-2 py-1 text-xs hover:bg-black/5 focus-ring" onClick={onGenerate}>
            Generate
          </button>
          <button className="rounded-md border px-2 py-1 text-xs hover:bg-black/5 focus-ring" onClick={onSave}>
            Save
          </button>
          <button className="rounded-md border px-2 py-1 text-xs hover:bg-black/5 focus-ring" onClick={onCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <textarea
        aria-label="Case note editor"
        className="min-h-[160px] w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-2 text-sm focus-ring"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Click Generate to create a case note, or write your own summary here..."
      />
    </section>
  );
}
