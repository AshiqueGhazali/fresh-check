import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full rounded-[5px] outline-none border border-gray-300 px-3 py-2 text-sm",
        "focus:border-2 focus:border-[#10b981]",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
