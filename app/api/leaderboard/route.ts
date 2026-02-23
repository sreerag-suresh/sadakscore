import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const contractors = await db.contractor.findMany({
    include: {
      sections: {
        select: { avgScore: true, totalRatings: true },
      },
    },
  });

  const entries = contractors
    .map((c) => {
      const ratedSections = c.sections.filter((s) => s.avgScore != null);
      const avgScore =
        ratedSections.length > 0
          ? ratedSections.reduce((sum, s) => sum + s.avgScore!, 0) / ratedSections.length
          : null;
      const totalRatings = c.sections.reduce((sum, s) => sum + s.totalRatings, 0);

      return {
        id: c.id,
        name: c.name,
        license: c.license,
        verified: c.verified,
        avgScore,
        totalRatings,
        totalSections: c.sections.length,
      };
    })
    .filter((c) => c.avgScore != null)
    .sort((a, b) => b.avgScore! - a.avgScore!);

  return NextResponse.json(entries);
}
