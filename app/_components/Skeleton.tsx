type Props = {
  className?: string;
  radius?: "sm" | "md" | "full";
};

const RADIUS: Record<NonNullable<Props["radius"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  full: "rounded-full",
};

export default function Skeleton({ className = "", radius = "sm" }: Props) {
  return <div aria-hidden className={`skeleton ${RADIUS[radius]} ${className}`} />;
}

export function SkeletonPropertyCard() {
  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm overflow-hidden">
      <Skeleton className="h-56 sm:h-64 w-full" />
      <div className="p-5 sm:p-6 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

export function SkeletonPropertyRow() {
  return (
    <div className="bg-[var(--m2-surface)] p-3 sm:p-4 rounded-sm border border-[var(--m2-line)] flex items-center gap-3 sm:gap-4">
      <Skeleton className="w-16 h-12 sm:w-20 sm:h-14 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 shrink-0" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-[var(--m2-surface)] border border-[var(--m2-line)] rounded-sm p-4 sm:p-5 space-y-2">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
}
