# 🚀 QUICK START GUIDE

## Step-by-Step Setup (5 minutes)

### 1. Start Backend Server
Open Terminal 1:
```bash
cd /Applications/MAMP/htdocs/clothing/backend
node server.js
```
✅ You should see:
```
🚀 Server is running!
📡 Port: 5001
🌍 Environment: development
🔗 API: http://localhost:5001/api
```

### 2. Start Frontend Server
Open Terminal 2:
```bash
cd /Applications/MAMP/htdocs/clothing/frontend
npm run dev
```
✅ You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 3. Access the Website
Open browser: **http://localhost:5173**

### 4. Access Admin Panel
Open browser: **http://localhost:5173/admin**

Login with:
- Username: `admin`
- Password: `admin123`

---

## 📝 What You Can Do Now

### Public Website (http://localhost:5173)
- ✅ View banner frame slider (fetched from API)
- ✅ See latest projects (fetched from API)
- ✅ Browse team members (fetched from API)
- ✅ All data is now dynamic from SQLite database!

### Admin Panel (http://localhost:5173/admin)
- ✅ Login with credentials
- ✅ View all team members
- ✅ View all projects
- ✅ View all banner slides
- ✅ Delete items (with confirmation)

---

## 🎯 Common Tasks

### Add New Team Member
Use Postman or curl:
```bash
# First, login to get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Copy the token from response, then:
curl -X POST http://localhost:5001/api/team \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "New Member",
    "position": "Designer",
    "bio": "Amazing designer",
    "icon": "🎨",
    "display_order": 9
  }'
```

### Add New Project
```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Amazing Project",
    "description": "Project description",
    "category": "Web Design",
    "image_url": "/images/project.jpg",
    "gradient": "from-blue-500/20 to-purple-500/20",
    "display_order": 7
  }'
```

### Reset Database
```bash
cd backend
rm database.sqlite
npm run seed
node server.js
```

---

## 🔧 Troubleshooting

### Backend won't start - "Port 5001 in use"
```bash
# Change port in backend/.env
PORT=5002

# Or kill the process using port 5001
lsof -ti:5001 | xargs kill -9
```

### Frontend shows "Loading..." forever
1. Check backend is running (http://localhost:5001/api/health)
2. Check browser console for CORS errors
3. Verify API_BASE_URL in `frontend/src/services/api.ts`

### Admin login fails
1. Clear browser localStorage
2. Check backend terminal for errors
3. Try resetting database

### CORS errors in console
Update `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173
```
Restart backend server.

---

## 📊 Database Schema

### team_members
- id, name, position, bio, icon, skills, email, phone, image_url, display_order

### projects
- id, title, description, category, image_url, gradient, display_order, is_featured

### banner_slides
- id, title, subtitle, description, image_url, button_text, button_link, display_order, is_active

### admin_users
- id, username, password_hash, last_login

---

## 🎨 Current Setup

✅ Backend API running on port 5001
✅ Frontend running on port 5173
✅ SQLite database with seeded data
✅ JWT authentication working
✅ Admin panel accessible
✅ All components fetching from API

---

## 📁 Important Files

### Configuration
- `backend/.env` - Backend config & credentials
- `backend/database.sqlite` - SQLite database file

### API Client
- `frontend/src/services/api.ts` - All API calls

### Admin Components
- `frontend/src/components/admin/LoginPage.tsx`
- `frontend/src/components/admin/AdminDashboard.tsx`

### Data Components (now use API)
- `frontend/src/components/TeamSection.tsx`
- `frontend/src/components/LatestProjects.tsx`
- `frontend/src/components/ArtisticFrameSlider.tsx`

---

## 🔐 Security Checklist for Production

- [ ] Change admin password in `.env`
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Use production database (PostgreSQL/MySQL)
- [ ] Set NODE_ENV=production
- [ ] Add logging and monitoring

---

## 🎉 You're All Set!

Your portfolio website with admin panel is ready to use!

**Public Site:** http://localhost:5173
**Admin Panel:** http://localhost:5173/admin

Happy coding! 🚀
