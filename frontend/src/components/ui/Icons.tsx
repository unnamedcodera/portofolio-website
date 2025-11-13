import { motion } from "framer-motion"
import { 
  Sparkles, 
  Zap, 
  Star, 
  Heart, 
  TrendingUp,
  Award,
  Target,
  Rocket
} from "lucide-react"
import { cn } from "../../utils/cn"

interface IconWrapperProps {
  icon: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "gradient" | "outline" | "ghost"
  animated?: boolean
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
  xl: "w-20 h-20 text-xl",
}

const variantClasses = {
  default: "bg-white shadow-md border border-vandyke/10",
  gradient: "bg-gradient-to-br from-vandyke via-walnut to-dun text-white shadow-lg",
  outline: "border-2 border-vandyke text-vandyke bg-transparent",
  ghost: "bg-vandyke/5 text-vandyke hover:bg-vandyke/10",
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  className,
  size = "md",
  variant = "default",
  animated = true,
}) => {
  return (
    <motion.div
      className={cn(
        "rounded-xl flex items-center justify-center transition-all",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={animated ? { scale: 1.1, rotate: 5 } : undefined}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {icon}
    </motion.div>
  )
}

interface AnimatedIconProps {
  type: "sparkles" | "zap" | "star" | "heart" | "trending" | "award" | "target" | "rocket"
  className?: string
  size?: number
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  type,
  className,
  size = 24,
}) => {
  const icons = {
    sparkles: Sparkles,
    zap: Zap,
    star: Star,
    heart: Heart,
    trending: TrendingUp,
    award: Award,
    target: Target,
    rocket: Rocket,
  }

  const Icon = icons[type]

  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Icon size={size} />
    </motion.div>
  )
}

interface FloatingShapeProps {
  className?: string
  shape?: "circle" | "square" | "triangle"
  size?: number
  color?: string
  delay?: number
}

export const FloatingShape: React.FC<FloatingShapeProps> = ({
  className,
  shape = "circle",
  size = 60,
  color = "vandyke",
  delay = 0,
}) => {
  const shapes = {
    circle: "rounded-full",
    square: "rounded-lg",
    triangle: "rounded-sm",
  }

  return (
    <motion.div
      className={cn(
        "absolute opacity-10",
        shapes[shape],
        `bg-${color}`,
        className
      )}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, -15, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  )
}

interface PulsingDotProps {
  className?: string
  size?: "sm" | "md" | "lg"
  color?: string
}

export const PulsingDot: React.FC<PulsingDotProps> = ({
  className,
  size = "md",
  color = "vandyke",
}) => {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <motion.div
      className={cn("relative", className)}
    >
      <motion.div
        className={cn("rounded-full", sizes[size], `bg-${color}`)}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full",
          sizes[size],
          `bg-${color}/30`
        )}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
