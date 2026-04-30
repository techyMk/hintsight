import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsLoading() {
  return (
    <div className="space-y-7" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-2xl max-w-md" />
      </div>

      <Skeleton className="h-10 w-96 rounded-xl" />

      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
