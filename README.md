# 🎥 Vynce – YouTube Clone (Next.js 15 + Firebase + MongoDB)

Vynce is a **full-stack YouTube clone** built using **Next.js 15 (Page Router)**, **React 19**, **TypeScript**, and **MongoDB**.  
It supports **video uploads**, **playback**, **authentication**, **subscriptions**, and **real-time interactions** with a modern, responsive UI.

---

## 🚀 Features

✅ **Authentication & JWT** – Secure Firebase Auth + JSON Web Tokens  
📹 **Video Upload & Streaming** – Handled via vercel blob  
💬 **Comments & Reactions** – Real-time comment system using MongoDB  
🎬 **Custom Video Player** – Responsive player with progress tracking  
📺 **Channel System** – Subscribe/unsubscribe, view channel videos  
🕒 **Watch Later & History** – Manage viewing preferences and activity  
🔍 **Search & Pagination** – Find videos easily with server-side filtering  
🎨 **Modern UI** – TailwindCSS v4 + Radix UI + Lucide Icons  
🌙 **Dark/Light Themes** – Managed using `next-themes`  
⚙️ **Full REST API** – Modular, structured API endpoints  

---

## 🧩 API Endpoints Overview

| Method | Endpoint | Description |
|--------|-----------|--------------|
| **GET** | `/api/channel/:id` | Get channel by ID |
| **POST** | `/api/channel` | Create a new channel |
| **PUT** | `/api/channel` | Toggle subscribe/unsubscribe |
| **GET** | `/api/channel/subscriptions` | Get subscribed channels |
| **GET** | `/api/comment?id=` | Get comments for a video |
| **POST** | `/api/comment` | Add a new comment |
| **PUT** | `/api/comment` | Edit comment |
| **DELETE** | `/api/comment` | Delete comment |
| **GET** | `/api/video/stream/:id` | Stream video |
| **GET** | `/api/video?page=1&limit=8&search=` | Get paginated videos |
| **POST** | `/api/video` | Upload new video |
| **GET/PUT** | `/api/video/react` | Get or react to videos |
| **GET/PUT** | `/api/watch` | Watch later management |
| **POST** | `/api/auth` | Authenticate user |
| **GET/POST/PATCH/DELETE** | `/api/history` | Manage history (CRUD) |

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | Next.js 15 (Page Router), React 19, TypeScript |
| **Backend** | Next.js API Routes, Firebase, MongoDB (Mongoose) |
| **Styling** | TailwindCSS v4, Radix UI, Lucide React Icons |
| **Auth** | Firebase Auth + JWT |
| **Uploads** | Vercel Blob |
| **Utilities** | Axios, clsx, class-variance-authority |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # Global app state (Auth, Video, Comments)
├── controllers/      # API logic (Channel, Comment, Video, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Firebase, JWT, Axios, utils
├── middleware/       # Authentication & DB connections
├── models/           # MongoDB (Mongoose) schemas
├── pages/            # Next.js Page Router + API routes
├── services/         # Axios service wrappers
└── types/            # TypeScript definitions
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/grep-many/vynce.git
cd vynce
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up `.env.local`
```env
MONGO_URI=mongodb://localhost:27017/vynce
BASE_URL=http://localhost:3000/api
ACCESS_TOKEN_SECRET=your_jwt_secret
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4️⃣ Run the development server
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000)

---

## 🧠 Key Highlights

- **Server-side rendering (SSR)** for better SEO & performance  
- **Scalable modular structure** for maintainability  
- **Context-based global state management**  
- **Responsive & accessible UI** following modern design standards  

---

## 🌍 Deployment (Vercel)

1. Push code to GitHub  
2. Connect the repo to [Vercel](https://vercel.com)  
3. Set environment variables  
4. Click **Deploy** 🚀  

**Live Demo:** [here](https://vynce-brown.vercel.app)

---

## 💡 Inspiration

Built with ❤️ to explore **video platforms, scalable APIs**, and **modern full-stack development** with **Next.js** and **Firebase**.
