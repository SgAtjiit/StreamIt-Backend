# 🎬 StreamIt - Video Sharing Platform Backend API

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.0-blue?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-green?logo=mongodb)](https://www.mongodb.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-brightgreen?logo=swagger)](http://localhost:8000/api-docs)
[![Postman](https://img.shields.io/badge/Postman-v2.1.0-orange?logo=postman)](https://www.postman.com/)

A production-ready, feature-rich video sharing and community platform backend API built with **Node.js**, **Express v5**, **MongoDB (Mongoose)**, **JWT Authentication**, and **Cloudinary/Local Media Storage**. Designed to replicate core YouTube channel and video management infrastructure with enterprise-level security, high-performance MongoDB aggregation pipelines, and comprehensive documentation.

---

## 🌟 Key Features

- 🔐 **Authentication & Authorization**: Secure JWT Access & Refresh Token architecture with HTTP-only cookies, bcrypt password hashing, and token rotation.
- 📹 **Video Management**: Multi-format video uploading, cover thumbnail generation, duration calculation, published/private toggles, view tracking, and pipeline pagination.
- 👥 **User Channel & Profiles**: Custom channel profiles with avatar/cover image management, subscriber metrics, and watch history tracking.
- 🔔 **Subscription System**: One-click channel subscriptions/unsubscriptions and subscriber list retrieval with dynamic aggregation counts.
- 📂 **Playlist Management**: Create, update, and manage public/private video playlists with custom order and metadata.
- 💬 **Comments & Community**: Threaded video comments with update/delete controls and user author references.
- 🐦 **Tweets (Community Posts)**: Create, update, and share short community announcements on channel feeds.
- ❤️ **Polymorphic Likes System**: Like/unlike videos, comments, and community tweets.
- 📊 **Dashboard & Analytics**: Total channel view counts, subscriber growth metrics, video upload counts, and total channel likes.
- 📖 **Interactive OpenAPI/Swagger UI**: Native Swagger API documentation built in at `/api-docs` with persistent JWT authorization.
- 🧪 **Automated Postman Collection**: Importable Postman collection with dynamic test scripts that auto-capture `accessToken`, `userId`, `videoId`, `playlistId`, etc.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or Cloud MongoDB Atlas URI

### 1. Clone & Install
```bash
git clone https://github.com/your-username/StreamIt-Backend.git
cd StreamIt-Backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```
Fill in your configuration variables in `.env`:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.lhxfdrg.mongodb.net/streamIt
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Seed Database with Dummy Data & Sample Media

The database seeder generates **151 realistic users**, **450+ subscriptions**, **tweets**, **comments**, **likes**, **playlists**, and sample **videos** complete with thumbnails.

#### 📁 How to Populate Sample Videos & Thumbnail Images Locally:
1. **Sample Videos**: Add your `.mp4` video files to the `public/videos/` folder.
2. **Sample Thumbnails**: Add your thumbnail images (`.png`, `.jpg`, `.jpeg`, `.webp`) to the `public/thumbnail/` folder.
3. **Run Seeder**:
   ```bash
   npm run seed
   ```

> 💡 **Automatic Remote Fallback**: If `public/videos/` or `public/thumbnail/` are empty, the seed script automatically falls back to online sample videos (Google Cloud sample MP4s) and dynamic placeholder images (DiceBear avatars, Picsum covers & video thumbnails), so Cloudinary credentials and local files are completely optional!

> 🔑 **Primary Seed Test User Credentials:**
> - **Username**: `johndoe`
> - **Email**: `johndoe@example.com`
> - **Password**: `Password@123`
> - **Subscribers**: 135 subscribers pre-subscribed

### 4. Run Development Server
```bash
npm run dev
```
The server starts at `http://localhost:8000` with hot-reloading via Nodemon.

---

## 📚 Interactive Swagger API Documentation

StreamIt Backend includes live, interactive OpenAPI 3.0 documentation powered by Swagger UI.

- **Access URL**: `http://localhost:8000/api-docs`
- **Features**:
  - Test all 37+ API endpoints directly in your browser.
  - **Persistent Authorization**: Click **Authorize** at the top, enter `Bearer <your_access_token>`, and all subsequent requests automatically include your JWT token.
  - Pre-filled sample MongoDB ObjectIDs for immediate testing.

---

## 📬 Postman Collection & Auto-Token Capture

An importable Postman collection is included in the project directory:
📍 `postman/streamItPostmanCollection.json`

### Key Highlights & Features:
1. **Zero Hardcoded Secrets**: Uses Postman collection variables (`{{username}}`, `{{email}}`, `{{password}}`, `{{newPassword}}`) so no sensitive credentials are hardcoded.
2. **Auto-Capturing Test Scripts**:
   - Logging in via `POST /users/login` automatically extracts and updates `{{accessToken}}`, `{{refreshToken}}`, and `{{userId}}`.
   - Creating or fetching videos (`GET /videos/getAllVideos` or `POST /videos/publishAVideo`) automatically sets `{{videoId}}`.
   - Creating tweets, comments, or playlists auto-captures `{{tweetId}}`, `{{commentId}}`, and `{{playlistId}}`.

### How to Import & Use in Postman:
1. Open Postman.
2. Click **Import** -> Select `postman/streamItPostmanCollection.json`.
3. Select the collection **StreamIt Backend API**.
4. Run `Users -> Login User` first to auto-capture your access token and begin executing authenticated requests!

---

## 🛠️ Complete API Endpoints Matrix

### Health Check
| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `GET` | `/api/v1/healthcheck` | Server and database status check | No |

### User Management
| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `POST` | `/api/v1/users/register` | Register a new channel user | No |
| `POST` | `/api/v1/users/login` | Authenticate user & receive JWT tokens | No |
| `POST` | `/api/v1/users/logout` | Revoke session & clear cookies | Yes |
| `POST` | `/api/v1/users/refreshUser` | Generate new access token using refresh token | Yes |
| `POST` | `/api/v1/users/changePassword` | Change user account password | Yes |
| `POST` | `/api/v1/users/getCurrentUser` | Fetch current logged-in user profile | Yes |
| `PATCH`| `/api/v1/users/updateUserDetails` | Update user full name and email | Yes |
| `PATCH`| `/api/v1/users/updateAvatar` | Upload new user avatar image | Yes |
| `PATCH`| `/api/v1/users/updateUserCoverImage` | Upload new user channel cover image | Yes |
| `GET`  | `/api/v1/users/channel/:username` | Fetch channel profile, subscribers, & status | Yes |
| `GET`  | `/api/v1/users/getWatchHistory` | Retrieve user video watch history | Yes |

### Video Operations
| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `GET`  | `/api/v1/videos/getAllVideos` | Fetch videos with search query, sorting, & pagination | Yes |
| `POST` | `/api/v1/videos/publishAVideo` | Upload & publish a new video with thumbnail | Yes |
| `GET`  | `/api/v1/videos/video/:videoId` | Get single video details by ID | Yes |
| `PATCH`| `/api/v1/videos/video/:videoId` | Update video title, description, or thumbnail | Yes |
| `DELETE`| `/api/v1/videos/video/:videoId` | Delete video by ID | Yes |
| `PATCH`| `/api/v1/videos/toggle/publish/:videoId` | Toggle public/private visibility status | Yes |

### Subscriptions
| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `POST` | `/api/v1/subscriptions/c/:channelId` | Toggle subscribe/unsubscribe to channel | Yes |
| `GET`  | `/api/v1/subscriptions/c/:channelId` | Get list of channels subscribed to by user | Yes |
| `GET`  | `/api/v1/subscriptions/u/:subscriberId` | Get list of subscribers for a channel | Yes |

### Playlists
| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `POST` | `/api/v1/playlists` | Create a new playlist | Yes |
| `GET`  | `/api/v1/playlists/:playlistId` | Get playlist by ID | Yes |
| `PATCH`| `/api/v1/playlists/:playlistId` | Update playlist title and description | Yes |
| `DELETE`| `/api/v1/playlists/:playlistId` | Delete playlist by ID | Yes |
| `PATCH`| `/api/v1/playlists/add/:videoId/:playlistId` | Add video to playlist | Yes |
| `PATCH`| `/api/v1/playlists/remove/:videoId/:playlistId` | Remove video from playlist | Yes |
| `GET`  | `/api/v1/playlists/user/:userId` | Get all playlists created by user | Yes |

### Comments & Likes
| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `GET`  | `/api/v1/comments/:videoId` | Get paginated comments for a video | Yes |
| `POST` | `/api/v1/comments/:videoId` | Add comment to a video | Yes |
| `PATCH`| `/api/v1/comments/c/:commentId` | Update comment text | Yes |
| `DELETE`| `/api/v1/comments/c/:commentId` | Delete comment by ID | Yes |
| `POST` | `/api/v1/likes/toggle/v/:videoId` | Toggle like on a video | Yes |
| `POST` | `/api/v1/likes/toggle/c/:commentId` | Toggle like on a comment | Yes |
| `POST` | `/api/v1/likes/toggle/t/:tweetId` | Toggle like on a tweet | Yes |
| `GET`  | `/api/v1/likes/videos` | Get all videos liked by authenticated user | Yes |

### Tweets (Community Posts) & Dashboard
| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `POST` | `/api/v1/tweets` | Create a new community tweet | Yes |
| `GET`  | `/api/v1/tweets/user/:userId` | Get all tweets created by user | Yes |
| `PATCH`| `/api/v1/tweets/:tweetId` | Update tweet content | Yes |
| `DELETE`| `/api/v1/tweets/:tweetId` | Delete tweet by ID | Yes |
| `GET`  | `/api/v1/dashboard/stats` | Get total views, subscribers, videos, & likes | Yes |
| `GET`  | `/api/v1/dashboard/videos` | Get all videos uploaded by user for dashboard | Yes |

---

## 🏗️ Project Architecture

```
StreamIt-Backend/
├── .env.example             # Template for environment variables
├── package.json             # NPM dependencies & scripts
├── Readme.md                # Project documentation
├── postman/
│   └── streamItPostmanCollection.json  # Postman Collection v2.1.0
├── public/
│   ├── thumbnail/           # Sample static thumbnail images (.png)
│   └── videos/              # Sample static video media files (.mp4)
└── src/
    ├── app.js               # Express application initialization & middleware
    ├── index.js             # Entry point & DB connection startup
    ├── constant.js          # App constants (e.g. DB_NAME)
    ├── swagger.js           # OpenAPI 3.0 specification & Swagger UI config
    ├── controllers/         # Handler logic (User, Video, Comment, Like, etc.)
    ├── db/
    │   ├── index.js         # Mongoose connection with Atlas/Local fallback
    │   └── seed.js          # Database seed script for dummy data & media
    ├── middlewares/         # Auth JWT middleware & Multer upload middleware
    ├── models/              # Mongoose database schemas & indexes
    ├── routes/              # Express API route declarations
    └── utils/               # ApiError, ApiResponse, asyncHandler helpers
```

---

## 🧪 NPM Scripts Summary

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start development server with Nodemon hot-reload (`http://localhost:8000`) |
| `npm start` | Start production server with Node.js (`src/index.js`) |
| `npm run seed` | Seed database with 151 dummy users, 450+ subscriptions, tweets, likes, comments, playlists, and 12 local videos |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the Project repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
