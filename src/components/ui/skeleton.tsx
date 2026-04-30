import * as React from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md bg-foreground/5 relative overflow-hidden shimmer",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
