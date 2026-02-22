import { db } from "@/lib/db";
import ScoreBadge from "@/components/ui/ScoreBadge";

export const dynamic = "force-dynamic";

async function getSections() {
  return db.roadSection.findMany({
    include: {
      contractor: { select: { name: true } },
    },
    orderBy: [
      { avgScore: { sort: "desc", nulls: "last" } },
      { totalRatings: "desc" },
    ],
  });
}

export default async function BrowsePage() {
  const sections = await getSections();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Browse Road Ratings</h1>
        <p className="mt-1 text-sm text-stone-500">All rated road sections, sorted by score.</p>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 py-24 text-center">
          <p className="text-stone-400">No ratings yet. Be the first to rate a road.</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`/browse/${section.id}`}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-stone-900">{section.name}</p>
                <p className="text-xs text-stone-400">
                  {[section.city, section.district].filter(Boolean).join(", ")}
                  {section.contractor && ` · ${section.contractor.name}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-xs text-stone-400">{section.totalRatings} ratings</span>
                {section.avgScore != null ? (
                  <ScoreBadge score={section.avgScore} size="sm" />
                ) : (
                  <span className="font-mono text-sm text-stone-300">—</span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
