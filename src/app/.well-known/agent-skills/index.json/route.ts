import { createHash } from "node:crypto";

import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function GET() {
  const siteUrl = getSafeSiteUrl(
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center",
  );

  const baseSkills = [
    {
      name: "car-inspection",
      type: "service",
      description: "Schedule and manage car inspections (فحص السيارات)",
      url: `${siteUrl}/docs/api#car-inspection`,
    },
    {
      name: "wheel-alignment",
      type: "service",
      description: "Schedule wheel alignment service (ضبط الزوايا)",
      url: `${siteUrl}/docs/api#wheel-alignment`,
    },
    {
      name: "tire-balancing",
      type: "service",
      description: "Schedule tire balancing and rotation (ترصيص العجلات)",
      url: `${siteUrl}/docs/api#tire-balancing`,
    },
  ];

  const skillsIndex = {
    $schema: "https://agentskills.io/v0.2.0/skills-schema.json",
    skills: baseSkills.map((skill) => ({
      ...skill,
      sha256: sha256(`${skill.name}:${skill.type}:${skill.description}:${skill.url}`),
    })),
  };

  return Response.json(skillsIndex, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
