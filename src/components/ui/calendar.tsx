"use client"

import * as React from "react"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DatePicker>

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...props}
        slotProps={{
          textField: {
            className: cn("p-3", className)
          },
          openPickerButton: {
            className: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")
          }
        }}
      />
    </LocalizationProvider>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
