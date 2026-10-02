"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode, Ref } from "react";
import { useScrollTo } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[transform,box-shadow,border-color,background-color,color] duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-magenta disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Gradient layer is a pseudo element so the hover gradient can cross-fade.
  primary:
    "isolate overflow-hidden rounded-full text-white bg-brand-gradient hover:shadow-glow before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-[image:var(--gradient-brand-hover)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
  secondary:
    "rounded-full border border-border bg-transparent text-text hover:border-magenta hover:bg-bg-elevated/60",
  ghost:
    "min-h-11 px-1 text-text after:absolute after:bottom-2 after:left-1 after:right-1 after:h-px after:origin-right after:scale-x-0 after:bg-magenta after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-[52px] px-7 text-base",
  sm: "h-11 px-5 text-[15px]",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & { href: string; ref?: Ref<HTMLAnchorElement> };
type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined; ref?: Ref<HTMLButtonElement> };

export type ButtonProps = AnchorProps | NativeButtonProps;

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], variant !== "ghost" && sizes[size], className);
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    loadingLabel = "Sending…",
    iconLeft,
    iconRight,
    className,
    children,
  } = props;
  const scrollTo = useScrollTo();
  const classes = buttonClasses({ variant, size, className });

  const content = (
    <>
      {loading ? <Loader2 aria-hidden="true" className="size-5 animate-spin" /> : iconLeft}
      <span>{loading ? loadingLabel : children}</span>
      {!loading && iconRight}
    </>
  );

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, size: _s, loading: _l, loadingLabel: _ll, iconLeft: _il, iconRight: _ir, className: _c, children: _ch, href, onClick, ref, ...rest } = props;

    if (href.startsWith("#")) {
      const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        scrollTo(href);
      };
      return (
        <a ref={ref} href={href} className={classes} onClick={handleClick} {...rest}>
          {content}
        </a>
      );
    }

    if (isExternal(href)) {
      const newTab = href.startsWith("http");
      return (
        <a
          ref={ref}
          href={href}
          className={classes}
          onClick={onClick}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        >
          {content}
          {newTab && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    }

    return (
      <Link ref={ref} href={href} className={classes} onClick={onClick} {...rest}>
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, loading: _l, loadingLabel: _ll, iconLeft: _il, iconRight: _ir, className: _c, children: _ch, href: _h, type = "button", disabled, ref, ...rest } = props;
  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}
