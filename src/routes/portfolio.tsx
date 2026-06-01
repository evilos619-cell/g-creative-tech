import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PORTFOLIO, PORTFOLIO_CATEGORIES } from "@/lib/content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — G-Creative Tech" },
      { name: "description", content: "Selected work across web, branding, social media growth and electronics repair." },
      { property: "og:title", content: "Portfolio — G-Creative Tech" },
      { property: "og:description", content: "Real projects. Real results. See what we've built and repaired." },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

function Portfolio() {
  const [filter, setFilter] = useState<(typeof PORTFOLIO_CATEGORIES)[number]>("All");
  const [selected, setSelected] = useState<typeof PORTFOLIO[0] | null>(null);

  const items = useMemo(
    () => (filter === "All" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-4 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold">
            Our <span className="gradient-text">portfolio</span>
          </motion.h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            From websites to vintage amp restorations — a sample of the work we love.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PORTFOLIO_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  filter === c
                    ? "bg-primary text-primary-foreground border-primary glow-ring"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((p) => (
                <motion.button
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelected(p)}
                  className="glass rounded-2xl overflow-hidden group text-left hover:border-primary/50 transition-all"
                >
                  <div className="aspect-video relative bg-gradient-to-br from-primary/30 to-primary-glow/10 grid-bg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold gradient-text opacity-30">{p.title.charAt(0)}</span>
                    </div>
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-primary/90 text-primary-foreground px-2 py-1 rounded-full font-bold">{p.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Before & After repair gallery */}
      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Repair gallery" title={<>Before &amp; <span className="gradient-text">after</span></>} />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Amplifier restoration" },
              { label: "Solar inverter recovery" },
              { label: "PA system overhaul" },
            ].map((r) => (
              <div key={r.label} className="glass rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-destructive/30 to-destructive/10 flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">Before</div>
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/40 to-primary-glow/20 flex items-center justify-center text-xs uppercase tracking-widest text-primary">After</div>
                </div>
                <h3 className="mt-4 font-semibold">{r.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Brought back to factory-fresh performance.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl max-w-2xl w-full p-8 relative"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/30 to-primary-glow/10 grid-bg flex items-center justify-center mb-6">
                <span className="text-7xl font-bold gradient-text opacity-30">{selected.title.charAt(0)}</span>
              </div>
              <span className="text-xs uppercase tracking-widest text-primary font-bold">{selected.category}</span>
              <h3 className="text-2xl font-bold mt-2">{selected.title}</h3>
              <p className="mt-3 text-muted-foreground">{selected.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.tags.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">{t}</span>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="hero">Start a similar project</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
