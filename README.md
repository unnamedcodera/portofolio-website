# Clothing Portfolio Website with Admin Panel

A beautiful, artistic portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion, featuring a complete admin panel with SQLite database backend.

## 🎨 Features

### Frontend
- ✨ **Beautiful Artistic Design** with Framer Motion animations
- 🖼️ **Frame Slider** for banner content
- 👥 **Team Section** with modal popups
- 🎨 **Latest Projects** showcase with masonry layout
- 📱 **Fully Responsive** design
- 🎭 **Interactive Effects** and smooth transitions

### Backend & Admin Panel
- 🔐 **Secure Admin Authentication** with JWT
- 💾 **SQLite Database** for data persistence
- 🔑 **Password Hashing** with bcrypt
- 🎯 **RESTful API** for CRUD operations
- 📊 **Admin Dashboard** to manage:
  - Team Members
  - Projects/Portfolio
  - Banner Slides

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if using git)
```bash
cd /Applications/MAMP/htdocs/clothing
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Seed the Database**
```bash
npm run seed
```

### Running the Application

#### 1. Start Backend Server (Terminal 1)
```bash
cd backend
node server.js
```
Backend will run on: `http://localhost:5001`

#### 2. Start Frontend Dev Server (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

## 🔐 Admin Access

### Access Admin Panel
Navigate to: `http://localhost:5173/admin`

### Default Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials in `/backend/.env` before deploying to production!

## 📁 Project Structure

```
clothing/
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin panel components
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── AdminDashboard.tsx
│   │   │   ├── ArtisticFrameSlider.tsx
│   │   │   ├── BannerSection.tsx
│   │   │   ├── LatestProjects.tsx
│   │   │   ├── TeamSection.tsx
│   │   │   ├── MainContent.tsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.ts          # API client
│   │   ├── data/               # Legacy JSON files (now using API)
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                     # Node.js + Express API
    ├── routes/
    │   ├── auth.js             # Authentication endpoints
    │   ├── team.js             # Team member endpoints
    │   ├── projects.js         # Project endpoints
    │   └── slides.js           # Banner slide endpoints
    ├── middleware/
    │   └── auth.js             # JWT authentication middleware
    ├── database.js             # SQLite setup and queries
    ├── server.js               # Express server
    ├── seed.js                 # Database seeding script
    ├── config.js               # Configuration
    ├── .env                    # Environment variables
    ├── package.json
    └── README.md
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:5173
```

### Frontend API Endpoint
Edit `/frontend/src/services/api.ts` if backend URL changes:
```typescript
const API_BASE_URL = 'http://localhost:5001/api';
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Team Members
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single member
- `POST /api/team` - Create member (auth required)
- `PUT /api/team/:id` - Update member (auth required)
- `DELETE /api/team/:id` - Delete member (auth required)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Banner Slides
- `GET /api/slides` - Get all slides
- `GET /api/slides/:id` - Get single slide
- `POST /api/slides` - Create slide (auth required)
- `PUT /api/slides/:id` - Update slide (auth required)
- `DELETE /api/slides/:id` - Delete slide (auth required)

## 🎨 Color Palette

The project uses a custom Tailwind color palette:
- **Vandyke:** `#6B4423` (dark brown)
- **Walnut:** `#8B6F47` (medium brown)
- **Dun:** `#C9B898` (light beige)
- **Battleship Gray:** `#858E96` (gray)
- **Magnolia:** `#F4EDE4` (off-white)

## 🛠️ Tech Stack

### Frontend
- React 18+
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- PostCSS

### Backend
- Node.js
- Express
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## 📝 Development Notes

### Adding New Content via API

#### Using Postman or curl:

**Create Team Member:**
```bash
curl -X POST http://localhost:5001/api/team \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Member",
    "position": "Designer",
    "bio": "Bio text...",
    "icon": "🎨",
    "skills": "Design, UI/UX",
    "email": "member@example.com",
    "phone": "+1-234-567-8900",
    "image_url": "/path/to/image.jpg",
    "display_order": 9
  }'
```

**Create Project:**
```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Project",
    "description": "Project description...",
    "category": "Web Design",
    "image_url": "/path/to/image.jpg",
    "gradient": "from-blue-500/20 to-purple-500/20",
    "display_order": 7,
    "is_featured": 1
  }'
```

**Create Banner Slide:**
```bash
curl -X POST http://localhost:5001/api/slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Slide",
    "subtitle": "Subtitle",
    "description": "Description...",
    "image_url": "/path/to/image.jpg",
    "button_text": "Learn More",
    "button_link": "#",
    "display_order": 6,
    "is_active": 1
  }'
```

### Database Location
SQLite database is stored at: `/backend/database.sqlite`

### Resetting Database
To reset with fresh seed data:
```bash
cd backend
rm database.sqlite
npm run seed
```

## 🔒 Security Recommendations

1. **Change Admin Password:** Update `ADMIN_PASSWORD` in `.env`
2. **Use Strong JWT Secret:** Generate a random secret for `JWT_SECRET`
3. **Enable HTTPS:** Use SSL in production
4. **Add Rate Limiting:** Implement rate limiting on login endpoint
5. **Input Validation:** Add validation middleware
6. **Environment Variables:** Never commit `.env` to version control

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
```bash
cd frontend
npm run build
```
2. Deploy the `dist/` folder
3. Update `API_BASE_URL` in `api.ts` to your backend URL

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables on your hosting platform
2. Ensure SQLite database persists (use volume or switch to PostgreSQL/MySQL for production)
3. Run `npm run seed` after first deployment
4. Update CORS_ORIGIN to your frontend URL

## 🐛 Troubleshooting

**Backend won't start:**
- Check if port 5001 is available
- Try changing `PORT` in `.env`

**CORS errors:**
- Ensure `CORS_ORIGIN` in `.env` matches your frontend URL

**Authentication fails:**
- Clear `localStorage` and try logging in again
- Check JWT_SECRET is consistent

**Database locked:**
- Close any open connections
- Restart backend server

## 📄 License

ISC

## 👨‍💻 Support

For issues or questions:
1. Check backend logs in terminal
2. Check browser console for frontend errors
3. Verify API endpoints are running: `http://localhost:5001/api/health`

---

**Built with ❤️ using React, TypeScript, Express, and SQLite**
