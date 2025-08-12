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
    <div className="space-y-8">
      <div className="card-container p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{doc.name}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>{(doc.size / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span>{doc.type.toUpperCase()}</span>
              <span>•</span>
              <span className="capitalize">{doc.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {doc.status !== "extracted" && doc.status !== "extracting" && (
              <button
                className="rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:scale-105 focus-ring transition-all duration-200"
                onClick={() => startExtraction(doc.id)}
              >
                Start extraction
              </button>
            )}
            {doc.status === "extracting" && (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium text-purple-600">Processing...</span>
              </div>
            )}
            {doc.status === "extracted" && (
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                ✓ Extracted
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {doc.status === "extracting" && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <ExtractionProgress progress={doc.progress} />
            </div>
          )}
          {doc.status === "extracted" && (
            <div>
              <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Content preview</div>
              <pre className="max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4 text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {doc.contentText}
              </pre>
            </div>
          )}
          {doc.status === "uploaded" && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Click &ldquo;Start extraction&rdquo; to process this document and enable advanced features.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <CaseNotePanel docId={doc.id} />
        <CopilotChat docId={doc.id} />
      </div>
    </div>
  );
}
