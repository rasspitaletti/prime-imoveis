import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-ink px-6 text-center">
      <div>
        <p className="t-eyebrow">Erro 404</p>
        <h1 className="t-h1 mt-4">Este endereço não existe.</h1>
        <p className="t-lead mx-auto mt-4 max-w-md">O imóvel pode ter sido vendido ou alugado. Que tal ver opções parecidas?</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="inline-flex h-11 items-center rounded-full bg-porcelain px-5 text-[15px] font-medium text-ink">Início</Link>
          <Link href="/imoveis" className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-[15px] font-medium text-ink">Ver imóveis</Link>
        </div>
      </div>
    </main>
  );
}
