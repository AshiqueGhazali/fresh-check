import * as React from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
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

export { Input }
