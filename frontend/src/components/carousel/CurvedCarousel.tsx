import React from 'react'
import { motion } from 'framer-motion'
import { CarouselCard } from './CarouselCard'

interface CurvedCarouselProps {
  slides: Array<{
    title: string
    description: string
    color: string
  }>
  currentSlide: number
}

export const CurvedCarousel: React.FC<CurvedCarouselProps> = ({
  slides,
  currentSlide
}) => {
  return (
    <div className="relative w-full h-[480px] max-w-5xl mx-auto overflow-visible flex items-center justify-center">
      {/* Carousel Container dengan center yang tepat dan perspective yang diperbaiki */}
      <div 
        className="relative w-full h-full flex items-center justify-center" 
        style={{ 
          perspective: "1400px", // Perspective yang optimal untuk tampilan terbaik
          perspectiveOrigin: "center center", // Pastikan perspective dari tengah
          transformStyle: "preserve-3d" // Preserve 3D pada container juga
        }}
      >
        
        {/* Container Roda Melengkung - Rotasi tepat di tengah dengan layering yang sempurna */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: 'center center' // Rotasi dari tengah absolut
          }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 20, // Roda berputar dalam 20 detik
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Render SEMUA slide dengan layering berdasarkan kedalaman Z */}
          {slides
            .map((slide, index) => {
              // Hitung sudut untuk setiap gambar
              const totalSlides = slides.length
              const anglePerSlide = 360 / totalSlides
              const currentAngle = (index * anglePerSlide) - (currentSlide * anglePerSlide)
              const radius = 550 // Jari-jari yang optimal untuk tampilan terbaik
              
              // Konversi ke radian
              const angleRad = (currentAngle * Math.PI) / 180
              
              // Hitung posisi 3D dengan center yang tepat dan jarak yang optimal
              const x = Math.sin(angleRad) * radius // Posisi horizontal
              const z = Math.cos(angleRad) * radius // Kedalaman - menentukan layering
              const y = Math.sin(angleRad) * 50 // Naik turun dengan range yang halus
              
              // Tentukan gambar mana yang di tengah (z terbesar = paling dekat)
              const normalizedAngle = ((currentAngle % 360) + 360) % 360
              const isCenter = normalizedAngle >= 350 || normalizedAngle <= 10
              
              // Hitung jarak dari tengah untuk scaling progresif
              const distanceFromCenter = Math.min(
                Math.abs(normalizedAngle),
                Math.abs(normalizedAngle - 360)
              ) / 180
              
              // Scaling progresif: membesar menuju tengah, mengecil setelah melewati tengah
              // Menggunakan kurva yang smooth untuk transisi yang natural
              const scaleProgress = 1 - distanceFromCenter // 1 = tengah, 0 = paling jauh
              const smoothScale = Math.pow(scaleProgress, 0.8) // Kurva easing yang smooth
              
              const baseScale = 0.4 + (smoothScale * 1.5) // Scale dari 0.4 hingga 1.9
              const opacity = 0.3 + (smoothScale * 0.7) // Opacity dari 0.3 hingga 1.0
              
              // Ukuran kartu dengan transisi progresif yang proporsional dan elegan
              const cardWidth = 160 + (smoothScale * 200) // Dari 160px hingga 360px
              const cardHeight = 200 + (smoothScale * 240) // Dari 200px hingga 440px
              
              return { slide, index, x, y, z, isCenter, distanceFromCenter, baseScale, opacity, cardWidth, cardHeight, currentAngle }
            })
            .sort((a, b) => a.z - b.z) // Sort berdasarkan Z untuk layering yang benar (belakang ke depan)
            .map(({ slide, index, x, y, z, isCenter, distanceFromCenter, baseScale, opacity, cardWidth, cardHeight }) => {
              
              // Z-index berdasarkan kedalaman - gambar paling depan mendapat z-index tertinggi
              const zIndex = Math.round(z) + 1000 // Offset untuk memastikan nilai positif
              
              return (
                <motion.div
                  key={`curve-${index}`}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`,
                    transformStyle: "preserve-3d",
                    zIndex: zIndex // Layering berdasarkan kedalaman
                  }}
                >
                  {/* Counter-rotate gambar agar selalu tegak dan tidak ter-invert */}
                  <motion.div
                    style={{
                      transformStyle: "preserve-3d"
                    }}
                    animate={{ 
                      rotateY: -360, // Counter-rotate untuk menjaga gambar selalu tegak
                      scale: baseScale // Scaling progresif tanpa animasi berlebihan
                    }}
                    transition={{
                      rotateY: {
                        duration: 20, // Sama dengan parent rotation
                        repeat: Infinity,
                        ease: "linear"
                      },
                      scale: {
                        duration: 0.8, // Transisi scale yang smooth dan cepat
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <CarouselCard
                      slide={slide}
                      isCenter={isCenter}
                      cardWidth={cardWidth}
                      cardHeight={cardHeight}
                      opacity={opacity}
                      distanceFromCenter={distanceFromCenter}
                    />
                  </motion.div>
                </motion.div>
              )
            })}
        </motion.div>
      </div>
    </div>
  )
}