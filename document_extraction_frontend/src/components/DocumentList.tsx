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
    <div className="space-y-3" role="list" aria-label="Uploaded documents">
      {documents.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">📄</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No documents yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload files to get started</p>
        </div>
      )}
      {documents.map((doc) => {
        const isActive = selectedDocId === doc.id;
        return (
          <div
            key={doc.id}
            role="listitem"
            className={`group rounded-lg border transition-all duration-200 ${
              isActive
                ? "border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-accent)]/15 to-purple-100/30 dark:to-purple-900/20 shadow-sm"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
            }`}
          >
            <button
              className="w-full text-left p-4 focus-ring rounded-lg"
              onClick={() => selectDocument(doc.id)}
              aria-pressed={isActive}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-medium text-sm text-gray-900 dark:text-white truncate flex-1">{doc.name}</span>
                <StatusBadge status={doc.status} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>{(doc.size / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span>{doc.type.toUpperCase()}</span>
              </div>
            </button>
            <div className="px-4 pb-3">
              <button
                aria-label={`Remove ${doc.name}`}
                className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded px-2 py-1 transition-colors"
                onClick={() => removeDocument(doc.id)}
                title="Remove document"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
