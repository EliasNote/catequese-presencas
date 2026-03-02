import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-[#FFF200] text-slate-900 shadow-sm": variant === "default",
          "border-transparent bg-slate-100 text-slate-900": variant === "secondary",
          "border-transparent bg-red-600 text-white": variant === "destructive",
          "border-transparent bg-green-600 text-white": variant === "success",
          "border-transparent bg-yellow-400 text-slate-900": variant === "warning",
          "text-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
