"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";

import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";

function CalendarIcon({ className }: { className?: string }) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function parseISODateLocal(iso: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplay(iso: string | undefined, placeholder: string): string {
  if (!iso) return placeholder;
  const d = parseISODateLocal(iso);
  if (!d) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type DatePickerProps = {
  /** ISO date string `YYYY-MM-DD` */
  value: string | undefined;
  onChange: (next: string) => void;
  /** Optional ISO lower bound — earlier dates are disabled. */
  minDate?: string;
  /** Optional ISO upper bound — later dates are disabled. */
  maxDate?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
};

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Pick a date",
  id,
  name,
  className,
  triggerClassName,
  disabled,
}: DatePickerProps) {
  const selected = value ? parseISODateLocal(value) : undefined;
  const min = minDate ? parseISODateLocal(minDate) : undefined;
  const max = maxDate ? parseISODateLocal(maxDate) : undefined;

  return (
    <div className={className}>
      {/* Hidden field so the value participates in form submission. */}
      <input type="hidden" name={name} value={value ?? ""} />

      <Popover.Root>
        <Popover.Trigger
          id={id}
          disabled={disabled}
          className={cn(
            "h-10 w-full inline-flex items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors",
            "hover:border-foreground/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 outline-none",
            "data-[popup-open]:border-foreground/40",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !value && "text-muted-foreground",
            triggerClassName
          )}
        >
          <span>{formatDisplay(value, placeholder)}</span>
          <CalendarIcon className="text-muted-foreground" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={6} align="start">
            <Popover.Popup
              className={cn(
                "rounded-xl border border-border bg-popover text-popover-foreground shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] outline-none",
                "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[ending-style]:scale-[0.98] transition-all duration-150"
              )}
            >
              <Calendar
                mode="single"
                selected={selected}
                onSelect={(d) => {
                  if (d) onChange(toISODateLocal(d));
                }}
                defaultMonth={selected ?? min}
                disabled={[
                  ...(min ? [{ before: min }] : []),
                  ...(max ? [{ after: max }] : []),
                ]}
              />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
