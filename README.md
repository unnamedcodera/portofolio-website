# Darahitam Creative Lab - Portfolio Website# Clothing Portfolio Website with Admin Panel



A modern, full-stack portfolio website built with React, TypeScript, Node.js, and SQLite. Features admin dashboard, project management, inquiry system, and dynamic content management.A beautiful, artistic portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion, featuring a complete admin panel with SQLite database backend.



![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)## 🎨 Features

![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)

![React](https://img.shields.io/badge/react-19.0.0-blue.svg)### Frontend

- ✨ **Beautiful Artistic Design** with Framer Motion animations

## 🌟 Features- 🖼️ **Frame Slider** for banner content

- 👥 **Team Section** with modal popups

### Frontend- 🎨 **Latest Projects** showcase with masonry layout

- **Modern React 19** with TypeScript and Vite- 📱 **Fully Responsive** design

- **Framer Motion** animations throughout- 🎭 **Interactive Effects** and smooth transitions

- **Tailwind CSS** for responsive design

- **Canvas Editor** for project image editing### Backend & Admin Panel

- **Lazy Loading** and code splitting for performance- 🔐 **Secure Admin Authentication** with JWT

- **XSS Protection** with DOMPurify- 💾 **SQLite Database** for data persistence

- **CSRF Protection** on all forms- 🔑 **Password Hashing** with bcrypt

- 🎯 **RESTful API** for CRUD operations

### Backend- 📊 **Admin Dashboard** to manage:

- **RESTful API** with Express.js  - Team Members

- **SQLite Database** with better-sqlite3  - Projects/Portfolio

- **JWT Authentication** with automatic expiration  - Banner Slides

- **CSRF Token** validation

- **Rate Limiting** (100 requests/15min, 5 login attempts/15min)## 🚀 Quick Start

- **Input Validation** with express-validator

- **Security Headers** with Helmet### Prerequisites

- **SQL Injection Protection** via parameterized queries- Node.js (v18 or higher)

- npm or yarn

### Admin Dashboard

- **Project Management**: Create, edit, delete projects with canvas editor### Installation

- **Team Management**: Manage team members with social media links

- **Banner Slides**: Manage homepage carousel1. **Clone the repository** (if using git)

- **Categories**: Organize projects by category```bash

- **Inquiries**: View and manage project inquiriescd /Applications/MAMP/htdocs/clothing

- **Settings**: Configure site-wide settings (footer, contact info)```

- **Persistent Tab State**: Remembers last active section

2. **Install Frontend Dependencies**

### Security Features```bash

- ✅ JWT token expiration with auto-logoutcd frontend

- ✅ CSRF protection on all state-changing requestsnpm install

- ✅ XSS prevention with content sanitization```

- ✅ SQL injection protection with prepared statements

- ✅ Rate limiting on all endpoints3. **Install Backend Dependencies**

- ✅ Secure password hashing with bcrypt```bash

- ✅ Input validation and sanitizationcd ../backend

- ✅ Security headers (CSP, XSS, Frame Options)npm install

```

## 📋 Prerequisites

4. **Seed the Database**

- Node.js >= 18.0.0```bash

- npm >= 9.0.0npm run seed

- Modern web browser (Chrome, Firefox, Safari, Edge)```



## 🚀 Quick Start### Running the Application



### Option 1: Manual Setup#### 1. Start Backend Server (Terminal 1)

```bash

1. **Clone the repository**cd backend

```bashnode server.js

git clone <repository-url>```

cd clothingBackend will run on: `http://localhost:5001`

```

#### 2. Start Frontend Dev Server (Terminal 2)

2. **Install backend dependencies**```bash

```bashcd frontend

cd backendnpm run dev

npm install```

```Frontend will run on: `http://localhost:5173`



3. **Install frontend dependencies**## 🔐 Admin Access

```bash

cd ../frontend### Access Admin Panel

npm installNavigate to: `http://localhost:5173/admin`

```

### Default Login Credentials

4. **Configure environment**- **Username:** `admin`

- **Password:** `admin123`

Create `backend/.env`:

```env⚠️ **IMPORTANT:** Change these credentials in `/backend/.env` before deploying to production!

PORT=5001

JWT_SECRET=your-super-secret-jwt-key-change-in-production## 📁 Project Structure

CSRF_SECRET=your-csrf-secret-key-change-in-production

NODE_ENV=development```

```clothing/

├── frontend/                    # React + TypeScript frontend

5. **Start backend server**│   ├── src/

```bash│   │   ├── components/

cd backend│   │   │   ├── admin/          # Admin panel components

npm start│   │   │   │   ├── LoginPage.tsx

# Server runs on http://localhost:5001│   │   │   │   └── AdminDashboard.tsx

```│   │   │   ├── ArtisticFrameSlider.tsx

│   │   │   ├── BannerSection.tsx

6. **Start frontend dev server**│   │   │   ├── LatestProjects.tsx

```bash│   │   │   ├── TeamSection.tsx

cd frontend│   │   │   ├── MainContent.tsx

npm run dev│   │   │   └── ...

# Frontend runs on http://localhost:5173│   │   ├── services/

```│   │   │   └── api.ts          # API client

│   │   ├── data/               # Legacy JSON files (now using API)

7. **Access the application**│   │   └── App.tsx

- **Public Site**: http://localhost:5173│   ├── package.json

- **Admin Login**: http://localhost:5173/admin│   └── vite.config.ts

  - Default username: `admin`│

  - Default password: `admin123` (change in production!)└── backend/                     # Node.js + Express API

    ├── routes/

### Option 2: Docker Setup    │   ├── auth.js             # Authentication endpoints

    │   ├── team.js             # Team member endpoints

See [docker/README.md](./docker/README.md) for Docker deployment instructions.    │   ├── projects.js         # Project endpoints

    │   └── slides.js           # Banner slide endpoints

## 📁 Project Structure    ├── middleware/

    │   └── auth.js             # JWT authentication middleware

```    ├── database.js             # SQLite setup and queries

clothing/    ├── server.js               # Express server

├── backend/                 # Node.js backend API    ├── seed.js                 # Database seeding script

│   ├── config.js           # Configuration settings    ├── config.js               # Configuration

│   ├── database.js         # Database operations    ├── .env                    # Environment variables

│   ├── server.js           # Express server setup    ├── package.json

│   ├── middleware/         # Auth, CSRF, validation    └── README.md

│   │   ├── auth.js```

│   │   ├── csrf.js

│   │   └── validation.js## 🔧 Configuration

│   ├── routes/             # API routes

│   │   ├── auth.js### Backend (.env)

│   │   ├── team.js```env

│   │   ├── projects.jsPORT=5001

│   │   ├── slides.jsJWT_SECRET=your-super-secret-jwt-key-change-this-in-production

│   │   ├── categories.jsADMIN_USERNAME=admin

│   │   ├── inquiries.jsADMIN_PASSWORD=admin123

│   │   ├── settings.jsCORS_ORIGIN=http://localhost:5173

│   │   └── upload.js```

│   └── uploads/            # File uploads directory

├── frontend/               # React frontend### Frontend API Endpoint

│   ├── src/Edit `/frontend/src/services/api.ts` if backend URL changes:

│   │   ├── components/     # React components```typescript

│   │   │   ├── admin/      # Admin dashboard componentsconst API_BASE_URL = 'http://localhost:5001/api';

│   │   │   └── ...         # Public components```

│   │   ├── services/       # API client

│   │   ├── utils/          # Utility functions## 📡 API Endpoints

│   │   └── img/            # Static images

│   ├── public/             # Public assets### Authentication

│   └── vite.config.ts      # Vite configuration- `POST /api/auth/login` - Admin login

└── docker/                 # Docker setup (optional)- `GET /api/auth/verify` - Verify JWT token

```

### Team Members

## 🎨 Tech Stack- `GET /api/team` - Get all team members

- `GET /api/team/:id` - Get single member

### Frontend- `POST /api/team` - Create member (auth required)

- **Framework**: React 19 with TypeScript- `PUT /api/team/:id` - Update member (auth required)

- **Build Tool**: Vite 7- `DELETE /api/team/:id` - Delete member (auth required)

- **Styling**: Tailwind CSS 3.4

- **Animations**: Framer Motion 11### Projects

- **Canvas**: Fabric.js 6- `GET /api/projects` - Get all projects

- **Forms**: SweetAlert2- `GET /api/projects/:id` - Get single project

- **Security**: DOMPurify- `POST /api/projects` - Create project (auth required)

- **Routing**: React Router DOM 7- `PUT /api/projects/:id` - Update project (auth required)

- `DELETE /api/projects/:id` - Delete project (auth required)

### Backend

- **Runtime**: Node.js 18+### Banner Slides

- **Framework**: Express.js 4- `GET /api/slides` - Get all slides

- **Database**: SQLite 3 with better-sqlite3- `GET /api/slides/:id` - Get single slide

- **Authentication**: jsonwebtoken, bcrypt- `POST /api/slides` - Create slide (auth required)

- **Security**: helmet, express-rate-limit, express-validator, csrf- `PUT /api/slides/:id` - Update slide (auth required)

- **File Upload**: multer- `DELETE /api/slides/:id` - Delete slide (auth required)



## 🔧 Configuration## 🎨 Color Palette



### Backend Configuration (`backend/config.js`)The project uses a custom Tailwind color palette:

- **Vandyke:** `#6B4423` (dark brown)

```javascript- **Walnut:** `#8B6F47` (medium brown)

export default {- **Dun:** `#C9B898` (light beige)

  port: process.env.PORT || 5001,- **Battleship Gray:** `#858E96` (gray)

  jwtSecret: process.env.JWT_SECRET || 'change-in-production',- **Magnolia:** `#F4EDE4` (off-white)

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  nodeEnv: process.env.NODE_ENV || 'development'## 🛠️ Tech Stack

}

```### Frontend

- React 18+

### Frontend API Configuration (`frontend/src/services/api.ts`)- TypeScript

- Vite

```typescript- Tailwind CSS

const API_BASE_URL = 'http://localhost:5001/api';- Framer Motion

```- PostCSS



## 📚 API Documentation### Backend

- Node.js

See [API_TESTING.md](./API_TESTING.md) for complete API documentation with examples.- Express

- SQLite (better-sqlite3)

### Main Endpoints- JWT (jsonwebtoken)

- bcryptjs

**Authentication**- CORS

- `POST /api/auth/login` - Login

- `GET /api/auth/verify` - Verify token## 📝 Development Notes



**Public Endpoints**### Adding New Content via API

- `GET /api/team` - Get team members

- `GET /api/projects` - Get projects#### Using Postman or curl:

- `GET /api/slides` - Get banner slides

- `GET /api/categories` - Get categories**Create Team Member:**

- `GET /api/settings` - Get site settings```bash

- `POST /api/inquiries` - Submit inquirycurl -X POST http://localhost:5001/api/team \

  -H "Content-Type: application/json" \

**Protected Endpoints** (require JWT token)  -H "Authorization: Bearer YOUR_JWT_TOKEN" \

- Team CRUD operations  -d '{

- Project CRUD operations    "name": "New Member",

- Slide CRUD operations    "position": "Designer",

- Category CRUD operations    "bio": "Bio text...",

- Inquiry management    "icon": "🎨",

- Settings management    "skills": "Design, UI/UX",

    "email": "member@example.com",

## 🔐 Security Best Practices    "phone": "+1-234-567-8900",

    "image_url": "/path/to/image.jpg",

### For Production Deployment:    "display_order": 9

  }'

