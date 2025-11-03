# Canvas Editor Guide

## Overview
The Canvas Editor is a professional visual design tool integrated into the project editor, allowing you to create rich, interactive content with images, text, shapes, and animations.

## Features

### 🎨 **Object Types**
- **Text**: Editable text with custom fonts and colors
- **Images**: Upload and manipulate images
- **Shapes**: Rectangles, circles, and triangles

### 🖱️ **Object Manipulation**
- **Drag**: Click and drag any object to reposition
- **Resize**: Drag corner handles to resize
- **Rotate**: Drag rotation handle to rotate objects
- **Select**: Click an object to select it

### 🔧 **Toolbar Features**

#### Add Elements
- **Add Text**: Insert editable text
- **Add Image**: Upload and place images
- **Add Shapes**: Rectangle, Circle, Triangle

#### Layer Management
- **Bring Forward**: Move object one layer up (also: Ctrl+])
- **Send Backward**: Move object one layer down (also: Ctrl+[)

#### History
- **Undo**: Revert last change
- **Redo**: Reapply undone change

### 🎨 **Properties Panel**
When an object is selected, you can modify:

#### Fill Color
Choose from 10 preset colors:
- Black, Gray, Red, Blue, Green
- Yellow, Purple, Pink, Orange, Brown

#### Border Color
Choose from 5 preset colors:
- Black, White, Red, Blue, Green

#### Opacity
- Slider from 0 (transparent) to 1 (opaque)

#### Animations
Add animations to objects:
- 💓 **Pulse**: Scale up and down
- 🔄 **Rotate**: Continuous rotation
- ⬆️ **Bounce**: Up and down motion

### 🖱️ **Right-Click Context Menu**
Right-click any object to access quick actions:
- **Duplicate**: Create a copy offset from original
- **Delete**: Remove the object
- **Bring Forward**: Move up one layer
- **Send Backward**: Move down one layer
- **Lock Object**: Prevent all modifications
- **Add Frame**: Add decorative border around object

### 🔍 **Zoom Controls**
Located in bottom-left corner:
- **Zoom In**: Increase view size
- **Zoom Out**: Decrease view size
- **Reset**: Return to 100% zoom
- Current zoom percentage displayed

### ⌨️ **Keyboard Shortcuts**

#### General
- **Delete**: Remove selected object
- **Ctrl+D**: Duplicate selected object
- **Ctrl+L**: Lock selected object

#### Layers
- **Ctrl+]**: Bring forward
- **Ctrl+[**: Send backward

#### Zoom
- **Ctrl++** or **Ctrl+=**: Zoom in
- **Ctrl+-**: Zoom out
- **Ctrl+0**: Reset zoom to 100%

### 🔒 **Object Locking**
- Lock objects to prevent accidental modifications
- Locked objects cannot be moved, resized, or rotated
- An "Unlock Object" button appears when a locked object is selected
- Useful for backgrounds or fixed elements

### 🖼️ **Frame Feature**
- Automatically creates a decorative frame around selected object
- Frame is positioned behind the object
- Customizable stroke color, width, and rounded corners

## Workflow Tips

### Creating a Design
1. **Set Canvas Size**: Default is 1200x800px
2. **Add Background**: Use shapes or images as background
3. **Add Content**: Layer text and images
4. **Arrange Layers**: Use bring forward/send backward
5. **Style Objects**: Use properties panel for colors and opacity
6. **Add Effects**: Apply animations for interactivity
7. **Lock Elements**: Lock background elements to prevent changes
8. **Save**: Your design is automatically saved to the project

### Best Practices
- **Lock backgrounds** after positioning to avoid accidental moves
- **Use zoom** for precise positioning and alignment
- **Group related elements** using frames
- **Test animations** before finalizing
- **Save frequently** using undo/redo to explore options

## Technical Details

### Canvas Size
- Default: 1200x800 pixels
- Can be viewed at different zoom levels (50%-300%)
- Responsive and scalable

### File Format
- Canvas state stored as JSON
- Includes all objects, positions, colors, and animations
- Can be loaded and edited anytime

### Image Support
- Accepts: JPG, PNG, GIF, WebP
- Images are embedded in canvas
- Can be resized and repositioned freely

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Hardware acceleration recommended for smooth performance

## Troubleshooting

### Object won't move
- Check if object is locked (unlock button appears)
- Ensure object is selected (shows handles)

### Context menu doesn't appear
- Make sure you're right-clicking directly on an object
- Browser context menu blocked automatically

### Zoom not working
- Use keyboard shortcuts or zoom controls
- Check browser zoom is at 100%

### Animation not visible
- Animations are metadata only in editor
- Actual animation implementation requires frontend rendering

## Future Enhancements
- [ ] Text formatting (bold, italic, underline)
- [ ] More shape options (polygons, stars, arrows)
- [ ] Gradient fills
- [ ] Image filters and effects
- [ ] Alignment guides and snapping
- [ ] Export to PNG/SVG
- [ ] Templates and presets
- [ ] Collaborative editing
- [ ] Animation timeline
- [ ] Custom fonts
