import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
};

type ButtonProps = Common & {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  href?: undefined;
};

type LinkProps = Common & {
  href: string;
  external?: boolean;
};

function classes(variant: Variant = "primary", size: Size = "md"): string {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 whitespace-nowrap select-none focus-visible:outline-none";
  const sizes: Record<Size, string> = {
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-7 text-[15px]",
  };
  const variants: Record<Variant, string> = {
    primary:
      "bg-brand-500 text-black hover:bg-brand-400 shadow-btn-glow",
    secondary:
      "bg-white text-fg border border-border hover:border-border-hover shadow-card",
    ghost: "text-fg hover:bg-surface",
  };
  return `${base} ${sizes[size]} ${variants[variant]}`;
}

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className = "", icon, children } = props;
  const cls = `${classes(variant, size)} ${className}`;

  if ("href" in props && props.href) {
    const external = "external" in props && props.external;
    if (external) {
      return (
        <a
          href={props.href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon}
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={cls}>
        {icon}
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", disabled } = props as ButtonProps;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {icon}
      {children}
    </button>
  );
}
