import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Instagram, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GOLD_FILTER = "brightness(0) saturate(100%) invert(68%) sepia(56%) saturate(500%) hue-rotate(5deg) brightness(95%)";

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPageName]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Home", page: "Home" },
    { name: "Services", page: "Services" },
    { name: "Book Now", page: "BookAppointment" },
  ];

  return (
    <div className="min-h-screen font-body">
      <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between bg-background/80 backdrop-blur-md border border-border/60 rounded-full px-4 py-2.5 shadow-md pointer-events-auto">
          <Link to={createPageUrl("Home")} className="group">
            <img src="/images/logoo.png" alt="Hair by Eunice" className="h-20 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`text-sm font-medium tracking-wide transition-all duration-300 px-4 py-1.5 rounded-full ${
                  link.page === "BookAppointment"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : currentPageName === link.page
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu — detached pill below */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden max-w-6xl mx-auto mt-2 pointer-events-auto"
            >
              <nav className="flex flex-col items-center gap-2 py-4 bg-background/95 backdrop-blur-lg border border-border/60 rounded-3xl shadow-md">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className={`text-base font-medium tracking-wide transition-colors px-8 py-2 rounded-full ${
                      link.page === "BookAppointment"
                        ? "bg-primary text-primary-foreground"
                        : currentPageName === link.page
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <img src="/images/logoo.png" alt="Hair by Eunice" className="h-14 w-auto mb-4" style={{filter: GOLD_FILTER}} />
              <p className="text-background/60 text-sm leading-relaxed">
                Afro hair specialist serving Liverpool, Walsall & Birmingham. Braiding for men, women & kids. Home service available.
              </p>
              <a
                href="https://instagram.com/_hairbyeunicen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-primary text-sm hover:text-primary/80 transition-colors"
              >
                <Instagram size={16} /> @_hairbyeunicen
              </a>
            </div>
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Areas Covered</h4>
              <div className="space-y-2 text-sm text-background/60">
                <p>Liverpool</p>
                <p>Walsall, Birmingham</p>
                <p>Home service available</p>
              </div>
            </div>
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Booking Info</h4>
              <div className="space-y-2 text-sm text-background/60">
                <p>£15 deposit required to secure your appointment</p>
                <p className="pt-2">Instagram: <a href="https://instagram.com/_hairbyeunicen" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@_hairbyeunicen</a></p>
              </div>
            </div>
          </div>
          <div className="border-t border-background/10 mt-12 pt-8 text-center text-xs text-background/40">
            © 2026 Hair by Eunice. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}