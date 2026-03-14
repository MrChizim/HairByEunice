import React from "react";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-24 md:py-32 bg-secondary/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src="/images/1773022879971.jpeg"
                alt="Hair by Eunice — women's braids"
                loading="lazy" decoding="async" className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl hidden md:block">
              <p className="font-heading text-3xl font-semibold">5+</p>
              <p className="text-sm text-primary-foreground/80">Years Experience</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-primary text-sm tracking-[0.25em] uppercase mb-3 font-body">
              Meet Your Stylist
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Hello, I'm <span className="italic font-light">Eunice</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm an afro hair specialist based in Liverpool, offering expert braiding
                services for men, women, and kids. I also travel to Walsall and Birmingham
                to serve clients across the Midlands.
              </p>
              <p>
                Whether you're after box braids, knotless braids, cornrows, twists, or
                any other protective style, I bring skill, care, and creativity to every
                appointment.
              </p>
              <p>
                I offer a convenient home service — I come to you, so you can relax in
                your own space. A £15 deposit is required to secure your booking.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-border">
              <div>
                <p className="font-heading text-2xl font-semibold text-foreground">Men</p>
                <p className="text-sm text-muted-foreground">Hair too</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold text-foreground">Women</p>
                <p className="text-sm text-muted-foreground">All styles</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold text-foreground">Kids</p>
                <p className="text-sm text-muted-foreground">Welcome</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}