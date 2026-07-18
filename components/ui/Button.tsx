import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type StyleProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
};

type ButtonProps = StyleProps &
  (
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out-expo " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const variants = {
  primary:
    "bg-accent-fill text-on-accent hover:bg-accent-fill-hover " +
    "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--accent-glow)]",
  secondary:
    "bg-surface text-text border border-hairline " +
    "hover:bg-surface-hover hover:border-hairline-strong hover:-translate-y-0.5",
  ghost: "text-muted hover:text-text hover:bg-surface",
};

const sizes = {
  md: "h-10 px-4 text-small",
  lg: "h-12 px-6 text-body",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    return (
      <a
        className={cls}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }
  return (
    <button
      className={cls}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
