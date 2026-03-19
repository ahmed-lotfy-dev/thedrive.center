export function isComingSoonModeEnabled() {
  return (
    process.env.NEXT_PUBLIC_COMING_SOON_MODE === "true" ||
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
  );
}

export function isMaintenanceModeEnabled() {
  return process.env.NEXT_PUBLIC_SITE_MAINTENANCE_MODE === "true";
}

export function getComingSoonLaunchDate() {
  return (
    process.env.NEXT_PUBLIC_COMING_SOON_LAUNCH ||
    process.env.NEXT_PUBLIC_MAINTENANCE_LAUNCH ||
    "2026-03-21T07:00:00+02:00"
  );
}

export function isSiteStateScreenEnabled() {
  return isComingSoonModeEnabled() || isMaintenanceModeEnabled();
}
