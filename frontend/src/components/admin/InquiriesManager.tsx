import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import { inquiriesAPI } from '../../services/api'

interface Inquiry {
  id: number
  company_name: string
  business_type: string
  contact_person: string
  email: string
  phone: string
  whatsapp: string
  project_type: string
  budget: string
  timeline: string
  project_details: string
  status: 'new' | 'in-progress' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

interface Stats {
  total: number
  new: number
  inProgress: number
  completed: number
}

const InquiriesManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, inProgress: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [inquiriesData, statsData] = await Promise.all([
        inquiriesAPI.getAll(),
        inquiriesAPI.getStats()
      ])
      setInquiries(inquiriesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading inquiries:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load inquiries',
        confirmButtonColor: '#664228'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const result = await Swal.fire({
        title: 'Update Status',
        html: `
          <div class="text-left">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Add Notes (Optional)</label>
            <textarea id="status-notes" class="w-full px-3 py-2 border rounded-lg" rows="3" placeholder="Add any notes about this status change..."></textarea>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#664228',
        preConfirm: () => {
          const notes = (document.getElementById('status-notes') as HTMLTextAreaElement)?.value
          return notes
        }
      })

      if (result.isConfirmed) {
        await inquiriesAPI.updateStatus(id, newStatus, result.value || undefined)
        await loadData()
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Inquiry status has been updated',
          timer: 2000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update status',
        confirmButtonColor: '#664228'
      })
    }
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This inquiry will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await inquiriesAPI.delete(id)
        await loadData()
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Inquiry has been deleted',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete inquiry',
          confirmButtonColor: '#664228'
        })
      }
    }
  }

  const openDetailModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setShowDetailModal(true)
  }

  const parseProjectTypes = (projectTypeStr: string): string[] => {
    try {
      return JSON.parse(projectTypeStr)
    } catch {
      return [projectTypeStr]
    }
  }

  const getProjectTypeLabels = (projectTypeStr: string): string => {
    const types = parseProjectTypes(projectTypeStr)
    const labels: Record<string, string> = {
      web: 'Website Design',
      mobile: 'Mobile App',
      branding: 'Branding',
      uiux: 'UI/UX Design',
      graphic: 'Graphic Design',
      other: 'Other Services'
    }
    return types.map(id => labels[id] || id).join(', ')
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border-orange-300',
      'in-progress': 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border-indigo-300',
      completed: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-teal-700 border-teal-300',
      cancelled: 'bg-gradient-to-r from-gray-50 to-slate-50 text-slate-600 border-slate-300'
    }
    const labels = {
      new: 'New',
      'in-progress': 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
    const icons = {
      new: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      'in-progress': (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      completed: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      cancelled: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 shadow-sm ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      inquiry.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-vandyke"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vandyke">Project Inquiries</h1>
          <p className="text-battleshipgray mt-1">Manage customer project requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-gradient-to-br from-vandyke to-walnut rounded-2xl p-6 text-white shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-magnolia/80 text-sm font-medium">Total Inquiries</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-magnolia/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">New</p>
              <p className="text-3xl font-bold mt-2">{stats.new}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-2">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="w-full">
          <input
            type="text"
            placeholder="🔍 Search by company, contact person, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-vandyke focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'in-progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-vandyke text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-vandyke to-walnut text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Contact Person</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Service Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-lg font-semibold">No inquiries found</p>
                    <p className="text-sm mt-2">
                      {searchTerm ? 'Try adjusting your search' : 'New inquiries will appear here'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(inquiry.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-vandyke">{inquiry.company_name}</p>
                        <p className="text-xs text-gray-500">{inquiry.business_type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{inquiry.contact_person}</p>
                        <p className="text-xs text-gray-500">{inquiry.email}</p>
                        <p className="text-xs text-gray-500">{inquiry.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs">
                        {getProjectTypeLabels(inquiry.project_type)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {inquiry.budget || 'Not specified'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailModal(inquiry)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-vandyke focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedInquiry && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-vandyke to-walnut text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Inquiry Details</h3>
                    <p className="text-white/80 text-sm mt-1">ID: #{selectedInquiry.id}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status & Date */}
                <div className="flex items-center justify-between">
                  {getStatusBadge(selectedInquiry.status)}
                  <div className="text-sm text-gray-500">
                    <p>Created: {formatDate(selectedInquiry.created_at)}</p>
                    <p>Updated: {formatDate(selectedInquiry.updated_at)}</p>
                  </div>
                </div>

                {/* Company Info */}
                <div className="bg-gradient-to-br from-dun/30 to-dun/20 border border-dun/40 rounded-xl p-5">
                  <h4 className="font-bold text-vandyke mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                    </svg>
                    Company Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-semibold">Company Name</p>
                      <p className="text-gray-900">{selectedInquiry.company_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Industry</p>
                      <p className="text-gray-900">{selectedInquiry.business_type || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gradient-to-br from-walnut/10 to-walnut/5 border border-walnut/30 rounded-xl p-5">
                  <h4 className="font-bold text-vandyke mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Contact Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-semibold">Contact Person</p>
                      <p className="text-gray-900">{selectedInquiry.contact_person}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 font-semibold">Email</p>
                        <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                          {selectedInquiry.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Phone</p>
                        <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:underline">
                          {selectedInquiry.phone}
                        </a>
                      </div>
                    </div>
                    {selectedInquiry.whatsapp && (
                      <div>
                        <p className="text-gray-600 font-semibold">WhatsApp</p>
                        <a
                          href={`https://wa.me/${selectedInquiry.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          {selectedInquiry.whatsapp}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-gradient-to-br from-vandyke/10 to-vandyke/5 border border-vandyke/30 rounded-xl p-5">
                  <h4 className="font-bold text-vandyke mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Project Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-semibold">Service Type</p>
                      <p className="text-gray-900">{getProjectTypeLabels(selectedInquiry.project_type)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 font-semibold">Budget</p>
                        <p className="text-gray-900">{selectedInquiry.budget || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Timeline</p>
                        <p className="text-gray-900">{selectedInquiry.timeline || 'Not specified'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold mb-2">Project Details</p>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.project_details}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedInquiry.notes && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 rounded-xl p-5">
                    <h4 className="font-bold text-vandyke mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Admin Notes
                    </h4>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap text-sm">{selectedInquiry.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      window.open(`mailto:${selectedInquiry.email}?subject=Re: Your Project Inquiry`, '_blank')
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-vandyke to-walnut text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    📧 Send Email
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InquiriesManager
