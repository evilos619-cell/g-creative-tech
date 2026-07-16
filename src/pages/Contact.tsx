import { motion } from "framer-motion";
import { useState } from "react";
import { Phone, Mail, MessageCircle, Send, MapPin, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const service = String(data.get("service") ?? "");
    const message = String(data.get("message") ?? "");

    try {
      TableSchemas["service_requests"].parse({ name, email, phone: phone || null, service: service || null, message });
    } catch (err: any) {
      setError(err.errors ? err.errors.map((e: any) => e.message).join("\n") : err.message);
      setLoading(false);
      return;
    }
    const { error: dbError } = await supabase.from("service_requests").insert({
      name, email, phone: phone || null, service: service || null, message, status: "pending",
    } as any);
    if (dbError) {
      setError("Couldn't save your request, but we can still route it to WhatsApp.");
      console.error(dbError);
    }

    const text = `Hello G-Creative Tech!%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0AService: ${encodeURIComponent(service)}%0A%0A${encodeURIComponent(message)}`;
    window.open(`${SITE.whatsapp}?text=${text}`, "_blank");
    setLoading(false);
    setSent(true);
    form.reset();
  };

  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-4 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold">
            Let's <span className="gradient-text">talk</span>
          </motion.h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us about your project, repair, or idea. We typically respond within minutes.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-3 gap-6">
          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: Phone, label: "Call us", value: SITE.phone, href: `tel:${SITE.phone}` },
              { icon: MessageCircle, label: "WhatsApp", value: SITE.phone, href: SITE.whatsapp },
              { icon: Send, label: "Telegram", value: "t.me/gcreativetechhimself", href: SITE.telegram },
              { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
              { icon: MapPin, label: "Visit us", value: SITE.address },
              { icon: Clock, label: "Hours", value: "Mon–Sat • 9:00 AM – 7:00 PM" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href ?? "#"}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="glass rounded-xl p-4 flex items-start gap-3 hover:border-primary/50 transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                  <div className="font-medium break-words">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold">Send a message</h2>
            <p className="text-muted-foreground mt-1">We'll route your message straight to our WhatsApp for the fastest reply.</p>

            <form onSubmit={onSubmit} className="mt-6 grid sm:grid-cols-2 gap-4">
              <Field name="name" label="Your name" required />
              <Field name="email" label="Email" type="email" required />
              <Field name="phone" label="Phone" />
              <Field name="service" label="Service" placeholder="e.g. Website, Repair, Branding..." />
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="mt-1 w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                  placeholder="Tell us a bit about what you need..."
                />
              </div>
              {error && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3">{error}</p>
                </div>
              )}
              <div className="sm:col-span-2 flex items-center gap-3 justify-end">
                {sent && <span className="text-primary text-sm">Opened in WhatsApp ✓</span>}
                <Button variant="hero" type="submit" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <>Send via WhatsApp <Send className="h-4 w-4" /></>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass rounded-2xl overflow-hidden">
            <iframe
              title="G-Creative Tech location"
              src="https://www.google.com/maps?q=Etomi&output=embed"
              className="w-full h-[420px] border-0 grayscale-[0.3] contrast-110"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ name, label, type = "text", placeholder, required }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}{required && " *"}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
      />
    </div>
  );
}
