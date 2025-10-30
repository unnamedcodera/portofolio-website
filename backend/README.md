# Clothing Portfolio Backend API

Backend API server for the clothing portfolio website with admin panel management.

## 🚀 Features

- **RESTful API** for managing:
  - Team Members
  - Projects/Portfolio
  - Banner Slides
- **SQLite Database** for data persistence
- **JWT Authentication** for admin access
- **Secure Password Hashing** with bcrypt
- **CORS Enabled** for frontend integration
- **Admin Panel Support** with protected routes

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (optional - defaults are set):
Edit `.env` file to change admin credentials:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

3. Seed the database with initial data:
```bash
npm run seed
```

## 🎯 Usage

### Start Development Server
```bash
npm run dev
```

### Start Production Server
```bash
npm start
```

Server will run on: `http://localhost:5000`

## 🔐 Admin Credentials

**Default Login:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT**: Change these credentials in `.env` file before deploying to production!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login (returns JWT token)
- `GET /api/auth/verify` - Verify JWT token

### Team Members
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single team member
- `POST /api/team` - Create team member (requires auth)
- `PUT /api/team/:id` - Update team member (requires auth)
- `DELETE /api/team/:id` - Delete team member (requires auth)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (requires auth)
- `PUT /api/projects/:id` - Update project (requires auth)
- `DELETE /api/projects/:id` - Delete project (requires auth)

### Banner Slides
- `GET /api/slides` - Get all active slides
- `GET /api/slides/:id` - Get single slide
- `POST /api/slides` - Create slide (requires auth)
- `PUT /api/slides/:id` - Update slide (requires auth)
- `DELETE /api/slides/:id` - Delete slide (requires auth)

## 🔑 Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

## 📁 Project Structure

```
backend/
├── server.js          # Express server setup
├── database.js        # SQLite database & queries
├── config.js          # Configuration settings
├── seed.js            # Database seeding script
├── .env               # Environment variables
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── team.js        # Team member routes
│   ├── projects.js    # Project routes
│   └── slides.js      # Banner slide routes
└── middleware/
    └── auth.js        # JWT authentication middleware
```

## 🔧 Configuration

Edit `.env` file to customize:

```env
PORT=5000                      # Server port
JWT_SECRET=your-secret-key     # JWT signing key
ADMIN_USERNAME=admin           # Admin username
ADMIN_PASSWORD=admin123        # Admin password
CORS_ORIGIN=http://localhost:5173  # Frontend URL
```

## 🛡️ Security Notes

1. **Change default admin password** in `.env` before production
2. **Use strong JWT_SECRET** (random string)
3. **Enable HTTPS** in production
4. **Implement rate limiting** for login endpoints
5. **Add input validation** for production use

## 🔄 Connecting to React Frontend

Update your React components to fetch from API:

```javascript
// Example: Fetch team members
const fetchTeam = async () => {
  const response = await fetch('http://localhost:5000/api/team');
  const data = await response.json();
  return data;
};
```

## 📊 Database Schema

### team_members
- id, name, position, bio, icon, skills, email, phone, image_url, display_order

### projects
- id, title, description, category, image_url, gradient, display_order, is_featured

### banner_slides
- id, title, subtitle, description, image_url, button_text, button_link, display_order, is_active

### admin_users
- id, username, password_hash, last_login

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file or kill process using port 5000
```

**Database locked error:**
```bash
# Close any open database connections and restart server
```

**CORS errors:**
```bash
# Make sure CORS_ORIGIN in .env matches your frontend URL
```

## 📄 License

ISC
