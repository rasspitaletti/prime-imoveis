import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel" },
  robots: { index: false, follow: false },
};

/**
 * Área administrativa.
 * TODO (backend): proteger com middleware.ts verificando o cookie de sessão
 * emitido pelo FastAPI e redirecionar para /admin/login quando ausente.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
