"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { agency } from "@/config/agency";
import { images } from "@/config/images";
import { testimonialStats } from "@/data/testimonials";
import { whatsappLink } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { SmartImage } from "@/components/ui/smart-image";
import { Stars } from "@/components/ui/section";
import { QuickSearch } from "@/components/property/quick-search";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);

  return (
    <section ref={ref} className="relative bg-ink px-2 pt-2 md:px-4 md:pt-4" aria-labelledby="hero-title">
      <div className="relative mx-auto min-h-[calc(100svh-16px)] max-w-[1600px] overflow-hidden rounded-[28px] md:min-h-[calc(100svh-32px)]">
        {/* Fotografia de palco — use sua melhor foto em src/config/images.ts (hero) */}
        <motion.div style={{ scale, y }} className="absolute inset-0 will-change-transform">
          <SmartImage
            src={images.hero}
            alt="Casa contemporânea iluminada ao anoitecer"
            priority
            tone="none"
            className="h-full w-full"
            imgClassName="object-[62%_center]"
          />
        </motion.div>
        <div aria-hidden className="photo-scrim absolute inset-0" />

        <div className="relative z-10 flex min-h-[inherit] flex-col justify-end px-5 pb-6 pt-28 sm:px-8 md:px-12 md:pb-10 lg:px-16 lg:pb-12">
          {/* Selo de reputação */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="glass absolute right-5 top-24 hidden items-center gap-4 rounded-[20px] px-5 py-3.5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] md:right-10 md:top-28 lg:flex"
          >
            <div>
              <p className="font-[family-name:var(--font-display)] text-[26px] font-light leading-none tabular">
                +{testimonialStats.negociosFechados.toLocaleString("pt-BR")}
              </p>
              <p className="mt-1 text-[11px] text-mist">negócios fechados</p>
            </div>
            <span className="h-9 w-px bg-white/10" />
            <div>
              <Stars size={11} />
              <p className="mt-1.5 text-[11px] text-mist">
                {testimonialStats.media.toFixed(1).replace(".", ",")} · {testimonialStats.total} avaliações
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="t-eyebrow mb-6 text-mist"
          >
            Imobiliária boutique · {agency.endereco.cidade} desde {agency.fundacao}
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.18, ease }}
            className="t-display max-w-[12ch] text-balance"
          >
            Encontre o imóvel ideal para você
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="t-lead mt-6 max-w-[42ch] text-mist"
          >
            Imóveis selecionados para quem busca qualidade, localização e segurança.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease }}
            className="mt-8 hidden items-center gap-3 sm:flex"
          >
            <ButtonLink href="/imoveis" variant="glass" iconRight={<ArrowRight size={16} />}>
              Ver todos os imóveis
            </ButtonLink>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conversar com um corretor no WhatsApp"
              className="grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-[#05290f] transition-transform hover:scale-105"
            >
              <WhatsAppIcon size={21} />
            </a>
            <a
              href={agency.redes.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da imobiliária"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.1] text-porcelain backdrop-blur-xl transition-colors hover:bg-white/[0.18]"
            >
              <InstagramIcon size={18} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease }}
            className="mt-10 md:mt-14"
          >
            <QuickSearch />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
