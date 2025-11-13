import * as React from "react"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
