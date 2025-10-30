import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { slidesAPI } from '../services/api'

interface Slide {
  id: number
  title: string
  subtitle?: string
  description: string
  image_url: string
  button_text?: string
  button_link?: string
}

const ArtisticFrameSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  
  // Motion values for interactive effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring animations for parallax
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  
  // Transform values for parallax effect
  const rotateX = useTransform(springY, [-300, 300], [5, -5])
  const rotateY = useTransform(springX, [-300, 300], [-5, 5])

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await slidesAPI.getAll()
        setSlides(data)
      } catch (error) {
        console.error('Error fetching slides:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSlides()
  }, [])

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Navigate with direction tracking
  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection
      if (nextIndex < 0) nextIndex = slides.length - 1
      if (nextIndex >= slides.length) nextIndex = 0
      return nextIndex
    })
  }

  useEffect(() => {
    if (slides.length === 0) return
    const interval = setInterval(() => {
      paginate(1)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  if (loading || slides.length === 0) {
    return (
      <div className="relative w-full mx-auto px-4 py-20">
        <div className="text-center text-2xl text-vandyke">Loading slides...</div>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full mx-auto px-4 overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Artistic Doodle Background Layer */}
      <div className="absolute inset-0 -mx-4 overflow-hidden pointer-events-none">
        {/* Abstract circles and shapes */}
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 rounded-full border-2 border-vandyke/10"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-20 right-20 w-48 h-48 rounded-full border border-walnut/15"
          animate={{
            rotate: -360,
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Curved lines */}
        <svg className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10" viewBox="0 0 400 400">
          <motion.path
            d="M50,200 Q150,50 250,200 T450,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-vandyke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </svg>
        
        <svg className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-8" viewBox="0 0 400 400">
          <motion.path
            d="M100,300 Q200,150 300,300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-walnut"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1
            }}
          />
        </svg>
        
        {/* Dots pattern */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-dun"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.05, 0.2, 0.05],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Abstract squiggles */}
        <svg className="absolute top-1/2 left-10 w-32 h-32 opacity-12" viewBox="0 0 100 100">
          <motion.path
            d="M10,50 Q25,25 40,50 T70,50 T100,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-battleshipgray"
            animate={{
              d: [
                "M10,50 Q25,25 40,50 T70,50 T100,50",
                "M10,50 Q25,75 40,50 T70,50 T100,50",
                "M10,50 Q25,25 40,50 T70,50 T100,50"
              ]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
        
        <svg className="absolute bottom-20 right-10 w-40 h-40 opacity-10" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-vandyke"
            strokeDasharray="5,5"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </svg>
        
        {/* Geometric shapes */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-24 h-24 border border-dun/20 rotate-45"
          animate={{
            rotate: [45, 225, 45],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Frame Container */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[550px] flex items-center justify-between gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-7xl mx-auto px-2 sm:px-0">
        
        {/* LEFT PREVIEW - Previous Slide */}
        <motion.div
          className="relative w-20 sm:w-32 md:w-40 lg:w-48 flex-shrink-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.08 }}
        >
          <motion.button
            onClick={() => paginate(-1)}
            className="relative w-full cursor-pointer group"
            whileTap={{ scale: 0.92 }}
          >
            {/* Blur backdrop with animation */}
            <motion.div 
              className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl"
              animate={{ 
                opacity: [0.6, 0.8, 0.6],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div 
              className="relative bg-gradient-to-br from-vandyke/20 via-walnut/10 to-transparent rounded-lg sm:rounded-xl overflow-hidden h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px] shadow-xl"
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                y: -5
              }}
            >
              {/* Background Image for Preview */}
              {slides[(currentIndex - 1 + slides.length) % slides.length].image_url && (
                <div className="absolute inset-0">
                  <img
                    src={slides[(currentIndex - 1 + slides.length) % slides.length].image_url}
                    alt={slides[(currentIndex - 1 + slides.length) % slides.length].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              )}
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 z-10">
                <motion.h3 
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white text-center drop-shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {slides[(currentIndex - 1 + slides.length) % slides.length].title}
                </motion.h3>
                
                {/* DH Trademark with pulse */}
                <motion.img
                  src="/src/img/DH.png"
                  alt="DH"
                  className="absolute bottom-2 right-2 w-6 sm:w-8 h-auto object-contain opacity-30"
                  animate={{ 
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              {/* Hover overlay with gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.svg 
                  className="w-8 h-8 text-white drop-shadow-lg" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </motion.svg>
              </motion.div>
              
              {/* Animated particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </motion.div>
          </motion.button>
        </motion.div>
        
        {/* Center Frame Display with Parallax */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="relative z-10 flex-1 max-w-xl lg:max-w-2xl"
            initial={{ opacity: 0, scale: 0.9, rotateY: direction > 0 ? 15 : -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: direction > 0 ? -15 : 15 }}
            transition={{
              duration: 0.6,
              ease: [0.6, -0.05, 0.01, 0.99]
            }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000
            }}
          >
            {/* Artistic Blur Frame with animated layers */}
            <motion.div className="relative">
              {/* Outer glow layers with pulse */}
              <motion.div 
                className="absolute -inset-6 bg-gradient-to-br from-vandyke/20 via-walnut/15 to-dun/10 blur-2xl rounded-3xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl rounded-3xl"
                animate={{
                  rotate: [0, 1, -1, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Main Frame Content */}
              <motion.div 
                className="relative bg-gradient-to-br from-walnut/20 via-dun/10 to-transparent rounded-2xl sm:rounded-3xl overflow-hidden h-[300px] sm:h-[380px] md:h-[480px] shadow-2xl border border-white/20"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.5)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Image with Overlay */}
                {slides[currentIndex].image_url && (
                  <div className="absolute inset-0">
                    <img
                      src={slides[currentIndex].image_url}
                      alt={slides[currentIndex].title}
                      className="w-full h-full object-cover"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
                  </div>
                )}
                
                {/* Content Area */}
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 z-10">
                  
                  {/* Slide Title */}
                  <motion.h2
                    className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 text-center tracking-tight drop-shadow-2xl"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {slides[currentIndex].title}
                  </motion.h2>
                  
                  {/* Slide Description */}
                  <motion.p
                    className="text-sm sm:text-lg md:text-2xl text-white/95 font-light text-center max-w-lg drop-shadow-lg px-2"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {slides[currentIndex].description}
                  </motion.p>

                  {/* DH Trademark Watermark */}
                  <motion.div
                    className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 opacity-40 hover:opacity-70 transition-opacity"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <img
                      src="/src/img/DH.png"
                      alt="DH Trademark"
                      className="w-10 sm:w-16 md:w-20 h-auto object-contain drop-shadow-lg"
                    />
                  </motion.div>

                  {/* Corner Accents */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-8 sm:w-12 h-8 sm:h-12 border-l-2 border-t-2 border-white/40"></div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 sm:w-12 h-8 sm:h-12 border-r-2 border-t-2 border-white/40"></div>
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-8 sm:w-12 h-8 sm:h-12 border-l-2 border-b-2 border-white/40"></div>
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-8 sm:w-12 h-8 sm:h-12 border-r-2 border-b-2 border-white/40"></div>

                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT PREVIEW - Next Slide */}
        <motion.div
          className="relative w-20 sm:w-32 md:w-40 lg:w-48 flex-shrink-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.08 }}
        >
          <motion.button
            onClick={() => paginate(1)}
            className="relative w-full cursor-pointer group"
            whileTap={{ scale: 0.92 }}
          >
            {/* Blur backdrop with animation */}
            <motion.div 
              className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl"
              animate={{ 
                opacity: [0.6, 0.8, 0.6],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            <motion.div 
              className="relative bg-gradient-to-br from-dun/20 via-battleshipgray/10 to-transparent rounded-lg sm:rounded-xl overflow-hidden h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px] shadow-xl"
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                y: -5
              }}
            >
              {/* Background Image for Preview */}
              {slides[(currentIndex + 1) % slides.length].image_url && (
                <div className="absolute inset-0">
                  <img
                    src={slides[(currentIndex + 1) % slides.length].image_url}
                    alt={slides[(currentIndex + 1) % slides.length].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              )}
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 z-10">
                <motion.h3 
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white text-center drop-shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {slides[(currentIndex + 1) % slides.length].title}
                </motion.h3>
                
                {/* DH Trademark with pulse */}
                <motion.img
                  src="/src/img/DH.png"
                  alt="DH"
                  className="absolute bottom-2 right-2 w-6 sm:w-8 h-auto object-contain opacity-30"
                  animate={{ 
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </div>
              
              {/* Hover overlay with gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-l from-black/30 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.svg 
                  className="w-8 h-8 text-white drop-shadow-lg" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </motion.svg>
              </motion.div>
              
              {/* Animated particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.3 + 0.5
                  }}
                />
              ))}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Progress Indicators */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-vandyke' 
                  : 'w-2 bg-vandyke/30'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Ambient Background Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-dun/20 via-transparent to-transparent blur-3xl -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}

export default ArtisticFrameSlider