1. **Change default credentials**```

```bash

# Update in backend/database.js seedUsers()**Create Project:**

username: 'your-admin-username'```bash

password: 'strong-password-here'curl -X POST http://localhost:5001/api/projects \

```  -H "Content-Type: application/json" \

  -H "Authorization: Bearer YOUR_JWT_TOKEN" \

2. **Set strong secrets**  -d '{

```env    "title": "New Project",

JWT_SECRET=use-a-very-long-random-string-here-64-chars+    "description": "Project description...",

CSRF_SECRET=another-long-random-string-here-64-chars+    "category": "Web Design",

```    "image_url": "/path/to/image.jpg",

    "gradient": "from-blue-500/20 to-purple-500/20",

3. **Enable HTTPS** (required for production)    "display_order": 7,

    "is_featured": 1

4. **Configure CORS** properly  }'

```env```

CORS_ORIGIN=https://yourdomain.com

```**Create Banner Slide:**

```bash

5. **Set NODE_ENV** to productioncurl -X POST http://localhost:5001/api/slides \

```env  -H "Content-Type: application/json" \

NODE_ENV=production  -H "Authorization: Bearer YOUR_JWT_TOKEN" \

```  -d '{

    "title": "New Slide",

6. **Use environment variables** for all secrets    "subtitle": "Subtitle",

    "description": "Description...",

