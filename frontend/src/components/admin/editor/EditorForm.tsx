import { motion } from 'framer-motion'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

interface EditorFormProps {
  formData: {
    title: string
    description: string
    category: string
    author: string
    display_order: number
    is_featured: boolean
  }
  categories: Category[]
  onChange: (field: string, value: string | number | boolean) => void
}

const EditorForm = ({ formData, categories, onChange }: EditorFormProps) => {
  return (
    <motion.div
      className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 border border-dun/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-vandyke mb-2">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-magnolia/30 border-2 border-dun/40 rounded-lg sm:rounded-xl focus:border-vandyke focus:outline-none transition-all text-vandyke text-base sm:text-lg font-medium"
          placeholder="Amazing Project Title"
        />
      </div>

      {/* Category & Author Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-semibold text-vandyke mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-magnolia/30 border-2 border-dun/40 rounded-lg sm:rounded-xl focus:border-vandyke focus:outline-none transition-all text-vandyke text-sm sm:text-base"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-vandyke mb-2">
            Author
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => onChange('author', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-magnolia/30 border-2 border-dun/40 rounded-lg sm:rounded-xl focus:border-vandyke focus:outline-none transition-all text-vandyke text-sm sm:text-base"
            placeholder="Author name"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-vandyke mb-2">
          Short Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-magnolia/30 border-2 border-dun/40 rounded-lg sm:rounded-xl focus:border-vandyke focus:outline-none transition-all h-20 sm:h-24 text-vandyke resize-none text-sm sm:text-base"
          placeholder="Brief description for preview cards..."
        />
      </div>

      {/* Display Order & Featured */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
        <div>
          <label className="block text-sm font-semibold text-vandyke mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => onChange('display_order', Number(e.target.value))}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-magnolia/30 border-2 border-dun/40 rounded-lg sm:rounded-xl focus:border-vandyke focus:outline-none transition-all text-vandyke text-sm sm:text-base"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 sm:gap-3 cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 bg-magnolia/30 border-2 border-dun/40 rounded-lg sm:rounded-xl hover:border-vandyke transition-all w-full">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => onChange('is_featured', e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 text-vandyke rounded focus:ring-vandyke"
            />
            <span className="text-sm font-semibold text-vandyke">Featured Project</span>
          </label>
        </div>
      </div>
    </motion.div>
  )
}

export default EditorForm
