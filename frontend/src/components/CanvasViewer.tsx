import { motion } from 'framer-motion'

interface CanvasViewerProps {
  content: string
}

interface CanvasObject {
  type: string
  left: number
  top: number
  width?: number
  height?: number
  radius?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  text?: string
  fontFamily?: string
  fontSize?: number
  scaleX?: number
  scaleY?: number
  angle?: number
  opacity?: number
  rx?: number
  ry?: number
  src?: string
  flipX?: boolean
  flipY?: boolean
  animation?: string
  videoUrl?: string
}

const CanvasViewer: React.FC<CanvasViewerProps> = ({ content }) => {
  // Don't render anything if no valid content
  if (!content) {
    console.log('CanvasViewer: No content provided')
    return null
  }

  let parsedContent: any
  try {
    parsedContent = JSON.parse(content)
    console.log('CanvasViewer: Parsed content:', parsedContent)
    if (!parsedContent.version || !parsedContent.objects) {
      console.log('CanvasViewer: Invalid format - missing version or objects')
      return null
    }
    if (parsedContent.objects.length === 0) {
      console.log('CanvasViewer: No objects to render')
      return null
    }
  } catch (e) {
    console.error('CanvasViewer: Parse error:', e)
    return null
  }

  const canvasWidth = parsedContent.width || 900
  const canvasHeight = parsedContent.height || 500
  const background = parsedContent.background || 'transparent'

  const getAnimationClass = (animation?: string) => {
    switch (animation) {
      case 'pulse': return 'animate-pulse'
      case 'bounce': return 'animate-bounce'
      case 'rotate': return 'animate-spin'
      default: return ''
    }
  }

  const renderObject = (obj: CanvasObject, index: number) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${obj.left || 0}px`,
      top: `${obj.top || 0}px`,
      opacity: obj.opacity || 1,
      transform: `rotate(${obj.angle || 0}deg) scaleX(${obj.flipX ? -1 : 1}) scaleY(${obj.flipY ? -1 : 1})`,
      transformOrigin: 'center',
    }

    const animationClass = getAnimationClass(obj.animation)

    switch (obj.type) {
      case 'IText':
      case 'Text':
        return (
          <div
            key={index}
            className={`canvas-text whitespace-pre-wrap ${animationClass}`}
            style={{
              ...baseStyle,
              color: obj.fill || '#000000',
              fontFamily: obj.fontFamily || 'Arial',
              fontSize: `${obj.fontSize || 16}px`,
              fontWeight: 'normal',
              textAlign: 'left',
              lineHeight: 1.16,
              userSelect: 'text',
              cursor: 'text',
            }}
          >
            {obj.text || ''}
          </div>
        )

      case 'Rect':
        // Check if this rect is actually a video placeholder
        if (obj.videoUrl) {
          return (
            <video
              key={index}
              src={obj.videoUrl}
              controls
              className={`canvas-video ${animationClass}`}
              style={{
                ...baseStyle,
                width: `${(obj.width || 100) * (obj.scaleX || 1)}px`,
                height: `${(obj.height || 100) * (obj.scaleY || 1)}px`,
                objectFit: 'cover',
                borderRadius: obj.rx ? `${obj.rx}px` : '0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            />
          )
        }
        
        // Regular rectangle
        return (
          <div
            key={index}
            className={animationClass}
            style={{
              ...baseStyle,
              width: `${(obj.width || 100) * (obj.scaleX || 1)}px`,
              height: `${(obj.height || 100) * (obj.scaleY || 1)}px`,
              backgroundColor: obj.fill || 'transparent',
              border: obj.stroke ? `${obj.strokeWidth || 1}px solid ${obj.stroke}` : 'none',
              borderRadius: obj.rx ? `${obj.rx}px` : '0',
            }}
          />
        )

      case 'Circle':
        const diameter = (obj.radius || 50) * 2 * (obj.scaleX || 1)
        return (
          <div
            key={index}
            className={animationClass}
            style={{
              ...baseStyle,
              width: `${diameter}px`,
              height: `${diameter}px`,
              backgroundColor: obj.fill || 'transparent',
              border: obj.stroke ? `${obj.strokeWidth || 1}px solid ${obj.stroke}` : 'none',
              borderRadius: '50%',
            }}
          />
        )

      case 'Triangle':
        const triWidth = (obj.width || 100) * (obj.scaleX || 1)
        const triHeight = (obj.height || 100) * (obj.scaleY || 1)
        return (
          <div
            key={index}
            className={animationClass}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${triWidth / 2}px solid transparent`,
              borderRight: `${triWidth / 2}px solid transparent`,
              borderBottom: `${triHeight}px solid ${obj.fill || '#000'}`,
            }}
          />
        )

      case 'Image':
        return (
          <img
            key={index}
            src={obj.src}
            alt=""
            className={`canvas-image ${animationClass}`}
            style={{
              ...baseStyle,
              width: `${(obj.width || 100) * (obj.scaleX || 1)}px`,
              height: `${(obj.height || 100) * (obj.scaleY || 1)}px`,
              objectFit: 'cover',
              border: obj.stroke ? `${obj.strokeWidth || 1}px solid ${obj.stroke}` : 'none',
              borderRadius: obj.rx ? `${obj.rx}px` : '0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        )

      case 'Path':
      case 'path':
        // Render SVG path
        return (
          <svg
            key={index}
            className={animationClass}
            style={{
              position: 'absolute',
              left: `${obj.left || 0}px`,
              top: `${obj.top || 0}px`,
              opacity: obj.opacity || 1,
              transform: `rotate(${obj.angle || 0}deg)`,
              transformOrigin: 'center',
              overflow: 'visible',
            }}
          >
            <path
              d={(obj as any).path?.join(' ') || ''}
              fill="none"
              stroke={obj.stroke || '#000'}
              strokeWidth={obj.strokeWidth || 1}
            />
          </svg>
        )

      case 'Line':
        // For lines, we'll use a div with border
        return (
          <div
            key={index}
            className={animationClass}
            style={{
              ...baseStyle,
              width: `${Math.abs((obj.width || 100) * (obj.scaleX || 1))}px`,
              height: '0',
              borderTop: `${obj.strokeWidth || 1}px solid ${obj.stroke || '#000'}`,
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      className="canvas-viewer-fullpage px-4 sm:px-6 py-6 sm:py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundColor: background === '#ffffff' ? 'transparent' : background,
        width: '100%',
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: '100%',
          width: `${canvasWidth}px`,
          height: 'auto',
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          overflow: 'hidden',
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: 'scale(1)',
            transformOrigin: 'top center',
          }}
        >
          {parsedContent.objects.map((obj: CanvasObject, index: number) => renderObject(obj, index))}
        </div>
      </div>
    </motion.div>
  )
}

export default CanvasViewer
