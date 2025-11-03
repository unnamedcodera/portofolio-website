import { motion } from 'framer-motion'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

const KeyboardShortcutsHelp = ({ isOpen, onClose }: KeyboardShortcutsHelpProps) => {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-vandyke flex items-center gap-2 sm:gap-3">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="truncate">Keyboard Shortcuts</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dun/20 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-battleshipgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* General Shortcuts */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-vandyke mb-2 text-sm sm:text-base">General</h3>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-magnolia/50 rounded-lg">
              <span className="text-xs sm:text-sm text-battleshipgray">Save Project</span>
              <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + S</kbd>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-magnolia/50 rounded-lg">
              <span className="text-xs sm:text-sm text-battleshipgray">Toggle Fullscreen</span>
              <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + Shift + F</kbd>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-magnolia/50 rounded-lg">
              <span className="text-xs sm:text-sm text-battleshipgray">Exit Fullscreen</span>
              <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Esc</kbd>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-magnolia/50 rounded-lg">
              <span className="text-xs sm:text-sm text-battleshipgray">Show Help</span>
              <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">F1</kbd>
            </div>
          </div>

          {/* Text Formatting Shortcuts */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-vandyke mb-2 text-sm sm:text-base">Text Formatting</h3>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-magnolia/50 rounded-lg">
              <span className="text-xs sm:text-sm text-battleshipgray">Bold</span>
              <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + B</kbd>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-magnolia/50 rounded-lg">
              <span className="text-xs sm:text-sm text-battleshipgray">Italic</span>
              <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + I</kbd>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-magnolia/50 rounded-lg">
              <span className="text-xs sm:text-sm text-battleshipgray">Underline</span>
              <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + U</kbd>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-magnolia/50 rounded-lg">
              <span className="text-xs sm:text-sm text-battleshipgray">Undo</span>
              <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + Z</kbd>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-800">
            <strong>💡 Pro Tips:</strong> In fullscreen mode, you can drag images to reposition them, click images to see resize handles, and use the rich toolbar for advanced formatting.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default KeyboardShortcutsHelp
