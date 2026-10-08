"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  ExternalLink,
  House,
  Inbox,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { agency } from "@/config/agency";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { Avatar } from "@/components/admin/ui";

export const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Agenda", href: "/admin/agenda", icon: CalendarDays },
  { label: "Visitas", href: "/admin/visitas", icon: ClipboardList },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Imóveis", href: "/admin/imoveis", icon: House },
  { label: "Corretores", href: "/admin/corretores", icon: BriefcaseBusiness },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

/** Usuário de demonstração. Autenticação real virá do backend (cookie httpOnly). */
const demoUser = { nome: "Gerência", papel: "Administrador" };

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");
  // O painel é 100% client-side (dados dependem do relógio do usuário e, no futuro, da sessão).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    setToday(new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }));
  }, []);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Administração" className="flex flex-col gap-0.5">
      {adminNav.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[14px] transition-colors",
              active ? "text-porcelain" : "text-ash hover:bg-white/[0.04] hover:text-porcelain",
            )}
          >
            {active && (
              <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-[14px] bg-white/[0.07]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
            )}
            <item.icon size={17} className="relative" strokeWidth={1.8} />
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-svh bg-ink">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-line bg-graphite px-4 py-5 lg:flex">
        <div className="px-2">
          <Logo href="/admin" suffix="ADMIN" />
        </div>
        <div className="mt-8 flex-1">{nav}</div>
        <SidebarFooter />
      </aside>

      {/* Drawer mobile */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-graphite px-4 py-5 lg:hidden"
            >
              <div className="flex items-center justify-between px-2">
                <Logo href="/admin" />
                <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.06]" aria-label="Fechar menu">
                  <X size={18} />
                </button>
              </div>
              <div className="mt-8 flex-1">{nav}</div>
              <SidebarFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[248px]">
        {/* Topbar */}
        <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/[0.06] lg:hidden" aria-label="Abrir menu">
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <p className="text-[13px] font-medium">{agency.nome}</p>
              <p className="text-[12px] capitalize text-ash">{today || " "}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-amber/10 px-3 py-1 text-[12px] font-medium text-amber md:inline">Modo demonstração</span>
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-ash hover:text-porcelain md:inline-flex">
              Ver site <ExternalLink size={13} />
            </Link>
            <button className="relative grid h-10 w-10 place-items-center rounded-full text-mist hover:bg-white/[0.06]" aria-label="Notificações (3 novas)">
              <Bell size={18} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-ink" />
            </button>
            <Avatar name={demoUser.nome} size={34} />
          </div>
        </header>

        <main className="px-4 pb-16 pt-6 md:px-8 md:pt-8">{mounted ? children : <AdminSkeleton />}</main>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="rounded-[18px] bg-white/[0.03] p-3">
      <div className="flex items-center gap-3">
        <Avatar name={demoUser.nome} size={34} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">{demoUser.nome}</p>
          <p className="text-[12px] text-ash">{demoUser.papel}</p>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate">Login real será feito pelo backend (FastAPI + sessão segura).</p>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando painel">
      <div className="h-9 w-56 animate-pulse rounded-full bg-white/[0.05]" />
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-[132px] animate-pulse rounded-[24px] bg-graphite" />
        ))}
      </div>
      <div className="mt-3 h-[320px] animate-pulse rounded-[24px] bg-graphite" />
    </div>
  );
}
