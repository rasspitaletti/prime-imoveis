"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Escurece levemente a foto para integrá-la ao palco escuro. */
  tone?: "none" | "soft" | "deep";
};

/**
 * Imagem com fallback elegante (caso a URL falhe) e tratamento de tom.
 * Usa <img> nativo para funcionar com qualquer CDN; troque por next/image
 * quando as fotos forem servidas de /public ou de um domínio configurado.
 */
export function SmartImage({ src, alt, className, imgClassName, priority, tone = "soft" }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Imagens já em cache podem terminar de carregar antes da hidratação.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-carbon", className)}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)]",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      ) : (
        <div role="img" aria-label={alt} className="flex h-full w-full items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_20%,rgb(47_123_255/0.18),transparent_70%)]" />
          <ToothMark className="relative h-12 w-12 text-steel" />
        </div>
      )}
      {tone !== "none" && !failed && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            tone === "soft" ? "bg-black/10" : "bg-gradient-to-t from-black/85 via-black/25 to-black/5",
          )}
        />
      )}
    </div>
  );
}

export function ToothMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 7.2c-2.1-1.6-4.6-2.3-6.9-1.6C5.8 6.6 4.6 10 5.4 13.6c.6 2.6 1.6 4.6 2.2 7.4.5 2.3.9 5.4 2.6 5.8 2 .5 2.4-3.3 3-5.5.4-1.4 1.1-2.3 2.8-2.3s2.4.9 2.8 2.3c.6 2.2 1 6 3 5.5 1.7-.4 2.1-3.5 2.6-5.8.6-2.8 1.6-4.8 2.2-7.4.8-3.6-.4-7-3.7-8-2.3-.7-4.8 0-6.9 1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
