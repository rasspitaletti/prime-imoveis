"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, Search } from "lucide-react";
import { agency } from "@/config/agency";
import { cn, whatsappLink } from "@/lib/utils";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";

/**
 * Desktop: trilho discreto na lateral direita.
 * Mobile: barra inferior fixa BUSCAR | WHATSAPP | VISITA (WhatsApp em destaque).
 */
export function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop rail */}
      <motion.aside
        aria-label="Atalhos"
        initial={false}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed bottom-8 right-6 z-40 hidden flex-col items-end gap-2 md:flex",
          !visible && "pointer-events-none",
        )}
      >
        <RailItem href={agency.redes.instagram.url} label="Instagram" external>
          <InstagramIcon size={17} />
        </RailItem>
        <RailItem href="/agendar-visita" label="Agendar visita">
          <CalendarPlus size={18} />
        </RailItem>
        <RailItem href="/imoveis" label="Buscar imóveis">
          <Search size={17} />
        </RailItem>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="group flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#25D366] pl-4 pr-4 text-[#05290f] transition-all duration-300 hover:gap-2 hover:pr-5"
        >
          <WhatsAppIcon size={24} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-semibold transition-all duration-300 group-hover:max-w-[180px]">
            Fale com um corretor
          </span>
        </a>
      </motion.aside>

      {/* Mobile bottom bar */}
      <nav
        aria-label="Atalhos rápidos"
        className="glass fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 md:hidden"
      >
        <div className="grid grid-cols-[1fr_1.35fr_1fr] gap-2">
          <Link
            href="/imoveis"
            className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-2xl bg-white/[0.06] text-[11px] font-medium text-mist active:scale-[0.97]"
          >
            <Search size={17} />
            Buscar
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-[14px] font-semibold text-[#05290f] active:scale-[0.97]"
          >
            <WhatsAppIcon size={20} />
            WhatsApp
          </a>
          <Link
            href="/agendar-visita"
            className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-2xl bg-white/[0.06] text-[11px] font-medium text-mist active:scale-[0.97]"
          >
            <CalendarPlus size={17} />
            Visita
          </Link>
        </div>
      </nav>
    </>
  );
}

function RailItem({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: ReactNode;
}) {
  const cls =
    "group flex h-11 items-center gap-0 overflow-hidden rounded-full bg-carbon/90 pl-3.5 pr-3.5 text-mist backdrop-blur-xl shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] transition-all duration-300 hover:gap-2 hover:pr-4 hover:text-porcelain";
  const inner = (
    <>
      {children}
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-medium transition-all duration-300 group-hover:max-w-[130px]">
        {label}
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} aria-label={label} className={cls}>
      {inner}
    </Link>
  );
}
