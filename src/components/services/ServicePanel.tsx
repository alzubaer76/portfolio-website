"use client";

import { Check, X } from "lucide-react";
import { whatsappLink, type Service } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

interface ServicePanelProps {
  service: Service | null;
  onClose: () => void;
}

export function ServicePanel({ service, onClose }: ServicePanelProps) {
  return (
    <Drawer open={!!service} onClose={onClose} labelledBy="service-panel-title">
      {service && <PanelBody service={service} onClose={onClose} />}
    </Drawer>
  );
}

function PanelBody({ service, onClose }: { service: Service; onClose: () => void }) {
  return (
    <>
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-bg-elevated/95 px-6 py-5 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="bg-brand-gradient grid size-12 shrink-0 place-items-center rounded-full text-white shadow-glow">
            <Icon name={service.icon} className="size-6" />
          </span>
          <div>
            <p className="text-eyebrow text-text-muted">Service</p>
            <h2 id="service-panel-title" className="text-h3">
              {service.name}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close service details"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-magenta"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="space-y-8 px-6 py-7">
        <p className="text-lg text-text-muted">{service.description}</p>

        <section aria-labelledby="sp-included">
          <h3 id="sp-included" className="text-eyebrow mb-4 text-text-muted">
            What&apos;s included
          </h3>
          <ul className="space-y-3">
            {service.included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-magenta/15 text-magenta">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sp-results">
          <h3 id="sp-results" className="text-eyebrow mb-4 text-text-muted">
            Typical results
          </h3>
          <ul className="flex flex-wrap gap-3">
            {service.results.map((r) => (
              <li key={r.label} className="rounded-[12px] border border-success/30 bg-success/10 px-4 py-3">
                <span className="text-metric block text-xl text-success">{r.value}</span>
                <span className="text-sm text-text-muted">{r.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sp-tools">
          <h3 id="sp-tools" className="text-eyebrow mb-4 text-text-muted">
            Tools we use
          </h3>
          <ul className="flex flex-wrap gap-2">
            {service.tools.map((t) => (
              <li key={t} className="rounded-full border border-border bg-bg-elevated-2 px-3.5 py-1.5 text-sm">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sp-ideal">
          <h3 id="sp-ideal" className="text-eyebrow mb-3 text-text-muted">
            Ideal for
          </h3>
          <p>{service.idealFor}</p>
        </section>

        <Button
          href={whatsappLink(`Hi Al Zubaer, I'd like to discuss your ${service.name} service for my business.`)}
          className="w-full"
          iconLeft={<WhatsAppIcon className="size-5" />}
        >
          Discuss this service
        </Button>
      </div>
    </>
  );
}
