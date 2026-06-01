import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SERVICE_CATEGORIES } from "@/lib/content";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — G-Creative Tech" },
      { name: "description", content: "Digital solutions, creative services, social media growth and electronics repair services. Everything you need, in one place." },
      { property: "og:title", content: "Our Services — G-Creative Tech" },
      { property: "og:description", content: "Four practices, one team. Websites, brands, growth and repairs." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-4 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold">
            Our <span className="gradient-text">services</span>
          </motion.h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Smart solutions across digital, creative, growth and repairs — built around your goals.
          </p>
        </div>

        {/* Quick nav */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 px-4">
          {SERVICE_CATEGORIES.map((c) => (
            <a key={c.slug} href={`#${c.slug}`}>
              <Button variant="glass" size="sm"><c.icon className="h-4 w-4" /> {c.title}</Button>
            </a>
          ))}
        </div>
      </section>

      {SERVICE_CATEGORIES.map((cat, idx) => (
        <section key={cat.slug} id={cat.slug} className={`py-20 ${idx % 2 === 0 ? "bg-background/40" : ""}`}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Category {String(idx + 1).padStart(2, "0")}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
                  <span className={`inline-flex h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} items-center justify-center`}>
                    <cat.icon className="h-6 w-6 text-white" />
                  </span>
                  {cat.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{cat.tagline}</p>
              </div>
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                <Button variant="hero">Get a quote <ArrowRight className="h-4 w-4" /></Button>
              </a>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.services.map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-2xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1"
                >
                  <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {s.benefits.map((b) => (
                      <li key={b} className="text-xs flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />{b}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="mt-5 inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
                    Request service <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass rounded-3xl p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Not sure what you need?</h2>
            <p className="mt-3 text-muted-foreground">Tell us about your project and we'll recommend the right mix.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact"><Button variant="hero" size="lg">Talk to us</Button></Link>
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer"><Button variant="glass" size="lg">WhatsApp</Button></a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
