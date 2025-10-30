import React from 'react'
import { motion } from 'framer-motion'

interface CarouselCardProps {
  slide: {
    title: string
    description: string
    color: string
  }
  isCenter: boolean
  cardWidth: number
  cardHeight: number
  opacity: number
  distanceFromCenter: number
}

export const CarouselCard: React.FC<CarouselCardProps> = ({
  slide,
  isCenter,
  cardWidth,
  cardHeight,
  opacity,
  distanceFromCenter
}) => {
  return (
    <motion.div
      className={`bg-gradient-to-br ${slide.color} rounded-xl backdrop-blur-sm border relative overflow-hidden ${
        isCenter 
          ? 'shadow-2xl border-white/70' 
          : 'shadow-md border-white/15'
      }`}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        opacity: opacity,
        zIndex: isCenter ? 400 : Math.round((1 - distanceFromCenter) * 100),
        backfaceVisibility: 'visible' // Pastikan selalu terlihat
      }}
      whileHover={{ 
        scale: 1.05, // Hover scale yang lebih subtle
        opacity: Math.min(opacity * 1.2, 1),
        transition: { duration: 0.2 }
      }}
    >
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-center text-white">
          <motion.h4 
            className={`font-light text-magnolia tracking-wide mb-3 ${
              isCenter ? 'text-2xl md:text-3xl' : 'text-xs md:text-sm'
            }`}
            animate={isCenter ? {
              opacity: [0.95, 1, 0.95]
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {slide.title}
          </motion.h4>
          <motion.p 
            className={`text-white/90 leading-relaxed ${
              isCenter ? 'text-sm md:text-base' : 'text-xs'
            }`}
            animate={isCenter ? {
              opacity: [0.85, 0.95, 0.85]
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {slide.description}
          </motion.p>
        </div>
      </div>
      
      {/* Partikel khusus untuk gambar tengah */}
      {isCenter && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-magnolia/50 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 3) * 25}%`
              }}
              animate={{
                y: [-15, 15, -15],
                x: [-5, 5, -5],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.6, 1.2, 0.6]
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Efek spotlight untuk gambar tengah */}
      {isCenter && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-0 border-2 border-magnolia/40 rounded-xl"
            animate={{
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}
    </motion.div>
  )
}