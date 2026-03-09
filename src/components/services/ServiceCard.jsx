import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

export default function ServiceCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
            {service.name}
          </h3>
          {service.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {service.description}
            </p>
          )}
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <p className="font-heading text-2xl font-semibold text-foreground">
            £{service.price}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Clock size={14} />
          <span>{service.duration} mins</span>
        </div>
        <Link
          to={createPageUrl("BookAppointment") + `?service=${service.id}`}
          className="inline-flex items-center gap-1.5 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          Book <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}