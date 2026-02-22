import RatingForm from "@/components/forms/RatingForm";

export const metadata = {
  title: "Rate a Road — SadakScore",
};

export default function RatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Rate a Road</h1>
        <p className="mt-1 text-sm text-stone-500">
          Submit a condition rating for any road section in your area.
        </p>
      </div>
      <RatingForm />
    </div>
  );
}
