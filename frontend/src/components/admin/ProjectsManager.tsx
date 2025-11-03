import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface Project {
  id: number
  title: string
  description: string
  category: string
  image_url: string
  gradient: string
}

interface ProjectsManagerProps {
  projectsData: Project[]
  onEdit: (item: any) => void
  onDelete: (id: number) => void
}

const ProjectsManager: React.FC<ProjectsManagerProps> = ({ projectsData, onDelete }) => {
  const navigate = useNavigate()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectsData.map((project, index) => (
        <motion.div
          key={project.id}
          className="bg-magnolia/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-dun/20 hover:shadow-2xl transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="h-48 bg-gradient-to-br from-vandyke/30 to-walnut/30 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-dun/50 to-battleshipgray/50"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            {project.image_url && (
              <img 
                src={project.image_url} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
              />
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <span className="px-3 py-1 bg-vandyke/15 text-vandyke text-xs font-semibold rounded-full border border-vandyke/20">
                {project.category}
              </span>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => navigate(`/admin/project/edit/${project.id}`)}
                  className="p-1.5 text-walnut hover:bg-dun/30 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Edit project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => onDelete(project.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Delete project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-vandyke mb-2">{project.title}</h3>
            <p className="text-sm text-battleshipgray leading-relaxed line-clamp-3">{project.description}</p>
          </div>
        </motion.div>
      ))}
      
      {projectsData.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-battleshipgray text-lg">No projects yet. Click "Add New Project" to get started!</p>
        </div>
      )}
    </div>
  )
}

export default ProjectsManager
