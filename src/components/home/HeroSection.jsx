import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/1773022865027.jpeg"
          alt="Hair by Eunice — knotless braids"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <p className="text-primary/80 text-sm tracking-[0.3em] uppercase mb-4 font-body">
            Afro Hair Specialist · Liverpool · Walsall · Birmingham
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-semibold text-white leading-[1.1] mb-6">
            Braids &amp;{" "}
            <span className="italic font-light text-primary">Beyond</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md font-body font-light">
            Expert afro hairstylist specialising in braiding for men, women &amp; kids.
            Home service available. £15 deposit to book.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={createPageUrl("BookAppointment")}
              className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-primary/90 transition-all duration-300 group"
            >
              Book Your Appointment
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={createPageUrl("Services")}
              className="inline-flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-white/10 transition-all duration-300"
            >
              View Services
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}