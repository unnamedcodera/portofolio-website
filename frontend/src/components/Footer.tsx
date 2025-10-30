import { motion } from 'framer-motion'
import { useState, useEffect, useMemo, memo, useCallback } from 'react'
import { settingsAPI } from '../services/api'

interface QuickLink {
  name: string
  url: string
}

const Footer: React.FC = memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const [settings, setSettings] = useState<any>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const data = await settingsAPI.get()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const getQuickLinks = useMemo((): QuickLink[] => {
    if (!settings?.quick_links) return []
    try {
      return JSON.parse(settings.quick_links)
    } catch {
      return []
    }
  }, [settings])

  const getServices = useMemo((): string[] => {
    if (!settings?.services) return []
    try {
      return JSON.parse(settings.services)
    } catch {
      return []
    }
  }, [settings])

  if (!settings) {
    return null // Or a loading state
  }

  return (
    <footer className="relative bg-gradient-to-br from-vandyke to-walnut text-white">
      {/* Wavy divider with particles */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: '100px', marginTop: '-99px' }}>
        {/* Wave SVG */}
        <svg 
          className="absolute bottom-0 w-full h-full" 
          viewBox="0 0 1200 100" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z" 
            fill="url(#footerGradient)" 
            opacity="0.9"
          />
          <path 
            d="M0,60 Q300,35 600,60 T1200,60 L1200,100 L0,100 Z" 
            fill="#664228" 
          />
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#664228" />
              <stop offset="50%" stopColor="#6B4423" />
              <stop offset="100%" stopColor="#664228" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-magnolia/30"
            style={{
              width: Math.random() * 6 + 3 + 'px',
              height: Math.random() * 6 + 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 80 + 10 + '%',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Melting drip effect particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`drip-${i}`}
            className="absolute"
            style={{
              left: (i * 20 + 5) + '%',
              top: '0',
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-dun/40"
              animate={{
                y: [0, 30, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
                <img
                  src="/src/img/DH.png"
                  alt={settings.company_name}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg font-black text-white leading-none tracking-tight">
                  {settings.company_short}
                </span>
                <span className="text-[9px] font-medium text-white/60 uppercase tracking-widest leading-none mt-0.5">
                  {settings.tagline}
                </span>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              {settings.description}
            </p>
          </div>

          {/* Quick Links */}
          {getQuickLinks.length > 0 && (
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {getQuickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {getServices.length > 0 && (
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {getServices.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact - Only show if at least one field is filled */}
          {(settings.email || settings.phone || settings.address) && (
            <div>
              <h3 className="font-bold mb-4">Get in Touch</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {settings.email && <li>{settings.email}</li>}
                {settings.phone && <li>{settings.phone}</li>}
                {settings.address && <li>{settings.address}</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-white/20 text-center text-sm text-white/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>&copy; {currentYear}</span>
            <span className="font-bold text-white">{settings.company_name}</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-white/20 to-white/10 rounded-full text-[11px] font-black tracking-[0.2em] text-white border border-white/30 shadow-lg backdrop-blur-sm">
              <img src="/src/img/DH.png" alt="DH" className="w-3 h-3 object-contain" />
              DRHTM
            </span>
            <span>All rights reserved.</span>
          </p>
        </motion.div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
