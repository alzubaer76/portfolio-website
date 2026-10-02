/**
 * Commerce Crews — single source of truth for all site copy and data.
 *
 * EVERYTHING marked `// TODO: replace` is a placeholder. Values are
 * intentionally obviously fake (e.g. "Client Name", "0.0x ROAS") so they can
 * never be mistaken for real claims. Replace them before launch.
 */

/* ======================================================================
   Types
   ====================================================================== */

export type IconName =
  | "megaphone"
  | "music"
  | "search"
  | "trending-up"
  | "camera"
  | "palette"
  | "layout"
  | "target"
  | "phone"
  | "clipboard"
  | "rocket"
  | "chart"
  | "sparkles"
  | "settings";

export type Currency = "USD" | "GBP" | "EUR" | "BDT";
export type Platform = "meta" | "google" | "tiktok";
export type ProjectFilter = "all" | "meta" | "google" | "tiktok" | "seo" | "creative";
export type TileSpan = "1x1" | "2x1" | "1x2" | "2x2";

export interface NavLink {
  label: string;
  href: `#${string}`;
}

export interface Cta {
  label: string;
  href: string;
}

export interface Meta {
  title: string;
  description: string;
  url: string;
  ogImage: string;
  siteName: string;
  locale: string;
}

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export interface Hero {
  eyebrow: string;
  /** Headline split into parts; `highlight: true` parts render in the brand gradient. */
  headline: { text: string; highlight?: boolean }[];
  subheadline: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  stats: Stat[];
  scrollLabel: string;
}

export interface TrustBar {
  label: string;
  countries: { name: string; flag: string }[];
  platforms: { name: string; logo: string }[];
}

export interface MetricChip {
  label: string;
  value: string;
}

export interface Service {
  slug: string;
  name: string;
  icon: IconName;
  tagline: string;
  description: string;
  included: string[];
  results: MetricChip[];
  tools: string[];
  idealFor: string;
}

export interface Availability {
  status: "open" | "limited" | "closed";
  spotsLeft: number;
  note: string;
}

export interface About {
  eyebrow: string;
  heading: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  story: string[];
  badges: { name: string; image: string }[];
  availability: Availability;
  upwork: {
    jobSuccess: string;
    badge: string;
    totalJobs: string;
    hoursWorked: string;
    url: string;
  };
}

export interface ProjectResult {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Percent change, positive or negative. Rendered with ▲/▼ + text, never colour alone. */
  change: number;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  industry: string;
  country: string;
  flag: string;
  platforms: string[];
  filters: Exclude<ProjectFilter, "all">[];
  cover: string;
  gallery: string[];
  headlineMetric: string;
  challenge: string;
  strategy: string[];
  results: ProjectResult[];
  beforeAfter?: { before: string; after: string; beforeLabel: string; afterLabel: string };
  testimonial?: { quote: string; name: string; role: string };
  span: TileSpan;
}

export interface ResultCardData {
  platform: Platform;
  screenshot: string;
  objective: string;
  period: string;
  metrics: MetricChip[];
  /** Normalised 0–1 series for the sparkline: spend vs results. */
  series: { spend: number[]; results: number[] };
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  country: string;
  flag: string;
  quote: string;
  avatar: string;
  rating: number;
  videoUrl?: string;
  videoPoster?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  icon: IconName;
}

export interface PricingTier {
  name: string;
  description: string;
  price: Record<Currency, number>;
  period: string;
  adSpendNote: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  cta: Cta;
}

