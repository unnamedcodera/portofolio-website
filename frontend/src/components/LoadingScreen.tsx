import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-magnolia via-dun to-battleshipgray">
      {/* Background animated paint elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Paint Brush - Large */}
        <motion.div
          className="absolute"
          style={{ top: '8%', left: '12%' }}
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
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" className="text-vandyke/35">
            <path d="M9.5 2L8 3.5L12.5 8L14 6.5L9.5 2Z" fill="currentColor"/>
            <path d="M8 3.5L3 8.5L4.5 10L9.5 5L8 3.5Z" fill="currentColor"/>
            <path d="M12.5 8L10 10.5L11.5 12L14 9.5L12.5 8Z" fill="currentColor"/>
            <path d="M10 10.5L8.5 12L7 13.5L8.5 15L10 13.5L11.5 12L10 10.5Z" fill="currentColor"/>
            <path d="M7 13.5L5.5 15L4 16.5L3 17.5L3.5 18.5L4.5 18L6 16.5L7.5 15L7 13.5Z" fill="currentColor"/>
            <path d="M3.5 18.5C3.5 19.5 4 20.5 5 21C6 21.5 7 21 7.5 20L6 18.5L4.5 18L3.5 18.5Z" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Canvas/Easel - Large */}
        <motion.div
          className="absolute"
          style={{ top: '50%', right: '8%' }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="160" height="160" viewBox="0 0 24 24" fill="none" className="text-walnut/45">
            <path d="M4 3H20C20.5 3 21 3.5 21 4V16C21 16.5 20.5 17 20 17H4C3.5 17 3 16.5 3 16V4C3 3.5 3.5 3 4 3Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3"/>
            <path d="M2 19H22" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 17L8 19" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M18 17L16 19" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="7" cy="8" r="1.5" fill="currentColor" fillOpacity="0.6"/>
            <path d="M5 13L8 10L11 13L15 9L19 13V15H5V13Z" fill="currentColor" fillOpacity="0.4"/>
          </svg>
        </motion.div>

        {/* Paint Palette - Medium */}
        <motion.div
          className="absolute"
          style={{ top: '22%', right: '20%' }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-vandyke/25">
            <path d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C8.5 22 5.5 20 4 17C3 15.5 3.5 13.5 5 12.5C6.5 11.5 8.5 12 9.5 13.5C10 14 11 14 11.5 13.5C12 13 12 12 11.5 11.5C11 11 11 10 11.5 9.5C12 9 13 9 13.5 9.5C14 10 15 10 15.5 9.5C16 9 16 8 15.5 7.5C15 7 15 6 15.5 5.5C16 5 17 5 17.5 5.5C18 6 19 6 19.5 5.5C20 5 20 4 19.5 3.5C18 2.5 15 2 12 2Z" fill="currentColor"/>
            <circle cx="8" cy="8" r="1" fill="currentColor" fillOpacity="0.8"/>
            <circle cx="10" cy="6" r="1" fill="currentColor" fillOpacity="0.8"/>
            <circle cx="16" cy="7" r="1" fill="currentColor" fillOpacity="0.8"/>
            <circle cx="14" cy="9" r="1" fill="currentColor" fillOpacity="0.8"/>
            <circle cx="12" cy="11" r="1" fill="currentColor" fillOpacity="0.8"/>
          </svg>
        </motion.div>

        {/* Color Tubes - Medium */}
        <motion.div
          className="absolute"
          style={{ top: '65%', left: '20%' }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" className="text-dun/40">
            <rect x="6" y="4" width="3" height="16" rx="1" fill="currentColor"/>
            <rect x="10" y="6" width="3" height="14" rx="1" fill="currentColor"/>
            <rect x="14" y="3" width="3" height="17" rx="1" fill="currentColor"/>
            <circle cx="7.5" cy="2" r="1" fill="currentColor"/>
            <circle cx="11.5" cy="4" r="1" fill="currentColor"/>
            <circle cx="15.5" cy="1" r="1" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Artist Pen - Large */}
        <motion.div
          className="absolute"
          style={{ top: '35%', left: '5%' }}
          animate={{
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="140" height="140" viewBox="0 0 24 24" fill="none" className="text-battleshipgray/20">
            <path d="M3 21L12 12L15 15L6 24L3 21Z" fill="currentColor"/>
            <path d="M12 12L15 9L18 12L15 15L12 12Z" fill="currentColor"/>
            <path d="M15 9L18 6L21 9L18 12L15 9Z" fill="currentColor"/>
            <path d="M18 6L21 3L22 4L19 7L18 6Z" fill="currentColor"/>
            <circle cx="4.5" cy="19.5" r="1.5" fill="currentColor" fillOpacity="0.6"/>
          </svg>
        </motion.div>

        {/* Pencil - Medium */}
        <motion.div
          className="absolute"
          style={{ top: '15%', right: '45%' }}
          animate={{
            rotate: [45, 50, 40, 45],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-walnut/15">
            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="currentColor"/>
            <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Color Wheel - Large */}
        <motion.div
          className="absolute"
          style={{ top: '75%', right: '15%' }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <svg width="150" height="150" viewBox="0 0 24 24" fill="none" className="text-vandyke/30">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <path d="M12 2V6" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 18V22" stroke="currentColor" strokeWidth="2"/>
            <path d="M22 12H18" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 12H2" stroke="currentColor" strokeWidth="2"/>
            <path d="M19.07 4.93L16.24 7.76" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7.76 16.24L4.93 19.07" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M19.07 19.07L16.24 16.24" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7.76 7.76L4.93 4.93" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        {/* Spray Can - Medium */}
        <motion.div
          className="absolute"
          style={{ top: '5%', right: '35%' }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none" className="text-dun/50">
            <rect x="8" y="6" width="8" height="14" rx="2" fill="currentColor"/>
            <rect x="10" y="2" width="4" height="6" rx="1" fill="currentColor"/>
            <circle cx="12" cy="4" r="1" fill="currentColor" fillOpacity="0.7"/>
            <path d="M16 10H18C18.5 10 19 10.5 19 11V13C19 13.5 18.5 14 18 14H16" stroke="currentColor" strokeWidth="1"/>
            <circle cx="20" cy="12" r="0.5" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Paint Bucket - Small */}
        <motion.div
          className="absolute"
          style={{ top: '45%', left: '35%' }}
          animate={{
            scale: [0.8, 1.1, 0.8],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-battleshipgray/35">
            <path d="M5 8H19L18 20H6L5 8Z" fill="currentColor"/>
            <path d="M8 8V6C8 4.9 8.9 4 10 4H14C15.1 4 16 4.9 16 6V8" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="14" r="1" fill="currentColor" fillOpacity="0.8"/>
            <path d="M9 12H15" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
          </svg>
        </motion.div>

        {/* Art Frame - Medium */}
        <motion.div
          className="absolute"
          style={{ top: '85%', left: '40%' }}
          animate={{
            rotate: [0, 3, -3, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-walnut/20">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
            <rect x="5" y="5" width="14" height="14" rx="1" fill="currentColor" fillOpacity="0.3"/>
            <circle cx="9" cy="9" r="1" fill="currentColor" fillOpacity="0.6"/>
            <path d="M7 15L10 12L13 15L16 12L17 13V17H7V15Z" fill="currentColor" fillOpacity="0.5"/>
          </svg>
        </motion.div>
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo container with animation */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
        >
          <motion.div
            className="relative w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl flex items-center justify-center overflow-hidden"
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            {/* Logo image */}
            <motion.img
              src="/src/img/DH.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Glowing ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-vandyke/50"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Counter-rotating outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-walnut/30"
              animate={{
                rotate: -360,
                scale: [1.1, 1.25, 1.1],
              }}
              transition={{
                rotate: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
          </motion.div>
        </motion.div>

        {/* Art Quote */}
        <motion.div
          className="text-center max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.p
            className="text-xl text-vandyke font-medium italic leading-relaxed"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            "Art is not what you see, but what you make others see."
          </motion.p>
          <motion.p
            className="text-sm text-walnut/70 mt-2 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            — Edgar Degas
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-vandyke to-walnut rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 2.5,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-vandyke/30 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingScreen