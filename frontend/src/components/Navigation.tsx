import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { memo, useMemo, useCallback } from 'react'
import { Button } from './ui/Button'
import { ScrollProgress } from './ui/Modern2025'
import { Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const Navigation: React.FC<NavigationProps> = memo(({ activeSection, setActiveSection }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = useMemo(() => [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' }
  ], [])

  const handleNavClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    
    // If we're not on the home page and clicking home, navigate to home
    if (sectionId === 'home' && location.pathname !== '/') {
      navigate('/')
      return
    }
    
    // If we're not on home page, go to home first then scroll
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          const offset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
      }, 100)
      return
    }
    
    // Otherwise, scroll to section on current page
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }, [location.pathname, navigate, setActiveSection])

  return (
    <>
      <ScrollProgress />
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
              <img
                src="/img/DH.png"
                alt="Darahitam Creative Lab"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-black text-vandyke leading-none tracking-tight">
                DARAHITAM
              </span>
              <span className="text-[10px] font-medium text-walnut/70 uppercase tracking-widest leading-none mt-0.5">
                Creative Lab
              </span>
            </div>
          </motion.button>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-vandyke'
                    : 'text-walnut hover:text-vandyke'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Button
              variant="gradient"
              size="default"
              onClick={() => handleNavClick('contact')}
            >
              <Sparkles className="w-4 h-4" />
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-vandyke"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-white/20"
          >
            <div className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-vandyke/10 text-vandyke font-semibold'
                      : 'text-walnut hover:bg-walnut/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="px-4 pt-2">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    handleNavClick('contact')
                    setMobileMenuOpen(false)
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
    </>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
