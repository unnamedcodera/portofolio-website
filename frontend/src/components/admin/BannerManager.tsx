import { motion } from 'framer-motion'

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string
}

interface BannerManagerProps {
  slidesData: Slide[]
  onEdit: (item: any) => void
  onDelete: (id: number) => void
}

const BannerManager: React.FC<BannerManagerProps> = ({ slidesData, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {slidesData.map((slide, index) => (
        <motion.div
          key={slide.id}
          className="bg-magnolia/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-dun/20 hover:shadow-2xl transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🖼️</span>
                <h3 className="text-2xl font-bold text-vandyke">{slide.title}</h3>
              </div>
              <p className="text-sm text-walnut mb-3 font-semibold">{slide.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => onEdit(slide)}
                className="p-2 text-walnut hover:bg-dun/30 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Edit slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => onDelete(slide.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Delete slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
            </div>
          </div>
          <p className="text-sm text-battleshipgray leading-relaxed">{slide.description}</p>
          
          {/* Visual indicator for slide order */}
          <div className="mt-4 pt-4 border-t border-dun/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-battleshipgray font-semibold uppercase">Slide #{index + 1}</span>
              <div className="flex gap-1">
                {[...Array(slidesData.length)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === index ? 'bg-vandyke' : 'bg-dun/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {slidesData.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-battleshipgray text-lg">No banner slides yet. Click "Add New Slide" to get started!</p>
        </div>
      )}
    </div>
  )
}

export default BannerManager
