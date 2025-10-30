import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { inquiriesAPI } from '../services/api'
import type { JSX } from 'react/jsx-runtime'

interface ProjectFormData {
  companyName: string
  businessType: string
  contactPerson: string
  email: string
  phone: string
  whatsapp: string
  projectDetails: string
  timeline: string
  projectType: string[]
}

const CTASection: React.FC = () => {
  const [showModal, setShowModal] = useState(false)

  // Hide/show navigation and wave dividers when modal opens/closes
  useEffect(() => {
    const nav = document.querySelector('nav') as HTMLElement
    const footer = document.querySelector('footer') as HTMLElement
    
    if (showModal) {
      // Hide navigation
      if (nav) {
        nav.style.display = 'none'
      }
      // Hide footer (which contains the wave divider)
      if (footer) {
        footer.style.display = 'none'
      }
    } else {
      // Show navigation
      if (nav) {
        nav.style.display = ''
      }
      // Show footer
      if (footer) {
        footer.style.display = ''
      }
    }
    
    // Cleanup function to restore everything if component unmounts
    return () => {
      if (nav) {
        nav.style.display = ''
      }
      if (footer) {
        footer.style.display = ''
      }
    }
  }, [showModal])
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormData>({
    companyName: '',
    businessType: '',
    contactPerson: '',
    email: '',
    phone: '',
    whatsapp: '',
    projectDetails: '',
    timeline: '',
    projectType: []
  })
  const [submitting, setSubmitting] = useState(false)

  // Service icon components using Material Design Icons
  const getServiceIcon = (id: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'social-media': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
        </svg>
      ),
      'creative-design': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41M7 14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1m-5 0v3c0 1.1.9 2 2 2h3c.55 0 1-.45 1-1v-1l-4-4m15.71 3.29L16.3 18.7a.996.996 0 0 1-1.41 0l-1-1a.996.996 0 0 1 0-1.41l1.41-1.41c.39-.39 1.02-.39 1.41 0l1 1c.39.39.39 1.02 0 1.41z"/>
        </svg>
      ),
      'visual-branding': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2m0 3.53L15 13l-3-1.32L9 13l3-7.47z"/>
        </svg>
      ),
      'web-development': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4m5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
      ),
      'architecture': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 20V9L3 6H7V2H17V6H21L18 9V20H16V12H8V20H6M9 2V4H15V2H9M11 18V14H13V18H11Z"/>
        </svg>
      ),
      'motion': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 9H16V7H18M18 13H16V11H18M18 17H16V15H18M8 9H6V7H8M8 13H6V11H8M8 17H6V15H8M18 3V5H16V3H8V5H6V3H4V21H6V19H8V21H16V19H18V21H20V3H18Z"/>
        </svg>
      ),
      'manufacturing': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4L14.29 5.71L16 7.41V11H8V7.41L9.71 5.71L8 4L4 8V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L16 4Z"/>
        </svg>
      ),
      'others': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
        </svg>
      )
    }
    return icons[id] || icons['social-media']
  }

  const projectTypes = [
    { id: 'social-media', label: 'Social Media Management', icon: '📱', desc: 'Content Strategy, Engagement, Analytics' },
    { id: 'creative-design', label: 'Creative Design', icon: '🎨', desc: 'Graphic Design, Illustrations, Art Direction' },
    { id: 'visual-branding', label: 'Visual Branding', icon: '✨', desc: 'Logo, Identity, Brand Guidelines' },
    { id: 'web-development', label: 'Web Development', icon: '🌐', desc: 'Websites, E-commerce, Web Applications' },
    { id: 'architecture', label: 'Architecture', icon: '🏛️', desc: 'Design, Planning, 3D Visualization' },
    { id: 'motion', label: 'Motion Graphics', icon: '🎬', desc: 'Animation, Video Editing, Visual Effects' },
    { id: 'manufacturing', label: 'Manufacturing Clothing', icon: '👕', desc: 'Fashion Design, Production, Garment Manufacturing' },
    { id: 'others', label: 'Others Service', icon: '💼', desc: 'Custom Solutions, Consulting, Other Services' }
  ]

  const toggleProjectType = (id: string) => {
    if (formData.projectType.includes(id)) {
      setFormData({ ...formData, projectType: formData.projectType.filter(t => t !== id) })
    } else {
      setFormData({ ...formData, projectType: [...formData.projectType, id] })
    }
  }

  const validateStep = (step: number) => {
    if (step === 1) {
      return formData.projectType.length > 0
    }
    if (step === 2) {
      return formData.companyName && formData.contactPerson && formData.email && formData.phone
    }
    if (step === 3) {
      return formData.projectDetails.trim().length > 0
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all required fields before proceeding.',
        confirmButtonColor: '#664228'
      })
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(3)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
        confirmButtonColor: '#664228'
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address!',
        confirmButtonColor: '#664228'
      })
      return
    }

    setSubmitting(true)

    try {
      // Submit to API
      await inquiriesAPI.create({
        companyName: formData.companyName,
        businessType: formData.businessType,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        projectType: formData.projectType, // Array will be stringified in API
        timeline: formData.timeline,
        projectDetails: formData.projectDetails
      })

      const whatsappNumber = formData.whatsapp || formData.phone
      const projectTypeLabels = formData.projectType.map(id => 
        projectTypes.find(pt => pt.id === id)?.label
      ).join(', ')
      
      const message = encodeURIComponent(
        `🚀 New Project Inquiry\n\n` +
        `👤 ${formData.contactPerson} from ${formData.companyName}\n` +
        `🏢 Business: ${formData.businessType}\n` +
        `📧 ${formData.email}\n` +
        `📱 ${formData.phone}\n\n` +
        `📋 Project Type: ${projectTypeLabels}\n` +
        `⏰ Timeline: ${formData.timeline}\n\n` +
        `📝 Details:\n${formData.projectDetails}`
      )

      setShowModal(false)
      setCurrentStep(1)
      
      Swal.fire({
        icon: 'success',
        title: '🎉 Thank You!',
        html: `
          <div class="text-left">
            <p class="text-gray-700 mb-4 text-lg font-medium">We've received your project inquiry!</p>
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 mb-4">
              <p class="text-sm text-gray-600 mb-2">✅ Your information has been saved</p>
              <p class="text-sm text-gray-600">📧 We'll contact you within 24 hours</p>
            </div>
            <p class="text-sm text-gray-500 mb-2">Want to discuss immediately?</p>
            <p class="text-xs text-gray-400">Click below to connect via WhatsApp</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: '💬 Chat on WhatsApp',
        cancelButtonText: 'Close',
        confirmButtonColor: '#25D366',
        cancelButtonColor: '#8D918D',
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-xl px-6 py-3 font-semibold',
          cancelButton: 'rounded-xl px-6 py-3'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank')
        }
      })

      setFormData({
        companyName: '',
        businessType: '',
        contactPerson: '',
        email: '',
        phone: '',
        whatsapp: '',
        projectDetails: '',
        timeline: '',
        projectType: []
      })
    } catch (error) {
      console.error('Submission error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error instanceof Error ? error.message : 'Failed to submit form. Please try again.',
        confirmButtonColor: '#664228'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="py-16 px-6 pb-32 relative z-0 overflow-hidden bg-magnolia">
        {/* Professional Background Art Layer - Like Banner Section */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          {/* Pencil/Pen Icons */}
          <motion.div
            className="absolute top-[10%] left-[5%]"
            animate={{
              rotate: [0, 15, -15, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-vandyke/20">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" fill="currentColor"/>
            </svg>
          </motion.div>

          {/* Design Tool Icon */}
          <motion.div
            className="absolute top-[15%] right-[8%]"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg width="110" height="110" viewBox="0 0 24 24" fill="none" className="text-walnut/15">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" fill="currentColor"/>
            </svg>
          </motion.div>

          {/* Code Brackets */}
          <motion.div
            className="absolute top-[50%] left-[10%]"
            animate={{
              x: [0, -10, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="90" height="90" viewBox="0 0 24 24" fill="none" className="text-battleshipgray/25">
              <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z" fill="currentColor"/>
            </svg>
          </motion.div>

          {/* Camera Icon */}
          <motion.div
            className="absolute bottom-[25%] right-[12%]"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="95" height="95" viewBox="0 0 24 24" fill="none" className="text-vandyke/18">
              <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" fill="currentColor"/>
            </svg>
          </motion.div>

          {/* Laptop/Monitor Icon */}
          <motion.div
            className="absolute bottom-[15%] left-[15%]"
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="105" height="105" viewBox="0 0 24 24" fill="none" className="text-walnut/20">
              <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z" fill="currentColor"/>
            </svg>
          </motion.div>

          {/* Paint Brush */}
          <motion.div
            className="absolute top-[70%] right-[20%]"
            animate={{
              rotate: [0, 20, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="85" height="85" viewBox="0 0 24 24" fill="none" className="text-dun/25">
              <path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z" fill="currentColor"/>
            </svg>
          </motion.div>

          {/* Geometric Shapes */}
          <motion.div
            className="absolute top-[35%] right-[25%] w-20 h-20 border-2 border-vandyke/10 rounded-lg"
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <motion.div
            className="absolute bottom-[40%] left-[8%] w-16 h-16 border-2 border-walnut/15"
            animate={{
              rotate: [45, 135, 225, 315, 45],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Dots Pattern */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-battleshipgray"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.05, 0.2, 0.05],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}

          {/* Curved Lines */}
          <svg className="absolute top-[20%] left-[30%] w-64 h-64 opacity-10" viewBox="0 0 200 200">
            <motion.path
              d="M20,100 Q60,20 100,100 T180,100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-vandyke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </svg>

          <svg className="absolute bottom-[30%] right-[35%] w-48 h-48 opacity-8" viewBox="0 0 200 200">
            <motion.path
              d="M40,150 Q100,50 160,150"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-walnut"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1
              }}
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            className="bg-gradient-to-r from-vandyke to-walnut rounded-3xl p-12 md:p-16 text-white relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated Background Icons - Like Banner Section */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
              {/* Rocket Icon */}
              <motion.div
                className="absolute top-[15%] right-[12%]"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-magnolia/40">
                  <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M19.22 4C19.22 4 14.78 4.14 10 9C10 9 8.5 9.5 7 11C5.5 12.5 4.5 14 4.5 14L9 16.5C9 16.5 10.5 15.5 12 14C13.5 12.5 14 11 14 11C18.86 6.22 19 1.78 19 1.78L19.22 4M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63C15.32 5.85 16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8 17.41L6.59 16L2 20.59V22Z" fill="currentColor"/>
                </svg>
              </motion.div>

              {/* Light Bulb Icon */}
              <motion.div
                className="absolute top-[60%] left-[8%]"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg width="70" height="70" viewBox="0 0 24 24" fill="none" className="text-dun/50">
                  <path d="M9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21M12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2Z" fill="currentColor"/>
                </svg>
              </motion.div>

              {/* Star Icon */}
              <motion.div
                className="absolute bottom-[20%] right-[15%]"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-magnolia/30">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </motion.div>

              {/* Palette Icon */}
              <motion.div
                className="absolute top-[25%] left-[15%]"
                animate={{
                  rotate: [0, -15, 15, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg width="75" height="75" viewBox="0 0 24 24" fill="none" className="text-dun/40">
                  <path d="M12,2C6.49,2 2,6.49 2,12C2,17.51 6.49,22 12,22C13.1,22 14,21.1 14,20C14,19.5 13.82,19.04 13.53,18.67C13.24,18.3 13.08,17.84 13.08,17.33C13.08,16.23 13.98,15.33 15.08,15.33H17C19.76,15.33 22,13.09 22,10.33C22,5.61 17.51,2 12,2M6.5,9C5.67,9 5,9.67 5,10.5C5,11.33 5.67,12 6.5,12C7.33,12 8,11.33 8,10.5C8,9.67 7.33,9 6.5,9M9.5,5C8.67,5 8,5.67 8,6.5C8,7.33 8.67,8 9.5,8C10.33,8 11,7.33 11,6.5C11,5.67 10.33,5 9.5,5M14.5,5C13.67,5 13,5.67 13,6.5C13,7.33 13.67,8 14.5,8C15.33,8 16,7.33 16,6.5C16,5.67 15.33,5 14.5,5M17.5,9C16.67,9 16,9.67 16,10.5C16,11.33 16.67,12 17.5,12C18.33,12 19,11.33 19,10.5C19,9.67 18.33,9 17.5,9Z" fill="currentColor"/>
                </svg>
              </motion.div>

              {/* Target Icon */}
              <motion.div
                className="absolute bottom-[15%] left-[12%]"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg width="65" height="65" viewBox="0 0 24 24" fill="none" className="text-magnolia/35">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" fill="currentColor"/>
                </svg>
              </motion.div>
            </div>

            {/* Decorative gradient blurs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-dun/20 to-transparent rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-walnut/20 to-transparent rounded-full -ml-24 -mb-24 blur-3xl"></div>
            
            {/* Floating particles */}
            <motion.div
              className="absolute top-10 left-10 w-2 h-2 bg-magnolia rounded-full"
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-20 right-20 w-3 h-3 bg-dun rounded-full"
              animate={{ y: [0, 20, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-16 left-1/4 w-2 h-2 bg-magnolia/60 rounded-full"
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                  ✨ Let's Create Something Amazing
                </div>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Ready to Get Started?
              </h2>
              <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
                Let's bring your vision to life. Tell us about your project and we'll make it happen!
              </p>
              
              <motion.button
                onClick={() => setShowModal(true)}
                className="group relative px-10 py-5 bg-white text-vandyke rounded-full font-bold text-lg shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all inline-flex items-center gap-3 overflow-hidden"
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-dun via-magnolia to-dun opacity-0 group-hover:opacity-30"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                />
                
                {/* Rocket icon with animation */}
                <motion.svg 
                  className="w-6 h-6 relative z-10" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    y: [0, -3, 0, -3, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M19.22 4C19.22 4 14.78 4.14 10 9C10 9 8.5 9.5 7 11C5.5 12.5 4.5 14 4.5 14L9 16.5C9 16.5 10.5 15.5 12 14C13.5 12.5 14 11 14 11C18.86 6.22 19 1.78 19 1.78L19.22 4M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63C15.32 5.85 16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8 17.41L6.59 16L2 20.59V22Z"/>
                </motion.svg>
                
                <span className="relative z-10">Start Your Project</span>
                
                {/* Sparkle effect */}
                <motion.span
                  className="relative z-10 text-xl"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ✨
                </motion.span>
              </motion.button>
              
              <motion.p 
                className="mt-6 text-sm opacity-70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.7 }}
                transition={{ delay: 0.5 }}
              >
                🎯 Free consultation • Fast response • Professional team
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Project Form Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
                        <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Progress */}
              <div className="relative bg-gradient-to-br from-vandyke via-walnut to-vandyke text-white p-8 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24"></div>
                
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Logo Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                      <img src="/src/img/DH.png" alt="DH" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-1 tracking-tight">Darahitam Creative Lab</h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="font-semibold">Step {currentStep} of 3</span>
                        </div>
                        <span className="text-white/70">•</span>
                        <span className="text-white/90 font-medium">Easy & Quick</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:scale-110 hover:rotate-90 duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="relative z-10 flex items-center gap-3">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex-1 relative">
                      <div className={`h-2.5 rounded-full transition-all duration-500 ${
                        step <= currentStep 
                          ? 'bg-white shadow-lg shadow-white/30' 
                          : 'bg-white/20'
                      }`}>
                        {step === currentStep && (
                          <motion.div
                            className="h-full bg-gradient-to-r from-white to-white/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.5 }}
                          />
                        )}
                      </div>
                      {step <= currentStep && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 right-0 w-4 h-4 bg-white rounded-full shadow-lg"
                        >
                          <svg className="w-4 h-4 text-vandyke" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Project Type Selection */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h4 className="text-2xl font-bold text-vandyke mb-2">What can we help you with?</h4>
                          <p className="text-gray-600">Select one or more services you're interested in</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {projectTypes.map((type) => (
                            <motion.button
                              key={type.id}
                              type="button"
                              onClick={() => toggleProjectType(type.id)}
                              className={`p-5 rounded-2xl border-2 transition-all text-left ${
                                formData.projectType.includes(type.id)
                                  ? 'border-vandyke bg-vandyke/5 shadow-lg'
                                  : 'border-gray-200 hover:border-vandyke/50 hover:shadow-md'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-vandyke">{getServiceIcon(type.id)}</div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-vandyke mb-1">{type.label}</h5>
                                  <p className="text-sm text-gray-500">{type.desc}</p>
                                </div>
                                {formData.projectType.includes(type.id) && (
                                  <svg className="w-6 h-6 text-vandyke" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        {formData.projectType.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-vandyke/30 rounded-2xl p-5 shadow-lg overflow-hidden"
                          >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-vandyke/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-walnut/10 rounded-full blur-xl"></div>
                            
                            <div className="relative z-10 flex items-center gap-3">
                              {/* Checkmark Icon */}
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-vandyke to-walnut rounded-full flex items-center justify-center shadow-lg"
                              >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                              
                              {/* Text */}
                              <div>
                                <p className="text-sm font-bold text-vandyke flex items-center gap-2">
                                  <span className="text-2xl font-black text-walnut">{formData.projectType.length}</span>
                                  <span>Service{formData.projectType.length > 1 ? 's' : ''} Selected</span>
                                </p>
                                <p className="text-xs text-vandyke/70 mt-0.5">Great choice! Let's move forward</p>
                              </div>
                              
                              {/* Badge */}
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="ml-auto flex-shrink-0 px-3 py-1.5 bg-vandyke text-white text-xs font-bold rounded-full shadow-md"
                              >
                                ✓ Ready
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 2: Contact Information */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <div className="text-center mb-6">
                          <h4 className="text-2xl font-bold text-vandyke mb-2">Tell us about yourself</h4>
                          <p className="text-gray-600">We'll use this to contact you</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Company Name */}
                          <div>
                            <label className="block text-sm font-semibold text-vandyke mb-2">
                              Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.companyName}
                              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-vandyke focus:outline-none transition-all"
                              placeholder="Your Company Ltd."
                            />
                          </div>

                          {/* Business Type */}
                          <div>
                            <label className="block text-sm font-semibold text-vandyke mb-2">
                              Industry
                            </label>
                            <select
                              value={formData.businessType}
                              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-vandyke focus:outline-none transition-all"
                            >
                              <option value="">Select your industry</option>
                              <option value="E-commerce">E-commerce</option>
                              <option value="Fashion">Fashion & Beauty</option>
                              <option value="Technology">Technology & Software</option>
                              <option value="Food & Beverage">Food & Beverage</option>
                              <option value="Healthcare">Healthcare</option>
                              <option value="Education">Education</option>
                              <option value="Real Estate">Real Estate</option>
                              <option value="Finance">Finance & Banking</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Contact Person */}
                        <div>
                          <label className="block text-sm font-semibold text-vandyke mb-2">
                            Your Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                            <input
                              type="text"
                              value={formData.contactPerson}
                              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-vandyke focus:outline-none transition-all"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Email */}
                          <div>
                            <label className="block text-sm font-semibold text-vandyke mb-2">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-vandyke focus:outline-none transition-all"
                                placeholder="john@company.com"
                              />
                            </div>
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-semibold text-vandyke mb-2">
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-vandyke focus:outline-none transition-all"
                                placeholder="+62 812 3456 7890"
                              />
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp (Optional) */}
                        <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-vandyke/30 rounded-xl p-4 overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-walnut/10 rounded-full blur-xl"></div>
                          <label className="relative z-10 flex items-center gap-2 text-sm font-semibold text-vandyke mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-vandyke to-walnut rounded-lg flex items-center justify-center text-white text-xs">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                            </div>
                            WhatsApp Number <span className="text-xs text-vandyke/60 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            className="relative z-10 w-full px-4 py-3 border-2 border-vandyke/20 bg-white rounded-xl focus:border-vandyke focus:outline-none focus:ring-2 focus:ring-vandyke/20 transition-all"
                            placeholder="Same as phone or different"
                          />
                          <p className="relative z-10 text-xs text-vandyke/70 mt-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            If empty, we'll use your phone number for WhatsApp
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Project Details */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <div className="text-center mb-6">
                          <h4 className="text-2xl font-bold text-vandyke mb-2">Project Details</h4>
                          <p className="text-gray-600">Help us understand your needs better</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {/* Timeline */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-vandyke mb-2">
                              <span>⏰</span>
                              When do you need it?
                            </label>
                            <select
                              value={formData.timeline}
                              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-vandyke focus:outline-none transition-all"
                            >
                              <option value="">Select timeline</option>
                              <option value="ASAP">As soon as possible</option>
                              <option value="1-2 weeks">1-2 weeks</option>
                              <option value="1 month">1 month</option>
                              <option value="2-3 months">2-3 months</option>
                              <option value="3+ months">3+ months</option>
                              <option value="Flexible">Flexible</option>
                            </select>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-vandyke mb-2">
                            <span>📝</span>
                            Tell us about your project <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={formData.projectDetails}
                            onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-vandyke focus:outline-none transition-all h-40 resize-none"
                            placeholder="Describe your project, goals, target audience, features you need, or any specific requirements..."
                          />
                          <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                            <span className="text-blue-600 text-sm">💡</span>
                            <p className="text-xs text-blue-600">
                              <strong>Tips:</strong> Include details like your target audience, main features needed, design preferences, or examples of sites/apps you like.
                            </p>
                          </div>
                        </div>

                        {/* Summary Box */}
                        <div className="bg-gradient-to-br from-vandyke/5 to-walnut/5 border-2 border-vandyke/20 rounded-2xl p-5">
                          <h5 className="font-bold text-vandyke mb-3 flex items-center gap-2">
                            <span>📋</span>
                            Quick Summary
                          </h5>
                          <div className="space-y-2 text-sm">
                            <p><strong>Services:</strong> {formData.projectType.map(id => projectTypes.find(pt => pt.id === id)?.label).join(', ') || 'Not selected'}</p>
                            <p><strong>Company:</strong> {formData.companyName || 'Not provided'}</p>
                            <p><strong>Contact:</strong> {formData.contactPerson || 'Not provided'}</p>
                            <p><strong>Timeline:</strong> {formData.timeline || 'Not specified'}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 mt-8 pt-6 border-t">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                    )}
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-vandyke to-walnut text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        Continue
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <span>🚀</span>
                            Submit Project
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CTASection
