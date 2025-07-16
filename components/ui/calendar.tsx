import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-3", className)}
      modifiersClassNames={{
        selected: "!bg-violet-600 !text-white !border-violet-600",
        range_start: "!bg-violet-500 !text-white",
        range_end: "!bg-violet-500 !text-white",
        range_middle: "!bg-violet-100 !text-violet-700",
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
 