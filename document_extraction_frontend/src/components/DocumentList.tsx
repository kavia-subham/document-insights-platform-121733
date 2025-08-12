"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import type { DocumentItem } from "@/types";

function StatusBadge({ status }: { status: DocumentItem["status"] }) {
  const map: Record<DocumentItem["status"], string> = {
    uploaded: "bg-gray-200 text-gray-800",
    extracting: "bg-amber-200 text-amber-900",
    extracted: "bg-emerald-200 text-emerald-900",
    failed: "bg-rose-200 text-rose-900",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] ${map[status]}`}>{status}</span>;
}

// PUBLIC_INTERFACE
export default function DocumentList() {
  /** Sidebar list of documents with status and selection. */
  const { documents, selectedDocId, selectDocument, removeDocument } = useApp();

  return (
    <div className="space-y-2" role="list" aria-label="Uploaded documents">
      {documents.length === 0 && (
        <p className="text-xs text-black/60 dark:text-white/60">No documents yet. Upload to get started.</p>
      )}
      {documents.map((doc) => {
        const isActive = selectedDocId === doc.id;
        return (
          <div
            key={doc.id}
            role="listitem"
            className={`group flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
              isActive
                ? "border-[var(--color-primary)] bg-[var(--color-accent)]/20"
                : "border-black/10 dark:border-white/10 hover:bg-black/5"
            }`}
          >
            <button
              className="flex-1 text-left focus-ring"
              onClick={() => selectDocument(doc.id)}
              aria-pressed={isActive}
            >
              <div className="flex items-center gap-2">
                <span className="truncate">{doc.name}</span>
                <StatusBadge status={doc.status} />
              </div>
              <div className="text-[10px] text-black/60 dark:text-white/60">
                {(doc.size / 1024).toFixed(1)} KB • {doc.type.toUpperCase()}
              </div>
            </button>
            <button
              aria-label={`Remove ${doc.name}`}
              className="ml-2 rounded-md p-1 text-xs text-black/70 hover:bg-black/5 focus-ring"
              onClick={() => removeDocument(doc.id)}
              title="Remove"
            >
              🗑
            </button>
          </div>
        );
      })}
    </div>
  );
}
