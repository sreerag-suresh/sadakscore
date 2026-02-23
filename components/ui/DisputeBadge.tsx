"use client";

import { useState } from "react";

type DisputeStatus = "PENDING" | "RESOLVED" | "REJECTED";

const statusConfig: Record<DisputeStatus, { label: string; icon: string; className: string }> = {
  PENDING: {
    label: "Disputed",
    icon: "⚠",
    className: "border-amber-400 bg-amber-50 text-amber-700",
  },
  RESOLVED: {
    label: "Resolved",
    icon: "✓",
    className: "border-green-300 bg-green-50 text-green-700",
  },
  REJECTED: {
    label: "Rejected",
    icon: "✕",
    className: "border-red-300 bg-red-50 text-red-700",
  },
};

const tooltipText: Record<DisputeStatus, string> = {
  PENDING: "The contractor has disputed this rating. It is under review.",
  RESOLVED: "This dispute has been reviewed and resolved.",
  REJECTED: "This dispute was reviewed and rejected.",
};

export default function DisputeBadge({ status }: { status: DisputeStatus }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { label, icon, className } = statusConfig[status];

  return (
    <span
      className={`relative inline-flex cursor-default items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span>{icon}</span>
      {label}
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-normal text-stone-600 shadow-lg">
          {tooltipText[status]}
        </span>
      )}
    </span>
  );
}