export interface Pricing {
  eyebrow: string;
  heading: string;
  subheading: string;
  defaultCurrency: Currency;
  currencies: { code: Currency; symbol: string; label: string }[];
  tiers: PricingTier[];
  compare: {
    rows: { feature: string; values: (boolean | string)[] }[];
  };
  reassurance: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Contact {
  email: string;
  whatsapp: string;
  whatsappMessage: string;
  upwork: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  calendly: string;
  timezone: string;
  timezoneLabel: string;
  responseTime: string;
  responseHours: number;
  budgets: string[];
}

export interface AuditOffer {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  budgets: string[];
}

export interface CalculatorIndustry {
  id: string;
  label: string;
  /** USD cost per click range */
  cpc: [number, number];
  /** Conversion rate range, as a fraction (0.02 = 2%) */
  cvr: [number, number];
}

export interface Calculator {
  eyebrow: string;
  heading: string;
  subheading: string;
  budget: { min: number; max: number; step: number; default: number };
  defaultAov: number;
  industries: CalculatorIndustry[];
  /** Relative uplift multipliers applied for the "optimised" scenario. */
  optimised: { cpcMultiplier: number; cvrMultiplier: number };
  disclaimer: string;
  cta: string;
}

export interface SectionCopy {
  eyebrow: string;
  heading: string;
  subheading?: string;
}

export interface Site {
  meta: Meta;
  brand: { name: string; tagline: string; logo: string };
  nav: NavLink[];
  navCta: Cta;
  hero: Hero;
  trustBar: TrustBar;
  servicesCopy: SectionCopy;
  services: Service[];
  about: About;
  workCopy: SectionCopy;
  workFilters: { id: ProjectFilter; label: string }[];
  projects: Project[];
  resultsCopy: SectionCopy;
  results: ResultCardData[];
  calculator: Calculator;
  processCopy: SectionCopy;
  process: ProcessStep[];
  testimonialsCopy: SectionCopy;
  testimonials: Testimonial[];
  pricing: Pricing;
  auditOffer: AuditOffer;
  faqCopy: SectionCopy;
  faq: FaqItem[];
  contactCopy: SectionCopy;
  contact: Contact;
  footer: { tagline: string; builtWith: string };
}

/* ======================================================================
   Content
   ====================================================================== */

const CALENDLY = "https://calendly.com/your-handle/strategy-call"; // TODO: replace

export const site: Site = {
  meta: {
    title: "Commerce Crews | Meta, TikTok & Google Ads Agency",
    description:
      "Commerce Crews is a performance marketing agency running Meta, TikTok and Google Ads for brands in the UK, EU and Middle East. Built around ROAS, not vanity metrics.",
    url: "https://commercecrews.com", // TODO: replace with the real domain
    ogImage: "/og.jpg", // TODO: replace (1200×630)
    siteName: "Commerce Crews",
    locale: "en_GB",
  },

  brand: {
    name: "Commerce Crews",
    tagline: "Performance marketing that pays for itself.", // TODO: replace
    logo: "/logo.png", // TODO: replace with the real logo PNG
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Results", href: "#results" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
  navCta: { label: "Book a Free Call", href: CALENDLY },

  hero: {
    eyebrow: "Meta Certified Media Buyer · Clients in 5 countries", // TODO: replace (verify certification)
    headline: [
      { text: "Ads that turn " },
      { text: "scrolls", highlight: true },
      { text: " into " },
      { text: "sales", highlight: true },
    ],
    subheadline:
      "Performance marketing for brands that want measurable growth: Meta, TikTok & Google Ads, built around ROAS, not vanity metrics.", // TODO: replace
    primaryCta: { label: "Book a Free Strategy Call", href: CALENDLY },
    secondaryCta: { label: "Get a Free Ad Audit", href: "#audit" },
    stats: [
      { value: 0, prefix: "$", suffix: "K+", label: "ad spend managed" }, // TODO: replace
      { value: 0, suffix: "+", label: "brands scaled" }, // TODO: replace
      { value: 0, suffix: "x", decimals: 1, label: "avg. ROAS" }, // TODO: replace
    ],
    scrollLabel: "Scroll to explore",
  },

  trustBar: {
    label: "Platforms we run · Markets we serve",
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" },
      { name: "Qatar", flag: "🇶🇦" },
      { name: "Germany", flag: "🇩🇪" },
      { name: "Portugal", flag: "🇵🇹" },
      { name: "Bangladesh", flag: "🇧🇩" },
    ],
    platforms: [
      { name: "Meta", logo: "/platforms/meta.svg" },
      { name: "Google Ads", logo: "/platforms/google-ads.svg" },
      { name: "TikTok", logo: "/platforms/tiktok.svg" },
      { name: "Shopify", logo: "/platforms/shopify.svg" },
      { name: "WooCommerce", logo: "/platforms/woocommerce.svg" },
      { name: "GA4", logo: "/platforms/ga4.svg" },
    ],
  },

  servicesCopy: {
    eyebrow: "Services",
    heading: "Everything your ads need, under one crew",
    subheading: "Drag, swipe or use the arrows to explore. Select a service for the details.",
  },

  // TODO: replace — all service details, results and tools are placeholders
  services: [
    {
      slug: "meta-ads",
      name: "Meta Ads",
      icon: "megaphone",
      tagline: "Facebook & Instagram campaigns that scale profitably",
      description:
        "Placeholder description. Full-funnel Meta campaigns: prospecting, retargeting and retention, with creative testing built in.",
      included: [
        "Account & pixel / Conversions API audit",
        "Audience and funnel strategy",
        "Weekly creative testing",
        "Budget scaling rules",
        "Monthly performance report",
      ],
      results: [
        { label: "ROAS", value: "0.0x" },
        { label: "CPA", value: "−00%" },
      ],
      tools: ["Meta Ads Manager", "Conversions API", "GA4"],
      idealFor: "E-commerce and lead-gen brands spending $1k+/month on ads.",
    },
    {
      slug: "tiktok-ads",
      name: "TikTok Ads",
      icon: "music",
      tagline: "Native-feeling ads for a scroll-first audience",
      description: "Placeholder description. Spark Ads, UGC-style creative and TikTok Shop campaigns.",
      included: ["TikTok Pixel & Events API setup", "Hook-first creative briefs", "Spark Ads", "Weekly reporting"],
      results: [
        { label: "CPM", value: "−00%" },
        { label: "CTR", value: "0.0%" },
      ],
      tools: ["TikTok Ads Manager", "CapCut", "Events API"],
      idealFor: "Consumer brands targeting under-35 audiences.",
    },
    {
      slug: "google-ads",
      name: "Google Ads",
      icon: "target",
      tagline: "Capture buyers who are already searching",
      description: "Placeholder description. Search, Performance Max and Shopping campaigns structured for profit.",
      included: ["Keyword & competitor research", "Search + PMax build", "Merchant Center feed fixes", "Conversion tracking"],
      results: [
        { label: "Conv. rate", value: "0.0%" },
        { label: "CPC", value: "−00%" },
      ],
      tools: ["Google Ads", "Merchant Center", "GA4", "Tag Manager"],
      idealFor: "Businesses with existing search demand.",
    },
    {
      slug: "seo",
      name: "SEO",
      icon: "search",
      tagline: "Organic traffic that compounds month after month",
      description: "Placeholder description. Technical fixes, on-page optimisation and content planning.",
      included: ["Technical SEO audit", "On-page optimisation", "Content plan", "Monthly ranking report"],
      results: [
        { label: "Organic traffic", value: "+00%" },
        { label: "Top-10 keywords", value: "00" },
      ],
      tools: ["Search Console", "Ahrefs", "Screaming Frog"],
      idealFor: "Brands playing the long game alongside paid ads.",
    },
    {
      slug: "creative-content",
      name: "Creative Content",
      icon: "camera",
      tagline: "Scroll-stopping photo & video built for ads",
      description: "Placeholder description. Product photography, UGC-style video and short-form edits.",
      included: ["Creative strategy", "Product photography", "Short-form video edits", "Ad-ready exports"],
      results: [
        { label: "Thumb-stop rate", value: "00%" },
        { label: "Creatives / month", value: "00" },
      ],
      tools: ["Premiere Pro", "CapCut", "Lightroom"],
      idealFor: "Brands whose ads are limited by creative volume.",
    },
    {
      slug: "graphic-design",
      name: "Monthly Graphic Design",
      icon: "palette",
      tagline: "A design team on retainer, without the overhead",
      description: "Placeholder description. Social posts, ad statics, banners and brand assets every month.",
      included: ["Ad static creatives", "Social media posts", "Banners & promos", "Brand-consistent templates"],
      results: [
        { label: "Turnaround", value: "00h" },
        { label: "Designs / month", value: "00" },
      ],
      tools: ["Figma", "Photoshop", "Illustrator"],
      idealFor: "Teams that need a steady flow of on-brand design.",
    },
    {
      slug: "landing-pages",
      name: "Landing Pages",
      icon: "layout",
      tagline: "Pages built to convert the traffic you pay for",
      description: "Placeholder description. Fast, conversion-focused landing pages matched to your ads.",
      included: ["Wireframe & copy", "Design & build", "Speed optimisation", "A/B test setup"],
      results: [
        { label: "Conv. rate", value: "+00%" },
        { label: "Load time", value: "0.0s" },
      ],
      tools: ["Shopify", "WordPress", "Next.js"],
      idealFor: "Campaigns sending paid traffic to a generic homepage.",
    },
    {
      slug: "analytics-tracking",
      name: "Analytics & Tracking",
      icon: "chart",
      tagline: "Know exactly which ad made the sale",
      description: "Placeholder description. Server-side tracking, GA4 and dashboards you can trust.",
      included: ["GA4 & GTM setup", "Conversions API / server-side", "UTM framework", "Live dashboard"],
      results: [
        { label: "Tracked conversions", value: "+00%" },
        { label: "Data accuracy", value: "00%" },
      ],
      tools: ["GA4", "Tag Manager", "Looker Studio"],
      idealFor: "Anyone unsure whether their ads are actually working.",
    },
  ],

  about: {
    eyebrow: "About",
    heading: "Hi, I'm Al Zubaer",
    name: "Al Zubaer",
    role: "Founder & Lead Media Buyer, Commerce Crews",
    photo: "/about.jpg", // TODO: replace (portrait, 4:5)
    photoAlt: "Portrait of Al Zubaer, founder of Commerce Crews",
    // TODO: replace — story paragraphs are placeholders
    story: [
      "Placeholder paragraph. Tell the story of how Commerce Crews started and why you focus on performance over vanity metrics.",
      "Placeholder paragraph. Describe how you work with clients across the UK, Qatar, Germany, Portugal and Bangladesh.",
      "Placeholder paragraph. Explain what a client can expect in the first 30 days of working together.",
    ],
    // TODO: replace — badge images are placeholders; only list certifications you actually hold
    badges: [
      { name: "Certification placeholder 1", image: "/badges/badge-1.svg" },
      { name: "Certification placeholder 2", image: "/badges/badge-2.svg" },
      { name: "Certification placeholder 3", image: "/badges/badge-3.svg" },
    ],
    availability: {
      status: "limited",
      spotsLeft: 2, // TODO: replace
      note: "Taking 2 new clients this month", // TODO: replace
    },
    // TODO: replace — all Upwork numbers are placeholders
    upwork: {
      jobSuccess: "00%",
      badge: "Badge placeholder",
      totalJobs: "00",
      hoursWorked: "0,000",
      url: "https://www.upwork.com/freelancers/your-profile", // TODO: replace
    },
  },

  workCopy: {
    eyebrow: "Selected work",
    heading: "Campaigns that moved the numbers",
    subheading: "Select a project to see the challenge, the strategy and the results.",
  },
  workFilters: [
    { id: "all", label: "All" },
    { id: "meta", label: "Meta Ads" },
    { id: "google", label: "Google Ads" },
    { id: "tiktok", label: "TikTok" },
    { id: "seo", label: "SEO" },
    { id: "creative", label: "Creative" },
  ],

  // TODO: replace — every project, client and number below is a placeholder
  projects: [
    {
      slug: "project-one",
      title: "Project Title One",
      client: "Client Name",
      industry: "Fashion e-commerce",
      country: "United Kingdom",
      flag: "🇬🇧",
      platforms: ["Meta Ads", "Creative"],
      filters: ["meta", "creative"],
      cover: "/projects/project-one/cover.jpg",
      gallery: ["/projects/project-one/gallery-1.jpg", "/projects/project-one/gallery-2.jpg", "/projects/project-one/gallery-3.jpg"],
      headlineMetric: "0.0x ROAS",
      challenge: "Placeholder challenge. Describe the client's situation and what wasn't working before.",
      strategy: ["Placeholder strategy step one.", "Placeholder strategy step two.", "Placeholder strategy step three."],
      results: [
        { label: "ROAS", value: 0, suffix: "x", decimals: 1, change: 0 },
        { label: "Revenue", value: 0, prefix: "$", suffix: "K", change: 0 },
        { label: "CPA", value: 0, prefix: "$", change: 0 },
      ],
      beforeAfter: {
        before: "/projects/project-one/before.jpg",
        after: "/projects/project-one/after.jpg",
        beforeLabel: "Before",
        afterLabel: "After",
      },
      testimonial: { quote: "Client testimonial goes here.", name: "Client Name", role: "Role, Company" },
      span: "2x2",
    },
    {
      slug: "project-two",
      title: "Project Title Two",
      client: "Client Name",
      industry: "Beauty & skincare",
      country: "Qatar",
      flag: "🇶🇦",
      platforms: ["TikTok Ads"],
      filters: ["tiktok", "creative"],
      cover: "/projects/project-two/cover.jpg",
      gallery: ["/projects/project-two/gallery-1.jpg", "/projects/project-two/gallery-2.jpg"],
      headlineMetric: "0.0x ROAS",
      challenge: "Placeholder challenge.",
      strategy: ["Placeholder strategy step one.", "Placeholder strategy step two."],
      results: [
        { label: "ROAS", value: 0, suffix: "x", decimals: 1, change: 0 },
        { label: "CTR", value: 0, suffix: "%", decimals: 1, change: 0 },
        { label: "CPM", value: 0, prefix: "$", decimals: 2, change: 0 },
      ],
      span: "1x1",
    },
    {
      slug: "project-three",
      title: "Project Title Three",
      client: "Client Name",
      industry: "Home services",
      country: "Germany",
      flag: "🇩🇪",
      platforms: ["Google Ads"],
      filters: ["google"],
      cover: "/projects/project-three/cover.jpg",
      gallery: ["/projects/project-three/gallery-1.jpg", "/projects/project-three/gallery-2.jpg"],
      headlineMetric: "00% lower CPL",
      challenge: "Placeholder challenge.",
      strategy: ["Placeholder strategy step one.", "Placeholder strategy step two."],
      results: [
        { label: "Leads", value: 0, change: 0 },
        { label: "CPL", value: 0, prefix: "€", change: 0 },
        { label: "Conv. rate", value: 0, suffix: "%", decimals: 1, change: 0 },
      ],
      span: "1x2",
    },
    {
      slug: "project-four",
      title: "Project Title Four",
      client: "Client Name",
      industry: "Hospitality",
      country: "Portugal",
      flag: "🇵🇹",
      platforms: ["SEO"],
      filters: ["seo"],
      cover: "/projects/project-four/cover.jpg",
      gallery: ["/projects/project-four/gallery-1.jpg"],
      headlineMetric: "+00% organic traffic",
      challenge: "Placeholder challenge.",
      strategy: ["Placeholder strategy step one.", "Placeholder strategy step two."],
      results: [
        { label: "Organic sessions", value: 0, change: 0 },
        { label: "Top-10 keywords", value: 0, change: 0 },
      ],
      span: "1x1",
    },
    {
      slug: "project-five",
      title: "Project Title Five",
      client: "Client Name",
      industry: "Electronics retail",
      country: "Bangladesh",
      flag: "🇧🇩",
      platforms: ["Meta Ads", "Google Ads"],
      filters: ["meta", "google"],
      cover: "/projects/project-five/cover.jpg",
      gallery: ["/projects/project-five/gallery-1.jpg", "/projects/project-five/gallery-2.jpg"],
      headlineMetric: "0.0x ROAS",
      challenge: "Placeholder challenge.",
      strategy: ["Placeholder strategy step one.", "Placeholder strategy step two."],
      results: [
        { label: "ROAS", value: 0, suffix: "x", decimals: 1, change: 0 },
        { label: "Orders", value: 0, change: 0 },
      ],
      span: "2x1",
    },
    {
      slug: "project-six",
      title: "Project Title Six",
      client: "Client Name",
      industry: "Food & beverage",
      country: "United Kingdom",
      flag: "🇬🇧",
      platforms: ["Creative", "Meta Ads"],
      filters: ["creative", "meta"],
      cover: "/projects/project-six/cover.jpg",
      gallery: ["/projects/project-six/gallery-1.jpg", "/projects/project-six/gallery-2.jpg"],
      headlineMetric: "00 creatives / month",
      challenge: "Placeholder challenge.",
      strategy: ["Placeholder strategy step one.", "Placeholder strategy step two."],
      results: [
        { label: "Thumb-stop rate", value: 0, suffix: "%", change: 0 },
        { label: "CPA", value: 0, prefix: "£", change: 0 },
      ],
      span: "1x1",
    },
  ],

  resultsCopy: {
    eyebrow: "Results",
    heading: "Straight from the ad accounts",
    subheading: "Real dashboards, client names blurred. Scroll to browse.",
  },
  // TODO: replace — screenshots and all metrics are placeholders
  results: [
    {
      platform: "meta",
      screenshot: "/results/meta-1.jpg",
      objective: "Sales",
      period: "Placeholder period",
      metrics: [
        { label: "Spend", value: "$0,000" },
        { label: "Purchases", value: "000" },
        { label: "ROAS", value: "0.0x" },
      ],
      series: { spend: [0.2, 0.3, 0.35, 0.5, 0.55, 0.7, 0.8], results: [0.1, 0.25, 0.4, 0.5, 0.7, 0.85, 1] },
    },
    {
      platform: "meta",
      screenshot: "/results/meta-2.jpg",
      objective: "Leads",
      period: "Placeholder period",
      metrics: [
        { label: "Spend", value: "$0,000" },
        { label: "Leads", value: "000" },
        { label: "CPL", value: "$0.00" },
      ],
      series: { spend: [0.3, 0.3, 0.4, 0.45, 0.5, 0.55, 0.6], results: [0.15, 0.3, 0.45, 0.55, 0.65, 0.8, 0.95] },
    },
    {
      platform: "meta",
      screenshot: "/results/meta-3.jpg",
      objective: "Sales",
      period: "Placeholder period",
      metrics: [
        { label: "Spend", value: "$0,000" },
        { label: "Revenue", value: "$00,000" },
        { label: "ROAS", value: "0.0x" },
      ],
      series: { spend: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7], results: [0.1, 0.2, 0.35, 0.55, 0.6, 0.8, 0.9] },
    },
    {
      platform: "google",
      screenshot: "/results/google-1.jpg",
      objective: "Search — Leads",
      period: "Placeholder period",
      metrics: [
        { label: "Clicks", value: "0,000" },
        { label: "Conversions", value: "000" },
        { label: "Conv. rate", value: "0.0%" },
      ],
      series: { spend: [0.4, 0.4, 0.45, 0.5, 0.5, 0.55, 0.6], results: [0.2, 0.3, 0.4, 0.55, 0.6, 0.75, 0.9] },
    },
    {
      platform: "google",
      screenshot: "/results/google-2.jpg",
      objective: "Performance Max — Sales",
      period: "Placeholder period",
      metrics: [
        { label: "Cost", value: "$0,000" },
        { label: "Conv. value", value: "$00,000" },
        { label: "ROAS", value: "0.0x" },
      ],
      series: { spend: [0.2, 0.3, 0.3, 0.4, 0.5, 0.6, 0.65], results: [0.1, 0.2, 0.4, 0.45, 0.65, 0.8, 1] },
    },
    {
      platform: "tiktok",
      screenshot: "/results/tiktok-1.jpg",
      objective: "Conversions",
      period: "Placeholder period",
      metrics: [
        { label: "Spend", value: "$0,000" },
        { label: "Conversions", value: "000" },
        { label: "CPA", value: "$0.00" },
      ],
      series: { spend: [0.2, 0.25, 0.35, 0.4, 0.5, 0.55, 0.6], results: [0.1, 0.2, 0.3, 0.5, 0.6, 0.7, 0.85] },
    },
  ],

