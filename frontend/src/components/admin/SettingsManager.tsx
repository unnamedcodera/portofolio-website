import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { settingsAPI } from '../../services/api'

interface QuickLink {
  name: string
  url: string
}

interface Settings {
  id?: number
  company_name: string
  company_short: string
  tagline: string
  description: string
  email: string
  phone: string
  address: string
  quick_links: string
  services: string
}

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    company_name: 'Darahitam Creative Lab',
    company_short: 'DARAHITAM',
    tagline: 'Creative Lab',
    description: 'Transforming ideas into reality through creativity and innovation.',
    email: '',
    phone: '',
    address: '',
    quick_links: '[]',
    services: '[]'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.get()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getQuickLinks = (): QuickLink[] => {
    try {
      return JSON.parse(settings.quick_links)
    } catch {
      return []
    }
  }

  const getServices = (): string[] => {
    try {
      return JSON.parse(settings.services)
    } catch {
      return []
    }
  }

  const updateQuickLinks = (links: QuickLink[]) => {
    setSettings({ ...settings, quick_links: JSON.stringify(links) })
  }

  const updateServices = (services: string[]) => {
    setSettings({ ...settings, services: JSON.stringify(services) })
  }

  const addQuickLink = () => {
    const links = getQuickLinks()
    links.push({ name: '', url: '#' })
    updateQuickLinks(links)
  }

  const removeQuickLink = (index: number) => {
    const links = getQuickLinks()
    links.splice(index, 1)
    updateQuickLinks(links)
  }

  const updateQuickLink = (index: number, field: 'name' | 'url', value: string) => {
    const links = getQuickLinks()
    links[index] = { ...links[index], [field]: value }
    updateQuickLinks(links)
  }

  const addService = () => {
    const services = getServices()
    services.push('')
    updateServices(services)
  }

  const removeService = (index: number) => {
    const services = getServices()
    services.splice(index, 1)
    updateServices(services)
  }

  const updateService = (index: number, value: string) => {
    const services = getServices()
    services[index] = value
    updateServices(services)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await settingsAPI.update(settings)
      Swal.fire({
        icon: 'success',
        title: 'Settings Updated!',
        text: 'Site settings have been saved successfully.',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update settings',
        confirmButtonColor: '#664228'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-vandyke mb-2">Site Settings</h2>
          <p className="text-gray-600">Manage footer and general site configuration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Info */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-vandyke mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name (Full)
                </label>
                <input
                  type="text"
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                  placeholder="Darahitam Creative Lab"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Name (Logo)
                </label>
                <input
                  type="text"
                  value={settings.company_short}
                  onChange={(e) => setSettings({ ...settings, company_short: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                  placeholder="DARAHITAM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                  placeholder="Creative Lab"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                  placeholder="Transforming ideas into reality..."
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-vandyke mb-4">Contact Information</h3>
            <p className="text-sm text-gray-600 mb-4">Leave empty to hide from footer</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                  placeholder="contact@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                  placeholder="123 Main St, City"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-vandyke mb-4">Quick Links</h3>
            <div className="space-y-3">
              {getQuickLinks().map((link, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                    placeholder="Link Name"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                    placeholder="URL or #section"
                  />
                  <button
                    type="button"
                    onClick={() => removeQuickLink(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuickLink}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-medium hover:border-vandyke hover:text-vandyke transition-all"
              >
                + Add Quick Link
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-vandyke mb-4">Services</h3>
            <div className="space-y-3">
              {getServices().map((service, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => updateService(index, e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
                    placeholder="Service name"
                  />
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-medium hover:border-vandyke hover:text-vandyke transition-all"
              >
                + Add Service
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-vandyke to-walnut text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default SettingsManager
