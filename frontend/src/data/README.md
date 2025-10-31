# Data Configuration Files

This folder contains JSON files for easy content management.

## team.json

Configure your team members here. Each team member should have:

```json
{
  "id": 1,                              // Unique ID
  "name": "John Doe",                   // Team member name
  "position": "Creative Director",      // Job title/position
  "image": "/src/img/team/team1.jpg",  // Path to team member image
  "bio": "Brief bio description...",    // Short biography
  "icon": "🎨"                          // Emoji icon (used if no image)
}
```

### How to add a new team member:

1. Add team member images to `/public/images/team/` or `/src/img/team/`
2. Add a new object to the array in `team.json`
3. Make sure the `id` is unique
4. Update the `image` path to point to your image file

**Note:** If you don't have images yet, the component will display the emoji icon instead.

---

## slides.json

Configure the frame slider content here. Each slide should have:

```json
{
  "id": 1,                                          // Unique ID
  "title": "Manufacturing Excellence",              // Slide title
  "description": "Premium quality production...",   // Slide description
  "image": "/src/img/slides/manufacturing.jpg",    // Path to slide image
  "gradient": "from-vandyke/20 via-walnut/10 to-transparent"  // Background gradient
}
```

### How to add a new slide:

1. Add slide images to `/public/images/slides/` or `/src/img/slides/`
2. Add a new object to the array in `slides.json`
3. Make sure the `id` is unique
4. Update the `image` path to point to your image file
5. Choose a gradient from the available colors:
   - `vandyke` - Dark brown (#6B4423)
   - `walnut` - Medium brown (#8B6F47)
   - `dun` - Light beige (#C9B898)
   - `battleshipgray` - Gray
   - `magnolia` - Off-white (#F4EDE4)

### Available gradient patterns:

- `from-vandyke/20 via-walnut/10 to-transparent`
- `from-walnut/20 via-dun/10 to-transparent`
- `from-dun/20 via-battleshipgray/10 to-transparent`
- `from-battleshipgray/20 via-vandyke/10 to-transparent`

**Note:** The slider will automatically cycle through all slides in the array.

---

## Adding Images

### For Team Members:
Create folder: `/src/img/team/` or `/public/images/team/`
Add images: `team1.jpg`, `team2.jpg`, etc.

### For Slides:
Create folder: `/src/img/slides/` or `/public/images/slides/`
Add images: `manufacturing.jpg`, `branding.jpg`, etc.

**Recommended image sizes:**
- Team photos: 400x400px (square)
- Slide images: 1200x800px (landscape)

---

## Example: Complete Setup

### 1. Team Member with Image
```json
{
  "id": 4,
  "name": "Sarah Williams",
  "position": "UI/UX Designer",
  "image": "/src/img/team/sarah.jpg",
  "bio": "Creating beautiful user experiences with passion and precision.",
  "icon": "✨"
}
```

### 2. Slide with Image
```json
{
  "id": 6,
  "title": "E-Commerce Solutions",
  "description": "Complete online store platforms",
  "image": "/src/img/slides/ecommerce.jpg",
  "gradient": "from-walnut/20 via-dun/10 to-transparent"
}
```

---

After editing these JSON files, the changes will automatically appear on your website after the page refreshes!
