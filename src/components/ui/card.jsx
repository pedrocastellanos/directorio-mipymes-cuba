import { cn } from "@/lib/utils"

function Card({ className, ref, ...props }) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ref, ...props }) {
  return (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />
  )
}

function CardTitle({ className, ref, ...props }) {
  return (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
}

function CardDescription({ className, ref, ...props }) {
  return (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

function CardContent({ className, ref, ...props }) {
  return (
    <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
