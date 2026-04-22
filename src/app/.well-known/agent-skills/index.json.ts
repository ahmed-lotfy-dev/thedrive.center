import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  const skillsIndex = {
    $schema: "https://agentskills.io/v0.2.0/skills-schema.json",
    skills: [
      {
        name: "car-inspection",
        type: "service",
        description: "Schedule and manage car inspections (فحص السيارات)",
        url: `${siteUrl}/docs/api`,
      },
      {
        name: "wheel-alignment",
        type: "service",
        description: "Schedule wheel alignment service (ضبط الزوايا)",
        url: `${siteUrl}/docs/api`,
      },
      {
        name: "tire-balancing",
        type: "service",
        description: "Schedule tire balancing and rotation (ترصيص العجلات)",
        url: `${siteUrl}/docs/api`,
      },
    ],
  };

  return new Response(JSON.stringify(skillsIndex, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}