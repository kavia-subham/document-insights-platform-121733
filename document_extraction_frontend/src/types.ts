export type ID = string;

export type DocStatus = "uploaded" | "extracting" | "extracted" | "failed";

export interface User {
  id: ID;
  name: string;
  email: string;
  createdAt: number; // epoch ms
}

export interface ChatMessage {
  id: ID;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface DocumentItem {
  id: ID;
  name: string;
  size: number;
  type: "pdf" | "docx" | "other";
  uploadedAt: number;
  status: DocStatus;
  progress: number; // 0-100
  contentText?: string;
  caseNote?: string;
  chats: ChatMessage[];
}

export interface AppState {
  user?: User;
  documents: DocumentItem[];
  selectedDocId?: ID;
}

export interface AppContextType extends AppState {
  // PUBLIC_INTERFACE
  /**
   * Registers a new user with name and email.
   * Persists state and navigates app flow to workspace.
   */
  registerUser: (name: string, email: string) => void;

  // PUBLIC_INTERFACE
  /**
   * Adds uploaded files as documents. Accepts PDF and DOCX.
   * Creates metadata entries and selects the latest document.
   */
  addDocuments: (files: File[]) => void;

  // PUBLIC_INTERFACE
  /**
   * Selects a document by its id for viewing/editing.
   */
  selectDocument: (id: ID) => void;

  // PUBLIC_INTERFACE
  /**
   * Starts a simulated asynchronous extraction with progress for the doc.
   */
  startExtraction: (id: ID) => void;

  // PUBLIC_INTERFACE
  /**
   * Generates a case note from the extracted content.
   */
  generateCaseNote: (id: ID) => void;

  // PUBLIC_INTERFACE
  /**
   * Updates/saves a manual edit to the case note.
   */
  saveCaseNote: (id: ID, note: string) => void;

  // PUBLIC_INTERFACE
  /**
   * Adds a user chat message and generates an assistant reply derived
   * from the document(s) content.
   */
  askCopilot: (docId: ID | "all", question: string) => void;

  // PUBLIC_INTERFACE
  /**
   * Removes a document by id.
   */
  removeDocument: (id: ID) => void;

  // PUBLIC_INTERFACE
  /**
   * Logs out the user and clears local data.
   */
  logout: () => void;
}
