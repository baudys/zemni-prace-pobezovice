/** Střed obce (WGS84). Používá se jen jako bod na mapě oblasti. */
export type AreaPoint = {
  lat: number;
  lng: number;
};

export const AREA_ORIGIN = "Poběžovice";

/** Poloměry od Poběžovic, v kilometrech. */
export const AREA_RINGS_KM = [10, 25, 50] as const;

/**
 * Souřadnice obcí z `site.towns`. Středy sídel na Domažlicku a v okolí.
 * Všeruby = Všeruby u Domažlic, Rybník = Rybník v okrese Domažlice, Bor = Bor u Tachova.
 */
export const areaCoordinates: Record<string, AreaPoint> = {
  Poběžovice: { lat: 49.51028, lng: 12.80222 },
  Hostouň: { lat: 49.55944, lng: 12.77139 },
  "Horšovský Týn": { lat: 49.52972, lng: 12.94417 },
  "Bělá nad Radbuzou": { lat: 49.59139, lng: 12.71306 },
  Domažlice: { lat: 49.44056, lng: 12.92972 },
  Kdyně: { lat: 49.39056, lng: 13.03972 },
  Holýšov: { lat: 49.59361, lng: 13.10139 },
  Staňkov: { lat: 49.55361, lng: 13.07056 },
  Přimda: { lat: 49.67472, lng: 12.67361 },
  Bor: { lat: 49.71139, lng: 12.77528 },
  Stod: { lat: 49.63917, lng: 13.16472 },
  Stříbro: { lat: 49.75306, lng: 13.00417 },
  Tachov: { lat: 49.79528, lng: 12.63361 },
  Klatovy: { lat: 49.39556, lng: 13.295 },
  "Klenčí pod Čerchovem": { lat: 49.435, lng: 12.81444 },
  "Česká Kubice": { lat: 49.36861, lng: 12.85639 },
  Koloveč: { lat: 49.48694, lng: 13.10917 },
  Všeruby: { lat: 49.33806, lng: 12.98694 },
  "Kout na Šumavě": { lat: 49.39944, lng: 13.00278 },
  Meclov: { lat: 49.50528, lng: 12.87306 },
  Mutěnín: { lat: 49.545, lng: 12.74111 },
  Rybník: { lat: 49.51278, lng: 12.67694 },
  Trhanov: { lat: 49.41972, lng: 12.84583 },
  Blížejov: { lat: 49.5, lng: 12.98889 },
};