  calculator: {
    eyebrow: "ROI calculator",
    heading: "What could your ad budget return?",
    subheading: "Move the slider and see a conservative vs. optimised estimate in seconds.",
    budget: { min: 300, max: 20000, step: 100, default: 2000 },
    defaultAov: 60,
    // TODO: review — benchmark ranges are rough planning assumptions, not guarantees
    industries: [
      { id: "ecommerce", label: "E-commerce (general)", cpc: [0.6, 1.2], cvr: [0.012, 0.025] },
      { id: "fashion", label: "Fashion & apparel", cpc: [0.5, 1.0], cvr: [0.01, 0.022] },
      { id: "beauty", label: "Beauty & skincare", cpc: [0.6, 1.3], cvr: [0.015, 0.03] },
      { id: "home", label: "Home & furniture", cpc: [0.8, 1.6], cvr: [0.008, 0.018] },
      { id: "services", label: "Local / professional services", cpc: [1.5, 3.5], cvr: [0.03, 0.07] },
      { id: "education", label: "Education & courses", cpc: [0.9, 2.0], cvr: [0.02, 0.05] },
    ],
    optimised: { cpcMultiplier: 0.8, cvrMultiplier: 1.35 },
    disclaimer: "Estimates for planning only; real results depend on offer, creative and market.",
    cta: "Get a real forecast for my business",
  },

