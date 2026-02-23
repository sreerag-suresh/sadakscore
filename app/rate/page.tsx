import RatingForm from "@/components/forms/RatingForm";

export const metadata = {
  title: "Rate a Road — SadakScore",
};

export default function RatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <RatingForm />
    </div>
  );
}