7. **Regular security updates**    "image_url": "/path/to/image.jpg",

```bash    "button_text": "Learn More",

npm audit fix    "button_link": "#",

```    "display_order": 6,

    "is_active": 1

## 🎯 Performance Optimizations  }'

```

- ✅ Code splitting with React.lazy()

- ✅ Route-based lazy loading### Database Location

- ✅ Image lazy loadingSQLite database is stored at: `/backend/database.sqlite`

- ✅ Component memoization (React.memo)

- ✅ useMemo and useCallback hooks### Resetting Database

- ✅ Vendor chunk splittingTo reset with fresh seed data:

- ✅ Gzip compression ready```bash

- ✅ Optimized bundle sizecd backend

rm database.sqlite

## 📱 Browser Supportnpm run seed

```

- Chrome/Edge (latest)

- Firefox (latest)## 🔒 Security Recommendations

- Safari (latest)

- Mobile browsers (iOS Safari, Chrome Mobile)1. **Change Admin Password:** Update `ADMIN_PASSWORD` in `.env`

2. **Use Strong JWT Secret:** Generate a random secret for `JWT_SECRET`

## 🧪 Development3. **Enable HTTPS:** Use SSL in production

4. **Add Rate Limiting:** Implement rate limiting on login endpoint

### Run in development mode5. **Input Validation:** Add validation middleware

6. **Environment Variables:** Never commit `.env` to version control

**Backend:**

```bash## 🚀 Deployment

