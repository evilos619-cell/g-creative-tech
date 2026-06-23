import { Link } from "react-router-dom";
import { MapPin, Phone, Send, MessageCircle, Mail, Zap } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24 bg-background/60 backdrop-blur">
      <div className="container mx-auto px-4 lg:px-8 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">G-Creative Tech</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{SITE.tagline}</p>
          <p className="mt-2 text-sm text-muted-foreground">One place. Many solutions. Total satisfaction.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary">Explore</h4>
          <ul className="space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Digital Solutions</li>
            <li>Creative Services</li>
            <li>Social Media Growth</li>
            <li>Electronics Repairs</li>
            <li>SEO & Hosting</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {SITE.phone}</li>
            <li className="flex gap-2"><MessageCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <a href={SITE.whatsapp} className="hover:text-primary">WhatsApp Chat</a>
            </li>
            <li className="flex gap-2"><Send className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <a href={SITE.telegram} className="hover:text-primary">t.me/gcreativetechhimself</a>
            </li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {SITE.email}</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {SITE.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} G-Creative Tech. All rights reserved.
      </div>
    </footer>
  );
}
