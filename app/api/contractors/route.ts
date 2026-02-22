import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  license: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  contactEmail: z.email().optional().or(z.literal("")),
  website: z.url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { name, license, description, contactEmail, website } = parsed.data;

  // Check for duplicate license
  const existing = await db.contractor.findUnique({ where: { license } });
  if (existing) {
    return NextResponse.json(
      { error: "A contractor with this license number already exists." },
      { status: 409 }
    );
  }

  const contractor = await db.contractor.create({
    data: {
      name,
      license,
      description: description ?? null,
      contactEmail: contactEmail || null,
      website: website || null,
    },
  });

  return NextResponse.json(contractor, { status: 201 });
}

export async function GET() {
  const contractors = await db.contractor.findMany({
    include: {
      _count: { select: { sections: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(contractors);
}
