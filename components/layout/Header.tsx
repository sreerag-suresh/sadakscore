import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import NavLinks from "./NavLinks";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-base font-bold tracking-tight text-stone-900 hover:text-stone-600 transition-colors"
          >
            SadakScore
            <span className="rounded bg-stone-900 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white">
              BETA
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLinks />
            <span className="mx-2 h-5 w-px bg-stone-200" />
            {session?.user ? (
              <SignOutButton userName={session.user.name ?? session.user.email ?? "Account"} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin" className="rounded-md px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
