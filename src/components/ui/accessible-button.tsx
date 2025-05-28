
import * as React from "react"
import { cn } from "@/lib/utils"

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "filter-active" | "filter-inactive"
  ariaLabel?: string
  children: React.ReactNode
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, variant = "primary", ariaLabel, children, ...props }, ref) => {
    const variantClasses = {
      primary: "emotiq-btn-primary",
      secondary: "emotiq-btn-secondary", 
      accent: "emotiq-btn-accent",
      "filter-active": "emotiq-filter-btn emotiq-filter-btn-active",
      "filter-inactive": "emotiq-filter-btn emotiq-filter-btn-inactive"
    }

    return (
      <button
        ref={ref}
        className={cn(variantClasses[variant], className)}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton"

export { AccessibleButton }
