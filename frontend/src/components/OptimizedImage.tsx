import { useState, useEffect, memo } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  onLoad 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>('')

  useEffect(() => {
    // Preload image
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
      onLoad?.()
    }
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`)
      setIsLoaded(true)
    }
  }, [src, onLoad])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={loading}
        decoding="async"
      />
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage
