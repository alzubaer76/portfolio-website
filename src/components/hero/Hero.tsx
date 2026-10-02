import { ArrowRight, CalendarDays } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatNumber } from "@/lib/utils";

export function Hero() {
  const { hero } = site;
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      data-section="Home"
      className="relative flex min-h-[100svh] items-center overflow-x-clip pt-[var(--nav-h)]"
    >
      <Container className="relative z-10 py-16">
        <div className="max-w-[44rem] lg:w-[55%] lg:max-w-none">
          <p className="text-eyebrow mb-6 inline-flex items-center rounded-full border border-border bg-bg-elevated/70 px-4 py-2 text-text-muted">
            {hero.eyebrow}
          </p>
          <h1 id="hero-heading" className="text-display">
            {hero.headline.map((part, i) =>
              part.highlight ? (
                <span key={i} className="text-gradient">
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-muted md:text-xl">{hero.subheadline}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={hero.primaryCta.href} iconLeft={<CalendarDays aria-hidden="true" className="size-5" />}>
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="secondary" iconRight={<ArrowRight aria-hidden="true" className="size-5" />}>
              {hero.secondaryCta.label}
            </Button>
          </div>
          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-8">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-sm text-text-muted">{stat.label}</dt>
                <dd className="text-metric order-first text-3xl md:text-4xl">
                  {stat.prefix}
                  {formatNumber(stat.value, stat.decimals ?? 0)}
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
