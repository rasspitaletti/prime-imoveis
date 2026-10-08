import type { ReactNode } from "react";
import Link from "next/link";
import { agency, publicNav, whatsappDefaultMessage } from "@/config/agency";
import { propertyTypes } from "@/data/properties";
import { regions } from "@/data/regions";
import { whatsappLink } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { Logo } from "@/components/layout/logo";

export function SocialLinks({ className = "" }: { className?: string }) {
  const items = [
    { label: "Instagram", href: agency.redes.instagram.url, icon: <InstagramIcon size={17} /> },
    { label: "Facebook", href: agency.redes.facebook.url, icon: <FacebookIcon size={17} /> },
    { label: "TikTok", href: agency.redes.tiktok.url, icon: <TikTokIcon size={17} /> },
    { label: "WhatsApp", href: whatsappLink(), icon: <WhatsAppIcon size={18} /> },
  ];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={i.label}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.05] text-mist transition-colors hover:bg-white/[0.1] hover:text-porcelain"
        >
          {i.icon}
        </a>
      ))}
    </div>
  );
}

const typePlural: Record<string, string> = {
  Apartamento: "Apartamentos",
  Casa: "Casas",
  Cobertura: "Coberturas",
  Terreno: "Terrenos",
  Comercial: "Imóveis comerciais",
};

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-ink pb-28 pt-16 md:pb-12 md:pt-20">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-[14px] font-light leading-relaxed text-ash">{agency.descricao}</p>
            <SocialLinks className="mt-6" />
          </div>

          <FooterCol title="Imóveis">
            {publicNav.slice(0, 4).map((n) => (
              <FooterLink key={n.href} href={n.href}>
                {n.label}
              </FooterLink>
            ))}
            {propertyTypes.map((t) => (
              <FooterLink key={t} href={`/imoveis?tipo=${t}`}>
                {typePlural[t]}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Atendimento">
            <FooterLink href="/agendar-visita">Agendar visita</FooterLink>
            <FooterLink href="/corretores">Corretores</FooterLink>
            <FooterLink href="/sobre">Sobre nós</FooterLink>
            <FooterLink href="/contato">Contato</FooterLink>
            <FooterLink href="/assistente">Assistente virtual</FooterLink>
            <a
              href={whatsappLink("Olá! Gostaria de anunciar meu imóvel com a Prime Imóveis.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-light text-ash transition-colors hover:text-porcelain"
            >
              Anunciar meu imóvel
            </a>
          </FooterCol>

          <FooterCol title="Cidades atendidas">
            {regions.map((r) => (
              <FooterLink key={r.id} href={`/imoveis?local=${r.id}`}>
                {r.nome}
                {r.cidade !== r.nome && r.cidade !== "São Paulo" ? <span className="text-slate"> · {r.cidade}</span> : null}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Contato">
            <a href={`tel:+55${agency.contato.telefone.replace(/\D/g, "")}`} className="text-[14px] font-light text-ash hover:text-porcelain">
              {agency.contato.telefone}
            </a>
            <a href={whatsappLink(whatsappDefaultMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[14px] font-light text-ash hover:text-porcelain">
              <WhatsAppIcon size={14} /> {agency.contato.whatsappExibicao}
            </a>
            <a href={agency.redes.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[14px] font-light text-ash hover:text-porcelain">
              <InstagramIcon size={13} /> {agency.redes.instagram.usuario}
            </a>
            <a href={`mailto:${agency.contato.email}`} className="text-[14px] font-light text-ash hover:text-porcelain">
              {agency.contato.email}
            </a>
            <address className="mt-2 not-italic text-[14px] font-light leading-relaxed text-ash">
              {agency.endereco.logradouro}
              <br />
              {agency.endereco.bairro} — {agency.endereco.cidade}/{agency.endereco.uf}
            </address>
            <div className="mt-2 space-y-0.5">
              {agency.horarioAtendimento.map((h) => (
                <p key={h.dias} className="text-[13px] text-slate">
                  {h.dias}: {h.horario}
                </p>
              ))}
            </div>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-[12px] text-slate md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {agency.nome} · {agency.creci}. Imóveis e valores demonstrativos, sujeitos a alteração.
          </p>
          <div className="flex gap-5">
            <Link href="/admin" className="hover:text-ash">
              Área do corretor
            </Link>
            <span>Política de privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-porcelain">{title}</p>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-[14px] font-light text-ash transition-colors hover:text-porcelain">
      {children}
    </Link>
  );
}
