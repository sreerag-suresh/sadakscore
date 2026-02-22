import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { processUpload } from "@/lib/upload";

const bodySchema = z.object({
  // Accepts either a cuid (existing section) or a plain name (auto-creates section)
  sectionName: z.string().min(1, "Section name is required").max(300),
  score: z.coerce.number().int().min(1).max(5),
  notes: z.string().max(1000).optional(),
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
    sectionName: formData.get("sectionId"), // field name kept for form compat
    score: formData.get("score"),
    notes: formData.get("notes") ?? undefined,
    latitude: formData.get("latitude") ?? undefined,
    longitude: formData.get("longitude") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { sectionName, score, notes, latitude, longitude } = parsed.data;

  // Find existing section by name (case-insensitive) or create it on the fly
  let section = await db.roadSection.findFirst({
    where: { name: { equals: sectionName, mode: "insensitive" } },
  });

  if (!section) {
    section = await db.roadSection.create({
      data: { name: sectionName },
    });
  }

  const sectionId = section.id;

  // Handle optional photo upload
  let photoUrl: string | null = null;
  let gpsLat = latitude ?? null;
  let gpsLon = longitude ?? null;

  const photoFile = formData.get("photo");
  if (photoFile instanceof File && photoFile.size > 0) {
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const result = await processUpload(buffer, photoFile.name);
    photoUrl = result.url;
    // Prefer EXIF GPS over manually entered coordinates
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

    // Recompute aggregate score for this section
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

  // Bust the Next.js cache for pages that display this data
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
