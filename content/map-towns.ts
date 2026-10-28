export type MapTown = {
  name: string;
  lat: number;
  lng: number;
  hq?: boolean;
  fullName?: string;
};

export function mapTownLabel(town: MapTown) {
  return town.fullName ?? town.name;
}

/** Towns shown as markers on the area Leaflet map (within ~50 km of HQ). */
export const mapTowns: MapTown[] = [
  { name: "Poběžovice", lat: 49.5107, lng: 12.8028, hq: true },
  { name: "Hostouň", lat: 49.5594, lng: 12.7711 },
  { name: "Horšovský Týn", lat: 49.5297, lng: 12.9442 },
  { name: "Holýšov", lat: 49.5936, lng: 13.1014 },
  { name: "Domažlice", lat: 49.4405, lng: 12.9272 },
  { name: "Koloveč", lat: 49.4868, lng: 13.1088 },
  { name: "Bor", lat: 49.7117, lng: 12.775 },
  { name: "Přimda", lat: 49.6747, lng: 12.6736 },
  { name: "Bělá n. R.", lat: 49.5914, lng: 12.7125, fullName: "Bělá nad Radbuzou" },
  { name: "Česká Kubice", lat: 49.3703, lng: 12.8497 },
  { name: "Kdyně", lat: 49.3906, lng: 13.0397 },
];

export const mapRingsKm = [10, 25, 50] as const;

/**
 * Orientační km jedním směrem od Poběžovic — hint u slideru dopravy v ceníku.
 * Hodnoty zaokrouhlené na silniční odhad (ne vzdušnou čarou).
 */
export const distanceLandmarks: ReadonlyArray<{ km: number; label: string }> = [
  { km: 6, label: "Hostouň" },
  { km: 10, label: "Bělá nad Radbuzou" },
  { km: 13, label: "Domažlice" },
  { km: 15, label: "Horšovský Týn" },
  { km: 18, label: "Kdyně" },
  { km: 20, label: "Přimda" },
  { km: 22, label: "Bor" },
  { km: 25, label: "Holýšov" },
  { km: 32, label: "Stod" },
  { km: 40, label: "Tachov" },
  { km: 45, label: "Stříbro" },
  { km: 50, label: "Klatovy" },
];

export function landmarkForKm(km: number): string | null {
  const hit = distanceLandmarks.find((l) => l.km === km);
  return hit ? hit.label : null;
}
