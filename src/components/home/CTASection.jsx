import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/1773022870971.jpeg"
          alt="Hair by Eunice — men's cornrows"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto px-6 text-center"
      >
        <img
          src="/images/logoo.png"
          alt="Hair by Eunice"
          className="h-16 w-auto mx-auto mb-8"
          style={{filter: "brightness(0) saturate(100%) invert(68%) sepia(56%) saturate(500%) hue-rotate(5deg) brightness(95%)"}}

        />
        <h2 className="font-heading text-4xl md:text-5xl font-semibold text-white mb-6">
          Ready for Your <span className="italic font-light">Transformation?</span>
        </h2>
        <p className="text-white/70 mb-10 leading-relaxed">
          Book your appointment today and experience the difference 
          of personalised, luxury hair care.
        </p>
        <Link
          to={createPageUrl("BookAppointment")}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-primary/90 transition-all duration-300 group"
        >
          Book Now
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}