"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, RotateCcw, Sparkles } from "lucide-react";
import { settings } from "@/config/agency";
import { cn, whatsappLink } from "@/lib/utils";
import { api } from "@/services/api";
import { aiSuggestions, type AIAction } from "@/services/mock-ai";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

type Msg = { id: number; role: "user" | "assistant"; text: string; actions?: AIAction[] };

const welcome = (): Msg => ({ id: 0, role: "assistant", text: settings.assistente.mensagemBoasVindas });

export function AssistantChat({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([welcome()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: idRef.current++, role: "user", text: t }]);
    setTyping(true);
    try {
      const reply = await api.ai.chat(t);
      setMessages((m) => [...m, { id: idRef.current++, role: "assistant", ...reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: "assistant", text: "Tive um problema para responder agora. Tente de novo ou fale com a equipe.", actions: [{ label: "Falar no WhatsApp", href: "whatsapp" }] },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[28px] bg-graphite shadow-[inset_0_0_0_1px_var(--color-line)]",
        compact ? "h-[520px]" : "h-[min(720px,calc(100svh-180px))] min-h-[520px]",
        className,
      )}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-full bg-accent text-ink">
            <Sparkles size={18} />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-mint ring-2 ring-graphite" />
          </span>
          <div>
            <p className="text-[15px] font-semibold">Assistente Prime</p>
            <p className="text-[12px] text-ash">Assistente virtual · demonstração</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([welcome()])}
          className="grid h-9 w-9 place-items-center rounded-full text-ash hover:bg-white/[0.06] hover:text-porcelain"
          aria-label="Reiniciar conversa"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Mensagens */}
      <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-5 py-6" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn("max-w-[85%]", m.role === "user" && "text-right")}>
                <p
                  className={cn(
                    "inline-block whitespace-pre-line rounded-[22px] px-4 py-3 text-left text-[15px] leading-relaxed",
                    m.role === "user" ? "rounded-br-md bg-accent text-ink" : "rounded-bl-md bg-carbon text-porcelain",
                  )}
                >
                  {m.text}
                </p>
                {m.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.actions.map((a) =>
                      a.href === "whatsapp" ? (
                        <a
                          key={a.label}
                          href={whatsappLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3.5 py-2 text-[13px] font-medium text-[#4be08a] hover:bg-[#25D366]/25"
                        >
                          <WhatsAppIcon size={14} /> {a.label}
                        </a>
                      ) : (
                        <Link
                          key={a.label}
                          href={a.href}
                          className="inline-flex items-center rounded-full bg-white/[0.06] px-3.5 py-2 text-[13px] font-medium text-link hover:bg-white/[0.1]"
                        >
                          {a.label}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex items-center gap-1 rounded-[22px] rounded-bl-md bg-carbon px-4 py-4 w-fit" aria-label="Assistente está digitando">
            <span className="op-dot h-1.5 w-1.5 rounded-full bg-ash" />
            <span className="op-dot h-1.5 w-1.5 rounded-full bg-ash" />
            <span className="op-dot h-1.5 w-1.5 rounded-full bg-ash" />
          </div>
        )}
      </div>

      {/* Sugestões */}
      {messages.length <= 2 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
          {aiSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 rounded-full bg-white/[0.05] px-3.5 py-2 text-[13px] text-mist transition-colors hover:bg-white/[0.1] hover:text-porcelain"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Entrada */}
      <form onSubmit={onSubmit} className="border-t border-line p-3">
        <div className="flex items-center gap-2 rounded-full bg-white/[0.04] pl-5 pr-1.5 shadow-[inset_0_0_0_1px_var(--color-steel)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-accent)]">
          <label htmlFor={compact ? "ai-input-c" : "ai-input"} className="sr-only">
            Mensagem para o assistente
          </label>
          <input
            id={compact ? "ai-input-c" : "ai-input"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex.: casa com piscina até 3 milhões"
            className="h-12 flex-1 bg-transparent text-[16px] outline-none placeholder:text-slate"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="grid h-9 w-9 place-items-center rounded-full bg-accent text-ink transition-opacity disabled:opacity-30"
            aria-label="Enviar"
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <p className="mt-2 px-2 text-center text-[11px] text-slate">
          Respostas demonstrativas. Valores e disponibilidade são confirmados por um corretor.
        </p>
      </form>
    </div>
  );
}
