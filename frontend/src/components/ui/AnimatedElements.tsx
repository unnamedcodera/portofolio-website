import { motion } from "framer-motion"
import { cn } from "../../utils/cn"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  animate = false,
}) => {
  return (
    <motion.span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-vandyke via-walnut to-dun",
        className
      )}
      animate={
        animate
          ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }
          : undefined
      }
      style={animate ? { backgroundSize: "200% auto" } : undefined}
    >
      {children}
    </motion.span>
  )
}

interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
}

export const SectionBadge: React.FC<SectionBadgeProps> = ({
  children,
  className,
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "inline-block px-6 py-2 bg-gradient-to-r from-vandyke/10 via-walnut/10 to-dun/10 rounded-full text-vandyke text-sm font-semibold border border-vandyke/20 tracking-wide",
        className
      )}
    >
      {children}
    </motion.span>
  )
}

interface GlowingCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  className,
  glowColor = "vandyke",
}) => {
  return (
    <motion.div
      className={cn("relative group", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-vandyke to-walnut rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500",
          glowColor === "dun" && "from-dun to-walnut"
        )}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  delay = 0,
  duration = 3,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}
