"use client";

import React, { useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

// PUBLIC_INTERFACE
export default function Home() {
  /** Landing page that routes to onboarding or workspace depending on user presence. */
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/workspace");
  }, [user, router]);

  return <Onboarding />;
}
