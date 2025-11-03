import { useState, useEffect } from 'react'
import LatestProjects from './LatestProjects'
import Navigation from './Navigation'
import Footer from './Footer'

const ProjectsList = () => {
  const [activeSection, setActiveSection] = useState('projects')
  
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
    <div className="min-h-screen bg-magnolia">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <div id="projects" className="pt-20">
        <LatestProjects showFilters={true} />
      </div>
      <Footer />
    </div>
  )
}

export default ProjectsList
