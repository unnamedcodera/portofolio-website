# 🚀 Quick Reference - Professional UI Components

## ⚡ Quick Copy-Paste Examples

### 1. Enhanced Button
```tsx
import { Button } from './components/ui/Button'
import { Sparkles, ArrowRight } from 'lucide-react'

// Primary CTA
<Button variant="gradient" size="lg">
  <Sparkles className="w-5 h-5" />
  Get Started
  <ArrowRight className="w-5 h-5" />
</Button>

// Secondary
<Button variant="outline" size="default">
  Learn More
</Button>

// Subtle
<Button variant="ghost" size="sm">
  View Details
</Button>
```

### 2. Professional Card
```tsx
import { Card, CardContent } from './components/ui/Card'
import { GlowingCard } from './components/ui/AnimatedElements'
import { Badge } from './components/ui/Badge'

<GlowingCard>
  <Card hover>
    <img src="..." className="w-full h-48 object-cover rounded-t-xl" />
    <CardContent className="p-6">
      <Badge variant="gradient">Featured</Badge>
      <h3 className="text-2xl font-bold mt-2">Card Title</h3>
      <p className="text-vandyke/60 mt-2">Description here</p>
    </CardContent>
  </Card>
</GlowingCard>
```

### 3. Section Header
```tsx
import { GradientText, SectionBadge } from './components/ui/AnimatedElements'
import { Sparkles } from 'lucide-react'

<div className="text-center mb-16">
  <SectionBadge>
    <Sparkles className="w-4 h-4 inline mr-2" />
    Our Services
  </SectionBadge>
  <h2 className="text-5xl font-bold mt-4">
    <GradientText>What We Offer</GradientText>
  </h2>
  <p className="text-vandyke/60 mt-4 max-w-2xl mx-auto">
    Description text here
  </p>
</div>
```

### 4. Icon with Wrapper
```tsx
import { IconWrapper } from './components/ui/Icons'
import { Star, Award, Target } from 'lucide-react'

<IconWrapper 
  icon={<Star className="w-6 h-6" />} 
  variant="gradient" 
  size="lg"
/>

<IconWrapper 
  icon={<Award className="w-6 h-6" />} 
  variant="outline" 
  size="md"
/>
```

### 5. Badges
```tsx
import { Badge } from './components/ui/Badge'

<Badge variant="gradient">Featured</Badge>
<Badge variant="outline">New</Badge>
<Badge variant="secondary">Popular</Badge>
<Badge variant="default">Design</Badge>
```

### 6. Floating Background
```tsx
import { FloatingShape } from './components/ui/Icons'

<section className="relative overflow-hidden">
  <FloatingShape shape="circle" size={100} delay={0} className="top-20 left-10" />
  <FloatingShape shape="square" size={80} delay={1} className="bottom-40 right-20" />
  {/* Your content */}
</section>
```

## 🎨 Most Used Lucide Icons

```tsx
// Import any of these
import { 
  // Actions
  ArrowRight, ArrowLeft, Send, Download, Upload,
  Check, X, Plus, Edit, Trash, Save,
  
  // Social
  Mail, Phone, MessageCircle, 
  Instagram, Facebook, Twitter, Linkedin, Github,
  
  // Business
  Briefcase, Award, Target, TrendingUp, Users,
  Building, Rocket, Zap, BarChart,
  
  // Creative
  Palette, Pen, Image, Camera, Video,
  Sparkles, Star, Heart, Code, Layout,
  
  // UI
  Menu, X, Search, Settings, Info,
  ChevronRight, ChevronDown, Eye, Filter
} from 'lucide-react'

// Use like this
<Mail className="w-5 h-5" />
<Sparkles className="w-4 h-4 text-vandyke" />
```

## 🎯 Common Patterns

### Loading State
```tsx
<Button disabled={loading} variant="gradient">
  {loading ? (
    <>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
        <Sparkles className="w-5 h-5" />
      </motion.div>
      Processing...
    </>
  ) : (
    <>Submit</>
  )}
</Button>
```

### Hover Card Effect
```tsx
<GlowingCard>
  <Card hover className="group">
    <div className="relative overflow-hidden">
      <img src="..." className="transition-transform group-hover:scale-110" />
      <div className="absolute inset-0 bg-vandyke/0 group-hover:bg-vandyke/20 transition-colors" />
    </div>
    <CardContent>{/* content */}</CardContent>
  </Card>
</GlowingCard>
```

### Animated List
```tsx
<motion.div
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Responsive Button Sizes
```tsx
<Button 
  variant="gradient" 
  className="
    size-sm text-sm
    md:size-default
    lg:size-lg lg:text-base
  "
>
  Responsive Button
</Button>
```

## 📋 Component Props Reference

### Button
- `variant`: default | outline | ghost | link | gradient
- `size`: sm | default | lg | xl | icon
- `asChild`: boolean (use with Link component)

### Card
- `hover`: boolean (enables hover animation)

### Badge
- `variant`: default | secondary | outline | gradient

### IconWrapper
- `variant`: default | gradient | outline | ghost
- `size`: sm | md | lg | xl
- `animated`: boolean

### GlowingCard
- `glowColor`: vandyke | dun | walnut

### FloatingElement
- `delay`: number (in seconds)
- `duration`: number (animation duration)

### FloatingShape
- `shape`: circle | square | triangle
- `size`: number (in pixels)
- `delay`: number

## 🎨 Color Classes
```
bg-vandyke     text-vandyke     border-vandyke
bg-walnut      text-walnut      border-walnut
bg-dun         text-dun         border-dun
bg-magnolia    text-magnolia    border-magnolia

// With opacity
bg-vandyke/10  text-vandyke/60  border-vandyke/20
```

## ⚡ Pro Tips

1. **Always wrap buttons in motion.div for custom animations**
2. **Use GlowingCard for important cards** (featured items, CTAs)
3. **Limit to 2-3 FloatingShapes** per section
4. **Use viewport={{ once: true }}** to prevent re-animation
5. **Test mobile responsiveness** - all components adapt
6. **Combine variants** - outline + hover for subtle effects
7. **Add icons to buttons** for better visual hierarchy

## 📁 File Locations
```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── AnimatedElements.tsx
│       └── Icons.tsx
├── utils/
│   └── cn.ts
└── examples/
    ├── UIExamples.tsx
    └── EnhancedLatestProjects.tsx
```

## 🎉 Result
Your portfolio now has professional, consistent, and beautiful UI components ready to use!

**Check the example files for complete implementations!**
