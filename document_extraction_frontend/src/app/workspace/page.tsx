"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import DocumentList from "@/components/DocumentList";
import DocumentDetail from "@/components/DocumentDetail";

// PUBLIC_INTERFACE
export default function WorkspacePage() {
  /** Workspace UI for managing documents, extraction, case notes, and copilot. */
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/");
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-4">
          <aside aria-label="Sidebar" className="space-y-4">
            <UploadZone />
            <div className="rounded-lg border border-black/10 dark:border-white/10 p-3">
              <h3 className="mb-2 text-sm font-semibold">Your documents</h3>
              <DocumentList />
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/10 p-3">
              <h3 className="mb-2 text-sm font-semibold">Tips</h3>
              <ul className="list-disc pl-4 text-xs text-black/70 dark:text-white/70 space-y-1">
                <li>Upload PDF or DOCX files.</li>
                <li>Extract to enable case notes and Copilot.</li>
                <li>Use Copilot to ask targeted questions.</li>
              </ul>
            </div>
          </aside>
          <section aria-label="Main content">
            <DocumentDetail />
          </section>
        </div>
      </main>
      <footer className="border-t border-black/10 dark:border-white/10 text-center text-[10px] py-3 text-black/60 dark:text-white/60">
        © {new Date().getFullYear()} Document Insights
      </footer>
    </div>
  );
}
