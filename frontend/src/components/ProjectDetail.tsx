import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import { projectsAPI } from '../services/api'
import CanvasViewer from './CanvasViewer'

interface Project {
  id: number
  title: string
  category: string
  description: string
  content: string
  canvas_content?: string
  author: string
  banner_image: string
  image_url?: string
  views: number
  created_at: string
  updated_at: string
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true)
        const data = await projectsAPI.getById(slug!)
        setProject(data)
      } catch (error: any) {
        console.error('Failed to load project:', error)
        Swal.fire({
          icon: 'error',
          title: 'Failed to load project',
          text: error.message || 'Could not load project details',
          confirmButtonColor: '#664228'
        })
        navigate('/') // Redirect to home on error
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadProject()
    }
  }, [slug, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-magnolia flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dun border-t-vandyke rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-vandyke font-medium">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-magnolia flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-vandyke mb-4">Project not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-vandyke text-white rounded-full hover:bg-walnut transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-magnolia">
      {/* Banner Image */}
      {project.banner_image && (
        <motion.div
          className="relative h-[60vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={project.banner_image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vandyke/80 via-vandyke/40 to-transparent"></div>
          
          {/* Title Overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-8 md:p-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="inline-block px-4 py-2 bg-dun/90 backdrop-blur-sm rounded-full mb-4">
                <span className="text-vandyke font-semibold text-sm">{project.category}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {project.title}
              </h1>
              
              {/* Short Description in Header */}
              <p className="text-lg md:text-xl text-white/95 mb-4 max-w-3xl leading-relaxed drop-shadow-md">
                {project.description}
              </p>
              
              <div className="flex items-center gap-4 text-white/90">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  By {project.author}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {project.views || 0} views
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Rich Content - Only show if no canvas content */}
      {!project.canvas_content && project.content && (
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <motion.div
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <style>{`
            .project-content img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 2rem auto;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .project-content p {
              margin-bottom: 1rem;
              line-height: 1.8;
            }
            .project-content h1,
            .project-content h2,
            .project-content h3 {
              margin-top: 2rem;
              margin-bottom: 1rem;
            }
          `}</style>
          <div
            className="project-content text-vandyke"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </motion.div>
      </div>
      )}

      {/* Canvas Content Viewer - Full Page - Only show if canvas content exists and is not empty */}
      {project.canvas_content && project.canvas_content.trim() && (
        <div className="w-full mt-0">
          <CanvasViewer content={project.canvas_content} />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 pb-12">
        {/* Back Button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/projects')}
            className="px-8 py-4 bg-vandyke text-white rounded-full hover:bg-walnut transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            ← Back to Projects
          </button>
        </motion.div>
      </div>

      {/* Related Projects / More by Author could go here */}
    </div>
  )
}

export default ProjectDetail
