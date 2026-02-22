import { db } from "@/lib/db";
import ScoreBadge from "@/components/ui/ScoreBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contractor Leaderboard — SadakScore",
};

async function getLeaderboard() {
  const contractors = await db.contractor.findMany({
    include: {
      sections: {
        select: { avgScore: true, totalRatings: true },
      },
    },
  });

  return contractors
    .map((c) => {
      const ratedSections = c.sections.filter((s) => s.avgScore != null);
      const avgScore =
        ratedSections.length > 0
          ? ratedSections.reduce((sum, s) => sum + s.avgScore!, 0) /
            ratedSections.length
          : null;
      const totalRatings = c.sections.reduce((sum, s) => sum + s.totalRatings, 0);

      return {
        id: c.id,
        name: c.name,
        license: c.license,
        avgScore,
        totalRatings,
        totalSections: c.sections.length,
      };
    })
    .filter((c) => c.avgScore != null)
    .sort((a, b) => b.avgScore! - a.avgScore!);
}

export default async function LeaderboardPage() {
  const contractors = await getLeaderboard();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Contractor Leaderboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Ranked by average road quality score across all rated sections.
        </p>
      </div>

      {contractors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 py-24 text-center">
          <p className="text-stone-400">No contractors have rated sections yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white">
          {contractors.map((contractor, index) => (
            <Link
              key={contractor.id}
              href={`/contractor/${contractor.id}`}
              className="flex items-center gap-6 border-b border-stone-100 px-6 py-4 last:border-0 hover:bg-stone-50 transition-colors"
            >
              <span className="w-8 shrink-0 font-mono text-sm font-medium text-stone-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-stone-900">{contractor.name}</p>
                <p className="font-mono text-xs text-stone-400">
                  {contractor.license} · {contractor.totalSections} sections · {contractor.totalRatings} ratings
                </p>
              </div>
              <ScoreBadge score={contractor.avgScore!} size="sm" showLabel />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
