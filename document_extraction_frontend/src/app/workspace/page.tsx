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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-800/30 dark:to-purple-900/10">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8">
          <aside aria-label="Sidebar" className="space-y-6">
            <UploadZone />
            <div className="card-container p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Your documents</h3>
              <DocumentList />
            </div>
            <div className="card-container p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Tips</h3>
              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Upload PDF or DOCX files to get started</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Extract content to enable case notes and Copilot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Use Copilot to ask targeted questions about your documents</span>
                </li>
              </ul>
            </div>
          </aside>
          <section aria-label="Main content" className="min-h-0">
            <DocumentDetail />
          </section>
        </div>
      </main>
      <footer className="border-t border-gray-200/60 dark:border-gray-700/60 text-center text-[10px] py-6 text-gray-500 dark:text-gray-400 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        © {new Date().getFullYear()} Document Insights Platform
      </footer>
    </div>
  );
}
