"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContractorRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    license: "",
    description: "",
    contactEmail: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contractors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const contractor = await res.json();
      router.push(`/contractor/${contractor.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  function field(
    key: keyof typeof form,
    label: string,
    opts?: { required?: boolean; type?: string; placeholder?: string }
  ) {
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          {label}
          {opts?.required && <span className="ml-0.5 text-score-poor">*</span>}
        </label>
        <input
          type={opts?.type ?? "text"}
          required={opts?.required}
          placeholder={opts?.placeholder}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Register as a Contractor</h1>
        <p className="mt-1 text-sm text-stone-500">
          Create a contractor profile to track your road quality scores.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-stone-200 bg-white p-6 sm:p-8"
      >
        {field("name", "Company Name", { required: true, placeholder: "Acme Roads Ltd." })}
        {field("license", "License Number", { required: true, placeholder: "CR-2024-XXXXX" })}
        {field("contactEmail", "Contact Email", { type: "email", placeholder: "hello@acmeroads.com" })}
        {field("website", "Website", { type: "url", placeholder: "https://acmeroads.com" })}

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Brief description of your company…"
            className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 resize-none"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? "Registering…" : "Register Contractor"}
        </button>
      </form>
    </div>
  );
}
