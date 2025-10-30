import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface FrameSliderProps {
  slides: Array<{
    title: string
    description: string
    color: string
  }>
  currentSlide: number
}

export const FrameSlider: React.FC<FrameSliderProps> = ({
  slides,
  currentSlide
}) => {
  const [visibleFrames, setVisibleFrames] = useState<number[]>([])

  // Calculate which frames to show (center + surrounding frames)
  useEffect(() => {
    const totalSlides = slides.length
    const frames: number[] = []
    
    for (let i = -2; i <= 2; i++) {
      const frameIndex = (currentSlide + i + totalSlides) % totalSlides
      frames.push(frameIndex)
    }
    
    setVisibleFrames(frames)
  }, [currentSlide, slides.length])

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] max-w-7xl mx-auto overflow-hidden flex items-center justify-center px-4">
      {/* Frame container */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Frames */}
        <div className="flex items-center justify-center space-x-2 md:space-x-4 lg:space-x-6">
          {visibleFrames.map((slideIndex, position) => {
            const slide = slides[slideIndex]
            const isCenter = position === 2 // Center frame (index 2 in array of 5)
            const distanceFromCenter = Math.abs(position - 2)
            
            // Scale and opacity based on position
            const scale = isCenter ? 1 : 0.7 - (distanceFromCenter * 0.1)
            const opacity = isCenter ? 1 : 0.6 - (distanceFromCenter * 0.2)
            const zIndex = isCenter ? 50 : 40 - distanceFromCenter
            
            // Responsive frame dimensions - using base sizes for different screen sizes
            const frameWidth = isCenter ? 280 : 160 - (distanceFromCenter * 20)
            const frameHeight = isCenter ? 350 : 200 - (distanceFromCenter * 30)
            
            return (
              <motion.div
                key={`frame-${slideIndex}-${position}`}
                className="relative flex-shrink-0"
                style={{ zIndex }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity,
                  scale,
                  y: isCenter ? 0 : 20,
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
                }}
              >
                {/* Frame border */}
                <div
                  className={`relative bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden transform-gpu ${
                    isCenter 
                      ? 'shadow-2xl border-2 md:border-4 border-white ring-2 ring-white/50' 
                      : 'shadow-lg border border-white/80'
                  }`}
                  style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                  }}
                >
                  {/* Inner content frame */}
                  <div className="absolute inset-2 rounded-xl overflow-hidden">
                    {isCenter ? (
                      // Center frame with NEWS DHH trademark showcase
                      <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                        {/* Premium background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-transparent to-amber-600/20"></div>
                          <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                          }}></div>
                        </div>
                        
                        {/* NEWS DHH Trademark Image - Centered and Prominent */}
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                          <div className="relative">
                            <img
                              src="/src/img/NEWS DHH.png"
                              alt="NEWS DHH - Official Trademark"
                              className="max-w-full max-h-full object-contain drop-shadow-2xl"
                              style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
                            />
                            
                            {/* Trademark glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                          </div>
                        </div>

                        {/* Premium badge overlay */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            ™ OFFICIAL
                          </div>
                        </div>

                        {/* Brand information overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <motion.h3 
                              className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-white tracking-wide"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.6 }}
                            >
                              {slide.title}
                            </motion.h3>
                            <motion.p 
                              className="text-sm md:text-base text-amber-200 font-medium"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5, duration: 0.6 }}
                            >
                              {slide.description}
                            </motion.p>
                            <div className="mt-2 text-xs text-white/60">
                              Trademark & Brand Identity
                            </div>
                          </div>
                        </div>

                        {/* Premium shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-400/50"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-amber-400/50"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-amber-400/50"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-400/50"></div>
                      </div>
                    ) : (
                      // Side frames with gradient backgrounds
                      <div className={`w-full h-full bg-gradient-to-br ${slide.color} flex items-center justify-center p-2 md:p-4`}>
                        <div className="text-center text-white">
                          <h4 className="text-xs md:text-sm lg:text-lg font-semibold mb-1 md:mb-2 opacity-90">
                            {slide.title}
                          </h4>
                          <p className="text-xs md:text-sm text-white/80 leading-tight md:leading-relaxed">
                            {slide.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Frame shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
                    animate={isCenter ? {
                      opacity: [0, 1, 0],
                      x: ['-100%', '100%']
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }}
                  />
                </div>

                {/* Frame shadow */}
                <div 
                  className={`absolute inset-0 rounded-2xl ${
                    isCenter 
                      ? 'shadow-2xl' 
                      : 'shadow-lg'
                  }`}
                  style={{
                    background: 'transparent',
                    filter: `blur(${isCenter ? 20 : 10}px)`,
                    opacity: 0.3,
                    zIndex: -1
                  }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Side decorative elements - responsive */}
        <div className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 w-16 md:w-32 h-1 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
        <div className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 w-16 md:w-32 h-1 bg-gradient-to-l from-transparent to-white/20 rounded-full" />
      </div>

      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}