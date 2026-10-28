import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { ScrollSequence } from "@/components/motion/ScrollSequence";
import { Services } from "@/components/sections/Services";
import { Fleet } from "@/components/sections/Fleet";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Area } from "@/components/sections/Area";
import { Gallery } from "@/components/sections/Gallery";
import { Faq } from "@/components/sections/Faq";
import { TruckDriveBy } from "@/components/sections/TruckDriveBy";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollSequence />
        <Services />
        <Fleet />
        <HowItWorks />
        <Pricing />
        <Area />
        <Gallery />
        <Faq />
        <TruckDriveBy />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
