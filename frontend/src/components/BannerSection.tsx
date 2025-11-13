import { motion } from 'framer-motion'
import ArtisticFrameSlider from './ArtisticFrameSlider'
import {
  ParticleBackground,
  GradientOrb
} from './ui/Modern2025'
import { NoiseTexture } from './ui/Interactive3D'

const BannerSection: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Modern Background Effects */}
      <NoiseTexture opacity={0.03} />
      <ParticleBackground count={50} />
      <GradientOrb size={600} color1="rgba(102, 66, 40, 0.2)" color2="rgba(93, 64, 55, 0.15)" className="-top-48 -left-48" />
      <GradientOrb size={500} color1="rgba(212, 197, 176, 0.2)" color2="rgba(141, 145, 141, 0.15)" className="-bottom-48 -right-48" />
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-vandyke/5 via-transparent to-walnut/5"></div>
      
      {/* Full Randomized Doodle Background Layer - Like Loading Screen */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {/* Paint Brush Icons */}
        <motion.div
          className="absolute top-[10%] left-[8%]"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-vandyke/20">
            <path d="M9.5 2L8 3.5L12.5 8L14 6.5L9.5 2Z" fill="currentColor"/>
            <path d="M8 3.5L3 8.5L4.5 10L9.5 5L8 3.5Z" fill="currentColor"/>
            <path d="M12.5 8L10 10.5L11.5 12L14 9.5L12.5 8Z" fill="currentColor"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[15%] right-[12%]"
          animate={{
            rotate: [0, -20, 20, 0],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-walnut/25">
            <path d="M9.5 2L8 3.5L12.5 8L14 6.5L9.5 2Z" fill="currentColor"/>
            <path d="M7 13.5L5.5 15L4 16.5L3 17.5L3.5 18.5L4.5 18L6 16.5L7.5 15L7 13.5Z" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Palette Icons */}
        <motion.div
          className="absolute top-[25%] right-[15%]"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" className="text-dun/30">
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C13.5 22 15 21 15 19.5C15 18.7 14.7 18 14.5 17.4C14.3 16.9 14 16.5 14 16C14 15.2 14.7 14.5 15.5 14.5H17C19.8 14.5 22 12.3 22 9.5C22 5.4 17.5 2 12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="7" cy="9" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="7" r="1.5" fill="currentColor"/>
            <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="9" cy="14" r="1.5" fill="currentColor"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[35%] left-[18%]"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        >
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none" className="text-battleshipgray/25">
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C13.5 22 15 21 15 19.5C15 18.7 14.7 18 14.5 17.4C14.3 16.9 14 16.5 14 16C14 15.2 14.7 14.5 15.5 14.5H17C19.8 14.5 22 12.3 22 9.5C22 5.4 17.5 2 12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
          </svg>
        </motion.div>

        {/* Pencil/Pen Icons */}
        <motion.div
          className="absolute top-[45%] left-[5%]"
          animate={{
            rotate: [0, 25, -25, 0],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-vandyke/28">
            <path d="M3 21L6 18L18 6L21 3L18 6L6 18L3 21Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
            <path d="M14.5 5.5L18.5 9.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-[15%] right-[25%]"
          animate={{
            rotate: [0, -30, 30, 0],
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <svg width="85" height="85" viewBox="0 0 24 24" fill="none" className="text-walnut/22">
            <path d="M12 19L19 12L12 5L5 12L12 19Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.18"/>
            <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        {/* Star/Sparkle Icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          >
            <svg width={50 + i * 5} height={50 + i * 5} viewBox="0 0 24 24" fill="none" className="text-dun/20">
              <path d="M12 2L15 9L22 9L16.5 14L18.5 21L12 16.5L5.5 21L7.5 14L2 9L9 9L12 2Z" fill="currentColor"/>
            </svg>
          </motion.div>
        ))}

        {/* Circle/Ring Icons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${15 + Math.random() * 70}%`,
            }}
            animate={{
              rotate: i % 2 === 0 ? [0, 360] : [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg width={60 + i * 10} height={60 + i * 10} viewBox="0 0 24 24" fill="none" className={i % 3 === 0 ? "text-vandyke/15" : i % 3 === 1 ? "text-walnut/15" : "text-battleshipgray/15"}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15"/>
            </svg>
          </motion.div>
        ))}

        {/* Triangle/Geometric Icons */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`triangle-${i}`}
            className="absolute"
            style={{
              top: `${25 + Math.random() * 50}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              rotate: [0, 120, 240, 360],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 14 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          >
            <svg width={55 + i * 8} height={55 + i * 8} viewBox="0 0 24 24" fill="none" className="text-dun/18">
              <path d="M12 3L21 20H3L12 3Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
            </svg>
          </motion.div>
        ))}

        {/* Easel/Canvas Icons */}
        <motion.div
          className="absolute top-[30%] left-[25%]"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="140" height="140" viewBox="0 0 24 24" fill="none" className="text-walnut/20">
            <path d="M6 2L4 8M18 2L20 8" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="5" y="8" width="14" height="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12"/>
            <path d="M5 18L3 22M19 18L21 22" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 18L12 22" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[35%] right-[20%]"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-vandyke/22">
            <rect x="4" y="4" width="16" height="14" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
            <path d="M3 4L6 2M21 4L18 2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 18L2 22M20 18L22 22" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        {/* Ruler/Measuring Tools */}
        <motion.div
          className="absolute top-[50%] right-[30%]"
          animate={{
            rotate: [0, 20, -20, 0],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 8.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        >
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" className="text-dun/20">
            <rect x="2" y="8" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.18"/>
            <path d="M6 8V12M10 8V12M14 8V12M18 8V12" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </motion.div>

        {/* Scissors/Cutting Tools */}
        <motion.div
          className="absolute bottom-[25%] left-[35%]"
          animate={{
            rotate: [0, 25, 0],
            scale: [1, 1.18, 1],
          }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8
          }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-battleshipgray/18">
            <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
            <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
            <path d="M6 6L20 18M6 18L20 6" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        {/* Small Dots/Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 4 === 0 ? 'rgba(107, 68, 35, 0.15)' : i % 4 === 1 ? 'rgba(139, 111, 71, 0.15)' : i % 4 === 2 ? 'rgba(201, 184, 152, 0.15)' : 'rgba(128, 128, 128, 0.15)'
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              scale: [0.8, 1.5, 0.8],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}

        {/* Square/Rectangle Icons */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`square-${i}`}
            className="absolute"
            style={{
              top: `${35 + Math.random() * 30}%`,
              left: `${30 + Math.random() * 40}%`,
            }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 16 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i
            }}
          >
            <svg width={70 + i * 8} height={70 + i * 8} viewBox="0 0 24 24" fill="none" className="text-battleshipgray/15">
              <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12"/>
            </svg>
          </motion.div>
        ))}
      </div>
      
      {/* Main content container - absolutely centered */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Frame Slider */}
          <div className="w-full">
            <ArtisticFrameSlider />
          </div>
        </div>
      </div>

      {/* Running Text Container - Positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full">
        {/* Doodle dots along running text path */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`running-dot-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-vandyke/20"
              style={{
                left: `${i * 8.5}%`,
                bottom: `${60 + (i % 2) * 20}px`
              }}
              animate={{
                scale: [1, 1.5, 1],
                y: [-5, 5, -5]
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </div>
        
        {/* First running text */}
        <motion.div
          className="absolute bottom-16 left-0 w-full overflow-hidden"
        >
          <motion.div
            className="flex"
            animate={{
              x: [0, '-50%']
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop"
            }}
          >
            <div className="bg-vandyke/6 backdrop-blur-sm border-y border-vandyke/10 py-2 flex-shrink-0">
              <div className="text-xl md:text-3xl font-light text-vandyke/20 whitespace-nowrap tracking-wider">
                MANUFACTURING • BRANDING • ARCHITECTURE • DEVELOPMENT • MOTION • EXCELLENCE • MANUFACTURING • BRANDING • ARCHITECTURE • DEVELOPMENT • MOTION • EXCELLENCE • 
              </div>
            </div>
            <div className="bg-vandyke/6 backdrop-blur-sm border-y border-vandyke/10 py-2 flex-shrink-0">
              <div className="text-xl md:text-3xl font-light text-vandyke/20 whitespace-nowrap tracking-wider">
                MANUFACTURING • BRANDING • ARCHITECTURE • DEVELOPMENT • MOTION • EXCELLENCE • MANUFACTURING • BRANDING • ARCHITECTURE • DEVELOPMENT • MOTION • EXCELLENCE • 
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Second running text */}
        <motion.div
          className="absolute bottom-4 left-0 w-full overflow-hidden"
        >
          <motion.div
            className="flex"
            animate={{
              x: ['-50%', 0]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop"
            }}
          >
            <div className="bg-walnut/6 backdrop-blur-sm border-y border-walnut/10 py-2 flex-shrink-0">
              <div className="text-lg md:text-2xl font-light text-walnut/15 whitespace-nowrap tracking-wider">
                CREATIVE DESIGN • INNOVATION • QUALITY • PRECISION • EVERYTHING BETWEEN • CREATIVE DESIGN • INNOVATION • QUALITY • PRECISION • EVERYTHING BETWEEN • 
              </div>
            </div>
            <div className="bg-walnut/6 backdrop-blur-sm border-y border-walnut/10 py-2 flex-shrink-0">
              <div className="text-lg md:text-2xl font-light text-walnut/15 whitespace-nowrap tracking-wider">
                CREATIVE DESIGN • INNOVATION • QUALITY • PRECISION • EVERYTHING BETWEEN • CREATIVE DESIGN • INNOVATION • QUALITY • PRECISION • EVERYTHING BETWEEN • 
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default BannerSection
