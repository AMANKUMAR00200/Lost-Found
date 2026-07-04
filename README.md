# 🎒 Lost & Found Campus Portal

A full-stack Lost & Found web application built to help students report, search, and recover lost belongings within a college campus. The platform provides secure authentication, image uploads, real-time chat, claim requests, notifications, and an intuitive dashboard to make the recovery process simple and efficient.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Live-success)

---

# 🌐 Live Demo

### 🚀 Frontend
https://lost-found-mu.vercel.app

### ⚙ Backend API
https://lost-found-8djh.onrender.com

### 📂 GitHub Repository
https://github.com/AMANKUMAR00200/Lost-Found

---

# 📌 About the Project

Lost & Found Campus Portal is a modern web application that helps students report, search, and recover lost belongings within a college campus.

Instead of relying on WhatsApp groups, posters, or manual announcements, students can upload lost or found items, communicate securely with each other, submit claim requests, and receive real-time notifications from one centralized platform.

---

# ✨ Features

## 🔐 Authentication

- Secure JWT Authentication
- User Registration & Login
- Protected Routes
- User Profile Management

## 🎒 Item Management

- Report Lost Items
- Report Found Items
- Upload Multiple Images
- Camera & Gallery Support
- Edit Item Details
- Delete Own Reports
- Search Items
- Filter by Category
- Filter by Status
- Location Tracking
- Date Tracking

## 💬 Real-Time Communication

- Real-Time Chat
- Typing Indicator
- Seen Status
- Chat List
- Socket.IO Integration

## 🤝 Claim System

- Send Claim Requests
- Accept / Reject Claims
- Track Claim Status

## 🔔 Notifications

- Instant Notifications
- Claim Notifications
- Message Notifications

## 👥 User Safety

- Block Users
- Unblock Users
- Report Users

## 📊 Dashboard

- Total Lost Items
- Total Found Items
- My Reports
- Match Statistics

## 📱 UI

- Fully Responsive
- Mobile Friendly
- Modern Design
- Clean User Experience

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Socket.IO Client
- Lucide React
- React Icons
- React Hot Toast

## Backend

- Node.js
- Express.js
- JWT Authentication
- PostgreSQL
- Socket.IO
- Multer
- Cloudinary
- bcryptjs

## Database

- PostgreSQL (Neon)

## Deployment

- Vercel (Frontend)
- Render (Backend)
- Neon PostgreSQL
- Cloudinary

---

# 📂 Project Structure

```
Lost-Found/

├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── socket.js
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/AMANKUMAR00200/Lost-Found.git
```

```bash
cd Lost-Found
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a **.env** file:

```env
PORT=8000

DATABASE_URL=YOUR_DATABASE_URL

JWT_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a **.env**

```env
VITE_API_URL=http://localhost:8000
```

Run Frontend

```bash
npm run dev
```

---

# 📸 Screenshots

- Login Page
- Register Page
- Dashboard
- Report Lost Item
- Report Found Item
- Latest Items
- My Items
- Chat
- Notifications
- Claim Requests
- Matches
- Item Details

> Screenshots will be added soon.

---

# 🔮 Future Improvements

- Google Authentication
- Microsoft Authentication
- Email Verification
- Forgot Password
- AI Image Matching
- AI Duplicate Detection
- QR Code Claim Verification
- Admin Dashboard
- Push Notifications
- Dark Mode
- Progressive Web App (PWA)

---

# 📚 Learning Outcomes

Through this project I gained practical experience in:

- Full Stack Development
- REST API Development
- PostgreSQL Database Design
- JWT Authentication
- Socket.IO Real-Time Communication
- Cloudinary Image Upload
- State Management in React
- Responsive UI Design
- API Integration
- Deployment using Vercel & Render

---

# 👨‍💻 Author

## Aman Kumar

**B.Tech Computer Science & Engineering Student**

**Full Stack Developer**

### Connect with me

- GitHub: https://github.com/AMANKUMAR00200

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.
