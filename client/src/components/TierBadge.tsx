import type { EvidenceTier } from "@shared/supplements";

const tierConfig: Record<EvidenceTier, { label: string; description: string; className: string }> = {
  A: {
    label: "Tier A",
    description: "Robust Human Trials",
    className: "tier-a",
  },
  B: {
    label: "Tier B",
    description: "Emerging Evidence",
    className: "tier-b",
  },
  C: {
    label: "Tier C",
    description: "Preclinical Only",
    className: "tier-c",
  },
};

interface TierBadgeProps {
  tier: EvidenceTier;
  showDescription?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function TierBadge({ tier, showDescription = false, size = "md" }: TierBadgeProps) {
  const config = tierConfig[tier];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center font-mono font-semibold rounded-md ${config.className} ${sizeClasses[size]}`}
      >
        {config.label}
      </span>
      {showDescription && (
        <span className="text-xs text-muted-foreground">{config.description}</span>
      )}
    </div>
  );
}