cd backend

npm run dev  # with nodemon for auto-reload### Frontend (Vercel/Netlify)

```1. Build the frontend:

```bash

**Frontend:**cd frontend

```bashnpm run build

cd frontend```

npm run dev  # Vite dev server with HMR2. Deploy the `dist/` folder

```3. Update `API_BASE_URL` in `api.ts` to your backend URL



### Build for production### Backend (Heroku/Railway/DigitalOcean)

1. Set environment variables on your hosting platform

**Frontend:**2. Ensure SQLite database persists (use volume or switch to PostgreSQL/MySQL for production)

```bash3. Run `npm run seed` after first deployment

cd frontend4. Update CORS_ORIGIN to your frontend URL

npm run build

# Output in frontend/dist/## 🐛 Troubleshooting

```

**Backend won't start:**

### Preview production build- Check if port 5001 is available

- Try changing `PORT` in `.env`

```bash

cd frontend**CORS errors:**

npm run preview- Ensure `CORS_ORIGIN` in `.env` matches your frontend URL

```

**Authentication fails:**

## 🐛 Troubleshooting- Clear `localStorage` and try logging in again

- Check JWT_SECRET is consistent

### Port already in use

```bash**Database locked:**

# Kill process on port 5001- Close any open connections

lsof -ti:5001 | xargs kill -9- Restart backend server

```

## 📄 License

### Database locked

```bashISC

# Remove database lock file

rm backend/database.db-wal## 👨‍💻 Support

rm backend/database.db-shm

```For issues or questions:

1. Check backend logs in terminal

### CSRF token errors2. Check browser console for frontend errors

- Clear browser cookies3. Verify API endpoints are running: `http://localhost:5001/api/health`

- Restart both frontend and backend servers

---

### Module not found errors

```bash**Built with ❤️ using React, TypeScript, Express, and SQLite**

# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📖 Additional Documentation

- [API Testing Guide](./API_TESTING.md)
- [Project Summary](./PROJECT_SUMMARY.md)
- [Quick Start Guide](./QUICK_START.md)
- [Current Status](./STATUS.md)
- [Canvas Editor Guide](./frontend/CANVAS_EDITOR_GUIDE.md)
- [Component Structure](./frontend/COMPONENT_STRUCTURE.md)
- [Docker Setup](./docker/README.md)

## 🤝 Contributing

This is a private portfolio project. For suggestions or bug reports, please contact the development team.

## 📄 License

Copyright © 2025 Darahitam Creative Lab. All rights reserved.

## 🆘 Support

For technical support or inquiries:
- Email: [Contact through website form]
- Admin Dashboard: http://localhost:5173/admin

## 🎉 Acknowledgments

- React Team for React 19
- Vercel for Vite
- Framer for Framer Motion
- Tailwind Labs for Tailwind CSS
- All open-source contributors

---

**Built with ❤️ by Darahitam Creative Lab**
