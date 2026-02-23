import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const sections = await db.roadSection.findMany({
    include: {
      contractor: { select: { name: true, verified: true } },
      ratings: {
        select: { disputes: { select: { status: true } } },
      },
    },
    orderBy: [
      { avgScore: { sort: "desc", nulls: "last" } },
      { totalRatings: "desc" },
    ],
  });

  return NextResponse.json(sections);
}
