"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

// PUBLIC_INTERFACE
export default function Onboarding() {
  /** Onboarding screen offering Existing and New user flows, with registration dialog. */
  const { user, registerUser } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) router.push("/workspace");
  }, [user, router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return;
    registerUser(name.trim(), email.trim());
    setOpen(false);
    router.push("/workspace");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/20 px-3 py-1 text-xs text-[var(--color-primary)] dark:text-white mb-4">
          <span>Document Insights</span>
        </div>
        <h1 className="text-4xl font-semibold text-[var(--color-primary)] dark:text-white mb-3">
          Extract. Summarize. Ask anything.
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70">
          Upload your PDF or DOCX documents, extract their contents, generate case notes, and use a copilot to query your files.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-[var(--color-primary)] dark:text-white hover:bg-black/5 focus-ring"
            onClick={() => router.push("/workspace")}
          >
            I&apos;m an existing user
          </button>
          <button
            className="rounded-lg bg-[var(--color-primary)] text-white px-4 py-3 hover:opacity-90 focus-ring"
            onClick={() => setOpen(true)}
          >
            I&apos;m new here
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create your account">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium mb-1">Full name</label>
            <input
              id="name"
              className="w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm focus-ring"
              placeholder="Jordan Casey"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm focus-ring"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm hover:bg-black/5 focus-ring"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90 focus-ring"
            >
              Continue
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
