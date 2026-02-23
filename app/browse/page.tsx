"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ScoreBadge from "@/components/ui/ScoreBadge";
import DisputeBadge from "@/components/ui/DisputeBadge";
import { STATES, ROAD_TYPES } from "@/lib/constants";

interface Section {
  id: string;
  name: string;
  city: string | null;
  district: string | null;
  state: string | null;
  roadType: string | null;
  avgScore: number | null;
  totalRatings: number;
  contractor: { name: string; verified: boolean } | null;
  ratings: { disputes: { status: "PENDING" | "RESOLVED" | "REJECTED" }[] }[];
}

type SortOption = "recent" | "worst" | "best" | "most";

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const stateFilter = searchParams.get("state") ?? "";
  const roadTypeFilter = searchParams.get("roadType") ?? "";
  const sort = (searchParams.get("sort") ?? "best") as SortOption;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/browse");
      if (res.ok) {
        setSections(await res.json());
      }
      setLoading(false);
    }
    load();
  }, []);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/browse?${params.toString()}`);
  }

  // Client-side filter + sort
  const filtered = sections.filter((s) => {
    if (stateFilter && s.state !== stateFilter) return false;
    if (roadTypeFilter && s.roadType !== roadTypeFilter) return false;
    return true;
  });

  filtered.sort((a, b) => {
    switch (sort) {
      case "worst":
        return (a.avgScore ?? 11) - (b.avgScore ?? 11);
      case "best":
        return (b.avgScore ?? -1) - (a.avgScore ?? -1);
      case "most":
        return b.totalRatings - a.totalRatings;
      case "recent":
      default:
        return 0; // Already ordered by creation time from API
    }
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Browse Road Ratings</h1>
        <p className="mt-1 text-sm text-stone-500">All rated road sections across India.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={stateFilter}
          onChange={(e) => updateFilter("state", e.target.value)}
          className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
        >
          <option value="">All States</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={roadTypeFilter}
          onChange={(e) => updateFilter("roadType", e.target.value)}
          className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
        >
          <option value="">All Road Types</option>
          {ROAD_TYPES.map((rt) => (
            <option key={rt} value={rt}>{rt}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
        >
          <option value="best">Best rated</option>
          <option value="worst">Worst rated</option>
          <option value="most">Most rated</option>
          <option value="recent">Most recent</option>
        </select>
      </div>

      {loading ? (
        <div className="py-24 text-center text-stone-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 py-24 text-center">
          <p className="text-stone-400">No ratings found. Be the first to rate a road.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          {filtered.map((section, i) => {
            const hasPendingDispute = section.ratings?.some(
              (r) => r.disputes?.some((d) => d.status === "PENDING")
            );
            return (
              <Link
                key={section.id}
                href={`/browse/${section.id}`}
                className={`flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50 transition-colors ${
                  i > 0 ? "border-t border-stone-100" : ""
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {section.avgScore != null ? (
                    <ScoreBadge score={section.avgScore} size="sm" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-stone-200 font-mono text-sm text-stone-300">—</div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-stone-900">{section.name}</p>
                      {hasPendingDispute && <DisputeBadge status="PENDING" />}
                    </div>
                    <p className="text-xs text-stone-400">
                      {[section.state, section.district, section.roadType].filter(Boolean).join(" · ")}
                      {section.totalRatings > 0 && ` · ${section.totalRatings} ratings`}
                      {section.contractor && (
                        <>
                          {" · "}{section.contractor.name}
                          {section.contractor.verified && (
                            <span className="ml-1 inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">✓</span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-stone-300">›</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
