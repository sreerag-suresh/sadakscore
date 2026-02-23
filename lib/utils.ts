export function scoreCategory(score: number): "good" | "fair" | "poor" {
  if (score >= 7) return "good";
  if (score >= 4) return "fair";
  return "poor";
}

export function scoreColorClass(score: number): string {
  const cat = scoreCategory(score);
  return cat === "good" ? "text-score-good" : cat === "fair" ? "text-score-fair" : "text-score-poor";
}

export function scoreBgClass(score: number): string {
  const cat = scoreCategory(score);
  return cat === "good" ? "bg-score-good" : cat === "fair" ? "bg-score-fair" : "bg-score-poor";
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function scoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 5) return "Average";
  if (score >= 4) return "Fair";
  if (score >= 2) return "Poor";
  return "Terrible";
}
