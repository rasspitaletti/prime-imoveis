import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "whatsapp" | "glass";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-accent-hover active:scale-[0.98]",
  secondary:
    "bg-transparent text-porcelain shadow-[inset_0_0_0_1px_var(--color-slate)] hover:shadow-[inset_0_0_0_1px_var(--color-porcelain)] hover:bg-white/[0.04] active:scale-[0.98]",
  ghost: "bg-transparent text-mist hover:text-porcelain hover:bg-white/[0.06]",
  light: "bg-porcelain text-ink hover:bg-white active:scale-[0.98]",
  whatsapp: "bg-[#25D366] text-[#05290f] hover:bg-[#2fe072] active:scale-[0.98]",
  glass: "bg-white/[0.08] text-porcelain backdrop-blur-xl hover:bg-white/[0.14] active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-13 px-7 text-[16px] gap-2.5 min-h-[52px]",
};

const baseCls =
  "inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,box-shadow,color,transform] duration-200 ease-[var(--ease-out-soft)] disabled:pointer-events-none disabled:opacity-40";

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode; icon?: ReactNode; iconRight?: ReactNode };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  iconRight,
  ...rest
}: Common & ComponentPropsWithoutRef<"button">) {
  return (
    <button className={cn(baseCls, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

/** Link com aparência de botão. Links externos abrem em nova aba automaticamente. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  iconRight,
  ...rest
}: Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  const cls = cn(baseCls, variants[variant], sizes[size], className);
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {icon}
        {children}
        {iconRight}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}
