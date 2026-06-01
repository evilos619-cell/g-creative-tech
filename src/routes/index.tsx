import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Zap, Truck, BadgeCheck, Award,
  Star, Quote, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Counter } from "@/components/site/Counter";
import { SERVICE_CATEGORIES, STATS, PROCESS, TESTIMONIALS, FAQ, PORTFOLIO } from "@/lib/content";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "G-Creative Tech — Innovate. Create. Repair. Grow." },
      { name: "description", content: "Your one-stop hub for tech, creativity, growth & repairs. Smart solutions. Real results." },
      { property: "og:title", content: "G-Creative Tech" },
      { property: "og:description", content: "Digital solutions, creative services, social media growth and electronics repairs — all in one place." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl animate-pulse" />

        <div className="container relative mx-auto px-4 lg:px-8 pt-24 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" /> Quality you can trust
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            Your one-stop hub for<br />
            <span className="gradient-text glow-text">tech, creativity</span><br />
            <span className="text-foreground">growth &amp; repairs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {SITE.tagline} We build websites, grow brands, design visuals and revive electronics — all under one roof.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <Link to="/contact"><Button variant="hero" size="lg">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/services"><Button variant="glass" size="lg">Explore Services</Button></Link>
            <a href={SITE.whatsapp} target="_blank" rel="noreferrer"><Button variant="outline" size="lg">Request Quote</Button></a>
          </motion.div>

          {/* Floating badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { icon: ShieldCheck, label: "Expert Technicians" },
              { icon: BadgeCheck, label: "Genuine Parts" },
              { icon: Truck, label: "Fast Delivery" },
              { icon: Award, label: "Affordable Prices" },
              { icon: CheckCircle2, label: "100% Satisfaction" },
            ].map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="glass rounded-xl p-3 flex flex-col items-center gap-2"
              >
                <b.icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium text-center">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-border bg-background/40">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-6xl font-bold gradient-text">
                <Counter to={s.value} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="Why choose us"
            title={<>Smart solutions. <span className="gradient-text">Real results.</span></>}
            description="We combine engineering precision with creative flair to deliver work that moves the needle."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Fast turnaround", desc: "Most projects ship in days, not months. Repairs in 24–72 hours." },
              { icon: ShieldCheck, title: "Quality guaranteed", desc: "Every deliverable is QA-tested and backed by a workmanship warranty." },
              { icon: Sparkles, title: "All under one roof", desc: "Websites, branding, growth and repairs — one team, one invoice." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-24 bg-background/40">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="What we do"
            title={<>Featured <span className="gradient-text">services</span></>}
            description="Four powerhouse practices, one creative team."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-8 group hover:border-primary/50 transition-all relative overflow-hidden"
              >
                <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-25 transition-opacity blur-2xl`} />
                <div className={`relative h-14 w-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-5`}>
                  <cat.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">{cat.title}</h3>
                <p className="mt-2 text-muted-foreground">{cat.tagline}</p>
                <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
                  {cat.services.slice(0, 6).map((s) => (
                    <li key={s.slug} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-muted-foreground">{s.title}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/services" className="mt-6 inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="Our process"
            title={<>How we <span className="gradient-text">work</span></>}
            description="A proven four-step process that turns your idea into reality."
          />
          <div className="grid md:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative glass rounded-2xl p-6"
              >
                <div className="text-6xl font-bold gradient-text opacity-80">{p.step}</div>
                <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="py-24 bg-background/40">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="Selected work"
            title={<>Recent <span className="gradient-text">projects</span></>}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {PORTFOLIO.slice(0, 6).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer hover:border-primary/50 transition-all"
              >
                <div className="aspect-video relative bg-gradient-to-br from-primary/30 to-primary-glow/10 grid-bg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold gradient-text opacity-30">{p.title.charAt(0)}</span>
                  </div>
                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-primary/90 text-primary-foreground px-2 py-1 rounded-full font-bold">{p.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/portfolio"><Button variant="glass">View full portfolio <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="Loved by clients"
            title={<>What clients <span className="gradient-text">say</span></>}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 6).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-6"
              >
                <Quote className="h-7 w-7 text-primary mb-3 opacity-70" />
                <p className="text-foreground/90 leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 border-y border-border bg-background/40">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">Trusted by many clients</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
            {["Bella Boutique","Sunrise Solar","FreshFruit","Vintage Audio","TechWave","SkinPro"].map((p) => (
              <span key={p} className="font-display font-semibold text-lg text-muted-foreground hover:text-primary transition-colors">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title={<>Quick <span className="gradient-text">answers</span></>}
          />
          <div className="space-y-3">
            {FAQ.slice(0, 5).map((f) => (
              <details key={f.q} className="glass rounded-xl p-5 group">
                <summary className="cursor-pointer font-semibold flex items-center justify-between list-none">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground text-sm">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq"><Button variant="glass"><Search className="h-4 w-4" /> All FAQs</Button></Link>
          </div>
        </div>
      </section>

      {/* CONTACT BANNER */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold">Ready to <span className="gradient-text">grow</span> with us?</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Let's discuss your project. Get a free quote within minutes.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/contact"><Button variant="hero" size="lg">Contact Us</Button></Link>
                <a href={SITE.whatsapp} target="_blank" rel="noreferrer"><Button variant="glass" size="lg">WhatsApp Now</Button></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
          <h3 className="text-2xl md:text-3xl font-bold">Stay in the loop</h3>
          <p className="mt-2 text-muted-foreground">Tips, offers, and free resources — straight to your inbox.</p>
          <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }} className="mt-6 flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-lg bg-secondary border border-border px-4 py-3 outline-none focus:border-primary"
            />
            <Button variant="hero" type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
}
