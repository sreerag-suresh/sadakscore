import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-stone-400">
        Community road ratings
      </p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-stone-900 sm:text-6xl">
        Sadak<span className="font-mono">Score</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-500">
        Rate the roads in your area, hold contractors accountable, and track quality improvements over time.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/rate"
          className="rounded-md bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          Rate a Road
        </Link>
        <Link
          href="/browse"
          className="rounded-md border border-stone-200 px-6 py-3 text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
        >
          Browse Ratings
        </Link>
      </div>

      {/* Quick-stat strip */}
      <div className="mt-20 grid grid-cols-3 gap-12">
        {[
          { label: "Roads Rated", value: "—" },
          { label: "Contractors", value: "—" },
          { label: "Avg. Score", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <span className="font-mono text-3xl font-medium text-stone-900">{stat.value}</span>
            <span className="text-sm text-stone-400">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
