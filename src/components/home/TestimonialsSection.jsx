import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Tasha O.",
    text: "Eunice did my knotless braids and they came out absolutely stunning. She came to my house which was so convenient. Will definitely be booking again!",
    rating: 5,
  },
  {
    name: "Dami A.",
    text: "Best braider in Liverpool, hands down. She did my daughter's hair and was so patient and gentle. The results were beautiful.",
    rating: 5,
  },
  {
    name: "Marcus B.",
    text: "Got my cornrows done by Eunice and the finish was so clean. She really knows what she's doing. Home service is a massive bonus too.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.25em] uppercase mb-3 font-body">
            Kind Words
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground">
            What Clients <span className="italic font-light">Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 text-sm">
                "{t.text}"
              </p>
              <p className="font-heading text-lg font-semibold text-foreground">
                {t.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}