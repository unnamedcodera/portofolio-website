import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface EditorHeaderProps {
  isEdit: boolean
  onSave: () => void
  saving: boolean
}

const EditorHeader = ({ isEdit, onSave, saving }: EditorHeaderProps) => {
  const navigate = useNavigate()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-dun/30 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-vandyke hover:text-walnut transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium text-sm">Back</span>
            </button>
            <h1 className="text-base font-bold text-vandyke">
              {isEdit ? 'Edit' : 'New'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin')}
              className="flex-1 px-3 py-2 text-sm text-battleshipgray hover:text-vandyke transition-colors border border-dun/30 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-vandyke to-walnut text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm"
            >
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>

        {/* Desktop/Tablet Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-vandyke hover:text-walnut transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="w-px h-6 bg-dun/30"></div>
            <h1 className="text-lg sm:text-xl font-bold text-vandyke">
              {isEdit ? 'Edit Project' : 'Create New Project'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 text-battleshipgray hover:text-vandyke transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-vandyke to-walnut text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default EditorHeader
