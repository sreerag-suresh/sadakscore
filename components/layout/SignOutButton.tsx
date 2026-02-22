"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton({ userName }: { userName: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-stone-400">{userName}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
