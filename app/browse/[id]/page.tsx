import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import ScoreBadge from "@/components/ui/ScoreBadge";
import DisputeBadge from "@/components/ui/DisputeBadge";

export const dynamic = "force-dynamic";

async function getSection(id: string) {
  return db.roadSection.findUnique({
    where: { id },
    include: {
      contractor: { select: { id: true, name: true, verified: true } },
      ratings: {
        include: {
          user: { select: { name: true } },
          disputes: { select: { id: true, status: true, reason: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export default async function RoadSectionPage({
  params,
}: {
  params: { id: string };
}) {
  const section = await getSection(params.id);
  if (!section) notFound();

  const hasPendingDispute = section.ratings.some(
    (r) => r.disputes.some((d) => d.status === "PENDING")
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/browse"
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors"
      >
        ← Back to browse
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{section.name}</h1>
          <p className="mt-1 text-sm text-stone-400">
            {[section.state, section.district, section.roadType].filter(Boolean).join(" · ")}
            {section.contractor && (
              <>
                {" · "}
                <Link
                  href={`/contractor/${section.contractor.id}`}
                  className="underline underline-offset-2 hover:text-stone-700"
                >
                  {section.contractor.name}
                </Link>
                {section.contractor.verified && (
                  <span className="ml-1 inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">✓ Verified</span>
                )}
              </>
            )}
          </p>
          {section.description && (
            <p className="mt-3 text-sm text-stone-500">{section.description}</p>
          )}
        </div>
        {section.avgScore != null && (
          <ScoreBadge score={section.avgScore} size="lg" showLabel />
        )}
      </div>

      {/* Dispute callout */}
      {hasPendingDispute && (
        <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4">
          <p className="text-sm font-medium text-amber-800">⚠ This road section has disputed ratings</p>
          <p className="mt-1 text-xs text-amber-600">
            One or more ratings on this section have been disputed by a contractor and are under review.
          </p>
        </div>
      )}

      {/* Photo grid placeholder */}
      {section.ratings.some((r) => r.photoUrl) && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-stone-400">Photos</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {section.ratings
              .filter((r) => r.photoUrl)
              .map((r) => (
                <img
                  key={r.id}
                  src={r.photoUrl!}
                  alt="Road condition"
                  className="h-32 w-full rounded-lg border border-stone-200 object-cover"
                />
              ))}
          </div>
        </div>
      )}

      {/* Ratings list */}
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-stone-400">
        {section.totalRatings} Rating{section.totalRatings !== 1 ? "s" : ""}
      </h2>

      <div className="space-y-4">
        {section.ratings.map((rating) => (
          <div
            key={rating.id}
            className="rounded-xl border border-stone-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <ScoreBadge score={rating.score} size="sm" />
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {rating.user.name ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-stone-400">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {rating.disputes[0] && (
                <DisputeBadge status={rating.disputes[0].status} />
              )}
            </div>
            {rating.notes && (
              <p className="mt-3 text-sm text-stone-600">{rating.notes}</p>
            )}
            {rating.photoUrl && (
              <img
                src={rating.photoUrl}
                alt="Road condition"
                className="mt-3 h-48 w-full rounded-lg object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
