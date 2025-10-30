import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectsAPI, categoriesAPI } from '../services/api'

interface Project {
  id: number
  title: string
  slug?: string
  description: string
  category: string
  author?: string
  image_url: string
  gradient: string
  is_featured?: boolean
}

interface Category {
  id: number
  name: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

interface LatestProjectsProps {
  showFilters?: boolean
}

const LatestProjects: React.FC<LatestProjectsProps> = ({ showFilters = false }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, categoriesData] = await Promise.all([
          projectsAPI.getAll(),
          categoriesAPI.getAll()
        ])
        setProjects(projectsData)
        
        // On main page, show only latest 6 projects
        if (!showFilters) {
          setFilteredProjects(projectsData.slice(0, 6))
        } else {
          setFilteredProjects(projectsData)
        }
        
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [showFilters])

  // Filter projects when filters change
  useEffect(() => {
    if (!showFilters) {
      // On main page, always show latest 6
      setFilteredProjects(projects.slice(0, 6))
      return
    }

    let filtered = [...projects] // Create a copy

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => {
        // Trim and compare to handle any whitespace issues
        const projectCategory = (p.category || '').trim()
        const filterCategory = selectedCategory.trim()
        return projectCategory === filterCategory
      })
    }

    if (selectedAuthor !== 'all') {
      filtered = filtered.filter(p => {
        // Trim and compare to handle any whitespace issues
        const projectAuthor = (p.author || '').trim()
        const filterAuthor = selectedAuthor.trim()
        return projectAuthor === filterAuthor
      })
    }

    setFilteredProjects(filtered)
  }, [selectedCategory, selectedAuthor, projects, showFilters])

  // Get unique authors
  const authors = Array.from(new Set(projects.map(p => p.author).filter(Boolean)))

  if (loading) {
    return (
      <section className="py-20 px-6 bg-gradient-to-br from-magnolia via-white to-dun/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl text-vandyke">Loading projects...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-magnolia via-magnolia/50 to-white relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating shapes */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-vandyke/8 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-dun/15 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Decorative lines */}
        <svg className="absolute top-1/4 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000">
          <motion.path
            d="M0,500 Q250,400 500,500 T1000,500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-walnut"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-block px-5 py-2 bg-gradient-to-r from-vandyke/15 to-walnut/15 rounded-full text-vandyke text-sm font-semibold mb-4 border border-dun/30"
            whileHover={{ scale: 1.05 }}
          >
            Portfolio
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-vandyke via-walnut to-vandyke">
            Our Latest Projects
          </h2>
          <p className="text-lg text-battleshipgray max-w-2xl mx-auto">
            Discover our recent work that pushes boundaries and creates lasting impact
          </p>
        </motion.div>

        {/* Filters - Only show on /projects page */}
        {showFilters && (
          <motion.div
            className="mb-12 flex flex-wrap gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-vandyke">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-dun/40 rounded-full text-vandyke font-medium hover:border-vandyke focus:border-vandyke focus:outline-none transition-all cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            {authors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-vandyke">Author:</span>
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="px-4 py-2 bg-white border-2 border-dun/40 rounded-full text-vandyke font-medium hover:border-vandyke focus:border-vandyke focus:outline-none transition-all cursor-pointer"
                >
                  <option value="all">All Authors</option>
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Results count */}
            <div className="px-4 py-2 bg-dun/20 rounded-full">
              <span className="text-sm text-vandyke font-medium">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>

            {/* Clear filters button */}
            {(selectedCategory !== 'all' || selectedAuthor !== 'all') && (
              <motion.button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedAuthor('all')
                }}
                className="px-4 py-2 bg-vandyke text-white rounded-full text-sm font-medium hover:bg-walnut transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        )}

        {/* No results message */}
        {showFilters && filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-vandyke mb-2">No projects found</h3>
            <p className="text-battleshipgray mb-6">
              Try adjusting your filters or browse all projects
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedAuthor('all')
              }}
              className="px-6 py-3 bg-vandyke text-white rounded-full font-medium hover:bg-walnut transition-all"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 && (
          <motion.div 
            className={`grid gap-8 ${
              filteredProjects.length === 1 
                ? 'grid-cols-1 max-w-2xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-2'
            }`}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
          {filteredProjects.map((project, index) => {
            // Use your color palette gradients instead of project.gradient
            const paletteGradients = [
              'from-vandyke via-walnut to-vandyke',
              'from-walnut via-dun to-walnut',
              'from-vandyke/90 via-battleshipgray to-walnut',
              'from-dun via-battleshipgray/80 to-vandyke',
            ]
            const gradientClass = paletteGradients[index % paletteGradients.length]
            
            return (
              <motion.article
                key={project.id}
                className="group relative"
                variants={fadeInUp}
                onHoverStart={() => setHoveredId(project.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileHover={{ y: -8 }}
              >
                <Link to={`/project/${project.slug || project.id}`} className="block">
                {/* Card Container */}
                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                  
                  {/* Gradient Background */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
                    animate={{
                      opacity: hoveredId === project.id ? 0.95 : 0.9
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Image Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center mix-blend-soft-light"
                    style={{
                      backgroundImage: `url(${project.image_url})`,
                      opacity: 0.2
                    }}
                    animate={{
                      scale: hoveredId === project.id ? 1.1 : 1
                    }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Pattern Overlay */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                    }}
                    animate={{
                      opacity: hoveredId === project.id ? 0.4 : 0.2
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-between">
                    
                    {/* Top Section */}
                    <div>
                      <motion.div
                        className="flex items-center gap-3 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="px-3 py-1 bg-magnolia/25 backdrop-blur-sm rounded-full text-magnolia text-xs font-semibold uppercase tracking-wide border border-magnolia/40">
                          {project.category}
                        </span>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-3xl md:text-4xl font-bold text-magnolia mb-3 drop-shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {project.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-magnolia/95 text-base leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {project.description}
                      </motion.p>
                    </div>
                    
                    {/* Bottom Section */}
                    <div>
                      {/* Decorative Line */}
                      <motion.div 
                        className="h-px bg-gradient-to-r from-magnolia/30 via-magnolia/60 to-magnolia/30 mb-6"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                      
                      {/* View Project Button */}
                      <motion.button
                        className="flex items-center gap-2 text-magnolia font-semibold group/btn"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>View Project</span>
                        <motion.svg 
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{
                            x: hoveredId === project.id ? 5 : 0
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-magnolia/40 rounded-tl-lg" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-magnolia/40 rounded-br-lg" />
                  
                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-magnolia/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
                
                {/* Floating Number Badge */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-magnolia to-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-magnolia z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 + project.id * 0.1 }}
                  whileHover={{ scale: 1.15, rotate: 360 }}
                >
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-vandyke to-walnut">
                    {project.id}
                  </span>
                </motion.div>
                </Link>
              </motion.article>
            )
          })}
          </motion.div>
        )}

        {/* View All Button - Only show on home page, not on /projects */}
        {!showFilters && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/projects">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-vandyke to-walnut text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View All Projects
                <motion.span 
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default LatestProjects
