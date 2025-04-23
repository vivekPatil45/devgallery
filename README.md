
# 🚀 DevGallery

**DevGallery** is a full-stack web platform where developers can showcase their projects, explore others' work, interact via likes and comments, and build their public profile — all in a beautifully designed UI.

---

## 📸 Features

- 🧑‍💻 Public User Profiles with bio, profile image, social links & projects
- 🛠️ Create, edit, view & delete projects with:
  - Title, description (rich text)
  - Tech stack (tags)
  - GitHub and Live URLs
  - Project image (Cloudinary upload)
- 💖 Like/Unlike projects
- 💬 Comment on projects
- 🔍 Search & filter projects by:
  - Title
  - Description
  - Tech Stack
- 📄 Paginated project list views
- 🔐 User authentication with JWT
- 📩 Email verification via OTP during signup
- ✍️ Rich Text Editor (Draft.js) for project descriptions

---

## 🧑‍💻 Tech Stack

### Frontend
- **Next.js 14 (App Router)**
- **React & TypeScript**
- **Tailwind CSS** + **DaisyUI**
- **Draft.js** (rich text editor)
- **React Icons** & **React Hot Toast**
- **Cloudinary** (for image hosting)

### Backend
- **Next.js API Routes**
- **MongoDB + Mongoose**
- **bcryptjs** for password hashing
- **jsonwebtoken** for auth
- **Cloudinary SDK** for image upload
- **Nodemailer** (for email OTPs)



## 📁 Folder Structure


```
├───app
│   ├───(Home)                  # Public pages
│   │   ├───about
│   │   ├───features
│   │   ├───login
│   │   ├───signup
│   │   └───[...not_found]     # Catch-all for 404
│   ├───api                    # API routes
│   │   ├───auth               # Auth logic (JWT, login/signup)
│   │   │   ├───login
│   │   │   ├───logout
│   │   │   ├───signup
│   │   │   └───verifytoken
│   │   ├───helper             # Helper APIs (upload, verify)
│   │   │   ├───upload-img
│   │   │   └───verify-email
│   │   ├───projects           # Project CRUD + interactions
│   │   │   ├───comments
│   │   │   ├───create-project
│   │   │   ├───likes
│   │   │   ├───my-projects
│   │   │   └───[id]
│   │   └───user               # User-related endpoints
│   │       ├───stats
│   │       ├───update
│   │       └───[userId]
│   └───user                   # Protected pages
│       ├───create-project     # Create project page
│       ├───dashboard          # User dashboard
│       ├───favorites          # Favorite projects page
│       ├───my-projects        # User's own project list
│       ├───profile
│       │   └───[name]         # Public user profile
│       ├───projects
│       │   ├───edit           # Edit project
│       │   ├───[id]           # View project by ID
│       │   └───[title]        # View project by title
│       └───[...not_found]     # Catch-all for 404

```

## 🧭 Page Routing (Next.js App Router)

```
/                           → Landing Page (Home)
/about                     → About DevGallery
/features                  → App Features Overview
/login                     → User Login
/signup                    → User Signup
/404                       → Not Found Page

/user/dashboard            → Authenticated User Dashboard
/user/profile              → Logged-in User's Profile
/user/profile/[username]   → Public User Profile (with ?id=[userId])
/user/favorites            → Liked Projects
/user/my-projects          → Projects Created by the Logged-in User
/user/create-project       → Create New Project
/user/projects/edit        → Edit a Project
/user/projects/[id]        → View a Project by ID
/user/projects/[title]     → View a Project by Title

/api/auth/login            → Login API
/api/auth/logout           → Logout API
/api/auth/signup           → Signup API
/api/auth/verifytoken      → Token Verification API

/api/helper/upload-img     → Image Upload to Cloudinary
/api/helper/verify-email   → Email OTP Verification

/api/projects/create-project  → Create Project
/api/projects/comments        → Add/Get Comments
/api/projects/likes           → Like/Unlike Projects
/api/projects/my-projects     → Get Projects by Logged-in User
/api/projects/[id]            → Get/Edit/Delete Single Project

/api/user/update           → Update User Info
/api/user/stats            → Get User Statistics
/api/user/[userId]         → Get Public User Info by ID
```



## 🔌 API Endpoints

### Auth Routes

- `POST /api/auth/signup` – Register new user
- `POST /api/auth/login` – Login and receive token
- `POST /api/auth/verify-otp` – Verify email OTP

### Project Routes

- `POST /api/projects` – Create new project
- `GET /api/projects/:id` – Get single project
- `GET /api/projects` – Get all projects with filters
- `PUT /api/projects/:id` – Update project
- `DELETE /api/projects/:id` – Delete project

### Likes & Comments

- `POST /api/projects/likes` – Toggle like/unlike
- `POST /api/projects/comments` – Add comment

### Misc

- `POST /api/helper/upload-img` – Upload image to Cloudinary



## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/devgallery.git
cd devgallery
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Add Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 4. Run the dev server

```bash
npm run dev
# or
yarn dev
```

---

## 🧪 Future Improvements

- 🔒 Role-based access control
- 📊 Analytics for project views/likes
- 📁 Project categories
- 🧵 Threads or threaded comments
- 🧠 AI-powered project suggestion & review

---

## 📌 License

This project is open-source and free to use under the MIT License.

---

## 💖 Contributing

Found a bug or want to improve something? Feel free to [open an issue](https://github.com/your-username/devgallery/issues) or submit a PR!

---

Made with 💻 by Vivek Patil
```
