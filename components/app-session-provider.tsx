"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function AppSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      basePath={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/auth`}
    >
      {children}
    </SessionProvider>
  );
}
