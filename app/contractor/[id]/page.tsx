import { notFound } from "next/navigation";
import ScoreBadge from "@/components/ui/ScoreBadge";
import Link from "next/link";

// TODO: replace with real DB query
async function getContractor(id: string) {
  void id;
  return null as null | {
    id: string;
    name: string;
    license: string;
    description: string | null;
    logoUrl: string | null;
    contactEmail: string | null;
    website: string | null;
    sections: Array<{
      id: string;
      name: string;
      city: string | null;
      avgScore: number | null;
      totalRatings: number;
    }>;
  };
}

export default async function ContractorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const contractor = await getContractor(params.id);
  if (!contractor) notFound();

  const ratedSections = contractor.sections.filter((s) => s.avgScore != null);
  const overallAvg =
    ratedSections.length > 0
      ? ratedSections.reduce((sum, s) => sum + s.avgScore!, 0) / ratedSections.length
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile header */}
      <div className="mb-10 flex items-start gap-6">
        {contractor.logoUrl && (
          <img
            src={contractor.logoUrl}
            alt={contractor.name}
            className="h-16 w-16 rounded-xl object-contain"
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{contractor.name}</h1>
          <p className="font-mono text-sm text-stone-400">{contractor.license}</p>
          {contractor.description && (
            <p className="mt-2 text-sm text-stone-500">{contractor.description}</p>
          )}
          <div className="mt-3 flex gap-4 text-xs text-stone-400">
            {contractor.contactEmail && (
              <a href={`mailto:${contractor.contactEmail}`} className="hover:text-stone-700 underline underline-offset-2">
                {contractor.contactEmail}
              </a>
            )}
            {contractor.website && (
              <a href={contractor.website} target="_blank" rel="noreferrer" className="hover:text-stone-700 underline underline-offset-2">
                {contractor.website}
              </a>
            )}
          </div>
        </div>
        {overallAvg != null && (
          <div className="text-center">
            <ScoreBadge score={overallAvg} size="lg" showLabel />
            <p className="mt-1 text-xs text-stone-400">Overall</p>
          </div>
        )}
      </div>

      {/* Sections */}
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-stone-400">
        Road Sections ({contractor.sections.length})
      </h2>

      <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
        {contractor.sections.map((section) => (
          <Link
            key={section.id}
            href={`/browse/${section.id}`}
            className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50 transition-colors"
          >
            <div>
              <p className="font-medium text-stone-900">{section.name}</p>
              {section.city && <p className="text-xs text-stone-400">{section.city}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-stone-400">{section.totalRatings} ratings</span>
              {section.avgScore != null ? (
                <ScoreBadge score={section.avgScore} size="sm" />
              ) : (
                <span className="font-mono text-sm text-stone-300">—</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
