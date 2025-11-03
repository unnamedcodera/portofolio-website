import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { teamAPI } from '../services/api'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

interface TeamMember {
  id: number
  name: string
  position: string
  bio: string
  icon: string
  skills?: string
  social_media?: string
  email?: string
  phone?: string
  image_url?: string
}

interface Skill {
  name: string
  stars: number
}

interface SocialMedia {
  platform: string
  username: string
}

const TeamSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [teamData, setTeamData] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const parseSkills = (skillsString?: string): Skill[] => {
    if (!skillsString) return []
    try {
      return JSON.parse(skillsString)
    } catch {
      return []
    }
  }

  const parseSocialMedia = (socialString?: string): SocialMedia[] => {
    if (!socialString) return []
    try {
      return JSON.parse(socialString)
    } catch {
      return []
    }
  }

  const getSocialMediaUrl = (platform: string, username: string): string => {
    const urls: { [key: string]: string } = {
      instagram: `https://instagram.com/${username.replace('@', '')}`,
      tiktok: `https://tiktok.com/@${username.replace('@', '')}`,
      facebook: username.startsWith('http') ? username : `https://facebook.com/${username}`,
      behance: username.startsWith('http') ? username : `https://behance.net/${username}`,
      dribbble: username.startsWith('http') ? username : `https://dribbble.com/${username}`,
      linkedin: username.startsWith('http') ? username : `https://linkedin.com/in/${username}`,
      twitter: `https://twitter.com/${username.replace('@', '')}`,
      youtube: `https://youtube.com/@${username.replace('@', '')}`
    }
    return urls[platform] || username
  }

  const getSocialMediaIcon = (platform: string): React.ReactElement => {
    const icons: { [key: string]: React.ReactElement } = {
      instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      tiktok: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      behance: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM3.495 8.67h2.77c.72 0 1.27-.1 1.64-.31.37-.21.56-.56.56-1.07 0-.3-.07-.56-.18-.79-.13-.23-.3-.41-.52-.56-.23-.15-.49-.25-.79-.3-.3-.06-.62-.09-.95-.09H3.495v3.12zm0 7.27h3.12c.327 0 .64-.03.94-.1.3-.07.56-.17.78-.32.22-.15.39-.35.51-.61.12-.26.18-.58.18-.94 0-.68-.17-1.16-.52-1.46-.35-.3-.86-.44-1.53-.44H3.495v3.87zm16.38 1.4c.682.3 1.328.45 1.944.45.468 0 .89-.1 1.27-.3.38-.2.66-.48.84-.83h2.82c-.45 1.42-1.17 2.44-2.15 3.05-.97.61-2.13.92-3.47.92-.83 0-1.59-.13-2.27-.38-.68-.25-1.26-.63-1.74-1.14-.48-.51-.85-1.13-1.1-1.86-.25-.73-.38-1.56-.38-2.49 0-.88.13-1.7.38-2.44.25-.74.62-1.37 1.1-1.91.48-.54 1.06-.96 1.74-1.26.68-.3 1.44-.45 2.28-.45.94 0 1.75.18 2.43.54.68.36 1.24.85 1.67 1.47.43.62.74 1.34.94 2.14.2.8.28 1.65.23 2.54h-8.37c.05.9.37 1.62.94 2.15zm3.47-5.12c-.36-.37-.9-.56-1.62-.56-.48 0-.88.08-1.21.25-.33.17-.6.37-.81.61-.21.24-.36.52-.46.83-.1.31-.16.61-.17.91h4.96c-.1-.77-.33-1.37-.69-1.8v-.04zM13.98 6.2h6.12v1.5h-6.12V6.2z"/>
        </svg>
      ),
      dribbble: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
        </svg>
      ),
      linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
    return icons[platform] || (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  }

  const getSocialMediaColor = (platform: string): string => {
    const colors: { [key: string]: string } = {
      instagram: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      tiktok: 'bg-[#000000]',
      facebook: 'bg-[#1877F2]',
      behance: 'bg-[#1769FF]',
      dribbble: 'bg-[#EA4C89]',
      linkedin: 'bg-[#0A66C2]',
      twitter: 'bg-[#000000]',
      youtube: 'bg-[#FF0000]'
    }
    return colors[platform] || 'bg-gray-700'
  }

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await teamAPI.getAll()
        setTeamData(data)
      } catch (error) {
        console.error('Error fetching team:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  if (loading) {
    return (
      <section className="py-32 pb-48 px-6 bg-magnolia min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl text-vandyke">Loading team...</div>
        </div>
      </section>
    )
  }

  return (
    <>
    <section className="relative py-16 px-6 bg-magnolia overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-vandyke/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-walnut/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-dun/5 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Enhanced Header with Decorative Elements */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Top Decorative Line */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-vandyke/30" />
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <svg className="w-8 h-8 text-vandyke" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H15V9H13V11H15V12A1,1 0 0,1 14,13H11V15H15V17H11Z"/>
              </svg>
            </motion.div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-vandyke/30" />
          </motion.div>

          <span className="inline-block px-6 py-2 bg-gradient-to-r from-vandyke/10 via-walnut/10 to-dun/10 rounded-full text-vandyke text-sm font-semibold mb-4 border border-vandyke/20 tracking-wide">
            OUR CREATIVE TEAM
          </span>
          <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vandyke via-walnut to-dun mb-4">
            Meet The Experts
          </h2>
          <p className="text-vandyke/60 text-lg max-w-2xl mx-auto">
            Passionate professionals dedicated to bringing your creative vision to life
          </p>
        </motion.div>

        {/* Enhanced Team Grid with Better Cards */}
        <motion.div
          className={`grid gap-8 ${
            teamData.length === 1 
              ? 'grid-cols-1 max-w-sm mx-auto' 
              : teamData.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
              : teamData.length === 3
              ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {teamData.map((member, index) => (
            <motion.div
              key={member.id}
              variants={fadeInUp}
              whileHover={{ y: -12, scale: 1.03 }}
              className="group cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative">
                {/* Decorative Border Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-vandyke/20 via-walnut/20 to-dun/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card Frame with Glass Effect */}
                <div className="relative bg-gradient-to-br from-white via-white to-magnolia rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-vandyke/10">
                  
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-vandyke/20 rounded-tr-xl" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-vandyke/20 rounded-bl-xl" />
                  
                  {/* Avatar Circle with Enhanced Design */}
                  <div className="relative mx-auto mb-5 w-36 h-36">
                    {/* Rotating Border */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-vandyke via-walnut to-dun opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    <motion.div 
                      className="absolute inset-1 rounded-full bg-gradient-to-br from-vandyke/20 via-walnut/20 to-dun/20 flex items-center justify-center shadow-xl overflow-hidden border-4 border-white"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {member.image_url ? (
                        <img 
                          src={member.image_url} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">{member.icon || '👤'}</span>
                      )}
                    </motion.div>
                    
                    {/* Animated Number Badge */}
                    <motion.div 
                      className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-vandyke to-walnut rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white"
                      whileHover={{ scale: 1.15, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {index + 1}
                    </motion.div>
                    
                    {/* Pulse Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-vandyke/30"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  
                  {/* Name & Position with Better Styling */}
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-vandyke mb-1 group-hover:text-walnut transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-walnut/70 font-medium tracking-wide">
                      {member.position}
                    </p>
                    
                    {/* Skills Preview */}
                    {parseSkills(member.skills).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                        {parseSkills(member.skills).slice(0, 3).map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-vandyke/5 text-vandyke/70 text-xs rounded-full border border-vandyke/10"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative Divider with Dots */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-vandyke/20" />
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-vandyke/20 to-transparent" />
                    <div className="w-2 h-2 rounded-full bg-vandyke/20" />
                  </div>
                  
                  {/* View Profile Hint */}
                  <motion.div
                    className="text-center mt-3 text-xs text-vandyke/40 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 5 }}
                    whileHover={{ y: 0 }}
                  >
                    Click to view profile →
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Decorative Quote */}
        <motion.div
          className="text-center mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <svg className="w-12 h-12 text-vandyke/20 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
            <p className="text-lg text-vandyke/60 italic leading-relaxed">
              "Creativity is intelligence having fun. Together, we transform ideas into reality."
            </p>
          </div>
        </motion.div>
      </div>
    </section>

      {/* Beautiful Modal Popup - Rendered via Portal */}
      {createPortal(
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Header */}
              <div className="relative h-32 bg-gradient-to-r from-vandyke via-walnut to-dun overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile Content */}
              <div className="relative px-8 pb-8">
                {/* Avatar - Overlapping header */}
                <div className="flex justify-center -mt-16 mb-4">
                  <motion.div 
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-vandyke/10 via-walnut/10 to-dun/10 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {selectedMember.image_url ? (
                      <img 
                        src={selectedMember.image_url} 
                        alt={selectedMember.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">{selectedMember.icon || '👤'}</span>
                    )}
                  </motion.div>
                </div>

                {/* Name & Position */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-vandyke mb-2">
                    {selectedMember.name}
                  </h3>
                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-vandyke/10 to-walnut/10 rounded-full text-sm font-semibold text-walnut uppercase tracking-wide border border-vandyke/20">
                    {selectedMember.position}
                  </span>
                </div>

                {/* About Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-vandyke uppercase tracking-wider mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    About
                  </h4>
                  <p className="text-sm text-walnut/70 leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-vandyke uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Skills & Expertise
                  </h4>
                  {parseSkills(selectedMember.skills).length > 0 ? (
                    <div className="space-y-3">
                      {parseSkills(selectedMember.skills).map((skill, index) => (
                        <div key={index} className="bg-magnolia/50 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-vandyke">{skill.name}</span>
                            <span className="text-xs text-walnut/60">{skill.stars}/5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < skill.stars 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-battleshipgray/30'
                                }`}
                                fill={i < skill.stars ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </motion.svg>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-walnut/60 italic">No skills listed</p>
                  )}
                </div>

                {/* Social Media Section */}
                {parseSocialMedia(selectedMember.social_media).length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-vandyke uppercase tracking-wider mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Connect With Me
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {parseSocialMedia(selectedMember.social_media).map((social, index) => (
                        <motion.a
                          key={index}
                          href={getSocialMediaUrl(social.platform, social.username)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl ${getSocialMediaColor(social.platform)} text-white text-sm font-semibold hover:shadow-xl hover:brightness-110 transition-all`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          {getSocialMediaIcon(social.platform)}
                          <span className="capitalize">{social.platform}</span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}

export default TeamSection
