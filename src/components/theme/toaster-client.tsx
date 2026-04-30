"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ToasterClient() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      theme={(resolvedTheme as "light" | "dark" | undefined) ?? "system"}
      toastOptions={{
        classNames: {
          toast:
            "!bg-card !text-foreground !border !border-border !rounded-xl !shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]",
          description: "!text-muted-foreground",
          actionButton:
            "!bg-primary !text-primary-foreground !rounded-md !px-2 !py-1 !text-xs",
        },
      }}
    />
  );
}
