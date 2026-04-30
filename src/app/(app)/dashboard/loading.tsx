import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-12 w-44 rounded-lg" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>

      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}
