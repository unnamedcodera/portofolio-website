import { useState, useEffect } from 'react'
import LatestProjects from './LatestProjects'
import Navigation from './Navigation'
import Footer from './Footer'
import SEO from './SEO'

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
      <SEO 
        title="Projects | Darahitam Creative Lab - Our Creative Portfolio"
        description="Explore Darahitam Creative Lab's portfolio of innovative projects. Browse our work in branding, web development, graphic design, UI/UX, and creative solutions. Filter by category to discover projects that inspire your next creative endeavor."
        keywords="creative projects, portfolio, project showcase, branding projects, web development portfolio, design work, creative case studies, darahitam projects, client work, design portfolio, creative solutions examples"
        url="https://darahitam.com/projects"
      />
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <div id="projects" className="pt-20">
        <LatestProjects showFilters={true} />
      </div>
      <Footer />
    </div>
  )
}

export default ProjectsList
