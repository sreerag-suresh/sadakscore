import { formatScore, scoreCategory } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeClasses = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
};

const categoryStyles: Record<string, string> = {
  good: "border-2 border-green-500 bg-green-50 text-green-700",
  fair: "border-2 border-yellow-500 bg-yellow-50 text-yellow-700",
  poor: "border-2 border-red-500 bg-red-50 text-red-700",
};

export default function ScoreBadge({ score, size = "md", showLabel = false }: ScoreBadgeProps) {
  const cat = scoreCategory(score);
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className={`flex items-center justify-center rounded-full font-mono font-bold ${sizeClasses[size]} ${categoryStyles[cat]}`}
        aria-label={`Score: ${formatScore(score)}`}
      >
        {formatScore(score)}
      </div>
      {showLabel && <span className="text-xs text-stone-500 capitalize">{cat}</span>}
    </div>
  );
}
