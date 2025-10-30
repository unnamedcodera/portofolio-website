# 🧪 API Testing Guide

Quick reference for testing the API endpoints.

## 🔐 Authentication

### 1. Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
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

**💡 Copy the token and use it in subsequent requests!**

---

## 👥 Team Members

### Get All Team Members
```bash
curl http://localhost:5001/api/team
```

### Get Single Team Member
```bash
curl http://localhost:5001/api/team/1
```

### Create Team Member (Auth Required)
```bash
curl -X POST http://localhost:5001/api/team \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Sarah Johnson",
    "position": "UX Designer",
    "bio": "Creating beautiful user experiences with passion and precision.",
    "icon": "🎨",
    "skills": "UI/UX, Figma, Adobe XD",
    "email": "sarah@example.com",
    "phone": "+1-234-567-8999",
    "image_url": "/images/team/sarah.jpg",
    "display_order": 9
  }'
```

### Update Team Member (Auth Required)
```bash
curl -X PUT http://localhost:5001/api/team/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Doe Updated",
    "position": "Senior Creative Director",
    "bio": "Updated bio...",
    "icon": "🎨",
    "skills": "Leadership, Strategy",
    "email": "john@example.com",
    "phone": "+1-234-567-8901",
    "image_url": "/images/team/john.jpg",
    "display_order": 1
  }'
```

### Delete Team Member (Auth Required)
```bash
curl -X DELETE http://localhost:5001/api/team/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 Projects

### Get All Projects
```bash
curl http://localhost:5001/api/projects
```

### Get Single Project
```bash
curl http://localhost:5001/api/projects/1
```

### Create Project (Auth Required)
```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Mobile App Design",
    "description": "A beautiful mobile application with intuitive user interface",
    "category": "App Design",
    "image_url": "/images/projects/mobile-app.jpg",
    "gradient": "from-purple-500/20 via-pink-500/20 to-blue-500/20",
    "display_order": 7,
    "is_featured": 1
  }'
```

### Update Project (Auth Required)
```bash
curl -X PUT http://localhost:5001/api/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Fashion Collection 2025",
    "description": "Updated description...",
    "category": "Fashion",
    "image_url": "/images/projects/fashion.jpg",
    "gradient": "from-rose-500/20 to-pink-500/20",
    "display_order": 1,
    "is_featured": 1
  }'
```

### Delete Project (Auth Required)
```bash
curl -X DELETE http://localhost:5001/api/projects/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🖼️ Banner Slides

### Get All Banner Slides
```bash
curl http://localhost:5001/api/slides
```

### Get Single Slide
```bash
curl http://localhost:5001/api/slides/1
```

### Create Banner Slide (Auth Required)
```bash
curl -X POST http://localhost:5001/api/slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "New Service Launch",
    "subtitle": "Introducing Our Latest Offering",
    "description": "Discover our new premium service designed for modern businesses",
    "image_url": "/images/slides/new-service.jpg",
    "button_text": "Learn More",
    "button_link": "/services",
    "display_order": 6,
    "is_active": 1
  }'
```

### Update Banner Slide (Auth Required)
```bash
curl -X PUT http://localhost:5001/api/slides/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Manufacturing Excellence Updated",
    "subtitle": "Quality in Every Detail",
    "description": "Premium quality production with attention to every detail",
    "image_url": "/images/slides/manufacturing.jpg",
    "button_text": "Explore",
    "button_link": "#",
    "display_order": 1,
    "is_active": 1
  }'
```

### Delete Banner Slide (Auth Required)
```bash
curl -X DELETE http://localhost:5001/api/slides/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Using Postman

### 1. Import Collection
Create a new Postman collection with these requests:

### 2. Set Environment Variables
- `base_url`: `http://localhost:5001/api`
- `token`: (will be set after login)

### 3. Login Request
- Method: POST
- URL: `{{base_url}}/auth/login`
- Body (JSON):
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- In Tests tab, add:
```javascript
pm.environment.set("token", pm.response.json().token);
```

### 4. Authorized Requests
- Add header:
  - Key: `Authorization`
  - Value: `Bearer {{token}}`

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "id": 1
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### Data Response
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "position": "Creative Director",
    ...
  }
]
```

---

## 🔍 Testing Checklist

- [ ] Can login with correct credentials
- [ ] Cannot login with wrong credentials
- [ ] Can fetch all team members without auth
- [ ] Can fetch all projects without auth
- [ ] Can fetch all slides without auth
- [ ] Cannot create/update/delete without auth
- [ ] Can create team member with auth
- [ ] Can update team member with auth
- [ ] Can delete team member with auth
- [ ] Same for projects and slides

---

## 💡 Tips

1. **Save your token:** After login, save the JWT token for subsequent requests
2. **Check response status:** 200 = success, 401 = unauthorized, 404 = not found, 500 = server error
3. **Verify in browser:** After API changes, refresh frontend to see updates
4. **Database changes:** Directly reflected in the frontend
5. **CORS:** If you get CORS errors, check backend/.env CORS_ORIGIN setting

---

## 🐛 Common Issues

**401 Unauthorized:**
- Token expired (login again)
- Token missing or malformed
- Wrong Authorization header format

**404 Not Found:**
- Resource doesn't exist
- Wrong ID
- Wrong endpoint URL

**500 Internal Server Error:**
- Check backend terminal for error details
- Database connection issues
- Invalid data format

---

## 📝 Notes

- All endpoints return JSON
- Timestamps are in UTC
- IDs are auto-incremented integers
- display_order determines sort order (lower = first)
- is_active (for slides) and is_featured (for projects) are boolean (0 or 1)

---

Happy Testing! 🚀
