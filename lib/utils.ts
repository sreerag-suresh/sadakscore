/**
 * Returns "good" | "fair" | "poor" based on a 1–5 score.
 */
export function scoreCategory(score: number): "good" | "fair" | "poor" {
  if (score >= 4) return "good";
  if (score >= 2.5) return "fair";
  return "poor";
}

/**
 * Maps a score category to its Tailwind text colour class.
 */
export function scoreColorClass(score: number): string {
  const cat = scoreCategory(score);
  return cat === "good"
    ? "text-score-good"
    : cat === "fair"
    ? "text-score-fair"
    : "text-score-poor";
}

/**
 * Maps a score category to its Tailwind background colour class.
 */
export function scoreBgClass(score: number): string {
  const cat = scoreCategory(score);
  return cat === "good"
    ? "bg-score-good"
    : cat === "fair"
    ? "bg-score-fair"
    : "bg-score-poor";
}

/**
 * Formats a decimal score to one decimal place.
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/**
 * Returns a human-readable label for a 1–5 score.
 */
export function scoreLabel(score: number): string {
  if (score >= 4.5) return "Excellent";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Fair";
  if (score >= 1.5) return "Poor";
  return "Terrible";
}
