"use client";

import React, { useRef, useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

// PUBLIC_INTERFACE
export default function CopilotChat({ docId }: { docId: string | "all" }) {
  /** Chat-like UI to ask questions about extracted documents using simple local search. */
  const { documents, askCopilot, selectedDocId } = useApp();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const doc = docId === "all" ? documents.find((d) => d.id === selectedDocId) : documents.find((d) => d.id === docId);
  const chats = doc?.chats ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chats.length]);

  const onAsk = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    askCopilot(docId, q);
    setInput("");
  };

  return (
    <section aria-labelledby="copilot-title" className="card-container p-6 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 id="copilot-title" className="text-lg font-semibold text-gray-900 dark:text-white">Copilot</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Ask questions about your documents</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto rounded-lg bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900/50 p-4 mb-4 min-h-[250px]">
        {chats.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">💬</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Start a conversation with your document
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              For best results, extract your document first
            </p>
          </div>
        )}
        <div className="space-y-4">
          {chats.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-3 ${
                m.role === "user" 
                  ? "bg-gradient-to-r from-[var(--color-primary)] to-purple-600 text-white" 
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              }`}>
                <div className="text-xs font-medium mb-2 opacity-80">
                  {m.role === "user" ? "You" : "Assistant"}
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                <div className="text-xs mt-2 opacity-60">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={onAsk} className="flex items-center gap-3">
        <input
          aria-label="Ask a question"
          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-3 text-sm focus-ring placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Ask about the selected document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          className="rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-purple-600 px-6 py-3 text-sm font-medium text-white hover:shadow-lg hover:scale-105 focus-ring transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
          type="submit"
          disabled={!input.trim()}
        >
          Ask
        </button>
      </form>
    </section>
  );
}
