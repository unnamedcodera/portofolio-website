import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-vandyke/10 to-walnut/10 text-vandyke hover:from-vandyke/20 hover:to-walnut/20",
        secondary:
          "border-transparent bg-vandyke/5 text-vandyke hover:bg-vandyke/10",
        outline: "text-vandyke border-vandyke/30 hover:bg-vandyke/5",
        gradient:
          "border-transparent bg-gradient-to-r from-vandyke via-walnut to-dun text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
