import type { ReactNode } from "react";
import { AppSessionProvider } from "@/components/app-session-provider";

export default function ChatSessionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppSessionProvider>{children}</AppSessionProvider>;
}
