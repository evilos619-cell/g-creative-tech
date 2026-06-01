import {
  Globe, Palette, TrendingUp, Wrench, ShoppingCart, Server, Search, Settings,
  Image, Layout, FileText, CreditCard, Megaphone, Users, BarChart3, Sparkles,
  Tv, Speaker, Volume2, Sun, Fan, Lightbulb, Zap, Cog,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  description: string;
  benefits: string[];
};

export type ServiceCategory = {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  services: Service[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "digital",
    title: "Digital Solutions",
    tagline: "Websites, hosting, SEO & online visibility",
    icon: Globe,
    color: "from-emerald-400 to-lime-500",
    services: [
      { slug: "website-design", title: "Website Design", icon: Layout, description: "Pixel-perfect, conversion-focused designs tailored to your brand.", benefits: ["Custom UI/UX", "Mobile-first", "Brand-aligned"] },
      { slug: "website-development", title: "Website Development", icon: Globe, description: "Fast, secure, scalable websites using modern frameworks.", benefits: ["Lightning fast", "SEO-ready", "Secure"] },
      { slug: "landing-pages", title: "Landing Pages", icon: FileText, description: "High-converting landing pages for campaigns and launches.", benefits: ["A/B ready", "Conversion focused", "Quick delivery"] },
      { slug: "ecommerce", title: "E-commerce Websites", icon: ShoppingCart, description: "Online stores that turn browsers into buyers.", benefits: ["Secure checkout", "Inventory tools", "Payment gateways"] },
      { slug: "domain-hosting", title: "Domain & Hosting", icon: Server, description: "Domain registration and reliable managed hosting.", benefits: ["99.9% uptime", "Free SSL", "Daily backups"] },
      { slug: "seo", title: "SEO Optimization", icon: Search, description: "Rank higher on Google with proven SEO strategies.", benefits: ["Keyword research", "On-page SEO", "Performance tuning"] },
      { slug: "maintenance", title: "Website Maintenance", icon: Settings, description: "Keep your site fast, secure and always up to date.", benefits: ["Security patches", "Performance", "Monitoring"] },
    ],
  },
  {
    slug: "creative",
    title: "Creative Services",
    tagline: "Branding, design & visual identity",
    icon: Palette,
    color: "from-sky-400 to-blue-500",
    services: [
      { slug: "logo-design", title: "Logo Design", icon: Sparkles, description: "Memorable logos that capture your brand essence.", benefits: ["Unique concepts", "Multiple revisions", "All formats"] },
      { slug: "branding", title: "Brand Identity", icon: Palette, description: "Complete brand systems including colors, typography & guidelines.", benefits: ["Style guide", "Brand kit", "Consistency"] },
      { slug: "flyer-design", title: "Flyer & Poster Design", icon: Image, description: "Eye-catching flyers and posters for any campaign.", benefits: ["Print-ready", "Quick turnaround", "Custom layouts"] },
      { slug: "banner-design", title: "Banner & Ad Design", icon: Megaphone, description: "Web banners and ads that drive clicks.", benefits: ["All sizes", "Animated options", "On-brand"] },
      { slug: "business-cards", title: "Business Cards", icon: CreditCard, description: "Professional business cards that make an impression.", benefits: ["Premium quality", "Print-ready", "Unique designs"] },
      { slug: "presentations", title: "Presentation Design", icon: FileText, description: "Pitch decks and presentations that win.", benefits: ["Pitch-ready", "Engaging visuals", "Editable templates"] },
      { slug: "ui-ux", title: "UI/UX Design", icon: Layout, description: "User-first interface design for apps and websites.", benefits: ["User research", "Prototyping", "Design systems"] },
    ],
  },
  {
    slug: "social",
    title: "Social Media Growth",
    tagline: "Build audiences that convert",
    icon: TrendingUp,
    color: "from-pink-400 to-rose-500",
    services: [
      { slug: "account-management", title: "Account Management", icon: Users, description: "Full management of your social accounts.", benefits: ["Daily activity", "Community mgmt", "Reporting"] },
      { slug: "content-creation", title: "Content Creation", icon: Image, description: "Scroll-stopping posts, reels and graphics.", benefits: ["Trend-aware", "On-brand", "Engagement first"] },
      { slug: "growth", title: "Social Media Growth", icon: TrendingUp, description: "Real, organic audience growth.", benefits: ["Organic strategies", "Analytics", "Real followers"] },
      { slug: "ads", title: "Ad Campaigns", icon: Megaphone, description: "Meta, TikTok & Google ads that perform.", benefits: ["Audience targeting", "Optimization", "ROI focused"] },
      { slug: "analytics", title: "Analytics & Reporting", icon: BarChart3, description: "Clear insights on what's working.", benefits: ["Monthly reports", "KPIs", "Growth roadmap"] },
      { slug: "influencer", title: "Influencer Outreach", icon: Users, description: "Connect with influencers in your niche.", benefits: ["Vetted creators", "Negotiation", "Campaign mgmt"] },
    ],
  },
  {
    slug: "repairs",
    title: "Electronics Repairs",
    tagline: "Expert diagnostics, fast turnaround",
    icon: Wrench,
    color: "from-orange-400 to-amber-500",
    services: [
      { slug: "tv-repairs", title: "LED TV & Monitor Repairs", icon: Tv, description: "Screen, board and power repairs for all major brands.", benefits: ["Genuine parts", "Free diagnostics", "Warranty"] },
      { slug: "speaker-repairs", title: "Speaker Repairs", icon: Speaker, description: "Home, bluetooth and PA speaker repair.", benefits: ["All brands", "Quick fix", "Affordable"] },
      { slug: "amplifier-repairs", title: "Amplifier Repairs", icon: Volume2, description: "Power amps, mixers and audio systems.", benefits: ["Expert techs", "Component-level", "Tested results"] },
      { slug: "inverter-repairs", title: "Solar Inverter Repairs", icon: Sun, description: "Solar inverters, chargers and battery systems.", benefits: ["Solar specialists", "Charger fixes", "Battery testing"] },
      { slug: "fan-repairs", title: "Fan Repairs (AC/DC)", icon: Fan, description: "Standing, ceiling and rechargeable fans.", benefits: ["Motor rewinding", "Quick service", "Affordable"] },
      { slug: "touchlight-repairs", title: "Rechargeable Light Repairs", icon: Lightbulb, description: "Touch lights, lanterns and LED bulbs.", benefits: ["LED replacement", "Battery service", "Fast"] },
      { slug: "diagnostics", title: "Electrical Diagnostics", icon: Zap, description: "Pro diagnostics for any electronic fault.", benefits: ["Pro tools", "Honest pricing", "Full report"] },
      { slug: "maintenance-svc", title: "Maintenance Services", icon: Cog, description: "Regular maintenance keeps things running.", benefits: ["Scheduled visits", "Preventive care", "Long lifespan"] },
    ],
  },
];

