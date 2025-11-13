import { useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import { motion, AnimatePresence } from 'framer-motion'
import CanvasViewer from '../CanvasViewer'

interface ContextMenu {
  x: number
  y: number
  show: boolean
}

interface CanvasEditorProps {
  content: string
  onChange: (content: string) => void
  isFullscreen: boolean
  onClose: () => void
  onSave?: () => void
  projectSlug?: string
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ content, onChange, isFullscreen, onClose, onSave, projectSlug }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null)
  const [canvasHistory, setCanvasHistory] = useState<string[]>([])
  const [historyStep, setHistoryStep] = useState(0)
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ x: 0, y: 0, show: false })
  const [zoom, setZoom] = useState(1)
  const [showHeightControl, setShowHeightControl] = useState(false)
  const [clipboard, setClipboard] = useState<fabric.FabricObject | null>(null)
  const [previewContent, setPreviewContent] = useState(content)
  
  // Initialize canvas height from content or default to 500
  const getInitialHeight = () => {
    if (content && content.trim()) {
      try {
        const parsed = JSON.parse(content)
        if (parsed.height) {
          return parsed.height
        }
      } catch (e) {
        // Ignore
      }
    }
    return 500
  }
  
  const [canvasHeight, setCanvasHeight] = useState<number>(getInitialHeight())

  useEffect(() => {
    if (!canvasRef.current) return

    // Determine canvas size based on fullscreen mode and screen size
    const isMobile = window.innerWidth < 768
    let canvasWidth, finalHeight
    
    // Check if we have existing content with dimensions
    let existingWidth = null
    let existingHeight = null
    if (content && content.trim()) {
      try {
        const parsedContent = JSON.parse(content)
        if (parsedContent.width) existingWidth = parsedContent.width
        if (parsedContent.height) {
          existingHeight = parsedContent.height
          // Update the state immediately so it persists
          if (canvasHeight !== parsedContent.height) {
            setCanvasHeight(parsedContent.height)
          }
        }
      } catch (e) {
        // Ignore parse errors, will use defaults
      }
    }
    
    if (isFullscreen) {
      // Fullscreen: use most of the viewport width, but allow full canvas height (scrollable)
      canvasWidth = existingWidth || Math.min(1400, window.innerWidth - (selectedObject ? 400 : 100))
      finalHeight = existingHeight || canvasHeight // Use existing or current canvas height
    } else {
      // Normal: use container width for accurate preview positioning
      const containerWidth = window.innerWidth - 400 // Account for properties panel
      canvasWidth = existingWidth || Math.min(containerWidth - 40, 1200) // Max 1200px like viewer
      finalHeight = existingHeight || (isMobile ? Math.min(canvasHeight, 600) : canvasHeight)
    }

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: finalHeight,
      backgroundColor: '#ffffff', // White background for better visibility
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true,
    })

    // Configure default object properties to remove shadows
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#5D4037',
      cornerSize: 8,
      cornerStyle: 'circle',
      borderColor: '#5D4037',
      borderScaleFactor: 2,
      padding: 5,
    })

    fabricCanvasRef.current = canvas

    // Load existing content if any
    if (content && content.trim()) {
      try {
        const parsedContent = JSON.parse(content)
        // Check if it's valid Fabric.js JSON (has version and objects)
        if (parsedContent.version && parsedContent.objects) {
          canvas.loadFromJSON(parsedContent).then(() => {
            canvas.renderAll()
            // Force another render after a short delay to ensure everything is loaded
            setTimeout(() => {
              canvas.renderAll()
            }, 100)
            const json = JSON.stringify(canvas.toJSON())
            setCanvasHistory([json])
            setHistoryStep(0)
          }).catch((err) => {
            console.error('Error loading canvas content:', err)
            const json = JSON.stringify(canvas.toJSON())
            setCanvasHistory([json])
            setHistoryStep(0)
          })
        } else {
          // Initialize empty canvas
          const json = JSON.stringify(canvas.toJSON())
          setCanvasHistory([json])
          setHistoryStep(0)
        }
      } catch (e) {
        console.error('Failed to parse canvas content:', e)
        // If content is HTML/text, start with empty canvas
        // (User can add text manually using the Add Text button)
        const json = JSON.stringify(canvas.toJSON())
        setCanvasHistory([json])
        setHistoryStep(0)
      }
    } else {
      // Initialize empty canvas
      const json = JSON.stringify(canvas.toJSON())
      setCanvasHistory([json])
      setHistoryStep(0)
    }

    // Event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })

    canvas.on('selection:cleared', () => {
      setSelectedObject(null)
    })

    canvas.on('object:modified', () => {
      saveToHistory()
    })

    // Disable browser context menu and add custom one
    const canvasElement = canvas.getElement()
    const handleContextMenu = (e: MouseEvent) => {
      console.log('🖱️ Right-click detected at:', e.clientX, e.clientY)
      e.preventDefault()
      e.stopPropagation()
      const target = canvas.findTarget(e as any)
      console.log('🎯 Target found:', target ? target.type : 'none')
      
      if (target) {
        canvas.setActiveObject(target)
        setSelectedObject(target)
        console.log('✅ Setting context menu at:', e.clientX, e.clientY, 'for object:', target.type)
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          show: true
        })
      } else {
        console.log('⚠️ No target found, showing menu anyway at:', e.clientX, e.clientY)
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          show: true
        })
      }
    }
    
    canvasElement.addEventListener('contextmenu', handleContextMenu, { capture: true })
    
    // Also prevent context menu on the wrapper div
    const canvasWrapper = canvasElement.parentElement
    if (canvasWrapper) {
      canvasWrapper.addEventListener('contextmenu', handleContextMenu, { capture: true })
    }
    
    // Global context menu prevention as backup
    const preventDefaultContextMenu = (e: MouseEvent) => {
      // Check if click is within canvas area
      const rect = canvasElement.getBoundingClientRect()
      if (e.clientX >= rect.left && e.clientX <= rect.right && 
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('contextmenu', preventDefaultContextMenu, { capture: true })

    // Close context menu on click
    const handleClick = () => {
      setContextMenu({ x: 0, y: 0, show: false })
    }
    window.addEventListener('click', handleClick)

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if (e.key === 'Delete' && selectedObject) {
        deleteSelected()
      }
      // Ctrl+D for duplicate
      if (e.ctrlKey && e.key === 'd' && selectedObject) {
        e.preventDefault()
        duplicateObject()
      }
      // Ctrl+L for lock
      if (e.ctrlKey && e.key === 'l' && selectedObject) {
        e.preventDefault()
        lockObject()
      }
      // Ctrl+] for bring forward
      if (e.ctrlKey && e.key === ']' && selectedObject) {
        e.preventDefault()
        bringForward()
      }
      // Ctrl+[ for send backward
      if (e.ctrlKey && e.key === '[' && selectedObject) {
        e.preventDefault()
        sendBackward()
      }
      // Ctrl++ or Ctrl+= for zoom in
      if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault()
        handleZoomIn()
      }
      // Ctrl+- for zoom out
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault()
        handleZoomOut()
      }
      // Ctrl+0 for reset zoom
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault()
        handleZoomReset()
      }
      // Ctrl+C for copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const activeObject = fabricCanvasRef.current?.getActiveObject()
        if (activeObject) {
          e.preventDefault()
          copySelected()
        }
      }
      // Ctrl+V for paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard) {
        e.preventDefault()
        pasteFromClipboard()
      }
      // Ctrl+D for duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        const activeObject = fabricCanvasRef.current?.getActiveObject()
        if (activeObject) {
          e.preventDefault()
          duplicateSelected()
        }
      }
      // Delete or Backspace to delete selected object
      if ((e.key === 'Delete' || e.key === 'Backspace')) {
        // Only delete if not editing text
        const activeObject = fabricCanvasRef.current?.getActiveObject()
        const isEditingText = activeObject && activeObject.type === 'i-text' && (activeObject as any).isEditing
        if (activeObject && !isEditingText) {
          e.preventDefault()
          deleteSelected()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      canvas.dispose()
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
      canvasElement.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      document.removeEventListener('contextmenu', preventDefaultContextMenu, { capture: true })
      if (canvasWrapper) {
        canvasWrapper.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      }
    }
  }, [isFullscreen, content]) // Removed canvasHeight from dependencies

  const saveToHistory = () => {
    if (!fabricCanvasRef.current) return
    const canvasData = fabricCanvasRef.current.toJSON()
    // Add canvas dimensions to the JSON
    const jsonWithDimensions = {
      ...canvasData,
      width: fabricCanvasRef.current.getWidth(),
      height: fabricCanvasRef.current.getHeight()
    }
    const json = JSON.stringify(jsonWithDimensions)
    const newHistory = canvasHistory.slice(0, historyStep + 1)
    newHistory.push(json)
    setCanvasHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
    onChange(json)
    setPreviewContent(json) // Update live preview
  }

  // Handle canvas height changes and save
  useEffect(() => {
    if (!fabricCanvasRef.current || canvasHistory.length === 0) return
    
    const canvas = fabricCanvasRef.current
    const currentHeight = canvas.getHeight()
    
    if (currentHeight !== canvasHeight) {
      console.log('Updating canvas height from', currentHeight, 'to', canvasHeight)
      canvas.setHeight(canvasHeight)
      canvas.renderAll()
      // Save after height change with dimensions included
      const canvasData = canvas.toJSON()
      const jsonWithDimensions = {
        ...canvasData,
        width: canvas.getWidth(),
        height: canvas.getHeight()
      }
      const json = JSON.stringify(jsonWithDimensions)
      const newHistory = canvasHistory.slice(0, historyStep + 1)
      newHistory.push(json)
      setCanvasHistory(newHistory)
      setHistoryStep(newHistory.length - 1)
      onChange(json)
      console.log('Canvas height saved with dimensions:', canvas.getWidth(), 'x', canvas.getHeight())
    }
  }, [canvasHeight])

  const undo = () => {
    if (historyStep > 0 && fabricCanvasRef.current) {
      const newStep = historyStep - 1
      setHistoryStep(newStep)
      fabricCanvasRef.current.loadFromJSON(canvasHistory[newStep], () => {
        fabricCanvasRef.current?.renderAll()
      })
    }
  }

  const redo = () => {
    if (historyStep < canvasHistory.length - 1 && fabricCanvasRef.current) {
      const newStep = historyStep + 1
      setHistoryStep(newStep)
      fabricCanvasRef.current.loadFromJSON(canvasHistory[newStep], () => {
        fabricCanvasRef.current?.renderAll()
      })
    }
  }

  const addText = () => {
    if (!fabricCanvasRef.current) return
    
    const canvas = fabricCanvasRef.current
    const text = new fabric.IText('Click to edit text', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#000000',
      opacity: 0.7, // Make it semi-transparent while placing
    })
    
    canvas.add(text)
    
    // Make text follow mouse until clicked
    let isPlacing = true
    
    const onMouseMove = (e: any) => {
      if (!isPlacing) return
      const pointer = canvas.getPointer(e.e)
      text.set({
        left: pointer.x - (text.width || 0) / 2,
        top: pointer.y - (text.height || 0) / 2,
      })
      canvas.renderAll()
    }
    
    const onMouseDown = () => {
      if (!isPlacing) return
      isPlacing = false
      text.set({ opacity: 1 }) // Make fully visible when placed
      canvas.setActiveObject(text)
      canvas.off('mouse:move', onMouseMove)
      canvas.off('mouse:down', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
      saveToHistory()
    }
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlacing) {
        isPlacing = false
        canvas.remove(text)
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:down', onMouseDown)
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    
    canvas.on('mouse:move', onMouseMove)
    canvas.on('mouse:down', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file || !fabricCanvasRef.current) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string
        fabric.FabricImage.fromURL(imgUrl).then((img: any) => {
          img.scale(0.5)
          img.set({
            left: 100,
            top: 100,
            cornerColor: '#5D4037',
            cornerSize: 12,
            transparentCorners: false,
            borderColor: '#5D4037',
          })
          fabricCanvasRef.current?.add(img)
          fabricCanvasRef.current?.setActiveObject(img)
          saveToHistory()
        })
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const addShape = (type: 'rect' | 'circle' | 'triangle') => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    let shape: fabric.Object

    switch (type) {
      case 'rect':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 150,
          fill: '#D4C5B0',
          stroke: '#5D4037',
          strokeWidth: 2,
          opacity: 0.7,
        })
        break
      case 'circle':
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 75,
          fill: '#F8F4FF',
          stroke: '#5D4037',
          strokeWidth: 2,
          opacity: 0.7,
        })
        break
      case 'triangle':
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 150,
          height: 150,
          fill: '#8D918D',
          stroke: '#5D4037',
          strokeWidth: 2,
          opacity: 0.7,
        })
        break
    }

    canvas.add(shape)
    
    // Make shape follow mouse until placed
    let isPlacing = true
    
    const onMouseMove = (e: any) => {
      if (!isPlacing) return
      const pointer = canvas.getPointer(e.e)
      shape.set({
        left: pointer.x - (shape.width || 0) / 2,
        top: pointer.y - (shape.height || 0) / 2,
      })
      canvas.renderAll()
    }
    
    const onMouseDown = () => {
      if (!isPlacing) return
      isPlacing = false
      shape.set({ opacity: 1 })
      canvas.setActiveObject(shape)
      canvas.off('mouse:move', onMouseMove)
      canvas.off('mouse:down', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
      saveToHistory()
    }
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlacing) {
        isPlacing = false
        canvas.remove(shape)
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:down', onMouseDown)
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    
    canvas.on('mouse:move', onMouseMove)
    canvas.on('mouse:down', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
  }

  const addLine = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    
    let isPlacing = true
    let startPoint: { x: number; y: number } | null = null
    let line: fabric.Line | null = null
    
    const onMouseMove = (e: any) => {
      if (!isPlacing) return
      const pointer = canvas.getPointer(e.e)
      
      if (!startPoint) {
        // Haven't clicked yet, show preview line following cursor
        if (line) canvas.remove(line)
        line = new fabric.Line([pointer.x, pointer.y, pointer.x + 100, pointer.y], {
          stroke: '#5D4037',
          strokeWidth: 3,
          selectable: true,
          opacity: 0.7,
        })
        canvas.add(line)
      } else {
        // First point set, update end point
        line?.set({
          x2: pointer.x,
          y2: pointer.y,
        })
      }
      canvas.renderAll()
    }
    
    const onMouseDown = (e: any) => {
      if (!isPlacing) return
      const pointer = canvas.getPointer(e.e)
      
      if (!startPoint) {
        // First click - set start point
        startPoint = { x: pointer.x, y: pointer.y }
        if (line) canvas.remove(line)
        line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: '#5D4037',
          strokeWidth: 3,
          selectable: true,
          opacity: 0.7,
        })
        canvas.add(line)
      } else {
        // Second click - finish line
        isPlacing = false
        if (line) {
          line.set({ opacity: 1 })
          canvas.setActiveObject(line)
        }
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:down', onMouseDown)
        window.removeEventListener('keydown', onKeyDown)
        saveToHistory()
      }
    }
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlacing) {
        isPlacing = false
        if (line) canvas.remove(line)
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:down', onMouseDown)
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    
    canvas.on('mouse:move', onMouseMove)
    canvas.on('mouse:down', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
  }

  const addArrow = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    
    let isPlacing = true
    let startPoint: { x: number; y: number } | null = null
    let group: fabric.Group | null = null
    
    const onMouseMove = (e: any) => {
      if (!isPlacing) return
      const pointer = canvas.getPointer(e.e)
      
      if (!startPoint) {
        // Haven't clicked yet, show preview arrow following cursor
        if (group) canvas.remove(group)
        const line = new fabric.Line([pointer.x, pointer.y, pointer.x + 100, pointer.y], {
          stroke: '#5D4037',
          strokeWidth: 3,
        })
        const triangle = new fabric.Triangle({
          left: pointer.x + 100,
          top: pointer.y - 10,
          width: 20,
          height: 20,
          fill: '#5D4037',
          angle: 90,
        })
        group = new fabric.Group([line, triangle], { opacity: 0.7 })
        canvas.add(group)
      } else {
        // First point set, update end point and arrow head
        if (group) canvas.remove(group)
        const angle = Math.atan2(pointer.y - startPoint.y, pointer.x - startPoint.x) * 180 / Math.PI
        const line = new fabric.Line([startPoint.x, startPoint.y, pointer.x, pointer.y], {
          stroke: '#5D4037',
          strokeWidth: 3,
        })
        const triangle = new fabric.Triangle({
          left: pointer.x,
          top: pointer.y - 10,
          width: 20,
          height: 20,
          fill: '#5D4037',
          angle: angle + 90,
          originX: 'center',
          originY: 'center',
        })
        group = new fabric.Group([line, triangle], { opacity: 0.7 })
        canvas.add(group)
      }
      canvas.renderAll()
    }
    
    const onMouseDown = (e: any) => {
      if (!isPlacing) return
      const pointer = canvas.getPointer(e.e)
      
      if (!startPoint) {
        // First click - set start point
        startPoint = { x: pointer.x, y: pointer.y }
      } else {
        // Second click - finish arrow
        isPlacing = false
        if (group) {
          group.set({ opacity: 1 })
          canvas.setActiveObject(group)
        }
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:down', onMouseDown)
        window.removeEventListener('keydown', onKeyDown)
        saveToHistory()
      }
    }
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlacing) {
        isPlacing = false
        if (group) canvas.remove(group)
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:down', onMouseDown)
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    
    canvas.on('mouse:move', onMouseMove)
    canvas.on('mouse:down', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
  }

  const addCurve = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    
    let isPlacing = true
    let startPoint: { x: number; y: number } | null = null
    let controlPoint: { x: number; y: number } | null = null
    let path: fabric.Path | null = null
    let clickCount = 0
    
    const onMouseMove = (e: any) => {
      if (!isPlacing) return
      const pointer = canvas.getPointer(e.e)
      
      if (path) canvas.remove(path)
      
      if (clickCount === 0) {
        // No clicks yet - show preview curve
        const pathData = `M ${pointer.x} ${pointer.y} Q ${pointer.x + 50} ${pointer.y - 50} ${pointer.x + 100} ${pointer.y}`
        path = new fabric.Path(pathData, {
          stroke: '#5D4037',
          strokeWidth: 3,
          fill: '',
          opacity: 0.7,
        })
        canvas.add(path)
      } else if (clickCount === 1) {
        // Start point set, show curve following cursor
        const pathData = `M ${startPoint!.x} ${startPoint!.y} Q ${pointer.x} ${pointer.y} ${pointer.x + 50} ${pointer.y + 50}`
        path = new fabric.Path(pathData, {
          stroke: '#5D4037',
          strokeWidth: 3,
          fill: '',
          opacity: 0.7,
        })
        canvas.add(path)
      } else if (clickCount === 2) {
        // Start and control points set, show final curve
        const pathData = `M ${startPoint!.x} ${startPoint!.y} Q ${controlPoint!.x} ${controlPoint!.y} ${pointer.x} ${pointer.y}`
        path = new fabric.Path(pathData, {
          stroke: '#5D4037',
          strokeWidth: 3,
          fill: '',
          opacity: 0.7,
        })
        canvas.add(path)
      }
      canvas.renderAll()
    }
    
    const onMouseDown = (e: any) => {
      if (!isPlacing) return
      const pointer = canvas.getPointer(e.e)
      
      if (clickCount === 0) {
        // First click - set start point
        startPoint = { x: pointer.x, y: pointer.y }
        clickCount = 1
      } else if (clickCount === 1) {
        // Second click - set control point
        controlPoint = { x: pointer.x, y: pointer.y }
        clickCount = 2
      } else {
        // Third click - finish curve
        isPlacing = false
        if (path) {
          path.set({ opacity: 1 })
          canvas.setActiveObject(path)
        }
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:down', onMouseDown)
        window.removeEventListener('keydown', onKeyDown)
        saveToHistory()
      }
    }
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlacing) {
        isPlacing = false
        if (path) canvas.remove(path)
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:down', onMouseDown)
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    
    canvas.on('mouse:move', onMouseMove)
    canvas.on('mouse:down', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
  }

  const deleteSelected = () => {
    console.log('🗑️ deleteSelected called')
    if (!fabricCanvasRef.current) {
      console.log('❌ No canvas ref')
      return
    }
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) {
      console.log('❌ No active object to delete')
      return
    }
    console.log('✅ Deleting object:', activeObject.type)
    fabricCanvasRef.current.remove(activeObject)
    setSelectedObject(null)
    setContextMenu({ x: 0, y: 0, show: false })
    saveToHistory()
    console.log('✅ Object deleted successfully')
  }

  const duplicateSelected = () => {
    console.log('🔄 duplicateSelected called')
    if (!fabricCanvasRef.current) {
      console.log('❌ No canvas ref')
      return
    }
    const canvas = fabricCanvasRef.current
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
      console.log('❌ No active object to duplicate')
      return
    }
    console.log('✅ Duplicating object:', activeObject.type)
    
    activeObject.clone().then((cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
      saveToHistory()
      console.log('✅ Object duplicated successfully')
    })
  }

  const copySelected = () => {
    console.log('📋 copySelected called')
    if (!fabricCanvasRef.current) {
      console.log('❌ No canvas ref')
      return
    }
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) {
      console.log('❌ No active object to copy')
      return
    }
    console.log('✅ Copying object:', activeObject.type)
    activeObject.clone().then((cloned: any) => {
      setClipboard(cloned)
      console.log('✅ Object copied to clipboard')
    })
  }

  const pasteFromClipboard = () => {
    console.log('📌 pasteFromClipboard called')
    if (!fabricCanvasRef.current || !clipboard) {
      console.log('❌ No canvas ref or clipboard is empty')
      return
    }
    console.log('✅ Pasting from clipboard')
    const canvas = fabricCanvasRef.current
    
    clipboard.clone().then((cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
      saveToHistory()
      console.log('✅ Object pasted successfully')
    })
  }

  const bringForward = () => {
    if (!fabricCanvasRef.current) return
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) return
    const objects = fabricCanvasRef.current.getObjects()
    const currentIndex = objects.indexOf(activeObject)
    if (currentIndex < objects.length - 1) {
      fabricCanvasRef.current.remove(activeObject)
      fabricCanvasRef.current.insertAt(currentIndex + 1, activeObject)
      fabricCanvasRef.current.renderAll()
    }
  }

  const sendBackward = () => {
    if (!fabricCanvasRef.current) return
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) return
    const objects = fabricCanvasRef.current.getObjects()
    const currentIndex = objects.indexOf(activeObject)
    if (currentIndex > 0) {
      fabricCanvasRef.current.remove(activeObject)
      fabricCanvasRef.current.insertAt(currentIndex - 1, activeObject)
      fabricCanvasRef.current.renderAll()
    }
  }

  const changeColor = (color: string) => {
    if (!selectedObject) return
    selectedObject.set('fill', color)
    fabricCanvasRef.current?.renderAll()
    saveToHistory()
  }

  const changeBorderColor = (color: string) => {
    if (!selectedObject) return
    selectedObject.set('stroke', color)
    fabricCanvasRef.current?.renderAll()
    saveToHistory()
  }

  const changeOpacity = (opacity: number) => {
    if (!selectedObject) return
    selectedObject.set('opacity', opacity)
    fabricCanvasRef.current?.renderAll()
    saveToHistory()
  }

  const changeFontFamily = (fontFamily: string) => {
    if (!selectedObject || selectedObject.type !== 'i-text') return
    selectedObject.set('fontFamily', fontFamily)
    selectedObject.setCoords() // Update object coordinates
    fabricCanvasRef.current?.renderAll()
    fabricCanvasRef.current?.requestRenderAll()
    saveToHistory()
  }

  const changeFontSize = (fontSize: number) => {
    if (!selectedObject || selectedObject.type !== 'i-text') return
    selectedObject.set('fontSize', fontSize)
    selectedObject.setCoords() // Update object coordinates
    fabricCanvasRef.current?.renderAll()
    fabricCanvasRef.current?.requestRenderAll()
    saveToHistory()
  }

  const changeWidth = (width: number) => {
    if (!selectedObject) return
    const currentWidth = selectedObject.width || 100
    const scaleX = selectedObject.scaleX || 1
    const newScaleX = (width / currentWidth) * scaleX
    selectedObject.set('scaleX', newScaleX)
    selectedObject.setCoords()
    fabricCanvasRef.current?.renderAll()
    fabricCanvasRef.current?.requestRenderAll()
    saveToHistory()
  }

  const changeHeight = (height: number) => {
    if (!selectedObject) return
    const currentHeight = selectedObject.height || 100
    const scaleY = selectedObject.scaleY || 1
    const newScaleY = (height / currentHeight) * scaleY
    selectedObject.set('scaleY', newScaleY)
    selectedObject.setCoords()
    fabricCanvasRef.current?.renderAll()
    fabricCanvasRef.current?.requestRenderAll()
    saveToHistory()
  }

  const addAnimation = (type: 'pulse' | 'rotate' | 'bounce') => {
    if (!selectedObject) return
    
    // Store animation data
    selectedObject.set('animation', type)
    saveToHistory()
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3)
    setZoom(newZoom)
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current
      const center = canvas.getCenter()
      const point = new fabric.Point(center.left, center.top)
      canvas.zoomToPoint(point, newZoom)
    }
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.5)
    setZoom(newZoom)
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current
      const center = canvas.getCenter()
      const point = new fabric.Point(center.left, center.top)
      canvas.zoomToPoint(point, newZoom)
    }
  }

  const handleZoomReset = () => {
    setZoom(1)
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setViewportTransform([1, 0, 0, 1, 0, 0])
      fabricCanvasRef.current.renderAll()
    }
  }

  const addVideo = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file || !fabricCanvasRef.current) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const videoUrl = event.target?.result as string
        const videoElement = document.createElement('video')
        videoElement.src = videoUrl
        videoElement.controls = true
        videoElement.style.maxWidth = '100%'
        
        // Create a placeholder for video
        const rect = new fabric.Rect({
          left: 100,
          top: 100,
          width: 400,
          height: 225,
          fill: '#000',
          stroke: '#5D4037',
          strokeWidth: 2,
        })
        
        const text = new fabric.IText('🎥 Video\n(Click to play)', {
          left: 150,
          top: 180,
          fontSize: 24,
          fill: '#fff',
          fontFamily: 'Arial',
          textAlign: 'center',
        })
        
        // Store video URL in object data
        rect.set('videoUrl', videoUrl)
        text.set('videoUrl', videoUrl)
        
        fabricCanvasRef.current?.add(rect)
        fabricCanvasRef.current?.add(text)
        saveToHistory()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const duplicateObject = () => {
    if (!fabricCanvasRef.current) return
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) return
    activeObject.clone().then((cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      })
      fabricCanvasRef.current?.add(cloned)
      fabricCanvasRef.current?.setActiveObject(cloned)
      saveToHistory()
    })
    setContextMenu({ x: 0, y: 0, show: false })
  }

  const lockObject = () => {
    if (!fabricCanvasRef.current) return
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) return
    activeObject.set({
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      selectable: false,
    })
    fabricCanvasRef.current?.renderAll()
    setContextMenu({ x: 0, y: 0, show: false })
  }

  const unlockObject = () => {
    if (!fabricCanvasRef.current) return
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) return
    activeObject.set({
      lockMovementX: false,
      lockMovementY: false,
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
      selectable: true,
    })
    fabricCanvasRef.current?.renderAll()
  }

  const addFrame = () => {
    if (!fabricCanvasRef.current) return
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) return
    const bounds = activeObject.getBoundingRect()
    const frame = new fabric.Rect({
      left: bounds.left - 10,
      top: bounds.top - 10,
      width: bounds.width + 20,
      height: bounds.height + 20,
      fill: 'transparent',
      stroke: '#5D4037',
      strokeWidth: 3,
      rx: 10,
      ry: 10,
    })
    fabricCanvasRef.current.add(frame)
    fabricCanvasRef.current.sendObjectToBack(frame)
    saveToHistory()
    setContextMenu({ x: 0, y: 0, show: false })
  }

  const fitImageToCanvas = () => {
    if (!fabricCanvasRef.current) return
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (!activeObject) return
    const canvasWidth = fabricCanvasRef.current.getWidth()
    const canvasHeight = fabricCanvasRef.current.getHeight()
    const objWidth = activeObject.getScaledWidth()
    const objHeight = activeObject.getScaledHeight()
    
    const scaleX = canvasWidth / objWidth
    const scaleY = canvasHeight / objHeight
    const scale = Math.min(scaleX, scaleY) * 0.9 // 90% of canvas size
    
    activeObject.scale(scale)
    activeObject.set({
      left: (canvasWidth - activeObject.getScaledWidth()) / 2,
      top: (canvasHeight - activeObject.getScaledHeight()) / 2,
    })
    fabricCanvasRef.current.renderAll()
    saveToHistory()
    setContextMenu({ x: 0, y: 0, show: false })
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative border-2 border-dun/30 rounded-xl overflow-hidden bg-white'}`}>
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-vandyke to-walnut text-white p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {isFullscreen && (
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <h3 className="font-bold text-lg">Visual Canvas Editor - Fullscreen</h3>
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
          {/* Text */}
          <motion.button
            onClick={addText}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Add Text
          </motion.button>

          {/* Image */}
          <motion.button
            onClick={addImage}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image
          </motion.button>

          {/* Video */}
          <motion.button
            onClick={addVideo}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Video
          </motion.button>

          {/* Shapes */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => addShape('rect')}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
              title="Rectangle"
              whileHover={{ scale: 1.05 }}
            >
              ▭
            </motion.button>
            <motion.button
              onClick={() => addShape('circle')}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
              title="Circle"
              whileHover={{ scale: 1.05 }}
            >
              ●
            </motion.button>
            <motion.button
              onClick={() => addShape('triangle')}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
              title="Triangle"
              whileHover={{ scale: 1.05 }}
            >
              ▲
            </motion.button>
            <motion.button
              onClick={addLine}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
              title="Line"
              whileHover={{ scale: 1.05 }}
            >
              ─
            </motion.button>
            <motion.button
              onClick={addCurve}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
              title="Curved Line (3 clicks: start, control, end)"
              whileHover={{ scale: 1.05 }}
            >
              ⌒
            </motion.button>
            <motion.button
              onClick={addArrow}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
              title="Arrow"
              whileHover={{ scale: 1.05 }}
            >
              →
            </motion.button>
          </div>

          <div className="w-px h-8 bg-white/30"></div>

          {/* Undo/Redo */}
          <motion.button
            onClick={undo}
            disabled={historyStep <= 0}
            className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
          >
            ↶
          </motion.button>
          <motion.button
            onClick={redo}
            disabled={historyStep >= canvasHistory.length - 1}
            className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
          >
            ↷
          </motion.button>

          <div className="w-px h-8 bg-white/30"></div>

          {/* Canvas Height Control */}
          <motion.button
            onClick={() => setShowHeightControl(!showHeightControl)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            title="Adjust Canvas Height"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            {canvasHeight}px
          </motion.button>
          </div>
        </div>

        {isFullscreen && (
          <div className="flex items-center gap-3">
            {projectSlug && (
              <motion.button
                onClick={() => window.open(`/project/${projectSlug}`, '_blank')}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in New Tab
              </motion.button>
            )}
            {onSave && (
              <motion.button
                onClick={onSave}
                className="px-6 py-2 bg-vandyke hover:bg-walnut text-white rounded-lg font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💾 Save Project
              </motion.button>
            )}
            <motion.button
              onClick={onClose}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              Exit Fullscreen
            </motion.button>
          </div>
        )}
      </div>

      {/* Height Control Panel */}
      <AnimatePresence>
        {showHeightControl && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-vandyke/5 border-b border-dun/30 overflow-hidden"
          >
            <div className="p-4 flex items-center gap-4 flex-wrap">
              <span className="text-sm font-semibold text-vandyke">Canvas Height:</span>
              
              {/* Preset heights */}
              <div className="flex gap-2">
                {[500, 800, 1200, 1600, 2000, 3000].map(height => (
                  <button
                    key={height}
                    onClick={() => setCanvasHeight(height)}
                    className={`px-3 py-1.5 rounded text-sm transition-all ${
                      canvasHeight === height
                        ? 'bg-vandyke text-white'
                        : 'bg-white text-vandyke hover:bg-dun/20'
                    }`}
                  >
                    {height}px
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-vandyke">Custom:</span>
                <input
                  type="number"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(Math.max(300, Math.min(5000, parseInt(e.target.value) || 500)))}
                  className="w-24 px-3 py-1.5 border-2 border-dun/30 rounded focus:border-vandyke outline-none"
                  min="300"
                  max="5000"
                  step="100"
                />
                <span className="text-sm text-gray-500">(300-5000px)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-auto'}`}>
        {/* Canvas Area with Real Page Background */}
        <div className="flex-1 bg-white relative overflow-auto">
          
          {/* Canvas Size Info Badge */}
          {fabricCanvasRef.current && (
            <div className="fixed top-20 left-4 bg-vandyke/90 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg z-50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-semibold">WYSIWYG Editor</span>
              </div>
              <div className="text-[10px] mt-1 opacity-80">
                Real-time editing • {fabricCanvasRef.current.width}px × {fabricCanvasRef.current.height}px
              </div>
              <div className="text-[9px] mt-1 text-green-300">
                ✓ What You See Is What You Get
              </div>
            </div>
          )}
          
          {/* Real Page Preview as Background */}
          <div className="relative">
            {/* Live Preview Background (read-only) */}
            <div className="pointer-events-none opacity-30">
              {previewContent && <CanvasViewer content={previewContent} />}
            </div>
            
            {/* Editable Canvas Overlay */}
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              style={{ 
                width: fabricCanvasRef.current?.width || 900,
              }}
            >
              <canvas ref={canvasRef} className="block mx-auto" style={{ backgroundColor: 'transparent' }} />
            </div>
          </div>
          
          {/* Helper message when canvas is empty */}
          {fabricCanvasRef.current?.getObjects().length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-md mx-4 border-2 border-vandyke/20">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-vandyke" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h3 className="text-lg md:text-xl font-bold text-vandyke mb-2">🎨 WYSIWYG Editor</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-3">
                  You're editing directly on the real page!
                </p>
                <p className="text-gray-500 text-xs">
                  Add text, images, or shapes above. They'll appear exactly as visitors will see them.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Properties Panel */}
        <AnimatePresence>
          {selectedObject && (
            <motion.div
              className="w-64 md:w-80 bg-white border-l border-dun/30 p-4 md:p-6 overflow-auto"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
            >
              <h3 className="text-lg font-bold text-vandyke mb-4">Properties</h3>

              {/* Quick Actions */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-vandyke/70 uppercase mb-3 tracking-wide">Quick Actions</label>
                <div className="space-y-2">
                  <button
                    onClick={duplicateSelected}
                    className="w-full px-4 py-3 bg-gradient-to-r from-vandyke to-walnut hover:from-walnut hover:to-vandyke text-white rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-between group"
                  >
                    <span className="font-medium">Duplicate</span>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Ctrl+D</kbd>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={copySelected}
                      className="px-3 py-3 bg-white border-2 border-vandyke text-vandyke hover:bg-vandyke hover:text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Copy
                    </button>
                    
                    <button
                      onClick={pasteFromClipboard}
                      disabled={!clipboard}
                      className="px-3 py-3 bg-white border-2 border-vandyke text-vandyke hover:bg-vandyke hover:text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-vandyke"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Paste
                    </button>
                  </div>

                  <button
                    onClick={deleteSelected}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-between group"
                  >
                    <span>Delete</span>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Del</kbd>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Layer Controls */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-vandyke mb-2">Layer</label>
                <div className="flex gap-2">
                  <button
                    onClick={bringForward}
                    className="flex-1 px-3 py-2 bg-magnolia hover:bg-dun/20 rounded-lg text-sm"
                  >
                    ↑ Forward
                  </button>
                  <button
                    onClick={sendBackward}
                    className="flex-1 px-3 py-2 bg-magnolia hover:bg-dun/20 rounded-lg text-sm"
                  >
                    ↓ Backward
                  </button>
                </div>
              </div>

              {/* Color */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-vandyke mb-2">Fill Color</label>
                <div className="grid grid-cols-5 gap-2">
                  {['#F8F4FF', '#D4C5B0', '#8D918D', '#5D4037', '#664228', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'].map(color => (
                    <button
                      key={color}
                      onClick={() => changeColor(color)}
                      className="w-10 h-10 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Border Color */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-vandyke mb-2">Border Color</label>
                <div className="grid grid-cols-5 gap-2">
                  {['#000000', '#5D4037', '#664228', '#8D918D', '#D4C5B0'].map(color => (
                    <button
                      key={color}
                      onClick={() => changeBorderColor(color)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-md hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-vandyke mb-2">
                  Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedObject.opacity || 1}
                  onChange={(e) => changeOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Width and Height */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-vandyke mb-3">Dimensions</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-vandyke/70 mb-1">Width</label>
                    <input
                      type="number"
                      value={Math.round((selectedObject.width || 100) * (selectedObject.scaleX || 1))}
                      onChange={(e) => changeWidth(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-magnolia border border-dun/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vandyke"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-vandyke/70 mb-1">Height</label>
                    <input
                      type="number"
                      value={Math.round((selectedObject.height || 100) * (selectedObject.scaleY || 1))}
                      onChange={(e) => changeHeight(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-magnolia border border-dun/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vandyke"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Text Properties - only show for text objects */}
              {selectedObject.type === 'i-text' && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-vandyke mb-2">Font Family</label>
                    <select
                      value={(selectedObject as any).fontFamily || 'Arial'}
                      onChange={(e) => changeFontFamily(e.target.value)}
                      className="w-full px-3 py-2 bg-magnolia border border-dun/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vandyke"
                      style={{ fontFamily: (selectedObject as any).fontFamily || 'Arial' }}
                    >
                      <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                      <option value="Helvetica" style={{ fontFamily: 'Helvetica' }}>Helvetica</option>
                      <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                      <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                      <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                      <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                      <option value="Impact" style={{ fontFamily: 'Impact' }}>Impact</option>
                      <option value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</option>
                      <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</option>
                      <option value="Palatino" style={{ fontFamily: 'Palatino' }}>Palatino</option>
                      <option value="Garamond" style={{ fontFamily: 'Garamond' }}>Garamond</option>
                      <option value="Bookman" style={{ fontFamily: 'Bookman' }}>Bookman</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-vandyke mb-2">
                      Font Size: {(selectedObject as any).fontSize || 24}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      step="2"
                      value={(selectedObject as any).fontSize || 24}
                      onChange={(e) => changeFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {/* Animations */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-vandyke mb-2">Animation</label>
                <div className="space-y-2">
                  <button
                    onClick={() => addAnimation('pulse')}
                    className="w-full px-3 py-2 bg-magnolia hover:bg-dun/20 rounded-lg text-sm text-left"
                  >
                    💓 Pulse
                  </button>
                  <button
                    onClick={() => addAnimation('rotate')}
                    className="w-full px-3 py-2 bg-magnolia hover:bg-dun/20 rounded-lg text-sm text-left"
                  >
                    🔄 Rotate
                  </button>
                  <button
                    onClick={() => addAnimation('bounce')}
                    className="w-full px-3 py-2 bg-magnolia hover:bg-dun/20 rounded-lg text-sm text-left"
                  >
                    ⬆️ Bounce
                  </button>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={deleteSelected}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
              >
                Delete Object
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom Controls */}
        <motion.div 
          className="zoom-controls absolute bottom-4 left-4 flex items-center gap-2 bg-white shadow-lg rounded-lg p-2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomReset}
            className="p-2 hover:bg-gray-100 rounded transition-colors text-xs font-medium"
            title="Reset Zoom"
          >
            Reset
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </motion.div>

        {/* Custom Context Menu */}
        <AnimatePresence>
          {contextMenu.show && (() => {
            console.log('📋 Context menu rendering, show:', contextMenu.show)
            const activeObject = fabricCanvasRef.current?.getActiveObject()
            console.log('🔍 Active object in menu:', activeObject ? activeObject.type : 'none')
            if (!activeObject) {
              console.log('❌ No active object, hiding menu')
              return null
            }
            
            console.log('✅ Rendering menu with options for:', activeObject.type)
            return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="context-menu fixed bg-white shadow-xl rounded-lg py-2 min-w-[200px] z-50 border border-gray-200"
              style={{
                left: `${contextMenu.x}px`,
                top: `${contextMenu.y}px`,
              }}
            >
              <>
                <button
                  onClick={() => {
                    console.log('🔄 Duplicate button clicked')
                    duplicateObject()
                    setContextMenu({ x: 0, y: 0, show: false })
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Duplicate</span>
                </button>

                <button
                  onClick={() => {
                    console.log('📋 Copy button clicked')
                    copySelected()
                    setContextMenu({ x: 0, y: 0, show: false })
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span className="text-sm">Copy (Ctrl+C)</span>
                </button>

                <button
                  onClick={() => {
                    console.log('🗑️ Delete button clicked')
                    deleteSelected()
                    setContextMenu({ x: 0, y: 0, show: false })
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-sm">Delete (Del)</span>
                </button>                  <div className="border-t border-gray-200 my-1"></div>

                  <button
                    onClick={() => {
                      pasteFromClipboard()
                      setContextMenu({ x: 0, y: 0, show: false })
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                    disabled={!clipboard}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-sm">{clipboard ? 'Paste (Ctrl+V)' : 'Paste (empty)'}</span>
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>

                  <button
                    onClick={() => {
                      bringForward()
                      setContextMenu({ x: 0, y: 0, show: false })
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm">Bring Forward</span>
                  </button>

                  <button
                    onClick={() => {
                      sendBackward()
                      setContextMenu({ x: 0, y: 0, show: false })
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-sm">Send Backward</span>
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>

                  <button
                    onClick={() => {
                      lockObject()
                      setContextMenu({ x: 0, y: 0, show: false })
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm">Lock Object</span>
                  </button>

                  <button
                    onClick={() => {
                      addFrame()
                      setContextMenu({ x: 0, y: 0, show: false })
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <span className="text-sm">Add Frame</span>
                  </button>

                  {/* Fit to Canvas - Show for images and shapes that might be too large */}
                  {(activeObject.type === 'image' || activeObject.type === 'rect' || activeObject.type === 'circle') && (
                    <>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          fitImageToCanvas()
                          setContextMenu({ x: 0, y: 0, show: false })
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="text-sm">Fit to Canvas</span>
                      </button>
                    </>
                  )}
              </>
            </motion.div>
            )
          })()}
        </AnimatePresence>

        {/* Unlock Button (for locked objects) */}
        {selectedObject?.lockMovementX && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={unlockObject}
            className="fixed bottom-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-amber-600 transition-colors flex items-center gap-2 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Unlock Object
          </motion.button>
        )}
      </div>
    </div>
  )
}

export default CanvasEditor
