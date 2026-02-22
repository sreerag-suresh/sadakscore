"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Create account
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Sign in automatically
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      // Account created but auto-sign-in failed — send them to sign-in
      router.push("/auth/signin");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-stone-900">Create account</h1>
        <p className="mb-8 text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline underline-offset-2 hover:text-stone-900">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Name</label>
            <input
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
            />
            <p className="mt-1 text-xs text-stone-400">Minimum 8 characters</p>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
