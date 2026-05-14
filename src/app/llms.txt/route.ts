import { getSafeSiteUrl } from "@/lib/site-url";

export async function GET() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  const content = `# The Drive Center
> Precision automotive inspection, wheel alignment & tire balancing in El-Mahalla El-Kubra, Egypt

## About
The Drive Center is a specialized automotive service center offering comprehensive pre-purchase vehicle inspection (3 devices), computerized wheel alignment, tire balancing, and power steering coding. Located in El-Mahalla El-Kubra, Gharbia Governorate.

## Services
- [Comprehensive Pre-Purchase Inspection](${siteUrl}/fahs) — Full vehicle inspection using paint gauge, UV scanner, and diagnostic computer before buying or selling
- [Computerized Wheel Alignment](${siteUrl}/zawaiya) — Precision wheel alignment (ضبط زوايا كمبيوتر) for stability and tire life
- [Tire Balancing](${siteUrl}/tarses) — Professional tire balancing and truing (ترصيص واتزان)
- [Power Steering Coding](${siteUrl}/book) — Steering system coding and programming

## Pages
- [Home](${siteUrl}/)
- [Book Appointment](${siteUrl}/book)
- [Service Gallery](${siteUrl}/cars)
- [FAQ](${siteUrl}/faq)

## Tech Stack
Next.js, React, TypeScript, TailwindCSS, Drizzle ORM, PostgreSQL, S3-compatible storage

## Contact
- Phone: +201017131414
- Address: منشية البكري ٨ شارع طلعت النجار, المحلة الكبرى, الغربية, Egypt
`;

  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
