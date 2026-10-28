import { Header } from "@/components/sections/Header";
import { ScrollSequence } from "@/components/motion/ScrollSequence";
import { Services } from "@/components/sections/Services";
import { Fleet } from "@/components/sections/Fleet";
import { Pricing } from "@/components/sections/Pricing";
import { Contact } from "@/components/sections/Contact";
import { Area } from "@/components/sections/Area";
import { Faq } from "@/components/sections/Faq";
import { TruckDriveBy } from "@/components/sections/TruckDriveBy";
import { QuoteProvider } from "@/components/quote/QuoteContext";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ScrollSequence />
        <Services />
        <Fleet />
        <Area />
        <Faq />
        <QuoteProvider>
          <Pricing />
          <TruckDriveBy>
            <Contact />
          </TruckDriveBy>
        </QuoteProvider>
      </main>
    </>
  );
}
