import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Quote, Star, Play } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TESTIMONIALS, STATS } from "@/lib/content";
import { Counter } from "@/components/site/Counter";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — G-Creative Tech" },
      { name: "description", content: "Real reviews and success stories from G-Creative Tech clients across web, branding, growth and repair work." },
      { property: "og:title", content: "Client Testimonials — G-Creative Tech" },
      { property: "og:description", content: "Loved by clients across boutiques, churches, restaurants and tech startups." },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: Testimonials,
});

function Testimonials() {
  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-4 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold">
            Client <span className="gradient-text">love</span>
          </motion.h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hundreds of satisfied clients. Here's what a few of them have to say.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text"><Counter to={s.value} /></div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <Quote className="h-7 w-7 text-primary opacity-60 mb-2" />
                <p className="leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video placeholders */}
      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Video stories" title={<>Hear it <span className="gradient-text">directly</span></>} />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/30 to-primary-glow/10 relative flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">Client story #{i}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Coming soon — full video testimonial.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