  processCopy: {
    eyebrow: "Process",
    heading: "From first call to scaled campaigns",
    subheading: "A clear, five-step process, so you always know what happens next.",
  },
  process: [
    { step: 1, title: "Discovery Call", description: "We talk about your goals, margins and what you've tried so far.", duration: "Day 1", icon: "phone" },
    { step: 2, title: "Audit & Strategy", description: "A full audit of your accounts, tracking and funnel, plus a written plan.", duration: "Day 2–5", icon: "clipboard" },
    { step: 3, title: "Creative & Setup", description: "Tracking fixed, campaigns built, first creatives produced.", duration: "Week 2", icon: "sparkles" },
    { step: 4, title: "Launch & Optimise", description: "Campaigns go live with daily monitoring and weekly creative tests.", duration: "Week 3–6", icon: "rocket" },
    { step: 5, title: "Report & Scale", description: "Monthly reports with clear next steps; scale what works.", duration: "Ongoing", icon: "trending-up" },
  ], // TODO: review durations

  testimonialsCopy: {
    eyebrow: "Testimonials",
    heading: "What clients say",
  },
  // TODO: replace — these are placeholders. Do NOT publish invented testimonials.
  testimonials: [
    { name: "Client Name", role: "Role", company: "Company", country: "United Kingdom", flag: "🇬🇧", quote: "Client testimonial goes here.", avatar: "/testimonials/avatar-1.jpg", rating: 5 },
    { name: "Client Name", role: "Role", company: "Company", country: "Qatar", flag: "🇶🇦", quote: "Client testimonial goes here.", avatar: "/testimonials/avatar-2.jpg", rating: 5, videoUrl: "", videoPoster: "/testimonials/video-poster-1.jpg" },
    { name: "Client Name", role: "Role", company: "Company", country: "Germany", flag: "🇩🇪", quote: "Client testimonial goes here.", avatar: "/testimonials/avatar-3.jpg", rating: 5 },
    { name: "Client Name", role: "Role", company: "Company", country: "Portugal", flag: "🇵🇹", quote: "Client testimonial goes here.", avatar: "/testimonials/avatar-4.jpg", rating: 5 },
    { name: "Client Name", role: "Role", company: "Company", country: "Bangladesh", flag: "🇧🇩", quote: "Client testimonial goes here.", avatar: "/testimonials/avatar-5.jpg", rating: 5 },
    { name: "Client Name", role: "Role", company: "Company", country: "United Kingdom", flag: "🇬🇧", quote: "Client testimonial goes here.", avatar: "/testimonials/avatar-6.jpg", rating: 5 },
  ],

