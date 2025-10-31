import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import Swal from 'sweetalert2'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { uploadAPI, categoriesAPI } from '../../services/api'

interface Skill {
  name: string
  stars: number
}

interface SocialMedia {
  platform: string
  username: string
}

interface FormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit' | null
  activeTab: 'team' | 'projects' | 'slides' | 'categories'
  formData: any
  setFormData: (data: any) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  mode,
  activeTab,
  formData,
  setFormData,
  onClose,
  onSubmit,
  saving
}) => {
  // State for categories
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  
  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoriesAPI.getAll()
        setCategories(cats)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])
  
  // Quill editor modules configuration (memoized to prevent re-renders)
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  }), [])
  
  const getTitle = () => {
    const itemType = activeTab === 'team' ? 'Team Member' 
      : activeTab === 'projects' ? 'Project' 
      : activeTab === 'categories' ? 'Category'
      : 'Slide'
    return `${mode === 'create' ? 'Create New' : 'Edit'} ${itemType}`
  }

  // Parse skills from string to array
  const getSkills = (): Skill[] => {
    if (!formData.skills || formData.skills === '' || formData.skills === 'null') return []
    try {
      const parsed = JSON.parse(formData.skills)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  // Update skills in formData
  const updateSkills = (skills: Skill[]) => {
    setFormData({ ...formData, skills: JSON.stringify(skills) })
  }

  const addSkill = () => {
    const skills = getSkills()
    skills.push({ name: '', stars: 3 })
    updateSkills(skills)
  }

  const removeSkill = (index: number) => {
    const skills = getSkills()
    skills.splice(index, 1)
    updateSkills(skills)
  }

  const updateSkill = (index: number, field: 'name' | 'stars', value: string | number) => {
    const skills = getSkills()
    skills[index] = { ...skills[index], [field]: value }
    updateSkills(skills)
  }

  // Social Media management (similar to skills)
  const getSocialMedia = (): SocialMedia[] => {
    if (!formData.social_media || formData.social_media === '' || formData.social_media === 'null') return []
    try {
      const parsed = JSON.parse(formData.social_media)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const updateSocialMedia = (socialMedia: SocialMedia[]) => {
    setFormData({ ...formData, social_media: JSON.stringify(socialMedia) })
  }

  const addSocialMedia = () => {
    const socialMedia = getSocialMedia()
    socialMedia.push({ platform: 'instagram', username: '' })
    updateSocialMedia(socialMedia)
  }

  const removeSocialMedia = (index: number) => {
    const socialMedia = getSocialMedia()
    socialMedia.splice(index, 1)
    updateSocialMedia(socialMedia)
  }

  const updateSocialMediaItem = (index: number, field: 'platform' | 'username', value: string) => {
    const socialMedia = getSocialMedia()
    socialMedia[index] = { ...socialMedia[index], [field]: value }
    updateSocialMedia(socialMedia)
  }

  // Get social media icon component
  const getSocialMediaIcon = (platform: string, size: number = 20): React.ReactElement => {
    const props = { width: size, height: size, fill: 'currentColor', viewBox: '0 0 24 24' }
    
    switch (platform) {
      case 'instagram':
        return (
          <svg {...props}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        )
      case 'tiktok':
        return (
          <svg {...props}>
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
          </svg>
        )
      case 'facebook':
        return (
          <svg {...props}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      case 'behance':
        return (
          <svg {...props}>
            <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.25-1.91.25H0V4.5h6.938v.003zM16.94 16.665c.44.428 1.073.643 1.894.643.59 0 1.1-.148 1.53-.447.424-.29.68-.61.78-.94h2.588c-.403 1.28-1.048 2.2-1.9 2.75-.85.56-1.884.83-3.08.83-.837 0-1.584-.13-2.272-.4-.673-.27-1.24-.65-1.685-1.14-.442-.49-.78-1.08-1.013-1.76-.225-.68-.34-1.43-.34-2.24 0-.81.123-1.55.357-2.23.24-.68.585-1.26 1.043-1.74.457-.48 1.01-.86 1.663-1.12.66-.26 1.39-.4 2.203-.4.86 0 1.63.16 2.305.48.67.32 1.24.77 1.695 1.35.46.588.795 1.26 1.012 2.02.22.75.33 1.545.33 2.38 0 .14-.01.35-.015.56h-7.69c0 .84.28 1.632.71 2.065l-.05.055zm-10.43-5.07c.41-.045.78-.14 1.11-.28.336-.145.617-.34.84-.59.225-.24.338-.58.338-1.016 0-.59-.18-1.02-.54-1.29-.36-.27-.84-.404-1.43-.404H3.562v3.577l2.94.003h.008zm-2.955 7.23h3.11c.656 0 1.235-.15 1.727-.45.494-.3.737-.81.737-1.53 0-.424-.09-.77-.27-1.03-.18-.26-.42-.46-.72-.61-.296-.15-.64-.26-1.02-.31-.38-.055-.78-.08-1.18-.08H3.555v4.01z"/>
          </svg>
        )
      case 'dribbble':
        return (
          <svg {...props}>
            <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
          </svg>
        )
      case 'linkedin':
        return (
          <svg {...props}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case 'twitter':
        return (
          <svg {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        )
      case 'youtube':
        return (
          <svg {...props}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      default:
        return <span>📱</span>
    }
  }

  // Get social media brand color
  const getSocialMediaColorClass = (platform: string): string => {
    switch (platform) {
      case 'instagram': return 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
      case 'tiktok': return 'bg-[#000000]'
      case 'facebook': return 'bg-[#1877F2]'
      case 'behance': return 'bg-[#1769FF]'
      case 'dribbble': return 'bg-[#EA4C89]'
      case 'linkedin': return 'bg-[#0A66C2]'
      case 'twitter': return 'bg-[#000000]'
      case 'youtube': return 'bg-[#FF0000]'
      default: return 'bg-gray-500'
    }
  }

  const socialPlatforms = [
    { value: 'instagram', label: 'Instagram', placeholder: '@username' },
    { value: 'tiktok', label: 'TikTok', placeholder: '@username' },
    { value: 'facebook', label: 'Facebook', placeholder: 'facebook.com/username' },
    { value: 'behance', label: 'Behance', placeholder: 'behance.net/username' },
    { value: 'dribbble', label: 'Dribbble', placeholder: 'dribbble.com/username' },
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
    { value: 'twitter', label: 'Twitter/X', placeholder: '@username' },
    { value: 'youtube', label: 'YouTube', placeholder: '@channelname' }
  ]

  // Handle image file selection with upload
  const [uploading, setUploading] = useState(false)
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'Image must be less than 5MB',
        confirmButtonColor: '#664228'
      })
      return
    }

    setUploading(true)
    
    try {
      const result = await uploadAPI.uploadImage(file)
      const imageUrl = `http://localhost:5001${result.imageUrl}`
      setFormData({ ...formData, image_url: imageUrl })
      
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: 'Image uploaded successfully',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: error.message || 'Failed to upload image',
        confirmButtonColor: '#664228'
      })
    } finally {
      setUploading(false)
    }
  }

  // Handle banner image upload for projects
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'Banner image must be less than 5MB',
        confirmButtonColor: '#664228'
      })
      return
    }

    setUploading(true)
    
    try {
      const result = await uploadAPI.uploadImage(file)
      const bannerUrl = `http://localhost:5001${result.imageUrl}`
      setFormData({ ...formData, banner_image: bannerUrl })
      
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: 'Banner image uploaded successfully',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: error.message || 'Failed to upload banner image',
        confirmButtonColor: '#664228'
      })
    } finally {
      setUploading(false)
    }
  }

  // Handle thumbnail image upload for projects
  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'Thumbnail image must be less than 5MB',
        confirmButtonColor: '#664228'
      })
      return
    }

    setUploading(true)
    
    try {
      const result = await uploadAPI.uploadImage(file)
      const thumbnailUrl = `http://localhost:5001${result.imageUrl}`
      setFormData({ ...formData, image_url: thumbnailUrl })
      
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: 'Thumbnail image uploaded successfully',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: error.message || 'Failed to upload thumbnail image',
        confirmButtonColor: '#664228'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-vandyke/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-magnolia rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dun/30"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-vandyke to-walnut text-white p-6 rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{getTitle()}</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-magnolia/20 rounded-xl transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              {activeTab === 'team' && (
                <>
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Profile Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      {/* Image Preview */}
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-dun/20 to-walnut/20 flex items-center justify-center border-2 border-dun/40 relative">
                        {uploading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="text-2xl"
                          >
                            ⏳
                          </motion.div>
                        ) : formData.image_url ? (
                          <img 
                            src={formData.image_url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-10 h-10 text-battleshipgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Upload Button */}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={uploading}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className={`inline-block px-4 py-2 bg-gradient-to-r from-vandyke to-walnut text-white rounded-xl font-semibold text-sm cursor-pointer hover:shadow-lg transition-all ${
                            uploading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploading ? 'Uploading...' : 'Choose Image'}
                        </label>
                        <p className="text-xs text-battleshipgray mt-2">Upload a profile photo (JPG, PNG, max 5MB)</p>
                        
                        {/* Or Image URL Input */}
                        <input
                          type="text"
                          value={formData.image_url || ''}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          className="w-full mt-2 px-3 py-2 bg-white border border-dun/40 rounded-xl focus:border-vandyke focus:outline-none transition-all text-sm text-vandyke"
                          placeholder="Or paste image URL"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.position || ''}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                      placeholder="Creative Director"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all h-32 text-vandyke"
                      placeholder="Brief description about the team member..."
                      required
                    />
                  </div>

                  {/* Skills Section */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Skills
                    </label>
                    <div className="space-y-3">
                      {getSkills().map((skill, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-dun/40">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => updateSkill(index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 bg-magnolia/50 border border-dun/30 rounded-lg focus:border-vandyke focus:outline-none text-sm text-vandyke"
                            placeholder="Skill name (e.g., Photoshop)"
                          />
                          
                          {/* Star Rating */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => updateSkill(index, 'stars', star)}
                                className="focus:outline-none"
                              >
                                <svg 
                                  className={`w-5 h-5 transition-colors ${
                                    star <= skill.stars 
                                      ? 'text-yellow-500 fill-current' 
                                      : 'text-battleshipgray/30'
                                  }`}
                                  fill={star <= skill.stars ? 'currentColor' : 'none'}
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </button>
                            ))}
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      {/* Add Skill Button */}
                      <button
                        type="button"
                        onClick={addSkill}
                        className="w-full py-3 border-2 border-dashed border-vandyke/30 rounded-xl text-vandyke font-semibold text-sm hover:border-vandyke hover:bg-vandyke/5 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Social Media Section */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Social Media Links
                    </label>
                    <div className="space-y-3">
                      {getSocialMedia().map((social, index) => (
                        <div key={index} className="flex gap-3 items-start bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm hover:border-blue-300 transition-all">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Platform Selector with Icons */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2">Platform</label>
                              <div className="relative">
                                {/* Visual indicator of selected platform */}
                                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${getSocialMediaColorClass(social.platform)} flex items-center justify-center text-white shadow-md pointer-events-none z-10`}>
                                  <div className="scale-75">
                                    {getSocialMediaIcon(social.platform, 16)}
                                  </div>
                                </div>
                                
                                <select
                                  value={social.platform}
                                  onChange={(e) => updateSocialMediaItem(index, 'platform', e.target.value)}
                                  className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm font-medium appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em' }}
                                >
                                  {socialPlatforms.map(platform => (
                                    <option key={platform.value} value={platform.value}>
                                      {platform.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            {/* Username Input */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2">Username / URL</label>
                              <input
                                type="text"
                                value={social.username}
                                onChange={(e) => updateSocialMediaItem(index, 'username', e.target.value)}
                                placeholder={socialPlatforms.find(p => p.value === social.platform)?.placeholder || 'Enter username'}
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm hover:border-gray-400 transition-colors"
                              />
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeSocialMedia(index)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 hover:scale-110 active:scale-95"
                            title="Remove"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      {/* Add Social Media Button */}
                      <button
                        type="button"
                        onClick={addSocialMedia}
                        className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-semibold text-sm hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Social Media
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'projects' && (
                <>
                  {/* Banner Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Banner Image <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                        id="banner-upload"
                      />
                      <label
                        htmlFor="banner-upload"
                        className="flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl hover:border-vandyke transition-all cursor-pointer text-vandyke"
                      >
                        {uploading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-vandyke border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : formData.banner_image ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Banner uploaded - Click to change</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>📷</span>
                            <span>Upload banner image</span>
                          </div>
                        )}
                      </label>
                    </div>
                    {formData.banner_image && (
                      <div className="mt-3 relative rounded-xl overflow-hidden">
                        <img 
                          src={formData.banner_image} 
                          alt="Banner preview" 
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                      placeholder="Amazing Project"
                      required
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Author Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all h-24 text-vandyke"
                      placeholder="Brief summary for card display..."
                      required
                    />
                    <p className="text-xs text-battleshipgray mt-1">Used in project cards and previews</p>
                  </div>

                  {/* Rich Text Content */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Full Content <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-white border-2 border-dun/40 rounded-2xl overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formData.content || ''}
                        onChange={(value: string) => setFormData({ ...formData, content: value })}
                        modules={quillModules}
                        placeholder="Write detailed project content with rich formatting..."
                        className="quill-editor"
                      />
                    </div>
                    <p className="text-xs text-battleshipgray mt-1">Full project details with formatting, images, and more</p>
                  </div>

                  {/* Thumbnail Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Thumbnail Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl hover:border-vandyke transition-all cursor-pointer text-vandyke"
                      >
                        {uploading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-vandyke border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : formData.image_url ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Thumbnail uploaded - Click to change</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>🖼️</span>
                            <span>Upload thumbnail image</span>
                          </div>
                        )}
                      </label>
                    </div>
                    {formData.image_url && (
                      <div className="mt-3 relative rounded-xl overflow-hidden">
                        <img 
                          src={formData.image_url} 
                          alt="Thumbnail preview" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs text-battleshipgray mt-1">Optional: Custom thumbnail (uses banner if not set)</p>
                  </div>
                </>
              )}

              {activeTab === 'slides' && (
                <>
                  {/* Slide Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Slide Image <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="slide-upload"
                      />
                      <label
                        htmlFor="slide-upload"
                        className="flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl hover:border-vandyke transition-all cursor-pointer text-vandyke"
                      >
                        {uploading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-vandyke border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : formData.image_url ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Image uploaded - Click to change</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>🖼️</span>
                            <span>Upload slide image</span>
                          </div>
                        )}
                      </label>
                    </div>
                    {formData.image_url && (
                      <div className="mt-3 relative rounded-xl overflow-hidden">
                        <img 
                          src={formData.image_url} 
                          alt="Slide preview" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                      placeholder="Welcome to Our Portfolio"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Subtitle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                      placeholder="Creating Beautiful Experiences"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all h-32 text-vandyke"
                      placeholder="Longer description for the banner slide..."
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === 'categories' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all text-vandyke"
                      placeholder="Web Design"
                      required
                    />
                    <p className="text-xs text-battleshipgray mt-1">The display name of the category</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-dun/40 rounded-2xl focus:border-vandyke focus:outline-none transition-all h-24 text-vandyke"
                      placeholder="Description of the category..."
                    />
                    <p className="text-xs text-battleshipgray mt-1">Optional: Brief description of this category</p>
                  </div>
                  <div className="bg-dun/10 p-4 rounded-xl">
                    <p className="text-sm text-vandyke">
                      <strong>Auto-generated:</strong> The URL slug will be automatically created from the category name
                      (e.g., "Web Design" → "web-design")
                    </p>
                  </div>
                </>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-dun/20">
                <motion.button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-vandyke to-walnut text-white font-semibold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={saving ? {} : { scale: 1.02 }}
                  whileTap={saving ? {} : { scale: 0.98 }}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    mode === 'create' ? 'Create' : 'Update'
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="px-6 py-3 bg-battleshipgray/20 text-vandyke font-semibold rounded-2xl disabled:opacity-50"
                  whileHover={saving ? {} : { scale: 1.02 }}
                  whileTap={saving ? {} : { scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FormModal
