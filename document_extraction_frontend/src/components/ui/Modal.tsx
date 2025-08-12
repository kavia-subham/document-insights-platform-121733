"use client";

import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  labelledById?: string;
}

// PUBLIC_INTERFACE
export default function Modal({ open, onClose, title, children, footer, labelledById }: ModalProps) {
  /** Accessible modal dialog with overlay. */
  if (!open) return null;
  const lblId = labelledById || "modal-title";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={lblId}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-[var(--color-secondary)] p-6 shadow-2xl">
        {title && (
          <h2 id={lblId} className="text-xl font-semibold text-[var(--color-primary)] dark:text-white mb-4">
            {title}
          </h2>
        )}
        <div className="text-sm">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
        <button
          aria-label="Close"
          className="absolute right-2 top-2 rounded-md p-2 text-sm text-[var(--color-primary)] hover:bg-black/5 focus-ring"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
