import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './editor-canvas.css'
import CanvasEditor from './CanvasEditor'

// Import new components
import EditorHeader from './editor/EditorHeader'
import EditorForm from './editor/EditorForm'
import ImageUploadCard from './editor/ImageUploadCard'
import RichTextEditor from './editor/RichTextEditor'
import ContentTypeSelector from './editor/ContentTypeSelector'
import KeyboardShortcutsHelp from './editor/KeyboardShortcutsHelp'
import QuickTipsPanel from './editor/QuickTipsPanel'

// Import hooks
import { useProjectEditor } from './editor/hooks/useProjectEditor'
import { useImageUpload } from './editor/hooks/useImageUpload'

const ProjectEditor = () => {
  const navigate = useNavigate()
  const {
    formData,
    setFormData,
    updateFormField,
    categories,
    saving,
    isEdit,
    contentType,
    setContentType,
    handleSave
  } = useProjectEditor()

  const { uploading, uploadImage } = useImageUpload()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [useCanvasEditor, setUseCanvasEditor] = useState(false)

  // Auto-show/hide canvas editor based on content type
  useEffect(() => {
    if (contentType === 'canvas') {
      setUseCanvasEditor(true)
    } else {
      setUseCanvasEditor(false)
    }
  }, [contentType])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      // Ctrl/Cmd + Shift + F for fullscreen
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      }
      // Escape to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
      // F1 for help
      if (e.key === 'F1') {
        e.preventDefault()
        setShowHelp(!showHelp)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen, showHelp])

  // Handle image uploads
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'banner_image' | 'image_url'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    await uploadImage(file, (imageUrl) => {
      setFormData(prev => ({ ...prev, [field]: imageUrl }))
    })
  }

  const handleSaveAndNavigate = async () => {
    const success = await handleSave()
    if (success && !isEdit) {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magnolia via-white to-dun/10">
      {/* Header Navigation */}
      <EditorHeader isEdit={isEdit} onSave={handleSaveAndNavigate} saving={saving} />

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout - Single Column */}
          <div className="lg:hidden space-y-4 sm:space-y-6">
            {/* Form Section */}
            <EditorForm
              formData={formData}
              categories={categories}
              onChange={updateFormField}
            />

            {/* Images Section */}
            <div className="space-y-4">
              <ImageUploadCard
                title="Banner Image"
                icon="banner"
                imageUrl={formData.banner_image}
                uploading={uploading}
                onUpload={(e) => handleImageUpload(e, 'banner_image')}
                inputId="banner-upload"
              />
              <ImageUploadCard
                title="Thumbnail"
                icon="thumbnail"
                imageUrl={formData.image_url}
                uploading={uploading}
                onUpload={(e) => handleImageUpload(e, 'image_url')}
                inputId="thumbnail-upload"
              />
            </div>

            {/* Content Type Selector */}
            <ContentTypeSelector
              contentType={contentType}
              onChange={setContentType}
            />

            {/* Rich Text Editor */}
            {contentType === 'richtext' && (
              <RichTextEditor
                value={formData.content}
                onChange={(value) => updateFormField('content', value)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              />
            )}

            {/* Canvas Editor */}
            {contentType === 'canvas' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-vandyke">
                    🎨 Visual Canvas Editor
                  </label>
                  <div className="flex items-center gap-2">
                    {useCanvasEditor && (
                      <motion.button
                        onClick={() => setIsCanvasFullscreen(!isCanvasFullscreen)}
                        className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-vandyke/10 hover:bg-vandyke/20 text-vandyke rounded-lg text-xs sm:text-sm font-medium transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {isCanvasFullscreen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          )}
                        </svg>
                        {isCanvasFullscreen ? 'Exit' : 'Full'}
                      </motion.button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {useCanvasEditor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CanvasEditor
                        content={formData.canvas_content || ''}
                        onChange={(content) => updateFormField('canvas_content', content)}
                        isFullscreen={isCanvasFullscreen}
                        onClose={() => setIsCanvasFullscreen(false)}
                        onSave={handleSave}
                        projectSlug={formData.slug}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Quick Tips */}
            <QuickTipsPanel />

            {/* Tips */}
            {!isFullscreen && !isCanvasFullscreen && (
              <motion.div
                className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-blue-800 flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong>Pro Tip:</strong> Use Rich Text for traditional content and Canvas Editor for visual designs!</span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Desktop/Tablet Layout - Grid */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-8">
            {/* Left Sidebar - Document Lines Effect */}
            <div className="col-span-1 relative hidden xl:block">
              <div className="sticky top-28 space-y-4">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-px bg-dun/20"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.05 }}
                  />
                ))}
              </div>
            </div>

            {/* Main Editor Area */}
            <div className="xl:col-span-7 lg:col-span-8">
              <div className="space-y-6">
                <EditorForm
                  formData={formData}
                  categories={categories}
                  onChange={updateFormField}
                />

                {/* Content Type Selector */}
                <ContentTypeSelector
                  contentType={contentType}
                  onChange={setContentType}
                />

                {/* Rich Text Editor */}
                {contentType === 'richtext' && (
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => updateFormField('content', value)}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                  />
                )}

                {/* Canvas Editor */}
                {contentType === 'canvas' && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-vandyke">
                        🎨 Visual Canvas Editor
                      </label>
                      <div className="flex items-center gap-2">
                        {useCanvasEditor && (
                          <motion.button
                            onClick={() => setIsCanvasFullscreen(!isCanvasFullscreen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-vandyke/10 hover:bg-vandyke/20 text-vandyke rounded-lg text-sm font-medium transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {isCanvasFullscreen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              )}
                            </svg>
                            {isCanvasFullscreen ? 'Exit' : 'Fullscreen'}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {useCanvasEditor && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CanvasEditor
                            content={formData.canvas_content || ''}
                            onChange={(content) => updateFormField('canvas_content', content)}
                            isFullscreen={isCanvasFullscreen}
                            onClose={() => setIsCanvasFullscreen(false)}
                            onSave={handleSave}
                            projectSlug={formData.slug}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Tips */}
                {!isFullscreen && !isCanvasFullscreen && (
                  <motion.div
                    className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-blue-800 flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Pro Tip:</strong> Use Rich Text for traditional content and show the Canvas Editor for visual designs with drag-and-drop elements!</span>
                      </p>
                      <p className="text-sm text-purple-800 flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <span>Both editors can be used together and have separate fullscreen modes for focused editing.</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Images */}
            <div className="xl:col-span-4 lg:col-span-4">
              <motion.div
                className="sticky top-28 space-y-4 sm:space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ImageUploadCard
                  title="Banner Image"
                  icon="banner"
                  imageUrl={formData.banner_image}
                  uploading={uploading}
                  onUpload={(e) => handleImageUpload(e, 'banner_image')}
                  inputId="banner-upload"
                />

                <ImageUploadCard
                  title="Thumbnail"
                  icon="thumbnail"
                  imageUrl={formData.image_url}
                  uploading={uploading}
                  onUpload={(e) => handleImageUpload(e, 'image_url')}
                  inputId="thumbnail-upload"
                />

                <QuickTipsPanel />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help Overlay */}
      <KeyboardShortcutsHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Help Button - Floating */}
      {!showHelp && (
        <motion.button
          onClick={() => setShowHelp(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-vandyke to-walnut text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Keyboard Shortcuts (F1)"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>
      )}
    </div>
  )
}

export default ProjectEditor
