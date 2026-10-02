import { ArrowUp, Mail } from "lucide-react";
import { site, whatsappLink } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon, UpworkIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { FooterLink } from "./FooterLink";

const socials = [
  { label: "WhatsApp", href: whatsappLink(), Icon: WhatsAppIcon },
  { label: "LinkedIn", href: site.contact.linkedin, Icon: LinkedInIcon },
  { label: "Upwork", href: site.contact.upwork, Icon: UpworkIcon },
  { label: "Facebook", href: site.contact.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.contact.instagram, Icon: InstagramIcon },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-bg pt-20 pb-28 md:pb-12">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] lg:grid-cols-[1.6fr_1fr_1fr_auto]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-text-muted">{site.footer.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social links">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-magenta hover:text-text"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  aria-label={`Email ${site.contact.email}`}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-magenta hover:text-text"
                >
                  <Mail aria-hidden="true" className="size-[18px]" />
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-eyebrow mb-4 text-text-muted">Explore</h2>
            <ul className="space-y-1">
              {site.nav.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow mb-4 text-text-muted">Services</h2>
            <ul className="space-y-1">
              {site.services.map((s) => (
                <li key={s.slug}>
                  <FooterLink href={`#services/${s.slug}`}>{s.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:justify-self-end">
            <FooterLink href="#top" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-text hover:border-magenta">
              Back to top <ArrowUp aria-hidden="true" className="size-4" />
            </FooterLink>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-8 text-sm text-text-muted sm:flex-row sm:justify-between">
          <p>
            © {year} {site.brand.name}. All rights reserved.
          </p>
          <p>{site.footer.builtWith}</p>
        </div>
      </Container>
    </footer>
  );
}
