import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  /** Human-readable name used by the section dots / screen readers. */
  label?: string;
  eyebrow?: string;
  heading?: ReactNode;
  subheading?: ReactNode;
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  align?: "left" | "center";
  /** Render children outside the Container (full-bleed). */
  bleed?: boolean;
  /** id of a heading rendered by the children (when not using `heading`). */
  labelledBy?: string;
}

export function Section({
  id,
  label,
  eyebrow,
  heading,
  subheading,
  children,
  className,
  containerClassName,
  headerClassName,
  align = "left",
  bleed = false,
  labelledBy,
}: SectionProps) {
  const headingId = `${id}-heading`;
  const header = heading ? (
    <Reveal
      as="header"
      stagger={0.08}
      className={cn("mb-12 max-w-3xl md:mb-16", align === "center" && "mx-auto text-center", headerClassName)}
    >
      {eyebrow && (
        <p className="text-eyebrow mb-4 inline-flex items-center gap-2 text-text-muted">
          <span aria-hidden="true" className="bg-brand-gradient h-px w-8" />
          {eyebrow}
        </p>
      )}
      <h2 id={headingId} className="text-h2">
        {heading}
      </h2>
      {subheading && <p className="mt-5 text-lg text-text-muted">{subheading}</p>}
    </Reveal>
  ) : null;

  return (
    <section
      id={id}
      aria-labelledby={heading ? headingId : labelledBy}
      aria-label={heading || labelledBy ? undefined : label}
      data-section={label ?? id}
      className={cn("section-y relative overflow-x-clip", className)}
    >
      {bleed ? (
        <>
          <Container className={containerClassName}>{header}</Container>
          {children}
        </>
      ) : (
        <Container className={containerClassName}>
          {header}
          {children}
        </Container>
      )}
    </section>
  );
}
