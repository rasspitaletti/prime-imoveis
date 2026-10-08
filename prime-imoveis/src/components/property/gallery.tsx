"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";

/**
 * Galeria do imóvel:
 * - desktop: mosaico (foto principal grande + 4 miniaturas)
 * - mobile: carrossel com swipe
 * - lightbox em tela cheia com teclado (← → Esc) e arraste
 */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const thumbs = images.slice(1, 5);

  return (
    <>
      {/* Desktop mosaico */}
      <div className="hidden gap-2 md:grid md:h-[min(68svh,640px)] md:grid-cols-4 md:grid-rows-2">
        <button
          onClick={() => setOpen(0)}
          className={cn("group relative overflow-hidden rounded-[28px]", thumbs.length ? "col-span-2 row-span-2" : "col-span-4 row-span-2")}
          aria-label="Abrir foto principal"
        >
          <SmartImage src={images[0]} alt={`${title} — foto principal`} priority tone="none" className="h-full w-full" imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.03]" />
        </button>
        {thumbs.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpen(i + 1)}
            className={cn(
              "group relative overflow-hidden rounded-[22px]",
              thumbs.length === 1 && "col-span-2 row-span-2",
              thumbs.length === 2 && "col-span-2",
              thumbs.length === 3 && i === 2 && "col-span-2",
            )}
            aria-label={`Abrir foto ${i + 2}`}
          >
            <SmartImage src={src} alt={`${title} — foto ${i + 2}`} tone="none" className="h-full w-full" imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
            {i === thumbs.length - 1 && images.length > 1 && (
              <span className="glass absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-medium text-porcelain">
                <LayoutGrid size={14} /> Ver {images.length} fotos
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile carrossel */}
      <div className="relative md:hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[24px]"
          onScroll={(e) => {
            const el = e.currentTarget;
            setMobileIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {images.map((src, i) => (
            <button key={src} onClick={() => setOpen(i)} className="w-full shrink-0 snap-center" aria-label={`Abrir foto ${i + 1}`}>
              <SmartImage src={src} alt={`${title} — foto ${i + 1}`} priority={i === 0} tone="none" className="aspect-[4/3] w-full" />
            </button>
          ))}
        </div>
        <span className="glass absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-[12px] tabular text-porcelain">
          {mobileIndex + 1}/{images.length}
        </span>
      </div>

      <Lightbox images={images} title={title} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}

function Lightbox({
  images,
  title,
  index,
  onClose,
  onIndex,
}: {
  images: string[];
  title: string;
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const [dir, setDir] = useState(1);
  const go = useCallback(
    (d: 1 | -1) => {
      if (index === null) return;
      setDir(d);
      onIndex((index + d + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, go, onClose]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos — ${title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex flex-col bg-black/95"
        >
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <p className="truncate pr-4 text-[13px] text-mist">
              <span className="tabular text-porcelain">
                {index + 1} / {images.length}
              </span>{" "}
              · {title}
            </p>
            <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.08] hover:bg-white/[0.15]" aria-label="Fechar">
              <X size={20} />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 md:px-20">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`${title} — foto ${index + 1}`}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_: unknown, info: { offset: { x: number } }) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
                className="max-h-[78svh] max-w-full cursor-grab select-none rounded-[18px] object-contain active:cursor-grabbing"
                draggable={false}
              />
            </AnimatePresence>
            <button onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/[0.08] hover:bg-white/[0.16] md:grid" aria-label="Foto anterior">
              <ChevronLeft size={22} />
            </button>
            <button onClick={() => go(1)} className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/[0.08] hover:bg-white/[0.16] md:grid" aria-label="Próxima foto">
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="no-scrollbar flex justify-start gap-2 overflow-x-auto px-4 py-4 md:justify-center">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  onIndex(i);
                }}
                className={cn("h-14 w-20 shrink-0 overflow-hidden rounded-xl transition-opacity", i === index ? "opacity-100 ring-2 ring-porcelain" : "opacity-45 hover:opacity-80")}
                aria-label={`Ir para foto ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src.replace("w=1600", "w=240")} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
