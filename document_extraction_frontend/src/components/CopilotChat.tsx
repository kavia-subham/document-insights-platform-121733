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
    <section aria-labelledby="copilot-title" className="rounded-lg border border-black/10 dark:border-white/10 p-4 h-full flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h3 id="copilot-title" className="text-sm font-semibold">Copilot</h3>
        <span className="text-[10px] text-black/60 dark:text-white/60">Ask questions about your documents</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto rounded-md bg-white dark:bg-white/5 p-3">
        {chats.length === 0 && (
          <p className="text-xs text-black/60 dark:text-white/60">
            Start by asking a question. For best results, extract your document first.
          </p>
        )}
        <div className="space-y-3">
          {chats.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${m.role === "user" ? "ml-auto bg-[var(--color-accent)]/30" : "bg-black/5 dark:bg-white/10"}`}>
              <div className="mb-1 font-medium">{m.role === "user" ? "You" : "Assistant"}</div>
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div className="mt-1 text-[10px] text-black/50">{new Date(m.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={onAsk} className="mt-3 flex items-center gap-2">
        <input
          aria-label="Ask a question"
          className="flex-1 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm focus-ring"
          placeholder="Ask about the selected document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-xs text-white hover:opacity-90 focus-ring" type="submit">
          Ask
        </button>
      </form>
    </section>
  );
}
