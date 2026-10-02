import { site } from "@/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { TrustMarquee } from "@/components/trust/TrustMarquee";
import { Services } from "@/components/services/Services";
import { Section } from "@/components/ui/Section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <TrustMarquee />
        <Services />
        <Section id="about" label="About" eyebrow={site.about.eyebrow} heading={site.about.heading} />
        <Section id="work" label="Work" {...site.workCopy} />
        <Section id="results" label="Results" {...site.resultsCopy} />
        <Section id="calculator" label="ROI Calculator" eyebrow={site.calculator.eyebrow} heading={site.calculator.heading} subheading={site.calculator.subheading} />
        <Section id="process" label="Process" {...site.processCopy} />
        <Section id="testimonials" label="Testimonials" {...site.testimonialsCopy} />
        <Section id="pricing" label="Pricing" eyebrow={site.pricing.eyebrow} heading={site.pricing.heading} subheading={site.pricing.subheading} />
        <Section id="audit" label="Free Audit" eyebrow={site.auditOffer.eyebrow} heading={site.auditOffer.title} subheading={site.auditOffer.description} />
        <Section id="faq" label="FAQ" {...site.faqCopy} />
        <Section id="contact" label="Contact" {...site.contactCopy} />
      </main>
      <Footer />
    </>
  );
}
