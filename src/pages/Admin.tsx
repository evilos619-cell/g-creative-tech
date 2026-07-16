import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Briefcase, Sparkles, MessageSquare, Users, Inbox,
  LogOut, Loader2, Plus, Trash2, Save, Edit3, CheckCircle2, Circle, Clock, X, Menu,
  Sun, Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FileUpload } from "@/components/site/FileUpload";

const IMAGE_FIELDS = new Set(["image_url", "photo_url", "logo_url", "avatar_url", "cover_url"]);

type Tab = "overview" | "portfolio" | "projects" | "testimonials" | "team" | "requests" | "messages";

export default function Admin() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('gct_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch { return 'dark'; }
  });

  // apply theme to document and persist
  useEffect(() => {
    try {
      const doc = document.documentElement;
      if (theme === 'dark') doc.classList.add('dark'); else doc.classList.remove('dark');
      localStorage.setItem('gct_theme', theme);
    } catch {
      // ignore in SSR/test
    }
  }, [theme]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then((res: any) => {
      if (!active) return;
      if (!res.data?.session) {
        navigate("/auth");
        return;
      }
      setEmail(res.data.session.user.email ?? "");
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event: any) => {
      if (event === "SIGNED_OUT") navigate("/auth");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading dashboard…
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "projects", label: "Recent Projects", icon: Sparkles },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "team", label: "Team", icon: Users },
    { id: "requests", label: "Service Requests", icon: Inbox },
    { id: "messages", label: "Contact Messages", icon: Inbox },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Admin <span className="gradient-text">dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-secondary hover:bg-secondary/90">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/90"
            title="Toggle dark / light"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/"><Button variant="glass" size="sm">View site</Button></Link>
          <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Desktop / md+ sidebar */}
        <aside className="glass rounded-2xl p-3 h-fit lg:sticky lg:top-24 hidden md:block">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile slide-over sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="glass w-72 p-3 m-4 rounded-2xl overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Menu</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full bg-secondary"><X className="h-4 w-4" /></button>
              </div>
              <nav className="flex flex-col gap-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTab(t.id); setSidebarOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      tab === t.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <t.icon className="h-4 w-4" /> {t.label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="min-w-0">
          {tab === "overview" && <Overview />}
          {tab === "portfolio" && <PortfolioManager />}
          {tab === "projects" && <ProjectsManager />}
          {tab === "testimonials" && <TestimonialsManager />}
          {tab === "team" && <TeamManager />}
          {tab === "requests" && <ServiceRequestsManager />}
          {tab === "messages" && <ContactMessagesManager />}
        </main>
      </div>
    </div>
  );
}

