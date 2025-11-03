import React from 'react'
import { motion } from 'framer-motion'

interface CarouselProgressProps {
  slides: Array<{
    title: string
    description: string
    color: string
  }>
  currentSlide: number
}

export const CarouselProgress: React.FC<CarouselProgressProps> = ({
  slides,
  currentSlide
}) => {
  return (
    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
      {slides.map((_, index) => (
        <motion.div
          key={index}
          className={`w-3 h-3 rounded-full border-2 ${
            index === currentSlide 
              ? 'bg-magnolia border-magnolia' 
              : 'bg-transparent border-magnolia/40'
          }`}
          animate={{
            scale: index === currentSlide ? [1, 1.4, 1] : 1,
            opacity: index === currentSlide ? 1 : 0.6,
            borderColor: index === currentSlide 
              ? ['rgba(248, 244, 255, 1)', 'rgba(248, 244, 255, 0.8)', 'rgba(248, 244, 255, 1)']
              : 'rgba(248, 244, 255, 0.4)'
          }}
          transition={{
            duration: 0.4,
            scale: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      ))}
    </div>
  )
}