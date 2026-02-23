"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ScoreBadge from "@/components/ui/ScoreBadge";
import { STATES } from "@/lib/constants";
import { formatScore } from "@/lib/utils";

interface ContractorEntry {
  id: string;
  name: string;
  license: string;
  verified: boolean;
  avgScore: number | null;
  totalRatings: number;
  totalSections: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [contractors, setContractors] = useState<ContractorEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const tab = searchParams.get("tab") ?? "top";
  const stateFilter = searchParams.get("state") ?? "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        setContractors(await res.json());
      }
      setLoading(false);
    }
    load();
  }, []);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/leaderboard?${params.toString()}`);
  }

  // Sort based on tab
  const sorted = [...contractors].sort((a, b) => {
    if (tab === "lowest") return (a.avgScore ?? 11) - (b.avgScore ?? 11);
    return (b.avgScore ?? -1) - (a.avgScore ?? -1);
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Contractor Leaderboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Ranked by average road quality score across all rated sections.
        </p>
      </div>

      {/* Tab toggle + filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-stone-200 bg-stone-50 p-0.5">
          <button
            onClick={() => updateFilter("tab", "")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "top" ? "bg-stone-900 text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Top Rated
          </button>
          <button
            onClick={() => updateFilter("tab", "lowest")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "lowest" ? "bg-stone-900 text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Lowest Rated
          </button>
        </div>

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
      </div>

      {loading ? (
        <div className="py-24 text-center text-stone-400">Loading…</div>
      ) : sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 py-24 text-center">
          <p className="text-stone-400">No contractors have rated sections yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          {sorted.map((contractor, index) => (
            <Link
              key={contractor.id}
              href={`/contractor/${contractor.id}`}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors ${
                index > 0 ? "border-t border-stone-100" : ""
              }`}
            >
              <span className="w-8 shrink-0 font-mono text-sm font-bold text-stone-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-stone-900">{contractor.name}</p>
                  {contractor.verified && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">✓ Verified</span>
                  )}
                </div>
                <p className="font-mono text-xs text-stone-400">
                  {contractor.license} · {contractor.totalSections} sections · {contractor.totalRatings} ratings
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {contractor.avgScore != null && (
                  <>
                    <span className="font-mono text-sm text-stone-500">avg {formatScore(contractor.avgScore)}/10</span>
                    <ScoreBadge score={contractor.avgScore} size="sm" />
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 px-6 py-5 text-center">
        <p className="text-sm font-medium text-stone-900">Are you a road contractor?</p>
        <p className="mt-1 text-xs text-stone-500">Register with your GST number to claim your profile and respond to ratings.</p>
        <Link
          href="/contractor/register"
          className="mt-3 inline-block rounded-lg border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 hover:bg-white transition-colors"
        >
          Register as Contractor
        </Link>
      </div>
    </div>
  );
}
