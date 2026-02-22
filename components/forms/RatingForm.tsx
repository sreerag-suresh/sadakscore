"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "location" | "score" | "photo" | "review";

const STEPS: Step[] = ["location", "score", "photo", "review"];

const STEP_LABELS: Record<Step, string> = {
  location: "Location",
  score: "Score",
  photo: "Photo",
  review: "Review",
};

interface RatingFormData {
  sectionId: string;
  score: number | null;
  notes: string;
  photoFile: File | null;
  latitude: number | null;
  longitude: number | null;
}

const DEFAULT_FORM: RatingFormData = {
  sectionId: "",
  score: null,
  notes: "",
  photoFile: null,
  latitude: null,
  longitude: null,
};

export default function RatingForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("location");
  const [form, setForm] = useState<RatingFormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentIndex = STEPS.indexOf(step);

  function prev() {
    if (currentIndex > 0) setStep(STEPS[currentIndex - 1]);
  }

  function next() {
    if (currentIndex < STEPS.length - 1) setStep(STEPS[currentIndex + 1]);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("sectionId", form.sectionId);
      body.append("score", String(form.score));
      body.append("notes", form.notes);
      if (form.photoFile) body.append("photo", form.photoFile);
      if (form.latitude != null) body.append("latitude", String(form.latitude));
      if (form.longitude != null) body.append("longitude", String(form.longitude));

      const res = await fetch("/api/ratings", { method: "POST", body });

      if (res.ok) {
        setSubmitted(true);
        // Redirect to browse after a short pause so the success message is visible
        setTimeout(() => router.push("/browse"), 1500);
        return;
      }

      if (res.status === 401) {
        router.push("/auth/signin?callbackUrl=/rate");
        return;
      }

      // Show the error message from the API
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? `Submission failed (${res.status}). Please try again.`);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
        <p className="text-lg font-medium text-stone-900">Rating submitted!</p>
        <p className="mt-1 text-sm text-stone-500">Thank you for helping rate the roads.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8">
      {/* Progress */}
      <ol className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2 text-sm">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-medium ${
                i < currentIndex
                  ? "bg-stone-900 text-white"
                  : i === currentIndex
                  ? "border-2 border-stone-900 text-stone-900"
                  : "border border-stone-200 text-stone-400"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={
                i === currentIndex ? "text-stone-900 font-medium" : "text-stone-400"
              }
            >
              {STEP_LABELS[s]}
            </span>
            {i < STEPS.length - 1 && (
              <span className="text-stone-200">›</span>
            )}
          </li>
        ))}
      </ol>

      {/* Steps */}
      {step === "location" && (
        <LocationStep form={form} setForm={setForm} />
      )}
      {step === "score" && (
        <ScoreStep form={form} setForm={setForm} />
      )}
      {step === "photo" && (
        <PhotoStep form={form} setForm={setForm} />
      )}
      {step === "review" && (
        <ReviewStep form={form} />
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="rounded-md border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
        >
          Back
        </button>

        {step !== "review" ? (
          <button
            onClick={next}
            className="rounded-md bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-md bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Submitting…" : "Submit Rating"}
          </button>
        )}
      </div>
    </div>
  );
}

function LocationStep({
  form,
  setForm,
}: {
  form: RatingFormData;
  setForm: React.Dispatch<React.SetStateAction<RatingFormData>>;
}) {
  function detectLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((f) => ({
        ...f,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-stone-900">Which road section are you rating?</h2>
      <input
        type="text"
        placeholder="Road section name or ID"
        value={form.sectionId}
        onChange={(e) => setForm((f) => ({ ...f, sectionId: e.target.value }))}
        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
      />
      <button
        type="button"
        onClick={detectLocation}
        className="text-sm text-stone-500 underline underline-offset-2 hover:text-stone-900 transition-colors"
      >
        Use my current location
      </button>
      {form.latitude != null && (
        <p className="font-mono text-xs text-stone-400">
          {form.latitude.toFixed(5)}, {form.longitude?.toFixed(5)}
        </p>
      )}
    </div>
  );
}

function ScoreStep({
  form,
  setForm,
}: {
  form: RatingFormData;
  setForm: React.Dispatch<React.SetStateAction<RatingFormData>>;
}) {
  const scores = [1, 2, 3, 4, 5] as const;
  const labels: Record<number, string> = {
    1: "Terrible",
    2: "Poor",
    3: "Fair",
    4: "Good",
    5: "Excellent",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-stone-900">How would you rate this road?</h2>
      <div className="flex gap-3">
        {scores.map((s) => (
          <button
            key={s}
            onClick={() => setForm((f) => ({ ...f, score: s }))}
            className={`flex h-12 w-12 flex-col items-center justify-center rounded-full font-mono text-sm font-medium transition-all ${
              form.score === s
                ? "bg-stone-900 text-white scale-110"
                : "border border-stone-200 text-stone-600 hover:border-stone-400"
            }`}
            aria-label={labels[s]}
          >
            {s}
          </button>
        ))}
      </div>
      {form.score != null && (
        <p className="text-sm text-stone-500">{labels[form.score]}</p>
      )}
      <textarea
        placeholder="Optional notes…"
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        rows={3}
        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 resize-none"
      />
    </div>
  );
}

function PhotoStep({
  form,
  setForm,
}: {
  form: RatingFormData;
  setForm: React.Dispatch<React.SetStateAction<RatingFormData>>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-stone-900">
        Add a photo <span className="font-normal text-stone-400">(optional)</span>
      </h2>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 px-6 py-10 text-center hover:border-stone-300 transition-colors">
        <span className="text-sm text-stone-500">
          {form.photoFile ? form.photoFile.name : "Click to upload or drag & drop"}
        </span>
        <span className="mt-1 text-xs text-stone-400">JPEG, PNG — GPS data extracted automatically</span>
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={(e) =>
            setForm((f) => ({ ...f, photoFile: e.target.files?.[0] ?? null }))
          }
        />
      </label>
    </div>
  );
}

function ReviewStep({ form }: { form: RatingFormData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-stone-900">Review your rating</h2>
      <dl className="divide-y divide-stone-100 text-sm">
        <div className="flex justify-between py-2">
          <dt className="text-stone-500">Section</dt>
          <dd className="font-medium text-stone-900">{form.sectionId || "—"}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-stone-500">Score</dt>
          <dd className="font-mono font-medium text-stone-900">{form.score ?? "—"} / 5</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-stone-500">Photo</dt>
          <dd className="text-stone-900">{form.photoFile ? form.photoFile.name : "None"}</dd>
        </div>
        {form.notes && (
          <div className="py-2">
            <dt className="text-stone-500">Notes</dt>
            <dd className="mt-1 text-stone-900">{form.notes}</dd>
          </div>
        )}
        {form.latitude != null && (
          <div className="flex justify-between py-2">
            <dt className="text-stone-500">GPS</dt>
            <dd className="font-mono text-xs text-stone-600">
              {form.latitude.toFixed(5)}, {form.longitude?.toFixed(5)}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
