"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { properties } from "@/data/properties";
import { Section, SectionHeader } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Segmented } from "@/components/admin/ui";
import { PropertyCard } from "@/components/property/property-card";

type Filter = "todos" | "venda" | "aluguel";

export function FeaturedProperties() {
  const [filter, setFilter] = useState<Filter>("todos");
  const list = useMemo(() => {
    const featured = properties.filter((p) => p.ativo && p.destaque);
    const filtered = filter === "todos" ? featured : properties.filter((p) => p.ativo && p.finalidade === filter);
    return filtered.slice(0, 6);
  }, [filter]);

  return (
    <Section id="destaques">
      <div className="container-x">
        <SectionHeader
          eyebrow="Seleção da semana"
          title="Imóveis em destaque"
          lead="Escolhidos a dedo pela nossa equipe: localização, conservação e preço coerente com o mercado."
          action={
            <div className="flex flex-wrap items-center gap-3">
              <Segmented
                layoutId="feat-filter"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: "todos", label: "Destaques" },
                  { value: "venda", label: "Comprar" },
                  { value: "aluguel", label: "Alugar" },
                ]}
              />
              <ButtonLink href="/imoveis" variant="secondary" size="sm" className="h-10">
                Ver todos
              </ButtonLink>
            </div>
          }
        />
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}
