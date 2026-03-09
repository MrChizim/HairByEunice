import React from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const INSTAGRAM_HANDLE = "_hairbyeunicen";
const INSTAGRAM_URL = "https://instagram.com/_hairbyeunicen";

// Curated Unsplash photos showing braiding styles — replace with real Instagram embeds
// once connected via Instagram Basic Display API or a widget service
const GALLERY_IMAGES = [
  { src: "/images/1773022865027.jpeg", alt: "Knotless braids diamond pattern" },
  { src: "/images/1773022879971.jpeg", alt: "Women's box braids" },
  { src: "/images/1773022916152.jpeg", alt: "Men's cornrows" },
  { src: "/images/1773022844860.jpeg", alt: "Men's cornrow waves" },
  { src: "/images/1773022888835.jpeg", alt: "Men's twists" },
  { src: "/images/1773022896806.jpeg", alt: "Starter locs" },
];

export default function InstagramSection() {
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm tracking-[0.25em] uppercase mb-3 font-body">
            Follow Along
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Our <span className="italic font-light">Gallery</span>
          </h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            <Instagram size={16} />
            @{INSTAGRAM_HANDLE}
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group relative aspect-square overflow-hidden rounded-xl block"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center">
                <Instagram
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:bg-foreground/80 transition-colors"
          >
            <Instagram size={16} />
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
