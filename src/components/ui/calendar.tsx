"use client";

import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 18L9 12l6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 18L15 12 9 6" />
    </svg>
  );
}

export type CalendarProps = DayPickerProps;

/**
 * Calendar themed to Hintsight's design system. Built on react-day-picker v9
 * — overrides every classname slot to use Tailwind tokens (border, foreground,
 * brand, etc.) so the calendar follows light/dark mode automatically.
 */
export function Calendar({
  className,
  classNames,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      components={{
        Chevron: ({ orientation }) =>
          orientation === "right" ? (
            <ChevronRightIcon className="text-foreground" />
          ) : (
            <ChevronLeftIcon className="text-foreground" />
          ),
      }}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center pt-0.5 relative items-center h-9",
        caption_label: "text-sm font-medium tracking-tight text-foreground",
        nav: "flex items-center gap-1 absolute right-1 top-1",
        button_previous: cn(
          "size-7 rounded-md border border-border bg-background hover:bg-muted transition-colors inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        ),
        button_next: cn(
          "size-7 rounded-md border border-border bg-background hover:bg-muted transition-colors inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground/80 rounded-md w-9 font-mono text-[10px] uppercase tracking-widest",
        week: "flex w-full mt-1",
        day: "size-9 p-0 text-center text-sm relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-foreground/[0.04] first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
        day_button: cn(
          "size-9 p-0 font-mono tabular-nums rounded-md inline-flex items-center justify-center transition-colors",
          "text-foreground/85 hover:bg-foreground/[0.06] hover:text-foreground",
          "aria-selected:bg-foreground aria-selected:text-background aria-selected:font-semibold aria-selected:hover:bg-foreground",
          "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        ),
        selected: "",
        today:
          "[&_button]:ring-1 [&_button]:ring-brand/40 [&_button]:text-brand [&_button]:font-semibold",
        outside: "[&_button]:text-muted-foreground/40",
        disabled: "[&_button]:opacity-30 [&_button]:cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
