import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">
        Citizen-powered road accountability
      </p>
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-[40px]">
        Rate India&apos;s roads.
        <br />
        Hold contractors accountable.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-500">
        Photograph a road section, score the quality, and help build
        <br className="hidden sm:inline" />
        {" "}India&apos;s first open database of road contractor performance.
      </p>

      {/* CTAs */}
      <div className="mt-12 flex items-center justify-center gap-3">
        <Link
          href="/rate"
          className="rounded-lg bg-stone-900 px-7 py-3 text-sm font-semibold text-white hover:bg-stone-700 transition-colors"
        >
          Rate a Road →
        </Link>
        <Link
          href="/browse"
          className="rounded-lg border border-stone-300 px-7 py-3 text-sm font-semibold text-stone-900 hover:bg-stone-50 transition-colors"
        >
          Browse Ratings
        </Link>
      </div>

      {/* Stats strip */}
      <div className="mt-16 flex rounded-xl bg-stone-50">
        {[
          { value: "2,847", label: "Ratings submitted" },
          { value: "342", label: "Road sections" },
          { value: "89", label: "Contractors tracked" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-1 flex-col items-center gap-1 py-6 ${
              i < 2 ? "border-r border-stone-200" : ""
            } ${
              i === 0 ? "rounded-l-xl" : i === 2 ? "rounded-r-xl" : ""
            }`}
          >
            <span className="font-mono text-3xl font-extrabold text-stone-900">
              {stat.value}
            </span>
            <span className="text-xs text-stone-400">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div className="mt-16 rounded-xl border border-stone-200 bg-stone-50 px-6 py-5 text-left">
        <div className="mb-2 flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-stone-400"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Coming soon
          </span>
        </div>
        <p className="text-[13px] leading-relaxed text-stone-500">
          Government data integration (PMGSY, NHAI, State PWD), temporal tracking
          to measure road deterioration over time, and a mobile app.
        </p>
      </div>

      {/* Bottom links */}
      <div className="mt-8 flex items-center justify-center gap-3 text-xs text-stone-400">
        <span>Open source · MIT License</span>
        <span className="text-stone-300">·</span>
        <a href="#" className="text-stone-500 hover:text-stone-900 transition-colors">
          GitHub ↗
        </a>
        <span className="text-stone-300">·</span>
        <span>Privacy-first: we don&apos;t store your email</span>
      </div>
    </div>
  );
}
