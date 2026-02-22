import { cn } from "@/lib/utils"

function Input({ className, type, ref, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-border bg-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      ref={ref}
      {...props}
    />
  )
}

export { Input }