  pricing: {
    eyebrow: "Pricing",
    heading: "Simple monthly plans",
    subheading: "Management fee only. Ad spend is paid directly to the platforms.",
    defaultCurrency: "USD",
    currencies: [
      { code: "USD", symbol: "$", label: "US Dollar" },
      { code: "GBP", symbol: "£", label: "British Pound" },
      { code: "EUR", symbol: "€", label: "Euro" },
      { code: "BDT", symbol: "৳", label: "Bangladeshi Taka" },
    ],
    // TODO: replace — all prices are placeholders
    tiers: [
      {
        name: "Starter",
        description: "One platform, done properly. For brands testing paid ads.",
        price: { USD: 0, GBP: 0, EUR: 0, BDT: 0 },
        period: "/month",
        adSpendNote: "+ ad spend",
        features: ["1 ad platform", "Up to 2 campaigns", "4 ad creatives / month", "Pixel & tracking setup", "Monthly report"],
        highlighted: false,
        cta: { label: "Start with Starter", href: "#contact" },
      },
      {
        name: "Growth",
        description: "Two platforms with ongoing creative testing. Our most chosen plan.",
        price: { USD: 0, GBP: 0, EUR: 0, BDT: 0 },
        period: "/month",
        adSpendNote: "+ ad spend",
        features: ["2 ad platforms", "Unlimited campaigns", "10 ad creatives / month", "Server-side tracking", "Bi-weekly reports + call", "Landing page tweaks"],
        highlighted: true,
        badge: "Most Popular",
        cta: { label: "Choose Growth", href: "#contact" },
      },
      {
        name: "Scale",
        description: "Full-funnel, multi-platform management for brands ready to scale.",
        price: { USD: 0, GBP: 0, EUR: 0, BDT: 0 },
        period: "/month",
        adSpendNote: "+ ad spend",
        features: ["Meta, TikTok & Google", "Unlimited campaigns", "20+ creatives / month", "Live dashboard", "Weekly calls", "Priority WhatsApp support"],
        highlighted: false,
        cta: { label: "Talk about Scale", href: "#contact" },
      },
    ],
    compare: {
      rows: [
        { feature: "Ad platforms", values: ["1", "2", "3"] },
        { feature: "Campaigns", values: ["Up to 2", "Unlimited", "Unlimited"] },
        { feature: "Ad creatives / month", values: ["4", "10", "20+"] },
        { feature: "Pixel & tracking setup", values: [true, true, true] },
        { feature: "Server-side tracking", values: [false, true, true] },
        { feature: "Landing page optimisation", values: [false, true, true] },
        { feature: "Live dashboard", values: [false, false, true] },
        { feature: "Reporting", values: ["Monthly", "Bi-weekly", "Weekly"] },
        { feature: "Strategy calls", values: [false, "Bi-weekly", "Weekly"] },
        { feature: "WhatsApp support", values: [false, true, "Priority"] },
      ],
    },
    reassurance: "No long-term contracts · Cancel anytime", // TODO: confirm terms
  },

