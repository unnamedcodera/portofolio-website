import { useState } from 'react'
import Swal from 'sweetalert2'
import { uploadAPI, getApiBaseUrl } from '../../../../services/api'

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (
    file: File,
    onSuccess: (imageUrl: string) => void
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'File size must be less than 5MB', 'error')
      return
    }

    setUploading(true)
    try {
      const response = await uploadAPI.uploadImage(file)
      const imageUrl = `${getApiBaseUrl()}${response.imageUrl}`
      onSuccess(imageUrl)
      Swal.fire('Success', 'Image uploaded successfully!', 'success')
    } catch (error) {
      console.error('Upload error:', error)
      Swal.fire('Error', 'Failed to upload image', 'error')
    } finally {
      setUploading(false)
    }
  }

  return { uploading, uploadImage }
}
