import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { teamAPI, projectsAPI, slidesAPI, categoriesAPI } from '../../services/api'
import TeamManager from './TeamManager'
import ProjectsManager from './ProjectsManager'
import BannerManager from './BannerManager'
import CategoryManager from './CategoryManager'
import InquiriesManager from './InquiriesManager'
import SettingsManager from './SettingsManager'
import FormModal from './FormModal'

interface AdminDashboardProps {
  onLogout: () => void
}

type FormMode = 'create' | 'edit' | null

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate()
  // Load last active tab from localStorage or default to 'team'
  const [activeTab, setActiveTab] = useState<'team' | 'projects' | 'slides' | 'categories' | 'inquiries' | 'settings'>(() => {
    const savedTab = localStorage.getItem('adminActiveTab')
    return (savedTab as any) || 'team'
  })
  const [teamData, setTeamData] = useState<any[]>([])
  const [projectsData, setProjectsData] = useState<any[]>([])
  const [slidesData, setSlidesData] = useState<any[]>([])
  const [categoriesData, setCategoriesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [team, projects, slides, categories] = await Promise.all([
        teamAPI.getAll(),
        projectsAPI.getAll(),
        slidesAPI.getAll(),
        categoriesAPI.getAll()
      ])
      setTeamData(team)
      setProjectsData(projects)
      setSlidesData(slides)
      setCategoriesData(categories)
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load data. Please refresh the page.',
        confirmButtonColor: '#664228'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab)
  }, [activeTab])

  const handleDelete = async (type: 'team' | 'projects' | 'slides' | 'categories', id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#664228',
      cancelButtonColor: '#8D918D',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return

    try {
      if (type === 'team') await teamAPI.delete(id)
      if (type === 'projects') await projectsAPI.delete(id)
      if (type === 'slides') await slidesAPI.delete(id)
      if (type === 'categories') await categoriesAPI.delete(id)
      
      fetchData()
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Item has been deleted successfully.',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Delete failed',
        confirmButtonColor: '#664228'
      })
    }
  }

  const openCreateForm = () => {
    setFormMode('create')
    setEditingItem(null)
    // Set default values based on tab
    const defaultData = activeTab === 'team' 
      ? { icon: '👤', skills: '[]', social_media: '[]', image_url: '' }
      : activeTab === 'projects'
      ? { 
          image_url: '', 
          banner_image: '', 
          content: '', 
          author: '', 
          category: '', 
          description: '',
          title: ''
        }
      : activeTab === 'categories'
      ? { name: '', description: '' }
      : { image_url: '' }
    setFormData(defaultData)
    setShowForm(true)
  }

  const openEditForm = (item: any) => {
    setFormMode('edit')
    setEditingItem(item)
    // Ensure all fields exist (backwards compatibility)
    let formDataWithDefaults = item
    
    if (activeTab === 'projects') {
      formDataWithDefaults = {
        ...item,
        content: item.content || '',
        author: item.author || '',
        category: item.category || '',
        banner_image: item.banner_image || '',
        description: item.description || '',
        image_url: item.image_url || ''
      }
    } else if (activeTab === 'team') {
      formDataWithDefaults = {
        ...item,
        skills: item.skills || '[]',
        social_media: item.social_media || '[]',
        icon: item.icon || '👤',
        image_url: item.image_url || ''
      }
    }
    
    setFormData(formDataWithDefaults)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setFormMode(null)
    setEditingItem(null)
    setFormData({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Ensure skills and social_media are valid JSON strings for team members
      const submitData = { ...formData }
      if (activeTab === 'team') {
        if (!submitData.skills) {
          submitData.skills = '[]'
        }
        if (!submitData.social_media) {
          submitData.social_media = '[]'
        }
        if (!submitData.icon) {
          submitData.icon = '👤'
        }
      }

      // Auto-generate slug for categories
      if (activeTab === 'categories' && submitData.name) {
        submitData.slug = submitData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      }

      if (formMode === 'create') {
        if (activeTab === 'team') await teamAPI.create(submitData)
        if (activeTab === 'projects') await projectsAPI.create(submitData)
        if (activeTab === 'slides') await slidesAPI.create(submitData)
        if (activeTab === 'categories') await categoriesAPI.create(submitData)
        
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Item created successfully!',
          timer: 2000,
          showConfirmButton: false
        })
      } else if (formMode === 'edit' && editingItem) {
        if (activeTab === 'team') await teamAPI.update(editingItem.id, submitData)
        if (activeTab === 'projects') await projectsAPI.update(editingItem.id, submitData)
        if (activeTab === 'slides') await slidesAPI.update(editingItem.id, submitData)
        if (activeTab === 'categories') await categoriesAPI.update(editingItem.id, submitData)
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Item updated successfully!',
          timer: 2000,
          showConfirmButton: false
        })
      }
      
      fetchData()
      closeForm()
    } catch (error: any) {
      console.error('Submit error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Operation failed',
        confirmButtonColor: '#664228'
      })
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'team', label: 'Team Members', icon: '👥', count: teamData.length },
    { id: 'projects', label: 'Projects', icon: '🎨', count: projectsData.length },
    { id: 'slides', label: 'Banner Slides', icon: '🖼️', count: slidesData.length },
    { id: 'categories', label: 'Categories', icon: '📁', count: categoriesData.length },
    { id: 'inquiries', label: 'Inquiries', icon: '📬', count: 0 },
    { id: 'settings', label: 'Settings', icon: '⚙️', count: 0 }
  ]

  // Background floating icons (like login page)
  const floatingIcons = [
    { icon: '✨', delay: 0, x: '5vw', y: '10vh', duration: 8 },
    { icon: '🎨', delay: 0.5, x: '85vw', y: '15vh', duration: 10 },
    { icon: '🖼️', delay: 1, x: '10vw', y: '80vh', duration: 12 },
    { icon: '✏️', delay: 1.5, x: '90vw', y: '70vh', duration: 9 },
    { icon: '🎭', delay: 2, x: '20vw', y: '50vh', duration: 11 },
    { icon: '🌟', delay: 2.5, x: '75vw', y: '45vh', duration: 13 },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-magnolia via-dun/10 to-magnolia">
      {/* Artistic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-vandyke/5 via-transparent to-walnut/5"></div>
      
      {/* Floating Icons Background - Hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 md:opacity-30 hidden sm:block">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-3xl md:text-5xl"
            style={{ left: item.x, top: item.y }}
            animate={{ 
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              y: [0, -30, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Header - Responsive */}
      <div className="z-10 bg-gradient-to-r from-vandyke via-walnut to-vandyke text-white shadow-2xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 min-w-0"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.div
                  className="w-10 h-10 sm:w-14 sm:h-14 bg-magnolia rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src="/src/img/DH.png" 
                    alt="DRHTM" 
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  />
                </motion.div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Admin Dashboard</h1>
                  <p className="text-magnolia/80 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">Manage your portfolio content</p>
                </div>
              </div>
            </motion.div>
            
            <motion.button
              onClick={onLogout}
              className="px-3 sm:px-6 py-2 sm:py-3 bg-magnolia/20 hover:bg-magnolia/30 rounded-xl sm:rounded-2xl font-semibold transition-all backdrop-blur-sm border border-magnolia/30 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tabs - Horizontal scroll on mobile */}
        <div className="mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 sm:gap-4 min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-vandyke to-walnut text-white shadow-xl'
                    : 'bg-magnolia/80 backdrop-blur-sm text-vandyke hover:bg-magnolia border border-dun/30'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{tab.icon}</span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-base">{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id ? 'bg-magnolia/25' : 'bg-dun/30'
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Add New Button - Fixed on mobile */}
        {activeTab !== 'inquiries' && activeTab !== 'settings' && (
          <div className="mb-6 sm:mb-8">
            <motion.button
              onClick={() => {
                if (activeTab === 'projects') {
                  navigate('/admin/project/new')
                } else {
                  openCreateForm()
                }
              }}
              className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-gradient-to-r from-vandyke to-walnut text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New {
                  activeTab === 'team' ? 'Member' 
                  : activeTab === 'projects' ? 'Project' 
                  : activeTab === 'categories' ? 'Category'
                  : 'Slide'
                }</span>
              </span>
            </motion.button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 sm:py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block text-5xl sm:text-6xl mb-4"
            >
              🎨
            </motion.div>
            <div className="text-2xl text-vandyke font-semibold">Loading...</div>
          </div>
        ) : (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Team Members */}
            {activeTab === 'team' && (
              <TeamManager 
                teamData={teamData}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('team', id)}
              />
            )}

            {/* Projects */}
            {activeTab === 'projects' && (
              <ProjectsManager 
                projectsData={projectsData}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('projects', id)}
              />
            )}

            {/* Banner Slides */}
            {activeTab === 'slides' && (
              <BannerManager 
                slidesData={slidesData}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('slides', id)}
              />
            )}

            {/* Categories */}
            {activeTab === 'categories' && (
              <CategoryManager 
                categories={categoriesData}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('categories', id)}
              />
            )}

            {/* Inquiries */}
            {activeTab === 'inquiries' && (
              <InquiriesManager />
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <SettingsManager />
            )}
          </motion.div>
        )}
      </div>

      {/* FormModal Component */}
      {activeTab !== 'inquiries' && activeTab !== 'settings' && (
        <FormModal 
          isOpen={showForm}
          mode={formMode}
          activeTab={activeTab as 'team' | 'projects' | 'slides' | 'categories'}
          formData={formData}
          setFormData={setFormData}
          onClose={closeForm}
          onSubmit={handleSubmit}
          saving={saving}
        />
      )}
    </div>
  )
}

export default AdminDashboard
