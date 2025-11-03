# Component Structure Documentation

This project now uses a **modular component architecture** for better maintainability and organization.

## 📁 Component Structure

```
src/components/
├── MainContent.tsx          # Main container (imports all sections)
├── Navigation.tsx           # Top navigation bar
├── BannerSection.tsx        # Hero section with frame slider & doodles
├── TeamSection.tsx          # Team members grid with hover effects
├── CTASection.tsx           # Call-to-action section
├── Footer.tsx               # Footer with links and info
├── ArtisticFrameSlider.tsx  # Frame slider component
├── LoadingScreen.tsx        # Loading animation
└── carousel/                # Carousel components (legacy)
```

## 🎯 Main Components

### **MainContent.tsx** (30 lines)
- **Purpose**: Main container that imports and arranges all sections
- **State**: Manages `activeSection` for navigation
- **Components Used**: Navigation, BannerSection, TeamSection, CTASection, Footer

### **Navigation.tsx** (70 lines)
- **Purpose**: Fixed top navigation bar
- **Props**: `activeSection`, `setActiveSection`
- **Features**: 
  - Logo with DH image
  - Navigation links (Home, Services, Team, Contact)
  - CTA button
  - Responsive design

### **BannerSection.tsx** (400+ lines)
- **Purpose**: Hero section with frame slider and animated doodles
- **Features**:
  - Full-screen hero section
  - Artistic background doodles (paint brushes, palettes, etc.)
  - Frame slider component
  - Running text animations at bottom
  - Header text with gradient background
- **Subcomponents**: ArtisticFrameSlider

### **TeamSection.tsx** (200+ lines)
- **Purpose**: Display team members in grid
- **Data Source**: `src/data/team.json`
- **Features**:
  - 4-column grid (2 on mobile)
  - 8 team members
  - Hover overlay with details
  - Asymmetric photo frames
  - Animated decorations

### **CTASection.tsx** (40 lines)
- **Purpose**: Call-to-action section
- **Features**:
  - Gradient background
  - "Ready to Get Started?" message
  - CTA button with hover effects

### **Footer.tsx** (80 lines)
- **Purpose**: Footer with company info
- **Sections**:
  - Company info with logo
  - Quick links
  - Services list
  - Contact information
  - Copyright notice

## 📊 Component Breakdown

| Component | Lines | Purpose | Data Source |
|-----------|-------|---------|-------------|
| MainContent.tsx | ~30 | Main container | - |
| Navigation.tsx | ~70 | Top nav bar | - |
| BannerSection.tsx | ~450 | Hero section | - |
| TeamSection.tsx | ~220 | Team grid | team.json |
| CTASection.tsx | ~40 | Call to action | - |
| Footer.tsx | ~80 | Footer | - |
| **Total** | **~890** | *vs 786 before* | |

## ✅ Benefits of Modular Structure

### 1. **Better Organization**
- Each section is in its own file
- Easier to find and edit specific sections
- Clear separation of concerns

### 2. **Maintainability**
- Changes to one section don't affect others
- Easier to debug issues
- Simpler to add/remove sections

### 3. **Reusability**
- Components can be reused in other pages
- Easy to create variations
- Can be tested independently

### 4. **Collaboration**
- Multiple developers can work on different sections
- Less merge conflicts
- Clearer code ownership

### 5. **Performance**
- Can lazy-load components if needed
- Easier to optimize individual sections
- Better code splitting potential

## 🔧 How to Edit

### To edit the Navigation:
```bash
src/components/Navigation.tsx
```

### To edit the Hero Section:
```bash
src/components/BannerSection.tsx
```

### To edit Team Section:
```bash
src/components/TeamSection.tsx
# Also edit the data:
src/data/team.json
```

### To edit CTA Section:
```bash
src/components/CTASection.tsx
```

### To edit Footer:
```bash
src/components/Footer.tsx
```

## 🚀 Adding New Sections

1. Create new component file:
```tsx
// src/components/NewSection.tsx
import { motion } from 'framer-motion'

const NewSection: React.FC = () => {
  return (
    <section className="py-20 px-6">
      {/* Your content */}
    </section>
  )
}

export default NewSection
```

2. Import in MainContent.tsx:
```tsx
import NewSection from './NewSection'
```

3. Add to layout:
```tsx
<NewSection />
```

## 📝 Notes

- All sections use Framer Motion for animations
- Color palette defined in `tailwind.config.js`
- Team data in `src/data/team.json`
- Slider data in `src/data/slides.json`
- Original MainContent.tsx backed up as `MainContent.tsx.backup`

## 🔄 Migration from Old Structure

**Before**: 786 lines in one file
**After**: ~890 lines split across 6 files

While the total lines increased slightly, each file is now:
- Focused on one purpose
- Easier to understand
- Simpler to maintain
- More professional structure
