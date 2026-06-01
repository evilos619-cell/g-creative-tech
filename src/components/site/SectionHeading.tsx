import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-12`}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold leading-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
}
