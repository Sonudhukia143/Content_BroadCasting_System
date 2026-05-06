import * as React from "react"
import { cn } from "@/lib/utils.jsx"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/80",
      variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      variant === "success" && "bg-green-100 text-green-900",
      variant === "warning" && "bg-yellow-100 text-yellow-900",
      variant === "danger" && "bg-red-100 text-red-900",
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge }