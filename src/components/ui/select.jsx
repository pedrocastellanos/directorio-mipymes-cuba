import { cn } from "@/lib/utils"

function Select({ className, children, ref, ...props }) {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-lg border border-border bg-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
