import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

// 3D Tilt Card - Apple-style
interface TiltCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  intensity = 15
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={cn('perspective-1000', className)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
    </motion.div>
  )
}

// Ripple Effect Button
export const RippleButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
}> = ({ children, onClick, className }) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples([...ripples, { x, y, id }])
    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== id))
    }, 600)

    onClick?.()
  }

  return (
    <button
      className={cn('relative overflow-hidden', className)}
      onClick={addRipple}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0
          }}
          animate={{
            width: 400,
            height: 400,
            opacity: [1, 0],
            x: -200,
            y: -200
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      {children}
    </button>
  )
}

// Fluid Cursor Follower
export const FluidCursor: React.FC = () => {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [cursorX, cursorY])

  return (
    <>
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-vandyke pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring
        }}
      />
      <motion.div
        className="fixed w-2 h-2 rounded-full bg-vandyke pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorX,
          top: cursorY,
          x: 12,
          y: 12
        }}
      />
    </>
  )
}

// Animated Gradient Background
export const AnimatedGradientBg: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(102, 66, 40, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(93, 64, 55, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(212, 197, 176, 0.15) 0%, transparent 50%)
          `
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

// Typing Animation Effect
export const TypingText: React.FC<{
  text: string
  className?: string
  speed?: number
}> = ({ text, className, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-5 bg-vandyke ml-1"
      />
    </span>
  )
}

// Stacked Cards Effect
export const StackedCards: React.FC<{
  items: Array<{ id: number; content: React.ReactNode }>
}> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="relative h-[500px] w-full">
      {items.map((item, index) => {
        const offset = index - activeIndex
        const isActive = index === activeIndex

        return (
          <motion.div
            key={item.id}
            className="absolute inset-0 cursor-pointer"
            style={{
              zIndex: items.length - index
            }}
            animate={{
              y: offset * 20,
              scale: 1 - Math.abs(offset) * 0.05,
              opacity: 1 - Math.abs(offset) * 0.3,
              rotateZ: offset * 2
            }}
            onClick={() => setActiveIndex(index)}
            whileHover={isActive ? { scale: 1.02 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {item.content}
          </motion.div>
        )
      })}
    </div>
  )
}

// Noise Texture Overlay - Premium Effect
export const NoiseTexture: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity
      }}
    />
  )
}

// Infinite Scroll Marquee
export const InfiniteMarquee: React.FC<{
  children: React.ReactNode
  speed?: number
  direction?: 'left' | 'right'
}> = ({ children, speed = 50, direction = 'left' }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-block"
        animate={{
          x: direction === 'left' ? [0, -1000] : [-1000, 0]
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

// Split Text Animation
export const SplitText: React.FC<{
  text: string
  className?: string
  delay?: number
}> = ({ text, className, delay = 0 }) => {
  const letters = text.split('')

  return (
    <motion.div
      className={cn('inline-block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { y: 50, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                delay: delay + i * 0.03,
                type: 'spring',
                stiffness: 100
              }
            }
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Card Stack Carousel
export const CardStackCarousel: React.FC<{
  items: Array<React.ReactNode>
}> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  return (
    <div className="relative w-full h-96">
      {items.map((item, index) => {
        const offset = (index - currentIndex + items.length) % items.length
        
        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{ zIndex: items.length - offset }}
            animate={{
              scale: 1 - offset * 0.05,
              y: offset * 20,
              opacity: offset > 2 ? 0 : 1 - offset * 0.3,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {item}
          </motion.div>
        )
      })}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={prevCard}
          className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
        >
          ←
        </button>
        <button
          onClick={nextCard}
          className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  )
}
