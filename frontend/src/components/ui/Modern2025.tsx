import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

// Glassmorphism Card - 2025 Trend
interface GlassmorphicCardProps {
  children: React.ReactNode
  className?: string
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  intensity?: 'light' | 'medium' | 'strong'
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
  blur = 'md',
  intensity = 'medium'
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  const intensityClasses = {
    light: 'bg-white/10 border-white/10',
    medium: 'bg-white/20 border-white/20',
    strong: 'bg-white/30 border-white/30'
  }

  return (
    <motion.div
      className={cn(
        'rounded-2xl border shadow-lg',
        blurClasses[blur],
        intensityClasses[intensity],
        'hover:bg-white/30 transition-all duration-300',
        className
      )}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  )
}

// Particle Background - Modern Effect
export const ParticleBackground: React.FC<{ count?: number }> = ({ count = 50 }) => {
  const particles = Array.from({ length: count })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-vandyke/20 to-walnut/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Magnetic Button - Interactive Micro-interaction
interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 0.3
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}

// Parallax Section - Depth Effect
interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])
  const springY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div ref={ref} style={{ y: springY }} className={className}>
      {children}
    </motion.div>
  )
}

// Morphing Shape - Creative Animation
export const MorphingShape: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div
      className={cn('absolute', className)}
      animate={{
        borderRadius: [
          '60% 40% 30% 70%/60% 30% 70% 40%',
          '30% 60% 70% 40%/50% 60% 30% 60%',
          '60% 40% 30% 70%/60% 30% 70% 40%'
        ],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        background: 'linear-gradient(135deg, rgba(102, 66, 40, 0.1) 0%, rgba(212, 197, 176, 0.1) 100%)',
        filter: 'blur(40px)'
      }}
    />
  )
}

// Text Reveal Animation - Modern Typography
interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  children, 
  className,
  delay = 0 
}) => {
  const words = children.split(' ')

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay
          }
        }
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          variants={{
            hidden: { y: 20, opacity: 0, rotateX: 90 },
            visible: {
              y: 0,
              opacity: 1,
              rotateX: 0,
              transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Gradient Orb - Dynamic Background
export const GradientOrb: React.FC<{
  size?: number
  color1?: string
  color2?: string
  className?: string
}> = ({
  size = 400,
  color1 = 'rgba(102, 66, 40, 0.4)',
  color2 = 'rgba(93, 64, 55, 0.4)',
  className
}) => {
  return (
    <motion.div
      className={cn('absolute rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color1} 0%, ${color2} 50%, transparent 100%)`,
        filter: 'blur(60px)'
      }}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}

// Scroll Progress Bar - UX Enhancement
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/10 backdrop-blur-sm">
      <motion.div
        className="h-full bg-gradient-to-r from-vandyke via-walnut to-dun origin-left shadow-[0_0_20px_rgba(102,66,40,0.6)] relative"
        style={{ scaleX }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
      </motion.div>
    </div>
  )
}

// Bento Grid - Modern Layout (2025 trend)
export const BentoGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]',
      className
    )}>
      {children}
    </div>
  )
}

export const BentoCard: React.FC<{
  children: React.ReactNode
  className?: string
  span?: '1' | '2' | '3' | '4'
  rowSpan?: '1' | '2' | '3'
}> = ({ children, className, span = '1', rowSpan = '1' }) => {
  const spanClasses = {
    '1': 'col-span-1',
    '2': 'md:col-span-2',
    '3': 'md:col-span-3',
    '4': 'md:col-span-4'
  }

  const rowSpanClasses = {
    '1': 'row-span-1',
    '2': 'row-span-2',
    '3': 'row-span-3'
  }

  return (
    <motion.div
      className={cn(
        'rounded-2xl p-6 overflow-hidden relative group',
        spanClasses[span],
        rowSpanClasses[rowSpan],
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  )
}

// Animated Counter - Stats Display
export const AnimatedCounter: React.FC<{
  value: number
  duration?: number
  suffix?: string
  className?: string
}> = ({ value, duration = 2, suffix = '', className }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!ref.current || hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          const increment = value / (duration * 60)
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, 1000 / 60)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}

// Spotlight Effect - Premium Hover
export const SpotlightCard: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: '300px',
            height: '300px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(102, 66, 40, 0.2) 0%, transparent 70%)',
            transition: 'opacity 0.3s'
          }}
        />
      )}
      {children}
    </div>
  )
}
