import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { projectsAPI, categoriesAPI, getApiBaseUrl } from '../../../../services/api'

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

export const useProjectEditor = () => {
  const { id } = useParams()
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
  const [saving, setSaving] = useState(false)
  const [contentType, setContentType] = useState<'richtext' | 'canvas'>('richtext')

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

  const updateFormField = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.title || !formData.category) {
      Swal.fire('Error', 'Please fill in required fields', 'error')
      return
    }

    // Map frontend field names to backend field names
    const cleanedData = {
      title: formData.title,
      description: formData.description,
      short_description: formData.description, // Use description as short_description
      content: formData.content,
      canvas_content: formData.canvas_content,
      category: formData.category,
      category_id: null, // Will be set by backend based on category name
      author: formData.author || 'Admin',
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      tags: '', // Add if you have tags
      status: 'active',
      featured: formData.is_featured, // Map is_featured to featured
      display_order: formData.display_order || 0,
      views: 0,
      banner_image: typeof formData.banner_image === 'string' 
        ? formData.banner_image 
        : (formData.banner_image as any)?.imageUrl 
          ? `${getApiBaseUrl()}${(formData.banner_image as any).imageUrl}`
          : '',
      image_url: typeof formData.image_url === 'string'
        ? formData.image_url
        : (formData.image_url as any)?.imageUrl
          ? `${getApiBaseUrl()}${(formData.image_url as any).imageUrl}`
          : ''
    }

    console.log('Saving project with data:', cleanedData)
    
    setSaving(true)
    try {
      if (isEdit && id) {
        await projectsAPI.update(Number(id), cleanedData)
        Swal.fire('Success', 'Project updated successfully!', 'success')
      } else {
        await projectsAPI.create(cleanedData)
        Swal.fire('Success', 'Project created successfully!', 'success')
      }
      return true
    } catch (error: any) {
      console.error('Save error:', error)
      Swal.fire('Error', error?.message || 'Failed to save project', 'error')
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    formData,
    setFormData,
    updateFormField,
    categories,
    saving,
    isEdit,
    contentType,
    setContentType,
    handleSave
  }
}
