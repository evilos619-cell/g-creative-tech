import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { X, FolderOpen, Loader2, ExternalLink, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PORTFOLIO_CATEGORIES } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — G-Creative Tech" },
      { name: "description", content: "Selected work across web design, branding, social media growth and electronics repair." },
      { property: "og:title", content: "Portfolio — G-Creative Tech" },
      { property: "og:description", content: "Real projects. Real results. See what we've built and repaired." },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

type Item = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  client_name: string | null;
  completed_at: string | null;
  tags: string[] | null;
  category: string;
};

function Portfolio() {
  const [filter, setFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id,title,description,image_url,project_url,client_name,completed_at,tags,portfolio_categories(name)")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        console.error("[portfolio] fetch error:", error.message);
        setItems([]);
      } else {
        setItems(
          (data ?? []).map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            image_url: row.image_url,
            project_url: row.project_url,
            client_name: row.client_name,
            completed_at: row.completed_at,
            tags: row.tags,
            category: row.portfolio_categories?.name ?? "Other",
          })),
        );
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? items : items.filter((p) => p.category === filter)),
    [items, filter],
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

          {loading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading projects…
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-3xl py-20 text-center max-w-xl mx-auto">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-5 text-xl font-bold">No projects yet</h3>
              <p className="mt-2 text-muted-foreground">
                Our admin will publish projects here soon. Check back shortly.
              </p>
            </div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.button
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelected(p)}
                    className="glass rounded-2xl overflow-hidden group text-left hover:border-primary/50 transition-all"
                  >
                    <div className="aspect-video relative bg-gradient-to-br from-primary/30 to-primary-glow/10 grid-bg overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl font-bold gradient-text opacity-30">{p.title.charAt(0)}</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-primary/90 text-primary-foreground px-2 py-1 rounded-full font-bold">{p.category}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                      {p.tags && p.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {p.tags.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

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
              className="glass rounded-3xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/30 to-primary-glow/10 grid-bg flex items-center justify-center mb-6 overflow-hidden">
                {selected.image_url ? (
                  <img src={selected.image_url} alt={selected.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-7xl font-bold gradient-text opacity-30">{selected.title.charAt(0)}</span>
                )}
              </div>
              <span className="text-xs uppercase tracking-widest text-primary font-bold">{selected.category}</span>
              <h3 className="text-2xl font-bold mt-2">{selected.title}</h3>
              {selected.client_name && (
                <p className="mt-1 text-sm text-muted-foreground">Client: <span className="text-foreground">{selected.client_name}</span></p>
              )}
              {selected.completed_at && (
                <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {new Date(selected.completed_at).toLocaleDateString()}
                </p>
              )}
              {selected.description && <p className="mt-3 text-muted-foreground">{selected.description}</p>}
              {selected.tags && selected.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {selected.project_url && (
                  <a href={selected.project_url} target="_blank" rel="noreferrer">
                    <Button variant="hero">Visit project <ExternalLink className="h-4 w-4" /></Button>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
