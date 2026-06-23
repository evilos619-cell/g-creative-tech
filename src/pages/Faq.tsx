import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { FAQ } from "@/lib/content";
import { Button } from "@/components/ui/button";

export default function FaqPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(FAQ.map((f) => f.category)))], []);
  const filtered = useMemo(() => {
    return FAQ.filter((f) => (cat === "All" || f.category === cat) && (
      !q || f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())
    ));
  }, [q, cat]);

  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-4 lg:px-8 text-center max-w-2xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold">
            Frequently <span className="gradient-text">asked</span>
          </motion.h1>
          <p className="mt-6 text-lg text-muted-foreground">Search or browse by category. Can't find your answer? Reach out anytime.</p>

          <div className="mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary border border-border focus:border-primary outline-none"
            />
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  cat === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No matching questions. Try a different search.</p>
            )}
            {filtered.map((f) => (
              <details key={f.q} className="glass rounded-xl p-5 group">
                <summary className="cursor-pointer font-semibold flex items-center justify-between list-none gap-4">
                  <span>{f.q}</span>
                  <span className="text-primary transition-transform group-open:rotate-45 text-2xl leading-none shrink-0">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 glass rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold">Still have questions?</h3>
            <p className="mt-2 text-muted-foreground">Our team usually replies within minutes.</p>
            <Link to="/contact" className="inline-block mt-4">
              <Button variant="hero">Contact support</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
