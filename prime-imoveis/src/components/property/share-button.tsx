"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Compartilhar imóvel: usa o menu nativo do celular quando disponível, senão copia o link. */
export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* usuário cancelou */
    }
  };
  return (
    <button
      type="button"
      onClick={share}
      className={cn("inline-flex h-9 items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 text-[13px] text-mist transition-colors hover:bg-white/[0.12] hover:text-porcelain", className)}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Link copiado" : "Compartilhar"}
    </button>
  );
}
