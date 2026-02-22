import { notFound } from "next/navigation";
import ScoreBadge from "@/components/ui/ScoreBadge";
import DisputeBadge from "@/components/ui/DisputeBadge";

// TODO: replace with real DB query
async function getSection(id: string) {
  void id;
  return null as null | {
    id: string;
    name: string;
    description: string | null;
    city: string | null;
    district: string | null;
    avgScore: number | null;
    totalRatings: number;
    contractor: { id: string; name: string } | null;
    ratings: Array<{
      id: string;
      score: number;
      notes: string | null;
      photoUrl: string | null;
      createdAt: string;
      user: { name: string | null };
      disputes: Array<{ status: "PENDING" | "RESOLVED" | "REJECTED" }>;
    }>;
  };
}

export default async function RoadSectionPage({
  params,
}: {
  params: { id: string };
}) {
  const section = await getSection(params.id);
  if (!section) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{section.name}</h1>
          <p className="mt-1 text-sm text-stone-400">
            {[section.city, section.district].filter(Boolean).join(", ")}
            {section.contractor && (
              <>
                {" · "}
                <a
                  href={`/contractor/${section.contractor.id}`}
                  className="underline underline-offset-2 hover:text-stone-700"
                >
                  {section.contractor.name}
                </a>
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
