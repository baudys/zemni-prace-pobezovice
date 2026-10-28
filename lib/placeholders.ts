export function showPlaceholders(): boolean {
  if (process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "1") return true;
  return process.env.NODE_ENV === "development";
}
