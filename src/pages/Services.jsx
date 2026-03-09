import React, { useState } from "react";
import { entities } from "@/api/entities";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ServiceCard from "../components/services/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";

export const FALLBACK_SERVICES = [
  { id: "f1",  name: "Box Braids (Medium)",      description: "Classic medium-sized box braids",               price: 120, duration: 300, category: "braids" },
  { id: "f2",  name: "Box Braids (Small)",        description: "Small, neat box braids",                        price: 150, duration: 360, category: "braids" },
  { id: "f3",  name: "Knotless Braids (Medium)",  description: "Lightweight knotless braids, medium size",      price: 130, duration: 300, category: "braids" },
  { id: "f4",  name: "Knotless Braids (Small)",   description: "Lightweight knotless braids, small size",       price: 160, duration: 360, category: "braids" },
  { id: "f5",  name: "Goddess Braids",            description: "Bohemian style with curly ends",                price: 140, duration: 300, category: "braids" },
  { id: "f6",  name: "Fulani Braids",             description: "Traditional Fulani style with beads",           price: 130, duration: 270, category: "braids" },
  { id: "f7",  name: "Cornrows (Simple)",         description: "Straight-back cornrows",                        price: 50,  duration: 90,  category: "cornrows" },
  { id: "f8",  name: "Cornrows (Design)",         description: "Cornrows with curved or geometric patterns",    price: 80,  duration: 150, category: "cornrows" },
  { id: "f9",  name: "Feed-in Cornrows",          description: "Natural-looking feed-in cornrow style",         price: 70,  duration: 120, category: "cornrows" },
  { id: "f10", name: "Passion Twists",            description: "Bohemian passion twists",                       price: 110, duration: 270, category: "twists" },
  { id: "f11", name: "Senegalese Twists",         description: "Sleek and neat Senegalese rope twists",         price: 120, duration: 300, category: "twists" },
  { id: "f12", name: "Marley Twists",             description: "Full and voluminous Marley twists",             price: 100, duration: 240, category: "twists" },
  { id: "f13", name: "Men's Cornrows",            description: "Cornrow styles for men",                        price: 40,  duration: 60,  category: "men" },
  { id: "f14", name: "Men's Box Braids",          description: "Box braids for men",                            price: 80,  duration: 180, category: "men" },
  { id: "f15", name: "Kids' Cornrows",            description: "Fun cornrow styles for children",               price: 35,  duration: 60,  category: "kids" },
  { id: "f16", name: "Kids' Box Braids",          description: "Box braids for children",                       price: 60,  duration: 150, category: "kids" },
  { id: "f17", name: "Kids' Twists",              description: "Twist styles for children",                     price: 50,  duration: 120, category: "kids" },
];

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "braids", label: "Braids" },
  { key: "cornrows", label: "Cornrows" },
  { key: "twists", label: "Twists" },
  { key: "men", label: "Men" },
  { key: "kids", label: "Kids" },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const data = await entities.Service.list();
        return data.length > 0 ? data : FALLBACK_SERVICES;
      } catch {
        return FALLBACK_SERVICES;
      }
    },
  });

  const filtered = activeCategory === "all"
    ? services
    : services.filter((s) => s.category === activeCategory);

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm tracking-[0.25em] uppercase mb-3">
            Our Menu
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-semibold text-foreground mb-4">
            Services & <span className="italic font-light">Pricing</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Braiding services for men, women &amp; kids. Home service available across Liverpool, Walsall &amp; Birmingham. £15 deposit required to secure your booking.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No services in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        )}

        {/* Note */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-accent/50 rounded-2xl px-8 py-6 max-w-lg">
            <p className="text-sm text-accent-foreground leading-relaxed">
              <strong>£15 Deposit Required:</strong> A non-refundable £15 deposit is needed to secure your appointment. This goes towards the cost of your service. Find us on Instagram: <a href="https://instagram.com/_hairbyeunicen" target="_blank" rel="noopener noreferrer" className="font-semibold underline">@_hairbyeunicen</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}