import { site } from "@/content/site";
import { PriceTag } from "@/components/ui/PriceTag";
import { TextureBackground } from "@/components/motion/TextureBackground";

export function Pricing() {
  return (
    <TextureBackground
      id="cenik"
      desktop="/textures/rubble-bricks.webp"
      mobile="/textures/rubble-bricks-mobile.webp"
      className="py-20 md:py-28"
      parallax={false}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="hazard-stripe mb-8 max-w-xs" />
        <h2 className="font-display text-4xl uppercase md:text-6xl">Ceník</h2>
        <p className="mt-3 max-w-2xl text-white/80">{site.pricingDisclaimer}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.pricing.map((item) => (
            <PriceTag
              key={item.id}
              title={item.title}
              amountExVat={item.amountExVat}
              unit={item.unit}
              note={"note" in item ? item.note : undefined}
              from={"from" in item ? item.from : false}
              badge={"badge" in item ? item.badge : undefined}
              customLabel={"customLabel" in item ? item.customLabel : undefined}
            />
          ))}
        </div>
      </div>
    </TextureBackground>
  );
}
