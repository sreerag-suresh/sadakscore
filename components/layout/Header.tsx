import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="font-mono text-lg font-medium tracking-tight text-stone-900 hover:text-stone-600 transition-colors"
          >
            SadakScore
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link href="/browse" className="hover:text-stone-900 transition-colors">
              Browse
            </Link>
            <Link href="/leaderboard" className="hover:text-stone-900 transition-colors">
              Leaderboard
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/rate"
                  className="rounded-md bg-stone-900 px-4 py-1.5 text-white hover:bg-stone-700 transition-colors"
                >
                  Rate a Road
                </Link>
                <SignOutButton userName={session.user.name ?? session.user.email ?? "Account"} />
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="hover:text-stone-900 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-stone-900 px-4 py-1.5 text-white hover:bg-stone-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
