import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import './editor-canvas.css'
import Swal from 'sweetalert2'
import { projectsAPI, categoriesAPI, uploadAPI } from '../../services/api'
import CanvasEditor from './CanvasEditor'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

interface ProjectData {
  title: string
  description: string
  content: string
  canvas_content?: string
  category: string
  author: string
  banner_image: string
  image_url: string
  display_order: number
  is_featured: boolean
  slug?: string
}

const ProjectEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    description: '',
    content: '',
    canvas_content: '',
    category: '',
    author: '',
    banner_image: '',
    image_url: '',
    display_order: 0,
    is_featured: false
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [useCanvasEditor, setUseCanvasEditor] = useState(false)
  const [contentType, setContentType] = useState<'richtext' | 'canvas'>('richtext') // Default to richtext

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

  // Quill modules configuration with image resize
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }), [])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch project if editing
  useEffect(() => {
    if (isEdit && id) {
      const fetchProject = async () => {
        try {
          const project = await projectsAPI.getById(id)
          setFormData({
            title: project.title || '',
            description: project.description || '',
            content: project.content || '',
            canvas_content: project.canvas_content || '',
            category: project.category || '',
            author: project.author || '',
            banner_image: project.banner_image || '',
            image_url: project.image_url || '',
            display_order: project.display_order || 0,
            is_featured: project.is_featured || false,
            slug: project.slug || ''
          })
          
          // Auto-detect content type based on existing content
          if (project.canvas_content && project.canvas_content.trim()) {
            setContentType('canvas')
          } else {
            setContentType('richtext')
          }
        } catch (error) {
          console.error('Error fetching project:', error)
          Swal.fire('Error', 'Failed to load project', 'error')
        }
      }
      fetchProject()
    }
  }, [isEdit, id])

  // Handle image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'banner_image' | 'image_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'File size must be less than 5MB', 'error')
      return
    }

    setUploading(true)
    try {
      const response = await uploadAPI.uploadImage(file)
      console.log('Upload response:', response)
      const imageUrl = `http://localhost:5001${response.imageUrl}`
      console.log('Processed imageUrl:', imageUrl)
      setFormData(prev => {
        const updated = { ...prev, [field]: imageUrl }
        console.log('Updated formData:', updated)
        return updated
      })
      Swal.fire('Success', 'Image uploaded successfully!', 'success')
    } catch (error) {
      console.error('Upload error:', error)
      Swal.fire('Error', 'Failed to upload image', 'error')
    } finally {
      setUploading(false)
    }
  }

  // Handle save
  const handleSave = async () => {
    if (!formData.title || !formData.category) {
      Swal.fire('Error', 'Please fill in required fields', 'error')
      return
    }

    // Ensure image URLs are strings, not objects
    const cleanedData = {
      ...formData,
      banner_image: typeof formData.banner_image === 'string' 
        ? formData.banner_image 
        : (formData.banner_image as any)?.imageUrl 
          ? `http://localhost:5001${(formData.banner_image as any).imageUrl}`
          : '',
      image_url: typeof formData.image_url === 'string'
        ? formData.image_url
        : (formData.image_url as any)?.imageUrl
          ? `http://localhost:5001${(formData.image_url as any).imageUrl}`
          : ''
    }
    
    console.log('Saving project with cleanedData:', cleanedData)
    
    setSaving(true)
    try {
      if (isEdit && id) {
        await projectsAPI.update(Number(id), cleanedData)
        Swal.fire('Success', 'Project updated successfully!', 'success')
      } else {
        await projectsAPI.create(cleanedData)
        Swal.fire('Success', 'Project created successfully!', 'success')
        navigate('/admin')
      }
    } catch (error) {
      console.error('Save error:', error)
      Swal.fire('Error', 'Failed to save project', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magnolia via-white to-dun/10">
      {/* Header Navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-dun/30 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
            <h1 className="text-xl font-bold text-vandyke">
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
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-vandyke to-walnut text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Sidebar - Document Lines Effect */}
            <div className="col-span-1 relative">
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
            <div className="col-span-7">
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-dun/20"
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-magnolia/30 border-2 border-dun/40 rounded-xl focus:border-vandyke focus:outline-none transition-all text-vandyke text-lg font-medium"
                    placeholder="Amazing Project Title"
                  />
                </div>

                {/* Category & Author Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-magnolia/30 border-2 border-dun/40 rounded-xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
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
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 bg-magnolia/30 border-2 border-dun/40 rounded-xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
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
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-magnolia/30 border-2 border-dun/40 rounded-xl focus:border-vandyke focus:outline-none transition-all h-24 text-vandyke resize-none"
                    placeholder="Brief description for preview cards..."
                  />
                </div>

                {/* Rich Text Content */}
                <div className="relative">
                  {/* Rich Text Editor */}
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-vandyke">
                      Rich Text Content
                    </label>
                    <motion.button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-vandyke/10 hover:bg-vandyke/20 text-vandyke rounded-lg text-sm font-medium transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isFullscreen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        )}
                      </svg>
                      {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </motion.button>
                  </div>
                  
                  {/* Rich Text Editor */}
                  {/* Rich Text Editor */}
                  {contentType === 'richtext' && (
                  <motion.div
                    className={`bg-white rounded-xl overflow-hidden border-2 border-dun/40 transition-all ${
                      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative'
                    }`}
                    animate={isFullscreen ? { 
                      scale: 1,
                      opacity: 1 
                    } : {}}
                  >
                    {isFullscreen && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-vandyke to-walnut text-white p-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <h3 className="font-bold text-lg">Rich Text Editor - Fullscreen</h3>
                        </div>
                        <button
                          onClick={() => setIsFullscreen(false)}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                        >
                          Exit Fullscreen
                        </button>
                      </div>
                    )}
                    
                    <div className={`${isFullscreen ? 'pt-16 h-full' : ''}`}>
                      <style>{`
                        .quill-fullscreen .ql-container {
                          height: calc(100vh - 12rem) !important;
                          font-size: 16px;
                        }
                        .quill-fullscreen .ql-editor {
                          padding: 3rem;
                          max-width: 1200px;
                          margin: 0 auto;
                        }
                        .quill-normal .ql-container {
                          height: 400px;
                        }
                        .ql-editor img {
                          max-width: 100%;
                          height: auto;
                          display: block;
                          margin: 1rem auto;
                          cursor: move;
                          border: 2px solid transparent;
                          transition: all 0.3s;
                          border-radius: 8px;
                        }
                        .ql-editor img:hover {
                          border-color: #5D4037;
                          box-shadow: 0 4px 12px rgba(93, 64, 55, 0.2);
                        }
                        .ql-editor img.ql-image-selected {
                          border-color: #5D4037;
                          box-shadow: 0 0 0 3px rgba(93, 64, 55, 0.1);
                        }
                        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
                        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
                          content: 'Small';
                        }
                        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
                        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
                          content: 'Large';
                        }
                        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
                        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
                          content: 'Huge';
                        }
                      `}</style>
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        modules={quillModules}
                        className={isFullscreen ? 'quill-fullscreen' : 'quill-normal'}
                        placeholder="Start writing your content here... You can add text, images, videos, and more."
                      />
                    </div>
                  </motion.div>
                  )}
                  
                  {/* Content Type Selector */}
                  <div className="mt-6 mb-6">
                    <label className="block text-sm font-semibold text-vandyke mb-3">
                      Content Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setContentType('richtext')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          contentType === 'richtext'
                            ? 'bg-vandyke text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Rich Text Content
                      </button>
                      <button
                        type="button"
                        onClick={() => setContentType('canvas')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          contentType === 'canvas'
                            ? 'bg-vandyke text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        Visual Canvas Editor
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {contentType === 'richtext' 
                        ? '✍️ Use rich text editor for traditional blog-style content with formatting' 
                        : '🎨 Use visual canvas editor for custom layouts and design elements (WYSIWYG)'}
                    </p>
                  </div>
                  
                  {/* Canvas Visual Editor */}
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
                        <button
                          onClick={() => setUseCanvasEditor(!useCanvasEditor)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            useCanvasEditor
                              ? 'bg-vandyke text-white'
                              : 'bg-vandyke/10 text-vandyke hover:bg-vandyke/20'
                          }`}
                        >
                          {useCanvasEditor ? 'Hide Canvas' : 'Show Canvas'}
                        </button>
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
                            onChange={(content) => setFormData({ ...formData, canvas_content: content })}
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
                      className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
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

                {/* Display Order & Featured */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-magnolia/30 border-2 border-dun/40 rounded-xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer px-4 py-3 bg-magnolia/30 border-2 border-dun/40 rounded-xl hover:border-vandyke transition-all w-full">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-5 h-5 text-vandyke rounded focus:ring-vandyke"
                      />
                      <span className="text-sm font-semibold text-vandyke">Featured Project</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Sidebar - Images */}
            <div className="col-span-4">
              <motion.div
                className="sticky top-28 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Banner Image */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-dun/20">
                  <h3 className="text-lg font-bold text-vandyke mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Banner Image
                  </h3>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banner_image')}
                    className="hidden"
                    id="banner-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="banner-upload"
                    className={`flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-vandyke/10 to-walnut/10 border-2 border-dashed border-vandyke/30 rounded-xl hover:border-vandyke transition-all cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                  >
                    {uploading ? (
                      <div className="flex items-center gap-2 text-vandyke">
                        <div className="w-5 h-5 border-2 border-vandyke border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : formData.banner_image ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <span>✓</span>
                        <span>Change banner</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-vandyke">
                        <span>📸</span>
                        <span>Upload banner</span>
                      </div>
                    )}
                  </label>

                  {formData.banner_image && typeof formData.banner_image === 'string' && (
                    <motion.div
                      className="mt-4 rounded-xl overflow-hidden border-2 border-dun/30"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <img 
                        src={formData.banner_image} 
                        alt="Banner preview" 
                        className="w-full h-40 object-cover"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Thumbnail Image */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-dun/20">
                  <h3 className="text-lg font-bold text-vandyke mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Thumbnail
                  </h3>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image_url')}
                    className="hidden"
                    id="thumbnail-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className={`flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-vandyke/10 to-walnut/10 border-2 border-dashed border-vandyke/30 rounded-xl hover:border-vandyke transition-all cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                  >
                    {uploading ? (
                      <div className="flex items-center gap-2 text-vandyke">
                        <div className="w-5 h-5 border-2 border-vandyke border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : formData.image_url ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <span>✓</span>
                        <span>Change thumbnail</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-vandyke">
                        <span>🖼️</span>
                        <span>Upload thumbnail</span>
                      </div>
                    )}
                  </label>

                  {formData.image_url && typeof formData.image_url === 'string' && (
                    <motion.div
                      className="mt-4 rounded-xl overflow-hidden border-2 border-dun/30"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <img 
                        src={formData.image_url} 
                        alt="Thumbnail preview" 
                        className="w-full h-40 object-cover"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Quick Info Panel */}
                <div className="bg-gradient-to-br from-vandyke/5 to-walnut/5 rounded-2xl p-6 border border-dun/20">
                  <h3 className="text-sm font-bold text-vandyke mb-3">Quick Tips</h3>
                  <ul className="space-y-2 text-xs text-battleshipgray">
                    <li className="flex items-start gap-2">
                      <span className="text-vandyke mt-0.5">•</span>
                      <span>Banner: Landscape format (16:9) recommended</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-vandyke mt-0.5">•</span>
                      <span>Thumbnail: Square or portrait format works best</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-vandyke mt-0.5">•</span>
                      <span>Max file size: 5MB per image</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-vandyke mt-0.5">•</span>
                      <span>SEO-friendly URL generated from title</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help Overlay */}
      {showHelp && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowHelp(false)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-vandyke flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-dun/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-battleshipgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-vandyke mb-2">General</h3>
                <div className="flex items-center justify-between p-3 bg-magnolia/50 rounded-lg">
                  <span className="text-sm text-battleshipgray">Save Project</span>
                  <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + S</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-magnolia/50 rounded-lg">
                  <span className="text-sm text-battleshipgray">Toggle Fullscreen</span>
                  <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + Shift + F</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-magnolia/50 rounded-lg">
                  <span className="text-sm text-battleshipgray">Exit Fullscreen</span>
                  <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Esc</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-magnolia/50 rounded-lg">
                  <span className="text-sm text-battleshipgray">Show Help</span>
                  <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">F1</kbd>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-vandyke mb-2">Text Formatting</h3>
                <div className="flex items-center justify-between p-3 bg-magnolia/50 rounded-lg">
                  <span className="text-sm text-battleshipgray">Bold</span>
                  <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + B</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-magnolia/50 rounded-lg">
                  <span className="text-sm text-battleshipgray">Italic</span>
                  <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + I</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-magnolia/50 rounded-lg">
                  <span className="text-sm text-battleshipgray">Underline</span>
                  <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + U</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-magnolia/50 rounded-lg">
                  <span className="text-sm text-battleshipgray">Undo</span>
                  <kbd className="px-2 py-1 bg-white rounded shadow text-xs font-mono">Ctrl + Z</kbd>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tips:</strong> In fullscreen mode, you can drag images to reposition them, click images to see resize handles, and use the rich toolbar for advanced formatting.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Help Button - Floating */}
      {!showHelp && (
        <motion.button
          onClick={() => setShowHelp(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-vandyke to-walnut text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Keyboard Shortcuts (F1)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>
      )}
    </div>
  )
}

export default ProjectEditor
