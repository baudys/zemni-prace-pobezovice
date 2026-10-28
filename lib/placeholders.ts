export function showPlaceholders(): boolean {
  if (process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "1") return true;
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") return true;
  return process.env.NODE_ENV === "development";
}

export function isPlaceholderPhotoPath(src: string): boolean {
  return src.includes("/photos/placeholder/");
}
