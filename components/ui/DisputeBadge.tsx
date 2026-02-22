type DisputeStatus = "PENDING" | "RESOLVED" | "REJECTED";

interface DisputeBadgeProps {
  status: DisputeStatus;
}

const statusConfig: Record<DisputeStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Disputed",
    className: "bg-stone-100 text-stone-600 border-stone-200",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function DisputeBadge({ status }: DisputeBadgeProps) {
  const { label, className } = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
