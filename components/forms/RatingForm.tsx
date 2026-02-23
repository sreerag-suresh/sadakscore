"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATES, DISTRICTS, ROAD_TYPES } from "@/lib/constants";
import type { State } from "@/lib/constants";

type Step = "location" | "photos" | "score";

const STEPS: Step[] = ["location", "photos", "score"];
const STEP_LABELS: Record<Step, string> = {
  location: "Location",
  photos: "Photos",
  score: "Score & Review",
};

interface RatingFormData {
  state: string;
  district: string;
  roadType: string;
  roadName: string;
  section: string;
  score: number | null;
  notes: string;
  contractorName: string;
  photoFiles: File[];
  latitude: number | null;
  longitude: number | null;
}

const DEFAULT_FORM: RatingFormData = {
  state: "",
  district: "",
  roadType: "",
  roadName: "",
  section: "",
  score: null,
  notes: "",
  contractorName: "",
  photoFiles: [],
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

  function canContinue(): boolean {
    if (step === "location") {
      return !!(form.state && form.district && form.roadType && form.roadName);
    }
    return true;
  }

  async function submit() {
    if (form.score === null) {
      setError("Please select a score.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("state", form.state);
      body.append("district", form.district);
      body.append("roadType", form.roadType);
      body.append("roadName", form.roadName);
      body.append("section", form.section);
      body.append("score", String(form.score));
      body.append("notes", form.notes);
      body.append("contractorName", form.contractorName);
      if (form.photoFiles.length > 0) body.append("photo", form.photoFiles[0]);
      if (form.latitude != null) body.append("latitude", String(form.latitude));
      if (form.longitude != null) body.append("longitude", String(form.longitude));

      const res = await fetch("/api/ratings", { method: "POST", body });

      if (res.ok) {
        setSubmitted(true);
        return;
      }

      if (res.status === 401) {
        router.push("/auth/signin?callbackUrl=/rate");
        return;
      }

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
      <div className="mx-auto max-w-lg rounded-xl border border-stone-200 bg-white p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
          ✓
        </div>
        <p className="text-lg font-medium text-stone-900">Rating submitted!</p>
        <p className="mt-1 text-sm text-stone-500">Thank you for helping rate the roads.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { setSubmitted(false); setForm(DEFAULT_FORM); setStep("location"); }}
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
          >
            Rate Another Road
          </button>
          <button
            onClick={() => router.push("/browse")}
            className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Browse Ratings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress bar */}
      <div className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1 rounded-full transition-colors ${
                i <= currentIndex ? "bg-stone-900" : "bg-stone-200"
              }`}
            />
            <p className={`mt-2 text-xs ${i === currentIndex ? "font-medium text-stone-900" : "text-stone-400"}`}>
              {STEP_LABELS[s]}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8">
        {step === "location" && <LocationStep form={form} setForm={setForm} />}
        {step === "photos" && <PhotoStep form={form} setForm={setForm} />}
        {step === "score" && <ScoreStep form={form} setForm={setForm} />}

        {error && (
          <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="rounded-md border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
          >
            Back
          </button>

          {step !== "score" ? (
            <button
              onClick={next}
              disabled={!canContinue()}
              className="rounded-md bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-40 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting || form.score === null}
              className="rounded-md bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Submitting…" : "Submit Rating"}
            </button>
          )}
        </div>
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
  const districts = form.state ? DISTRICTS[form.state as State] ?? [] : [];

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
      <h2 className="text-lg font-semibold text-stone-900">Where is the road?</h2>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">State</label>
        <select
          value={form.state}
          onChange={(e) => setForm((f) => ({ ...f, state: e.target.value, district: "" }))}
          className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
        >
          <option value="">Select state</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">District</label>
        <select
          value={form.district}
          onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
          disabled={!form.state}
          className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 disabled:opacity-50"
        >
          <option value="">Select district</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Road Type</label>
        <div className="flex flex-wrap gap-2">
          {ROAD_TYPES.map((rt) => (
            <button
              key={rt}
              type="button"
              onClick={() => setForm((f) => ({ ...f, roadType: rt }))}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                form.roadType === rt
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 text-stone-600 hover:border-stone-400"
              }`}
            >
              {rt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Road Name</label>
        <input
          type="text"
          placeholder="e.g. NH-48, MG Road"
          value={form.roadName}
          onChange={(e) => setForm((f) => ({ ...f, roadName: e.target.value }))}
          className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Section <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Km 12–15, Near Toll Plaza"
          value={form.section}
          onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
          className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
        />
      </div>

      <button
        type="button"
        onClick={detectLocation}
        className="text-sm text-stone-500 underline underline-offset-2 hover:text-stone-900 transition-colors"
      >
        Use my current GPS location
      </button>
      {form.latitude != null && (
        <p className="font-mono text-xs text-stone-400">
          {form.latitude.toFixed(5)}, {form.longitude?.toFixed(5)}
        </p>
      )}
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
  function handleFiles(files: FileList | null) {
    if (!files) return;
    setForm((f) => ({ ...f, photoFiles: [...f.photoFiles, ...Array.from(files)] }));
  }

  function removeFile(index: number) {
    setForm((f) => ({ ...f, photoFiles: f.photoFiles.filter((_, i) => i !== index) }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-stone-900">
        Add photos <span className="font-normal text-stone-400">(optional)</span>
      </h2>

      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 px-6 py-10 text-center hover:border-stone-400 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <span className="text-2xl text-stone-300">📷</span>
        <span className="mt-2 text-sm text-stone-500">Click to upload or drag & drop</span>
        <span className="mt-1 text-xs text-stone-400">JPEG, PNG — GPS data extracted automatically</span>
        <input
          type="file"
          accept="image/jpeg,image/png"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {form.photoFiles.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {form.photoFiles.map((file, i) => (
            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-stone-200">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
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
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  function getScoreLabel(s: number): string {
    if (s >= 9) return "Excellent";
    if (s >= 7) return "Good";
    if (s >= 5) return "Average";
    if (s >= 4) return "Fair";
    if (s >= 2) return "Poor";
    return "Terrible";
  }

  function getScoreColor(s: number): string {
    if (s >= 7) return "border-green-500 bg-green-50 text-green-700";
    if (s >= 4) return "border-yellow-500 bg-yellow-50 text-yellow-700";
    return "border-red-500 bg-red-50 text-red-700";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Rate this road</h2>
        <p className="mt-1 text-sm text-stone-500">0 = Terrible, 10 = Excellent</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {scores.map((s) => (
          <button
            key={s}
            onClick={() => setForm((f) => ({ ...f, score: s }))}
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-all ${
              form.score === s
                ? getScoreColor(s) + " scale-110 ring-2 ring-offset-1 ring-stone-300"
                : "border-stone-200 text-stone-500 hover:border-stone-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {form.score !== null && (
        <p className="text-sm font-medium text-stone-600">{getScoreLabel(form.score)}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Review <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <textarea
          placeholder="Describe the road condition…"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={3}
          className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 resize-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Contractor <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Contractor or company name"
          value={form.contractorName}
          onChange={(e) => setForm((f) => ({ ...f, contractorName: e.target.value }))}
          className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
        />
      </div>
    </div>
  );
}
