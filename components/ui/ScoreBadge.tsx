import { formatScore, scoreCategory } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
};

const categoryClasses: Record<string, string> = {
  good: "bg-score-good text-white",
  fair: "bg-score-fair text-white",
  poor: "bg-score-poor text-white",
};

export default function ScoreBadge({
  score,
  size = "md",
  showLabel = false,
}: ScoreBadgeProps) {
  const cat = scoreCategory(score);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className={`flex items-center justify-center rounded-full font-mono font-medium ${sizeClasses[size]} ${categoryClasses[cat]}`}
        aria-label={`Score: ${formatScore(score)}`}
      >
        {formatScore(score)}
      </div>
      {showLabel && (
        <span className="text-xs text-stone-500 capitalize">{cat}</span>
      )}
    </div>
  );
}
