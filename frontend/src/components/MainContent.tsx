import { useState, useEffect } from 'react'
import Navigation from './Navigation'
import BannerSection from './BannerSection'
import LatestProjects from './LatestProjects'
import TeamSection from './TeamSection'
import CTASection from './CTASection'
import Footer from './Footer'

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
    <div className="min-h-screen bg-gradient-to-br from-magnolia via-dun/20 to-battleshipgray/10">
      {/* Navigation */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Banner Section with Frame Slider */}
      <div id="home">
        <BannerSection />
      </div>

      {/* Latest Projects Section */}
      <div id="projects">
        <LatestProjects showFilters={false} />
      </div>

      {/* Team Section */}
      <div id="team">
        <TeamSection />
      </div>

      {/* CTA Section */}
      <div id="contact">
        <CTASection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MainContent
