import React from "react";
import HeroSection from "../components/home/HeroSection";
import ServicesPreview from "../components/home/ServicesPreview";
import AboutSection from "../components/home/AboutSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import InstagramSection from "../components/home/InstagramSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesPreview />
      <AboutSection />
      <TestimonialsSection />
      <InstagramSection />
      <CTASection />
    </div>
  );
}