  auditOffer: {
    eyebrow: "Free audit",
    title: "Get a free Meta Ads account audit",
    description: "A recorded walkthrough of your ad account with the three biggest fixes, no strings attached.",
    bullets: [
      "Tracking & pixel health check",
      "Wasted-spend and audience overlap review",
      "Three prioritised fixes you can apply yourself",
    ],
    cta: "Request my free audit",
    budgets: ["Under $1,000 / month", "$1,000 – $5,000 / month", "$5,000 – $20,000 / month", "$20,000+ / month", "Not running ads yet"],
  },

  faqCopy: {
    eyebrow: "FAQ",
    heading: "Questions, answered",
  },
  // TODO: review — answers are placeholders, adjust to your real terms
  faq: [
    { question: "How much should I spend on ads?", answer: "Placeholder answer. Explain your recommended minimum ad budget and why." },
    { question: "How soon will I see results?", answer: "Placeholder answer. Describe the typical learning phase and timelines." },
    { question: "Do you work with clients outside Bangladesh?", answer: "Placeholder answer. Mention clients in the UK, Qatar, Germany and Portugal, and how you handle time zones." },
    { question: "Is there a minimum contract?", answer: "Placeholder answer. State your contract terms." },
    { question: "Do you create the ad creatives?", answer: "Placeholder answer. Explain what creative work is included in each plan." },
    { question: "Who owns the ad accounts?", answer: "Placeholder answer. Clarify account ownership and access." },
    { question: "How do you report on performance?", answer: "Placeholder answer. Describe reports, dashboards and calls." },
  ],

