import { HeroSection } from "@/components/HeroSection";
import { CollectionSection } from "@/components/CollectionSection";
import { AboutSection } from "@/components/AboutSection";
import { useSeo } from "@/hooks/useSeo";

export function HomePage() {
  useSeo("/");

  return (
    <>
      <HeroSection />
      <CollectionSection />
      <AboutSection />
    </>
  );
}
