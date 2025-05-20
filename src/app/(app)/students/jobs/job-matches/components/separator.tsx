import * as React from "react"

import { cn } from "@/lib/utils"

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", decorative = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        decorative ? "my-4" : "my-0",
        className,
      )}
      role="separator"
      aria-orientation={orientation}
      aria-hidden={decorative}
      {...props}
    />
  ),
)
Divider.displayName = "Divider"

export { Divider }
