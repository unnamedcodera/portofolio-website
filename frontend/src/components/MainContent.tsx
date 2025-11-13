import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from './Navigation'
import BannerSection from './BannerSection'
import LatestProjects from './LatestProjects'
import TeamSection from './TeamSection'
import CTASection from './CTASection'
import Footer from './Footer'
import SEO from './SEO'

const MainContent = () => {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'team', 'contact']
      const scrollPosition = window.scrollY + 100 // Offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <SEO 
        title="Darahitam Creative Lab | Home - Creative Agency & Design Studio"
        description="Welcome to Darahitam Creative Lab - Your partner in transforming ideas into reality. Explore our creative services including branding, web development, UI/UX design, and innovative solutions. Meet our expert team and discover our latest projects."
        keywords="darahitam creative lab, home, creative agency, design studio, branding services, web development, creative team, portfolio, projects showcase, contact creative agency, professional design services"
        url="https://darahitam.com"
      />
      
      {/* Navigation */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Banner Section with Frame Slider */}
      <div id="home" className="relative z-0">
        <BannerSection />
      </div>

      {/* Latest Projects Section */}
      <div id="projects" className="relative z-0">
        <LatestProjects showFilters={false} />
      </div>

      {/* Decorative Transition: Projects to Team */}
      <div className="relative bg-magnolia py-24 overflow-hidden">
        {/* Artistic Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern-1" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="#664228" opacity="0.15"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-1)"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Floating Artistic Shapes */}
          <motion.div
            className="absolute top-0 left-10 w-32 h-32 opacity-10"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L90 90 L10 90 Z" fill="#664228"/>
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-8 right-16 w-24 h-24 opacity-10"
            animate={{
              y: [0, 30, 0],
              rotate: [0, -180, -360],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <svg viewBox="0 0 100 100" fill="none">
              <rect x="20" y="20" width="60" height="60" fill="#6B4423" transform="rotate(45 50 50)"/>
            </svg>
          </motion.div>

          {/* Central Content */}
          <motion.div
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Decorative Top Element */}
            <motion.div
              className="flex items-center justify-center gap-6 mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-vandyke/20 to-vandyke/30" />
              <motion.div
                className="relative"
                animate={{ 
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-vandyke to-walnut rounded-full blur-md opacity-30" />
                <div className="relative bg-white rounded-full p-4 shadow-lg">
                  <svg className="w-8 h-8 text-vandyke" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2m0 3.53L15 13l-3-1.32L9 13l3-7.47z"/>
                  </svg>
                </div>
              </motion.div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-vandyke/20 to-vandyke/30" />
            </motion.div>
          </motion.div>

          {/* Ambient Floating Elements */}
          <motion.div
            className="absolute bottom-12 left-1/4 w-3 h-3 rounded-full bg-walnut/40"
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-vandyke/30"
            animate={{
              y: [0, 25, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>

      {/* Team Section */}
      <div id="team" className="relative z-0">
        <TeamSection />
      </div>

      {/* Decorative Transition: Team to Contact */}
      <div className="relative bg-magnolia py-28 overflow-hidden z-0">
        {/* Artistic Background Pattern */}
        <div className="absolute inset-0 opacity-20 z-0">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern-2" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <line x1="0" y1="40" x2="80" y2="40" stroke="#664228" strokeWidth="0.5" opacity="0.2"/>
                <line x1="40" y1="0" x2="40" y2="80" stroke="#664228" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-2)"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Large Floating Artistic Elements */}
          <motion.div
            className="absolute -top-8 left-12 w-48 h-48 opacity-8"
            animate={{
              y: [0, 40, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="#6B4423" strokeWidth="2" opacity="0.15"/>
              <circle cx="50" cy="50" r="25" fill="#D4B59E" opacity="0.1"/>
            </svg>
          </motion.div>

          <motion.div
            className="absolute -bottom-8 right-16 w-40 h-40 opacity-8"
            animate={{
              y: [0, -35, 0],
              rotate: [360, 270, 180, 90, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <svg viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L85 50 L50 90 L15 50 Z" fill="#664228" opacity="0.12"/>
            </svg>
          </motion.div>

          {/* Central Content */}
          <motion.div
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Decorative Top Element with Icon */}
            <motion.div
              className="flex items-center justify-center gap-6 mb-10"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
            >
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-vandyke/20 to-vandyke/30" />
                <motion.div
                  className="w-2 h-2 rounded-full bg-walnut/50"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <motion.div
                className="relative"
                animate={{ 
                  rotate: [0, -360]
                }}
                transition={{ 
                  duration: 18,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-vandyke via-walnut to-dun rounded-full blur-lg opacity-30" />
                <div className="relative bg-white rounded-full p-5 shadow-xl border border-vandyke/10">
                  <svg className="w-10 h-10 text-vandyke" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M19.22 4C19.22 4 14.78 4.14 10 9C10 9 8.5 9.5 7 11C5.5 12.5 4.5 14 4.5 14L9 16.5C9 16.5 10.5 15.5 12 14C13.5 12.5 14 11 14 11C18.86 6.22 19 1.78 19 1.78L19.22 4M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63C15.32 5.85 16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8 17.41L6.59 16L2 20.59V22Z"/>
                  </svg>
                </div>
              </motion.div>

              <div className="flex-1 flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-vandyke/50"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-vandyke/20 to-vandyke/30" />
              </div>
            </motion.div>

            {/* Title Section with Enhanced Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vandyke via-walnut to-dun mb-4">
                Let's Work Together
              </h3>
              <p className="text-vandyke/70 text-lg max-w-2xl mx-auto leading-relaxed">
                Ready to transform your ideas into reality? Start your journey with us today
              </p>
            </motion.div>

            {/* Call to Action Hint */}
            <motion.div
              className="mt-10 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-vandyke/5 via-walnut/5 to-dun/5 rounded-full border border-vandyke/20"
              initial={{ opacity: 0, scale: 0.9, y: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { delay: 0.5, duration: 0.5 },
                scale: { delay: 0.5, duration: 0.5 }
              }}
            >
              <span className="text-vandyke/60 text-sm font-medium">Scroll down to start your project</span>
              <motion.svg 
                className="w-5 h-5 text-vandyke/60" 
                viewBox="0 0 24 24" 
                fill="none"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </motion.div>

            {/* Decorative Bottom Dots */}
            <motion.div
              className="flex items-center justify-center gap-3 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`rounded-full ${i === 3 ? 'w-3 h-3 bg-vandyke/40' : 'w-2 h-2 bg-vandyke/20'}`}
                  animate={{
                    scale: i === 3 ? [1, 1.3, 1] : [1, 1.2, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Ambient Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-walnut/30"
              style={{
                top: `${20 + i * 10}%`,
                left: `${10 + i * 12}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div id="contact" className="relative z-0">
        <CTASection />
      </div>

      {/* Footer */}
      <div className="relative z-0">
        <Footer />
      </div>
    </div>
  )
}

export default MainContent
