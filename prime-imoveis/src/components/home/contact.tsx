import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { agency } from "@/config/agency";
import { whatsappLink } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { SocialLinks } from "@/components/layout/footer";

export const mapsSearchUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const agencyMapsUrl = mapsSearchUrl(`${agency.endereco.logradouro}, ${agency.endereco.bairro}, ${agency.endereco.cidade} - ${agency.endereco.uf}`);

/**
 * Mapa estilizado (sem dependências nem chaves de API).
 * Troque por um iframe do Google Maps quando houver endereço definitivo.
 */
export function StylizedMap({
  label = agency.nome,
  caption = `${agency.endereco.bairro} · ${agency.endereco.cidade}/${agency.endereco.uf}`,
  href = agencyMapsUrl,
  area = false,
}: {
  label?: string;
  caption?: string;
  href?: string;
  /** Mostra um raio aproximado em vez de um ponto exato (privacidade do imóvel). */
  area?: boolean;
}) {
  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-[28px] bg-[#0d0c0a]">
      <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="blocks" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#0d0c0a" />
            <rect x="6" y="6" width="48" height="48" rx="6" fill="#151411" />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9a46c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c9a46c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="420" fill="url(#blocks)" />
        <path d="M-20 300 C 120 260, 220 330, 340 250 S 560 170, 640 200" stroke="#24221d" strokeWidth="26" fill="none" />
        <path d="M-20 300 C 120 260, 220 330, 340 250 S 560 170, 640 200" stroke="#3a362e" strokeWidth="2" strokeDasharray="10 12" fill="none" />
        <path d="M180 -20 L 250 440" stroke="#1f1d19" strokeWidth="18" />
        <path d="M420 -20 L 380 440" stroke="#1f1d19" strokeWidth="14" />
        <rect x="430" y="40" width="130" height="90" rx="14" fill="#121a12" />
        <circle cx="300" cy="210" r="110" fill="url(#glow)" />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <div className="flex flex-col items-center">
          <span className="rounded-full bg-porcelain px-3 py-1.5 text-[12px] font-semibold text-ink shadow-[0_8px_30px_rgb(0_0_0/0.5)]">
            {label}
          </span>
          <span className="h-5 w-px bg-porcelain/70" />
          {area ? (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-accent/15 ring-1 ring-accent/40">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
          ) : (
            <span className="op-pulse h-3 w-3 rounded-full bg-accent ring-4 ring-accent/30" />
          )}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
        <span className="glass rounded-full px-3.5 py-2 text-[12px] text-mist">{caption}</span>
        <ButtonLink href={href} size="sm" variant="light" icon={<Navigation size={14} />}>
          Como chegar
        </ButtonLink>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 border-t border-line py-5 first:border-t-0 first:pt-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.05] text-mist">{icon}</span>
      <div>
        <p className="text-[12px] text-ash">{label}</p>
        <div className="mt-1 text-[16px] text-porcelain">{children}</div>
      </div>
    </div>
  );
}

export function ContactSection({ withHeader = true }: { withHeader?: boolean }) {
  return (
    <Section id="contato">
      <div className="container-x">
        {withHeader && (
          <SectionHeader eyebrow="Contato" title="Fale com a nossa equipe." lead="Atendimento por WhatsApp, telefone ou pessoalmente no nosso escritório." />
        )}
        <div className="grid gap-3 lg:grid-cols-[1fr_1.25fr]">
          <Reveal className="rounded-[28px] bg-graphite p-7 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-9">
            <InfoRow icon={<MapPin size={17} />} label="Endereço">
              <address className="not-italic">
                {agency.endereco.logradouro}
                <br />
                {agency.endereco.bairro} — {agency.endereco.cidade}/{agency.endereco.uf}
              </address>
            </InfoRow>
            <InfoRow icon={<Phone size={17} />} label="Telefone">
              <a href={`tel:+55${agency.contato.telefone.replace(/\D/g, "")}`} className="hover:text-link">
                {agency.contato.telefone}
              </a>
            </InfoRow>
            <InfoRow icon={<WhatsAppIcon size={17} />} label="WhatsApp">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-link">
                {agency.contato.whatsappExibicao}
              </a>
            </InfoRow>
            <InfoRow icon={<InstagramIcon size={16} />} label="Instagram">
              <a href={agency.redes.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-link">
                {agency.redes.instagram.usuario}
              </a>
            </InfoRow>
            <InfoRow icon={<Mail size={17} />} label="E-mail">
              <a href={`mailto:${agency.contato.email}`} className="hover:text-link">
                {agency.contato.email}
              </a>
            </InfoRow>
            <InfoRow icon={<Clock size={17} />} label="Horário">
              {agency.horarioAtendimento.map((h) => (
                <p key={h.dias} className="text-[15px]">
                  {h.dias}: <span className="text-mist">{h.horario}</span>
                </p>
              ))}
            </InfoRow>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink href={whatsappLink()} variant="whatsapp" icon={<WhatsAppIcon size={18} />}>
                Chamar no WhatsApp
              </ButtonLink>
              <SocialLinks />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <StylizedMap />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
