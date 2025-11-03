# Project Editor - Component Documentation

## Overview
The Project Editor has been completely refactored into smaller, reusable, and responsive components. It now features a mobile-first design with proper breakpoints for tablet and desktop views.

## Component Structure

```
admin/
├── ProjectEditor.tsx           # Main container component
├── editor/
│   ├── index.ts               # Barrel export file
│   ├── EditorHeader.tsx       # Responsive header with navigation and save button
│   ├── EditorForm.tsx         # Form fields (title, category, author, description, etc.)
│   ├── ImageUploadCard.tsx    # Reusable image upload component
│   ├── RichTextEditor.tsx     # ReactQuill editor with fullscreen support
│   ├── ContentTypeSelector.tsx # Toggle between rich text and canvas
│   ├── KeyboardShortcutsHelp.tsx # Help modal with keyboard shortcuts
│   ├── QuickTipsPanel.tsx     # Tips sidebar
│   └── hooks/
│       ├── useProjectEditor.ts # Main editor logic hook
│       └── useImageUpload.ts   # Image upload logic hook
```

## Components

### 1. EditorHeader
**Purpose:** Fixed header with navigation and action buttons

**Props:**
- `isEdit: boolean` - Whether editing existing project or creating new
- `onSave: () => void` - Save handler
- `saving: boolean` - Loading state

**Responsive Features:**
- Mobile: Compact layout with abbreviated text
- Desktop: Full layout with descriptive labels

---

### 2. EditorForm
**Purpose:** Main form fields for project metadata

**Props:**
- `formData: object` - Form data object
- `categories: Category[]` - List of categories
- `onChange: (field, value) => void` - Field change handler

**Features:**
- Single column on mobile
- Two-column grid on tablet/desktop
- Responsive text sizing

---

### 3. ImageUploadCard
**Purpose:** Reusable image upload component with preview

**Props:**
- `title: string` - Card title
- `icon: string` - Icon type ('banner' or 'thumbnail')
- `imageUrl: string` - Current image URL
- `uploading: boolean` - Upload loading state
- `onUpload: (e) => void` - Upload handler
- `inputId: string` - Unique input ID

**Features:**
- Drag and drop visual feedback
- Image preview with animations
- Upload progress indicator
- Mobile-optimized sizing

---

### 4. RichTextEditor
**Purpose:** Rich text editor with fullscreen mode

**Props:**
- `value: string` - Editor content
- `onChange: (value) => void` - Content change handler
- `isFullscreen: boolean` - Fullscreen state
- `onToggleFullscreen: () => void` - Fullscreen toggle handler

**Features:**
- Mobile-optimized toolbar
- Fullscreen mode for focused editing
- Responsive editor height
- Image drag and resize support

---

### 5. ContentTypeSelector
**Purpose:** Toggle between rich text and visual canvas editor

**Props:**
- `contentType: 'richtext' | 'canvas'` - Current content type
- `onChange: (type) => void` - Type change handler

**Features:**
- Responsive button layout (vertical on mobile, horizontal on desktop)
- Clear visual feedback
- Descriptive tooltips

---

### 6. KeyboardShortcutsHelp
**Purpose:** Modal showing keyboard shortcuts

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler

**Features:**
- Responsive grid layout
- Mobile-optimized text sizing
- Touch-friendly close button

---

### 7. QuickTipsPanel
**Purpose:** Static panel with helpful tips

**Props:** None (static content)

**Features:**
- Compact design
- Easy to read on all screen sizes

---

## Hooks

### useProjectEditor
**Purpose:** Manages all project editor state and logic

**Returns:**
- `formData` - Current form data
- `setFormData` - Form data setter
- `updateFormField` - Helper to update single field
- `categories` - Available categories
- `saving` - Save loading state
- `isEdit` - Edit mode flag
- `contentType` - Current content type
- `setContentType` - Content type setter
- `handleSave` - Save handler

---

### useImageUpload
**Purpose:** Handles image upload logic

**Returns:**
- `uploading` - Upload loading state
- `uploadImage` - Upload function

---

## Responsive Breakpoints

```css
Mobile: < 640px (sm)
Tablet: 640px - 1024px (sm to lg)
Desktop: > 1024px (lg+)
Extra Large: > 1280px (xl+)
```

### Layout Changes by Breakpoint

**Mobile (< 640px):**
- Single column layout
- Stacked form fields
- Compact header with abbreviated buttons
- Full-width image cards
- Vertical content type selector

**Tablet (640px - 1024px):**
- Two-column form grid
- Larger touch targets
- Sidebar starts to appear

**Desktop (1024px+):**
- Three-column grid (sidebar, main, images)
- Fixed sidebars
- Decorative document lines (XL only)
- Full toolbar visibility

---

## Key Improvements

1. **Better Code Organization:** Separated into logical, reusable components
2. **Mobile-First Design:** Optimized for mobile with progressive enhancement
3. **Improved Performance:** Smaller components, better memoization
4. **Better Maintainability:** Each component has single responsibility
5. **Reusable Components:** ImageUploadCard, ContentTypeSelector can be used elsewhere
6. **Custom Hooks:** Business logic separated from UI
7. **Responsive Text:** All text scales appropriately across devices
8. **Touch-Friendly:** Larger tap targets on mobile
9. **Better Accessibility:** Semantic HTML, proper labels
10. **Consistent Spacing:** Uses Tailwind's responsive spacing utilities

---

## Usage Example

```tsx
import ProjectEditor from './components/admin/ProjectEditor'

// In your router
<Route path="/admin/projects/new" element={<ProjectEditor />} />
<Route path="/admin/projects/:id/edit" element={<ProjectEditor />} />
```

---

## Future Enhancements

1. Add form validation with Zod or Yup
2. Add autosave functionality
3. Add image cropping/editing before upload
4. Add markdown preview for rich text
5. Add version history/undo-redo
6. Add collaborative editing support
7. Add more keyboard shortcuts
8. Add drag-and-drop for images
