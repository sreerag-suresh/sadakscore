import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { processUpload } from "@/lib/upload";

const bodySchema = z.object({
  state: z.string().min(1, "State is required").max(100),
  district: z.string().min(1, "District is required").max(100),
  roadType: z.string().min(1, "Road type is required").max(100),
  roadName: z.string().min(1, "Road name is required").max(300),
  section: z.string().max(300).optional(),
  score: z.coerce.number().int().min(0).max(10),
  notes: z.string().max(2000).optional(),
  contractorName: z.string().max(300).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse({
    state: formData.get("state"),
    district: formData.get("district"),
    roadType: formData.get("roadType"),
    roadName: formData.get("roadName"),
    section: formData.get("section") || undefined,
    score: formData.get("score"),
    notes: formData.get("notes") || undefined,
    contractorName: formData.get("contractorName") || undefined,
    latitude: formData.get("latitude") ?? undefined,
    longitude: formData.get("longitude") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { state, district, roadType, roadName, section, score, notes, contractorName, latitude, longitude } = parsed.data;

  // Build section name from roadName + section
  const sectionName = section ? `${roadName} — ${section}` : roadName;

  // Find existing section by name (case-insensitive) or create it
  let roadSection = await db.roadSection.findFirst({
    where: { name: { equals: sectionName, mode: "insensitive" } },
  });

  if (!roadSection) {
    roadSection = await db.roadSection.create({
      data: {
        name: sectionName,
        state,
        district,
        city: district,
        roadType,
      },
    });
  }

  const sectionId = roadSection.id;

  // If a contractor name was provided, link it
  if (contractorName && !roadSection.contractorId) {
    const contractor = await db.contractor.findFirst({
      where: { name: { equals: contractorName, mode: "insensitive" } },
    });
    if (contractor) {
      await db.roadSection.update({
        where: { id: sectionId },
        data: { contractorId: contractor.id },
      });
    }
  }

  // Handle optional photo upload
  let photoUrl: string | null = null;
  let gpsLat = latitude ?? null;
  let gpsLon = longitude ?? null;

  const photoFile = formData.get("photo");
  if (photoFile instanceof File && photoFile.size > 0) {
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const result = await processUpload(buffer, photoFile.name);
    photoUrl = result.url;
    if (result.latitude != null) gpsLat = result.latitude;
    if (result.longitude != null) gpsLon = result.longitude;
  }

  // Create rating and update section aggregate in a transaction
  const rating = await db.$transaction(async (tx) => {
    const newRating = await tx.rating.create({
      data: {
        userId,
        sectionId,
        score,
        notes: notes ?? null,
        photoUrl,
        latitude: gpsLat,
        longitude: gpsLon,
      },
    });

    const agg = await tx.rating.aggregate({
      where: { sectionId },
      _avg: { score: true },
      _count: { score: true },
    });

    await tx.roadSection.update({
      where: { id: sectionId },
      data: {
        avgScore: agg._avg.score,
        totalRatings: agg._count.score,
      },
    });

    return newRating;
  });

  revalidatePath("/browse");
  revalidatePath(`/browse/${sectionId}`);
  revalidatePath("/leaderboard");

  return NextResponse.json(rating, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sectionId = searchParams.get("sectionId");

  const ratings = await db.rating.findMany({
    where: sectionId ? { sectionId } : undefined,
    include: {
      user: { select: { name: true } },
      disputes: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(ratings);
}