export const TEAM = [
  { name: "Godwin C.", role: "Founder & Lead Engineer", initials: "GC" },
  { name: "Ada O.", role: "Creative Director", initials: "AO" },
  { name: "Tomi A.", role: "Social Growth Lead", initials: "TA" },
  { name: "Emeka N.", role: "Senior Repair Technician", initials: "EN" },
  { name: "Chiamaka U.", role: "Web Developer", initials: "CU" },
  { name: "David K.", role: "Brand Designer", initials: "DK" },
];

export const TESTIMONIALS = [
  { name: "Mrs. Adeola", role: "Boutique Owner", quote: "G-Creative Tech built my online store in a week. Sales doubled in the first month.", rating: 5 },
  { name: "Mr. Ibrahim", role: "Church Pastor", quote: "They fixed our amplifier and PA when no one else could. Total professionals.", rating: 5 },
  { name: "Chika E.", role: "Skincare Brand", quote: "My Instagram grew from 800 to 12k organic followers in 3 months.", rating: 5 },
  { name: "Engr. Bayo", role: "Solar Installer", quote: "They repaired three inverters our supplier said were dead. Saved us a fortune.", rating: 5 },
  { name: "Linda T.", role: "Restaurant Owner", quote: "Beautiful logo, beautiful flyers, beautiful website. One stop, zero stress.", rating: 5 },
  { name: "Tunde A.", role: "Event Planner", quote: "Fast delivery, fair pricing, premium quality. Now my go-to for everything tech.", rating: 5 },
];

