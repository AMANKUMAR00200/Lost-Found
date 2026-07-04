# 🎒 Lost & Found Campus Portal

A full-stack Lost & Found web application built to help students report, search, and recover lost belongings within a college campus. The platform provides real-time messaging, image uploads, claim requests, and notifications to make the recovery process simple and efficient.

---

## 📌 About the Project

This project was developed as a practical full-stack application to solve a common problem faced by students—losing personal belongings on campus.

Instead of relying on WhatsApp groups or manual notices, users can report lost or found items, communicate directly with each other, and track claim requests through a single platform.

---

## ✨ Features

- 🔐 Secure User Authentication (JWT)
- 👤 User Registration & Login
- 📷 Upload Images using Cloudinary
- 📱 Camera & Gallery Image Support
- 🔴 Report Lost Items
- 🟢 Report Found Items
- 📍 Location & Date Tracking
- 💬 Real-Time Chat (Socket.IO)
- 💬 Typing Indicator
- 👀 Message Seen Status
- 📩 Chat List
- 🔔 Notification System
- 🤝 Claim Request System
- 🚫 Block / Unblock Users
- 🚩 Report Users
- 📝 Edit & Delete Own Reports
- 🔍 Search & Filter Items
- 📊 Dashboard Statistics
- 📱 Responsive Mobile-Friendly UI

---

# 🛠 Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Icons
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Socket.IO
- Multer
- Cloudinary
- bcryptjs

### Database

- PostgreSQL (Neon)

---

# 📂 Project Structure

```
Lost-Found-Portal/

│
├── frontend/
│ ├── src/
│ ├── components/
│ ├── pages/
│ ├── layouts/
│ ├── services/
│ └── context/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ ├── utils/
│ └── socket.js
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/AMANKUMAR00200/lost-found-campus.git
```

```
cd lost-found-campus
```

---

## Backend Setup

```
cd backend
npm install
```

Create a **.env**

```
PORT=8000

DATABASE_URL=YOUR_DATABASE_URL

JWT_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

Run Backend

```
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
```

Run Frontend

```
npm run dev
```

---

# 📷 Screens

- Login Page
- Register Page
- Home Dashboard
- Report Lost Item
- Report Found Item
- Latest Reports
- My Reports
- Chat
- Notifications
- Matches
- Item Details

---

# Future Improvements

- Google Login
- Microsoft Login
- Email Verification
- Forgot Password
- AI Image Matching
- AI Duplicate Detection
- QR Code Based Claim Verification
- Admin Dashboard
- Push Notifications
- Dark Mode

---

# Learning Outcomes

While building this project I gained practical experience in

- Full Stack Development
- REST APIs
- PostgreSQL
- Authentication using JWT
- Real-Time Communication with Socket.IO
- Image Upload using Cloudinary
- State Management in React
- Responsive UI Design
- Database Design
- API Integration

---

# Author

**Aman Kumar**

B.Tech CSE Student

Full Stack Developer

---

## ⭐ If you like this project, don't forget to give it a Star.
