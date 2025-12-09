import React from "react";
import { cn } from "@/lib/utils";

/**
 * A reusable, consistent label component.
 * Matches shadcn/ui style and supports dark mode.
 */
export function Label({ children, className, htmlFor, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