export const FAQ = [
  { category: "General", q: "Where are you located?", a: "We are based at Chief Obi Agbor Compound, Primary School, Etomi. We serve clients globally online." },
  { category: "General", q: "What services do you offer?", a: "Digital solutions, creative services, social media growth, and electronics repair — all under one roof." },
  { category: "General", q: "How do I get a quote?", a: "Call/WhatsApp 07062431475 or use our contact form. We reply within minutes during business hours." },
  { category: "Web", q: "How long does a website take?", a: "Most websites are delivered in 5–14 days depending on scope. Landing pages can ship in 48 hours." },
  { category: "Web", q: "Do you provide hosting and domain?", a: "Yes — we register domains and provide managed hosting with free SSL and daily backups." },
  { category: "Web", q: "Will my website rank on Google?", a: "Every site we ship includes on-page SEO. We also offer dedicated SEO packages for higher rankings." },
  { category: "Creative", q: "How many logo revisions do I get?", a: "Unlimited revisions until you're 100% happy with your final logo." },
  { category: "Creative", q: "Can I get print-ready files?", a: "Yes — every design comes in print-ready (CMYK, PDF) and web-ready (RGB, PNG) formats." },
  { category: "Repairs", q: "Do you offer free diagnostics?", a: "Yes — bring your device in for free diagnostics. You only pay if you approve the repair." },
  { category: "Repairs", q: "How long do repairs take?", a: "Most repairs are completed within 24–72 hours depending on parts availability." },
  { category: "Repairs", q: "Do repairs come with a warranty?", a: "Yes, all our repairs come with a 30-day workmanship warranty." },
  { category: "Social", q: "Do you guarantee follower growth?", a: "We guarantee real, organic engagement and growth. No bots — ever." },
];

export const PORTFOLIO = [
  { id: 1, title: "Bella Boutique E-commerce", category: "Web", description: "A modern online store for a fashion boutique with full payment integration.", tags: ["E-commerce", "React", "Payments"] },
  { id: 2, title: "Sunrise Solar Branding", category: "Branding", description: "Complete brand identity for a renewable energy startup.", tags: ["Logo", "Brand Kit", "Print"] },
  { id: 3, title: "Skincare Instagram Growth", category: "Social", description: "0 → 12k organic followers in 90 days for a Lagos skincare brand.", tags: ["Growth", "Content", "Reels"] },
  { id: 4, title: "Vintage Amplifier Restoration", category: "Repair", description: "Restored a 1980s amplifier to factory performance.", tags: ["Audio", "Restoration"] },
  { id: 5, title: "FreshFruit Landing Page", category: "Web", description: "High-converting landing page for a fresh produce delivery startup.", tags: ["Landing", "Conversion"] },
  { id: 6, title: "Church PA System Repair", category: "Repair", description: "Diagnosed and repaired a complete PA + amplifier setup.", tags: ["Audio", "Diagnostics"] },
  { id: 7, title: "Restaurant Brand & Flyers", category: "Branding", description: "Logo, menu and flyer design for a new restaurant launch.", tags: ["Logo", "Print"] },
  { id: 8, title: "Solar Inverter Recovery", category: "Repair", description: "Recovered 3 'dead' inverters for a solar installation company.", tags: ["Solar", "Inverter"] },
  { id: 9, title: "Tech Founder Portfolio", category: "Web", description: "Personal portfolio site for a tech founder with blog and case studies.", tags: ["Portfolio", "Blog"] },
];

export const PORTFOLIO_CATEGORIES = ["All", "Web", "Branding", "Social", "Repair"] as const;

export const STATS = [
  { label: "Projects Delivered", value: 320 },
  { label: "Happy Clients", value: 180 },
  { label: "Devices Repaired", value: 540 },
  { label: "Years Experience", value: 7 },
];

export const PROCESS = [
  { step: "01", title: "Discover", description: "We listen to your goals, challenges and vision." },
  { step: "02", title: "Design", description: "We craft a plan and design that fits your brand." },
  { step: "03", title: "Deliver", description: "We build, ship and refine until you're thrilled." },
  { step: "04", title: "Support", description: "Ongoing support, maintenance and growth." },
];
