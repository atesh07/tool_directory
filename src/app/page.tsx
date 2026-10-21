import type { Metadata } from "next";
import HeroSection from "./Sections/HeroSection/HeroSection";
import PopularTools from "./Sections/PopularTools/PopularTools";
import Tutorial from "./Sections/Tutorial/Tutorial";
import Faq from "./Sections/Faq/Faq";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <main id="main-content">
      <HeroSection />
      <PopularTools />
      <Tutorial />
      <Faq />
    </main>
  );
}
