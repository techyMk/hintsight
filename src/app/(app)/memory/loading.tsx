import { Skeleton } from "@/components/ui/skeleton";

export default function MemoryLoading() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-2xl max-w-lg" />
      </div>
      <Skeleton className="h-[520px] rounded-2xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
  );
}
