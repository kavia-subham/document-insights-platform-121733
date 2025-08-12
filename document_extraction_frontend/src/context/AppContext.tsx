"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppContextType, AppState, ChatMessage, DocumentItem, ID, User } from "@/types";
import { clearState, loadState, saveState } from "@/lib/storage";

// Helpers
function uid(prefix = "id"): ID {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}
function now() {
  return Date.now();
}
function fileTypeFromName(name: string): DocumentItem["type"] {
  if (name.toLowerCase().endsWith(".pdf")) return "pdf";
  if (name.toLowerCase().endsWith(".docx")) return "docx";
  return "other";
}

// Initial state
const defaultState: AppState = {
  user: undefined,
  documents: [],
  selectedDocId: undefined,
};

// Reducer & actions
type Action =
  | { type: "REGISTER_USER"; payload: User }
  | { type: "ADD_DOCS"; payload: DocumentItem[] }
  | { type: "SELECT_DOC"; payload?: ID }
  | { type: "UPDATE_DOC"; payload: { id: ID; patch: Partial<DocumentItem> } }
  | { type: "REMOVE_DOC"; payload: { id: ID } }
  | { type: "SET_STATE"; payload: AppState }
  | { type: "LOGOUT" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "REGISTER_USER":
      return { ...state, user: action.payload };
    case "ADD_DOCS": {
      const docs = [...state.documents, ...action.payload];
      const selectedDocId = action.payload[action.payload.length - 1]?.id ?? state.selectedDocId;
      return { ...state, documents: docs, selectedDocId };
    }
    case "SELECT_DOC":
      return { ...state, selectedDocId: action.payload };
    case "UPDATE_DOC": {
      const docs = state.documents.map((d) => (d.id === action.payload.id ? { ...d, ...action.payload.patch } : d));
      return { ...state, documents: docs };
    }
    case "REMOVE_DOC": {
      const docs = state.documents.filter((d) => d.id !== action.payload.id);
      const selectedDocId = state.selectedDocId === action.payload.id ? docs[0]?.id : state.selectedDocId;
      return { ...state, documents: docs, selectedDocId };
    }
    case "SET_STATE":
      return { ...action.payload };
    case "LOGOUT":
      return { ...defaultState };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// PUBLIC_INTERFACE
export function useApp(): AppContextType {
  /** Hook to access shared application state and actions. */
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function AppProvider({ children }: { children: React.ReactNode }) {
  /** Provides global state, persistence, and business logic for the app. */
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, defaultState);
  const timersRef = useRef<Record<string, number>>({}); // docId -> interval id

  // Load initial state from localStorage
  useEffect(() => {
    const loaded = loadState();
    if (loaded) {
      dispatch({ type: "SET_STATE", payload: loaded });
    }
  }, []);

  // Persist state to localStorage (debounced via animation frame)
  const frameRef = useRef<number | null>(null);
  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      saveState(state);
    });
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [state]);

  const registerUser = useCallback((name: string, email: string) => {
    const user: User = { id: uid("usr"), name, email, createdAt: now() };
    dispatch({ type: "REGISTER_USER", payload: user });
  }, []);

  const addDocuments = useCallback((files: File[]) => {
    const docs: DocumentItem[] = files.map((f) => ({
      id: uid("doc"),
      name: f.name,
      size: f.size,
      type: fileTypeFromName(f.name),
      uploadedAt: now(),
      status: "uploaded",
      progress: 0,
      contentText: undefined,
      caseNote: "",
      chats: [],
    }));
    dispatch({ type: "ADD_DOCS", payload: docs });
  }, []);

  const selectDocument = useCallback((id?: ID) => {
    dispatch({ type: "SELECT_DOC", payload: id });
  }, []);

  // Simulated async extraction: progress increments until 100, then set content
  const startExtraction = useCallback((id: ID) => {
    const doc = state.documents.find((d) => d.id === id);
    if (!doc) return;
    if (doc.status === "extracting") return; // already running
    dispatch({ type: "UPDATE_DOC", payload: { id, patch: { status: "extracting", progress: 0 } } });

    // Clear prior timer if any
    if (timersRef.current[id]) {
      clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
    }

    const iv = window.setInterval(() => {
      const current = state.documents.find((d) => d.id === id);
      const currProgress = current?.progress ?? 0;
      const increment = Math.max(1, Math.round(Math.random() * 12));
      const next = Math.min(100, currProgress + increment);
      dispatch({ type: "UPDATE_DOC", payload: { id, patch: { progress: next } } });
      if (next >= 100) {
        clearInterval(iv);
        delete timersRef.current[id];

        // Generate a simulated extraction result
        const fallbackText = `Simulated extraction for ${doc.name}.
- File name: ${doc.name}
- Type: ${doc.type.toUpperCase()}
- Size: ${doc.size} bytes
- Uploaded: ${new Date(doc.uploadedAt).toLocaleString()}
Content Preview:
This is placeholder extracted text for demonstration. You can ask questions about this document using the Copilot, or generate a case note from this content.`;

        dispatch({
          type: "UPDATE_DOC",
          payload: {
            id,
            patch: {
              status: "extracted",
              contentText: fallbackText,
            },
          },
        });
      }
    }, 500);

    timersRef.current[id] = iv;
  }, [state.documents]);

  const generateCaseNote = useCallback((id: ID) => {
    const doc = state.documents.find((d) => d.id === id);
    if (!doc || !doc.contentText) return;
    const text = doc.contentText;
    // very naive summary: select first 4 lines/sentences
    const sentences = text
      .split(/\n|(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6);
    const note =
      `Case Note - ${doc.name}\n\n` +
      sentences.map((s) => `- ${s}`).join("\n") +
      `\n\nGenerated on ${new Date().toLocaleString()}`;
    dispatch({ type: "UPDATE_DOC", payload: { id, patch: { caseNote: note } } });
  }, [state.documents]);

  const saveCaseNote = useCallback((id: ID, note: string) => {
    dispatch({ type: "UPDATE_DOC", payload: { id, patch: { caseNote: note } } });
  }, []);

  const searchExtractedContentAcrossDocs = useCallback((question: string, targetDoc?: ID): string => {
    const terms = question.toLowerCase().split(/\s+/).filter(Boolean);
    const docs = targetDoc
      ? state.documents.filter((d) => d.id === targetDoc)
      : state.documents;
    const corpus = docs
      .filter((d) => d.contentText && d.status === "extracted")
      .map((d) => ({ id: d.id, name: d.name, lines: (d.contentText as string).split(/\n/) }));

    let best: { docId: ID; name: string; line: string; score: number } | null = null;
    for (const doc of corpus) {
      for (const line of doc.lines) {
        const l = line.toLowerCase();
        let score = 0;
        for (const t of terms) if (l.includes(t)) score += 1;
        if (score > 0 && (!best || score > best.score)) {
          best = { docId: doc.id, name: doc.name, line: line.trim(), score };
        }
      }
    }
    if (!best) {
      return "I couldn't find an exact match in the extracted content. Try rephrasing your question or extracting the document first.";
    }
    return `Found relevant snippet in "${best.name}":\n"${best.line}"`;
  }, [state.documents]);

  const askCopilot = useCallback((docId: ID | "all", question: string) => {
    const targetDocId = docId === "all" ? undefined : docId;
    const nowTs = now();
    const answer = searchExtractedContentAcrossDocs(question, targetDocId);

    // Assign chat to selected doc if a specific doc, else store in first extracted doc or app-level doc
    let attachDocId: ID | undefined = targetDocId;
    if (!attachDocId) {
      const firstExtracted = state.documents.find((d) => d.status === "extracted");
      attachDocId = firstExtracted?.id ?? state.documents[0]?.id;
    }
    if (!attachDocId) return;

    const doc = state.documents.find((d) => d.id === attachDocId);
    if (!doc) return;

    const userMsg: ChatMessage = { id: uid("msg"), role: "user", content: question, timestamp: nowTs };
    const assistantMsg: ChatMessage = { id: uid("msg"), role: "assistant", content: answer, timestamp: nowTs + 1 };

    const newChats = [...(doc.chats ?? []), userMsg, assistantMsg];
    dispatch({ type: "UPDATE_DOC", payload: { id: attachDocId, patch: { chats: newChats } } });
  }, [state.documents, searchExtractedContentAcrossDocs]);

  const removeDocument = useCallback((id: ID) => {
    // Clear any timers
    if (timersRef.current[id]) {
      clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
    }
    dispatch({ type: "REMOVE_DOC", payload: { id } });
  }, []);

  const logout = useCallback(() => {
    Object.values(timersRef.current).forEach((iv) => clearInterval(iv));
    timersRef.current = { };
    dispatch({ type: "LOGOUT" });
    clearState();
    router.push("/");
  }, [router]);

  const value: AppContextType = useMemo(() => ({
    ...state,
    registerUser,
    addDocuments,
    selectDocument,
    startExtraction,
    generateCaseNote,
    saveCaseNote,
    askCopilot,
    removeDocument,
    logout,
  }), [state, registerUser, addDocuments, selectDocument, startExtraction, generateCaseNote, saveCaseNote, askCopilot, removeDocument, logout]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