  contactCopy: {
    eyebrow: "Contact",
    heading: "Let's grow your brand",
    subheading: "Tell me a little about your business and I'll come back with honest next steps.",
  },
  // TODO: replace — every contact value below is a placeholder
  contact: {
    email: "hello@example.com",
    whatsapp: "+8800000000000",
    whatsappMessage: "Hi Al Zubaer, I found Commerce Crews and I'd like to talk about my ads.",
    upwork: "https://www.upwork.com/freelancers/your-profile",
    linkedin: "https://www.linkedin.com/in/your-profile",
    facebook: "https://www.facebook.com/your-page",
    instagram: "https://www.instagram.com/your-handle",
    calendly: CALENDLY,
    timezone: "Asia/Dhaka",
    timezoneLabel: "Dhaka",
    responseTime: "I usually reply within 2 hours",
    responseHours: 2,
    budgets: ["Under $1,000 / month", "$1,000 – $5,000 / month", "$5,000 – $20,000 / month", "$20,000+ / month", "Not sure yet"],
  },

  footer: {
    tagline: "Performance marketing for brands that want measurable growth.", // TODO: replace
    builtWith: "Built with ♥ in Dhaka",
  },
};

/* ======================================================================
   Derived helpers
   ====================================================================== */

/** Digits-only WhatsApp number for wa.me links. */
export const whatsappDigits = site.contact.whatsapp.replace(/\D/g, "");

export function whatsappLink(message: string = site.contact.whatsappMessage): string {
  return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
}
