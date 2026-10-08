"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { agency, publicNav } from "@/config/agency";
import { cn, whatsappLink } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { Logo } from "@/components/layout/logo";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div
        className={cn(
          "mx-auto flex h-[60px] max-w-[1320px] items-center justify-between rounded-[20px] pl-4 pr-2 transition-all duration-500 ease-[var(--ease-out-soft)] md:h-[66px] md:pl-5",
          scrolled || open ? "glass shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]" : "bg-transparent",
        )}
      >
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-0.5 lg:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-[14px] transition-colors",
                isActive(item.href) ? "text-porcelain" : "text-mist/80 hover:text-porcelain",
              )}
            >
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/[0.08]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/imoveis"
            aria-label="Buscar imóveis"
            className="hidden h-10 w-10 place-items-center rounded-full text-mist transition-colors hover:bg-white/[0.08] hover:text-porcelain md:grid"
          >
            <Search size={17} />
          </Link>
          <ButtonLink
            href={whatsappLink()}
            size="sm"
            className="hidden h-10 px-5 sm:inline-flex"
            icon={<WhatsAppIcon size={15} />}
          >
            Fale com um corretor
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-porcelain hover:bg-white/[0.08] lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass mx-auto mt-2 max-h-[calc(100svh-96px)] max-w-[1320px] overflow-y-auto rounded-[24px] p-3 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] lg:hidden"
          >
            <nav aria-label="Menu móvel" className="flex flex-col">
              {[{ label: "Início", href: "/" }, ...publicNav, { label: "Corretores", href: "/corretores" }].map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-light",
                      isActive(item.href) ? "bg-white/[0.06] text-porcelain" : "text-mist",
                    )}
                  >
                    {item.label}
                    <ArrowUpRight size={16} className="text-slate" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <ButtonLink href={whatsappLink()} variant="whatsapp" icon={<WhatsAppIcon size={18} />}>
                WhatsApp
              </ButtonLink>
              <ButtonLink href={agency.redes.instagram.url} variant="glass" icon={<InstagramIcon size={16} />}>
                Instagram
              </ButtonLink>
              <ButtonLink href="/imoveis" className="col-span-2" size="lg" icon={<Search size={17} />}>
                Buscar imóveis
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
