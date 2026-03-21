export function getSafeSiteUrl(raw: string | undefined) {
  const value = raw?.trim();
  if (!value) return "https://example.com";

  const normalized =
    value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://${value}`;

  try {
    return new URL(normalized).toString().replace(/\/$/, "");
  } catch {
    return "https://example.com";
  }
}
