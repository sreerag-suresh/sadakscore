import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-sm text-stone-500">SadakScore</p>
          <nav className="flex gap-6 text-sm text-stone-500">
            <Link href="/browse" className="hover:text-stone-900 transition-colors">
              Browse
            </Link>
            <Link href="/leaderboard" className="hover:text-stone-900 transition-colors">
              Leaderboard
            </Link>
            <Link href="/contractor/register" className="hover:text-stone-900 transition-colors">
              Register Contractor
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
