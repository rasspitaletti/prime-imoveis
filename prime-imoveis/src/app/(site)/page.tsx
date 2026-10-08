import { Hero } from "@/components/home/hero";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { Categories } from "@/components/home/categories";
import { AboutSection, Differentials } from "@/components/home/about";
import { Opportunities } from "@/components/home/opportunities";
import { RegionsSection } from "@/components/home/regions";
import { TestimonialsSection } from "@/components/home/testimonials";
import { FinalCTA } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <Categories />
      <AboutSection />
      <Differentials />
      <Opportunities />
      <RegionsSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