/* ------------------------ Overview ------------------------ */
function Overview() {
  const [stats, setStats] = useState({
    portfolio: 0, projects: 0, testimonials: 0, team: 0, requests: 0, messages: 0,
  });
  useEffect(() => {
    (async () => {
      const map: Record<string, string> = {
        portfolio: "portfolio_items",
        projects: "recent_projects",
        testimonials: "testimonials",
        team: "team_members",
        requests: "service_requests",
        messages: "contact_messages",
      };
      const result: any = {};
      for (const key of Object.keys(map)) {
        const { count } = await supabase.from(map[key]).select("*", { count: "exact", head: true });
        result[key] = count ?? 0;
      }
      setStats(result);
    })();
  }, []);
  const cards = [
    { label: "Portfolio items", value: stats.portfolio },
    { label: "Recent projects", value: stats.projects },
    { label: "Testimonials", value: stats.testimonials },
    { label: "Team members", value: stats.team },
    { label: "Open requests", value: stats.requests },
    { label: "Contact messages", value: stats.messages },
  ];
  return (
    <Section title="Overview" subtitle="Quick snapshot of your content.">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <div className="text-3xl font-bold gradient-text">{c.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------ Portfolio ------------------------ */
function PortfolioManager() {
  const [items, setItems] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: itemsData }, { data: catsData }] = await Promise.all([
      supabase.from("portfolio_items").select("*").order("created_at", { ascending: false }),
      supabase.from("portfolio_categories").select("*").order("name"),
    ]);
    setItems(itemsData ?? []);
    setCats(catsData ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (form: any) => {
    const payload = {
      title: form.title?.trim(),
      description: form.description?.trim() || null,
      category_id: form.category_id || null,
      image_url: form.image_url || null,
      project_url: form.project_url || null,
      client_name: form.client_name?.trim() || null,
      completed_at: form.completed_at || null,
      tags: form.tags ? form.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : null,
      published: !!form.published,
    };
    const { error } = editing?.id
      ? await supabase.from("portfolio_items").update(payload).eq("id", editing.id)
      : await supabase.from("portfolio_items").insert(payload);
    if (error) return alert(error.message);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this portfolio item?")) return;
    await supabase.from("portfolio_items").delete().eq("id", id);
    load();
  };

  return (
    <Section
      title="Portfolio"
      subtitle="Manage portfolio items shown on /portfolio."
      action={<Button variant="hero" size="sm" onClick={() => setEditing({})}><Plus className="h-4 w-4" /> New item</Button>}
    >
      <CategoryEditor cats={cats} onChange={load} />
      {loading ? <LoadingRow /> : items.length === 0 ? <EmptyRow label="No portfolio items yet." /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((i) => (
            <div key={i.id} className="glass rounded-2xl p-4">
              {i.image_url && <img src={i.image_url} alt={i.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-semibold truncate">{i.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{i.description}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${i.published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {i.published ? "Live" : "Draft"}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="glass" onClick={() => setEditing(i)}><Edit3 className="h-3 w-3" /> Edit</Button>
                <Button size="sm" variant="outline" onClick={() => remove(i.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit portfolio item" : "New portfolio item"}>
          <PortfolioForm item={editing} cats={cats} onSave={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </Section>
  );
}

function CategoryEditor({ cats, onChange }: { cats: any[]; onChange: () => void }) {
  const [name, setName] = useState("");
  const add = async () => {
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { error } = await supabase.from("portfolio_categories").insert({ name: name.trim(), slug });
    if (error) return alert(error.message);
    setName(""); onChange();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await supabase.from("portfolio_categories").delete().eq("id", id);
    onChange();
  };
  return (
    <div className="glass rounded-2xl p-4 mb-6">
      <h4 className="font-semibold mb-3 text-sm uppercase tracking-widest text-muted-foreground">Categories</h4>
      <div className="flex flex-wrap gap-2 mb-3">
        {cats.map((c) => (
          <span key={c.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm">
            {c.name}
            <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive ml-1"><X className="h-3 w-3" /></button>
          </span>
        ))}
        {cats.length === 0 && <span className="text-sm text-muted-foreground">No categories yet.</span>}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border outline-none focus:border-primary text-sm" />
        <Button size="sm" variant="hero" onClick={add}><Plus className="h-3 w-3" /> Add</Button>
      </div>
    </div>
  );
}

function PortfolioForm({ item, cats, onSave, onCancel }: any) {
  const [form, setForm] = useState({
    title: item.title ?? "",
    description: item.description ?? "",
    category_id: item.category_id ?? "",
    image_url: item.image_url ?? "",
    project_url: item.project_url ?? "",
    client_name: item.client_name ?? "",
    completed_at: item.completed_at?.slice(0, 10) ?? "",
    tags: (item.tags ?? []).join(", "),
    published: item.published ?? true,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <FormField label="Title *"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></FormField>
      <FormField label="Category">
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls}>
          <option value="">— None —</option>
          {cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </FormField>
      <FormField label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} /></FormField>
      <FormField label="Image">
        <FileUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="portfolio" />
      </FormField>
      <FormField label="Project URL"><input value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} className={inputCls} placeholder="https://..." /></FormField>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Client name"><input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Completed"><input type="date" value={form.completed_at} onChange={(e) => setForm({ ...form, completed_at: e.target.value })} className={inputCls} /></FormField>
      </div>
      <FormField label="Tags (comma-separated)"><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} /></FormField>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
      </label>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="hero" size="sm"><Save className="h-3 w-3" /> Save</Button>
      </div>
    </form>
  );
}

/* ------------------------ Recent Projects ------------------------ */
function ProjectsManager() {
  return (
    <SimpleCrud
      title="Recent Projects"
      subtitle="Shown on the home page 'Recent projects' section."
      table="recent_projects"
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "category", label: "Category" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image_url", label: "Image URL" },
        { name: "published", label: "Published", type: "checkbox", defaultValue: true },
      ]}
      renderItem={(i) => (
        <>
          {i.image_url && <img src={i.image_url} alt={i.title} className="w-full h-28 object-cover rounded-lg mb-3" />}
          <h4 className="font-semibold">{i.title}</h4>
          <p className="text-xs text-muted-foreground">{i.category}</p>
        </>
      )}
    />
  );
}

/* ------------------------ Testimonials ------------------------ */
function TestimonialsManager() {
  return (
    <SimpleCrud
      title="Testimonials"
      subtitle="Client testimonial cards shown on /testimonials and the home page."
      table="testimonials"
      orderBy="created_at"
      fields={[
        { name: "client_name", label: "Client name", required: true },
        { name: "role", label: "Role / company" },
        { name: "quote", label: "Quote", type: "textarea", required: true },
        { name: "rating", label: "Rating (1–5)", type: "number", defaultValue: 5 },
        { name: "logo_url", label: "Logo URL" },
        { name: "enabled", label: "Enabled", type: "checkbox", defaultValue: true },
      ]}
      renderItem={(i) => (
        <>
          <h4 className="font-semibold">{i.client_name}</h4>
          <p className="text-xs text-muted-foreground">{i.role}</p>
          <p className="text-sm mt-2 line-clamp-3">"{i.quote}"</p>
        </>
      )}
    />
  );
}

/* ------------------------ Team ------------------------ */
function TeamManager() {
  return (
    <SimpleCrud
      title="Team"
      subtitle="Public site shows published members on /about. Currently only the CEO is published by default."
      table="team_members"
      orderBy="sort_order"
      fields={[
        { name: "name", label: "Full name", required: true },
        { name: "position", label: "Position", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "photo_url", label: "Photo URL" },
        { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
        { name: "published", label: "Published on site", type: "checkbox", defaultValue: false },
      ]}
      renderItem={(i) => (
        <div className="flex items-center gap-3">
          {i.photo_url ? (
            <img src={i.photo_url} alt={i.name} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-secondary" />
          )}
          <div className="min-w-0">
            <h4 className="font-semibold truncate">{i.name}</h4>
            <p className="text-xs text-muted-foreground truncate">{i.position}</p>
          </div>
        </div>
      )}
    />
  );
}

/* ------------------------ Service Requests ------------------------ */
function ServiceRequestsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false });
    setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const setStatus = async (id: string, status: string) => {
    await supabase.from("service_requests").update({ status }).eq("id", id); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    await supabase.from("service_requests").delete().eq("id", id); load();
  };
  const STATUS_ICON: any = { pending: Circle, in_progress: Clock, completed: CheckCircle2 };
  return (
    <Section title="Service Requests" subtitle="Requests submitted via the contact form.">
      {loading ? <LoadingRow /> : items.length === 0 ? <EmptyRow label="No service requests yet." /> : (
        <div className="space-y-3">
          {items.map((r) => {
            const Icon = STATUS_ICON[r.status] ?? Circle;
            return (
              <div key={r.id} className="glass rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${r.status === "completed" ? "text-primary" : r.status === "in_progress" ? "text-amber-400" : "text-muted-foreground"}`} />
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">{r.status.replace("_", " ")}</span>
                    </div>
                    <h4 className="font-semibold">{r.name} <span className="text-muted-foreground font-normal">• {r.service ?? "General"}</span></h4>
                    <p className="text-xs text-muted-foreground">{r.email}{r.phone && ` • ${r.phone}`} • {new Date(r.created_at).toLocaleString()}</p>
                    <p className="mt-2 text-sm whitespace-pre-wrap">{r.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "pending")}>Pending</Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "in_progress")}>In progress</Button>
                    <Button size="sm" variant="hero" onClick={() => setStatus(r.id, "completed")}>Completed</Button>
                    <Button size="sm" variant="outline" onClick={() => remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

/* ------------------------ Contact Messages ------------------------ */
function ContactMessagesManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const toggleRead = async (id: string, read: boolean) => {
    await supabase.from("contact_messages").update({ read: !read }).eq("id", id); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id); load();
  };
  return (
    <Section title="Contact Messages" subtitle="Direct messages from the contact form.">
      {loading ? <LoadingRow /> : items.length === 0 ? <EmptyRow label="No contact messages yet." /> : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className={`glass rounded-2xl p-5 ${!m.read && "border-primary/50"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold">{m.name} {!m.read && <span className="text-xs text-primary">• new</span>}</h4>
                  <p className="text-xs text-muted-foreground">{m.email} • {new Date(m.created_at).toLocaleString()}</p>
                  {m.subject && <p className="mt-1 text-sm font-medium">Subject: {m.subject}</p>}
                  <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleRead(m.id, m.read)}>{m.read ? "Mark unread" : "Mark read"}</Button>
                  <Button size="sm" variant="outline" onClick={() => remove(m.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ------------------------ Generic CRUD helper ------------------------ */
type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox";
  required?: boolean;
  defaultValue?: any;
};

function SimpleCrud({
  title, subtitle, table, fields, renderItem, orderBy = "created_at",
}: {
  title: string;
  subtitle: string;
  table: string;
  fields: FieldDef[];
  renderItem: (item: any) => ReactNode;
  orderBy?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select("*").order(orderBy, { ascending: false });
    setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, [table]);

  const save = async (form: any) => {
    const payload: any = {};
    fields.forEach((f) => {
      let v = form[f.name];
      if (f.type === "number") v = v === "" ? null : Number(v);
      if (f.type === "checkbox") v = !!v;
      if (v === "") v = null;
      payload[f.name] = v;
    });
    const { error } = editing?.id
      ? await supabase.from(table).update(payload).eq("id", editing.id)
      : await supabase.from(table).insert(payload);
    if (error) return alert(error.message);
    setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from(table).delete().eq("id", id); load();
  };

  const initial = () => {
    const o: any = {};
    fields.forEach((f) => (o[f.name] = f.defaultValue ?? (f.type === "checkbox" ? false : "")));
    return o;
  };

  return (
    <Section title={title} subtitle={subtitle} action={<Button variant="hero" size="sm" onClick={() => setEditing(initial())}><Plus className="h-4 w-4" /> New</Button>}>
      {loading ? <LoadingRow /> : items.length === 0 ? <EmptyRow label="Nothing yet — click 'New' to add the first one." /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((i) => (
            <div key={i.id} className="glass rounded-2xl p-4">
              {renderItem(i)}
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="glass" onClick={() => setEditing(i)}><Edit3 className="h-3 w-3" /> Edit</Button>
                <Button size="sm" variant="outline" onClick={() => remove(i.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? `Edit ${title}` : `New ${title}`}>
          <GenericForm fields={fields} item={editing} onSave={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </Section>
  );
}

function GenericForm({ fields, item, onSave, onCancel }: { fields: FieldDef[]; item: any; onSave: (v: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState<any>(() => {
    const o: any = {};
    fields.forEach((f) => {
      let v = item[f.name];
      if (v === null || v === undefined) v = f.defaultValue ?? (f.type === "checkbox" ? false : "");
      o[f.name] = v;
    });
    return o;
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      {fields.map((f) => (
        <FormField key={f.name} label={f.label + (f.required ? " *" : "")}>
          {IMAGE_FIELDS.has(f.name) ? (
            <FileUpload value={form[f.name] ?? ""} onChange={(url) => setForm({ ...form, [f.name]: url })} folder={f.name.replace(/_url$/, "")} />
          ) : f.type === "textarea" ? (
            <textarea required={f.required} rows={3} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />
          ) : f.type === "checkbox" ? (
            <label className="flex items-center gap-2 text-sm pt-2">
              <input type="checkbox" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} /> Yes
            </label>
          ) : (
            <input required={f.required} type={f.type ?? "text"} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />
          )}
        </FormField>
      ))}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="hero" size="sm"><Save className="h-3 w-3" /> Save</Button>
      </div>
    </form>
  );
}

/* ------------------------ UI helpers ------------------------ */
const inputCls = "w-full px-3 py-2 rounded-lg bg-secondary border border-border outline-none focus:border-primary text-sm";

function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
function Modal({ children, title, onClose }: { children: ReactNode; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass rounded-3xl max-w-lg w-full p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function LoadingRow() { return <div className="flex items-center justify-center py-12 text-muted-foreground gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Loading…</div>; }
function EmptyRow({ label }: { label: string }) { return <div className="glass rounded-2xl py-12 text-center text-muted-foreground">{label}</div>; }
