import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Award, Users, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TEAM, STATS, TIMELINE } from "@/lib/content";
import { Counter } from "@/components/site/Counter";

const VALUES = [
  { icon: Heart, title: "Integrity", desc: "Honest pricing, honest timelines, honest results." },
  { icon: Award, title: "Excellence", desc: "We obsess over quality — from a logo curve to a code line." },
  { icon: Users, title: "Partnership", desc: "Your success is our success. We're invested in your growth." },
  { icon: Target, title: "Impact", desc: "Every project must move the needle for our client." },
];

export default function About() {
  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-4 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold"
          >
            Built on craft. <br /><span className="gradient-text">Driven by results.</span>
          </motion.h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            G-Creative Tech is a complete tech hub helping businesses build, grow and shine — both online and offline.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Our Mission", desc: "To make world-class technology, creativity and repair services accessible to every business — big or small." },
            { icon: Eye, title: "Our Vision", desc: "To be Africa's most trusted tech hub: one place for every digital and electronic need." },
          ].map((m) => (
            <div key={m.title} className="glass rounded-2xl p-8">
              <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                <m.icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{m.title}</h2>
              <p className="mt-3 text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="What we stand for" title={<>Our <span className="gradient-text">core values</span></>} />
          <div className="grid md:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <v.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Crew */}
      <section className="py-20 bg-background/40">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="Leadership"
            title={<>Meet the <span className="gradient-text">crew</span></>}
            description="The leadership driving G-Creative Tech forward."
          />
          <div className="grid md:grid-cols-1 max-w-3xl mx-auto gap-6">
            {TEAM.map((m, i) => (
              <motion.article
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-3xl p-6 md:p-10 grid md:grid-cols-[260px_1fr] gap-8 items-center"
              >
                <div className="relative mx-auto md:mx-0">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/40 to-primary-glow/20 blur-xl opacity-70" />
                  <img
                    src={m.photo}
                    alt={`${m.name} — ${m.position}`}
                    loading="lazy"
                    className="relative h-56 w-56 md:h-60 md:w-60 rounded-3xl object-cover border-2 border-primary/40 glow-ring"
                  />
                </div>
                <div className="text-center md:text-left">
                  <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">
                    {m.position}
                  </span>
                  <h3 className="mt-2 text-2xl md:text-3xl font-bold">{m.name}</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{m.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text">
                <Counter to={s.value} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why trust us */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Why clients trust us" title={<>Trust, <span className="gradient-text">earned daily</span></>} />
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "Transparent pricing — no hidden fees",
              "30-day workmanship warranty on repairs",
              "Free diagnostics before every repair",
              "Genuine, original parts only",
              "Unlimited revisions on design work",
              "Responsive 24/7 support",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 glass rounded-xl p-4">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background/40">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <SectionHeading eyebrow="Our journey" title={<>The G-Creative <span className="gradient-text">timeline</span></>} />
          <div className="relative pl-8 border-l-2 border-primary/30 space-y-10">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={`${t.year}-${t.title}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <div className="absolute -left-[37px] h-4 w-4 rounded-full bg-primary glow-ring animate-pulse" />
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-primary font-bold tracking-widest">{t.year}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold">{t.title}</h3>
                <p className="text-muted-foreground mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass rounded-3xl p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Let's build something <span className="gradient-text">amazing</span></h2>
            <p className="mt-3 text-muted-foreground">Tell us what you need — we'll handle the rest.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact"><Button variant="hero" size="lg">Start a project</Button></Link>
              <Link to="/services"><Button variant="glass" size="lg">Our services</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
