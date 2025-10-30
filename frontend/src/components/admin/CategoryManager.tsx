import { motion } from 'framer-motion'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  created_at?: string
}

interface CategoryManagerProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          className="bg-white rounded-2xl p-6 border-2 border-dun/30 hover:border-vandyke transition-all shadow-sm hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -4 }}
        >
          {/* Category Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-vandyke to-walnut rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">📁</span>
          </div>

          {/* Category Info */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-vandyke mb-2">{category.name}</h3>
            <p className="text-sm text-battleshipgray mb-2">
              <span className="font-mono bg-dun/20 px-2 py-1 rounded">/{category.slug}</span>
            </p>
            {category.description && (
              <p className="text-sm text-battleshipgray line-clamp-2">{category.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => onEdit(category)}
              className="flex-1 px-4 py-2 bg-vandyke text-white rounded-xl hover:bg-walnut transition-all text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✏️ Edit
            </motion.button>
            <motion.button
              onClick={() => onDelete(category.id)}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🗑️ Delete
            </motion.button>
          </div>
        </motion.div>
      ))}

      {categories.length === 0 && (
        <div className="col-span-full text-center py-12 text-battleshipgray">
          <p className="text-xl">No categories yet. Create your first one!</p>
        </div>
      )}
    </div>
  )
}

export default CategoryManager
