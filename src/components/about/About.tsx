import Image from "next/image";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AvailabilityPill } from "./AvailabilityPill";
import { LocalTime } from "./LocalTime";
import { UpworkCard } from "./UpworkCard";

export function About() {
  const { about } = site;
  return (
    <Section id="about" label="About" labelledBy="about-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <Reveal className="mx-auto w-full max-w-[420px] lg:max-w-none">
          {/* Portrait in a slowly rotating conic-gradient ring */}
          <div className="relative overflow-hidden rounded-[28px] p-[3px] shadow-glow">
            <div
              aria-hidden="true"
              className="absolute -inset-[40%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,#D900FD,#9E00C9,#5E0094,#2A1A40,#5E0094,#9E00C9,#D900FD)]"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[25px] bg-bg-elevated">
              <Image
                src={about.photo}
                alt={about.photoAlt}
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 480px) 420px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal stagger={0.08}>
            <p className="text-eyebrow mb-4 inline-flex items-center gap-2 text-text-muted">
              <span aria-hidden="true" className="bg-brand-gradient h-px w-8" />
              {about.eyebrow}
            </p>
            <h2 id="about-heading" className="text-h2">
              {about.heading}
            </h2>
            <p className="mt-2 font-medium text-text-muted">{about.role}</p>
            <div className="mt-6 space-y-4 text-lg">
              {about.story.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </Reveal>

          <Reveal stagger={0.08} className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <AvailabilityPill />
            </div>
            <LocalTime />
            <ul aria-label="Certifications" className="flex flex-wrap items-center gap-4">
              {about.badges.map((b) => (
                <li key={b.name}>
                  <Image src={b.image} alt={b.name} width={72} height={72} unoptimized className="size-[72px]" />
                </li>
              ))}
            </ul>
            <UpworkCard />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
