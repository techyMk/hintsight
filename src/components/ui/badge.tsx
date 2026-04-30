import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tracking-tight whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 bg-foreground/5 text-foreground/80",
        muted:
          "border-transparent bg-muted text-muted-foreground",
        outline:
          "border-foreground/15 text-foreground/80",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        warning:
          "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-200",
        danger:
          "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
        accent:
          "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
