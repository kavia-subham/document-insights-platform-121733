"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import ExtractionProgress from "@/components/ExtractionProgress";
import CaseNotePanel from "@/components/CaseNotePanel";
import CopilotChat from "@/components/CopilotChat";

// PUBLIC_INTERFACE
export default function DocumentDetail() {
  /** Main area showing selected document details and tools. */
  const { documents, selectedDocId, startExtraction } = useApp();
  const doc = documents.find((d) => d.id === selectedDocId);

  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-black/60 dark:text-white/60">
        Select or upload a document to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold">{doc.name}</h2>
            <p className="text-xs text-black/60 dark:text-white/60">
              {(doc.size / 1024).toFixed(1)} KB • {doc.type.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {doc.status !== "extracted" && doc.status !== "extracting" && (
              <button
                className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs text-white hover:opacity-90 focus-ring"
                onClick={() => startExtraction(doc.id)}
              >
                Start extraction
              </button>
            )}
            {doc.status === "extracting" && <span className="text-xs">Processing...</span>}
            {doc.status === "extracted" && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] text-emerald-900">Extracted</span>
            )}
          </div>
        </div>

        <div className="mt-4">
          {doc.status === "extracting" && <ExtractionProgress progress={doc.progress} />}
          {doc.status === "extracted" && (
            <div>
              <div className="mb-1 text-xs font-medium">Content preview</div>
              <pre className="max-h-48 overflow-auto rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-xs whitespace-pre-wrap">
                {doc.contentText}
              </pre>
            </div>
          )}
          {doc.status === "uploaded" && (
            <p className="text-xs text-black/60 dark:text-white/60">Click “Start extraction” to extract this file.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CaseNotePanel docId={doc.id} />
        <CopilotChat docId={doc.id} />
      </div>
    </div>
  );
}
