import { motion } from 'framer-motion'

interface ImageUploadCardProps {
  title: string
  icon: string
  imageUrl: string
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputId: string
}

const ImageUploadCard = ({ 
  title, 
  icon, 
  imageUrl, 
  uploading, 
  onUpload, 
  inputId 
}: ImageUploadCardProps) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-dun/20">
      <h3 className="text-base sm:text-lg font-bold text-vandyke mb-3 sm:mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon === 'banner' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          )}
        </svg>
        {title}
      </h3>
      
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
        id={inputId}
        disabled={uploading}
      />
      <label
        htmlFor={inputId}
        className={`flex items-center justify-center w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-vandyke/10 to-walnut/10 border-2 border-dashed border-vandyke/30 rounded-lg sm:rounded-xl hover:border-vandyke transition-all cursor-pointer ${uploading ? 'opacity-50' : ''}`}
      >
        {uploading ? (
          <div className="flex items-center gap-2 text-vandyke text-sm sm:text-base">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-vandyke border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading...</span>
          </div>
        ) : imageUrl ? (
          <div className="flex items-center gap-2 text-green-600 text-sm sm:text-base">
            <span>✓</span>
            <span>Change {icon}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-vandyke text-sm sm:text-base">
            <span>{icon === 'banner' ? '📸' : '🖼️'}</span>
            <span>Upload {icon}</span>
          </div>
        )}
      </label>

      {imageUrl && typeof imageUrl === 'string' && (
        <motion.div
          className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl overflow-hidden border-2 border-dun/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img 
            src={imageUrl} 
            alt={`${title} preview`}
            className="w-full h-32 sm:h-40 object-cover"
          />
        </motion.div>
      )}
    </div>
  )
}

export default ImageUploadCard
