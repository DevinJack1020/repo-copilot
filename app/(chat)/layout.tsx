import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
