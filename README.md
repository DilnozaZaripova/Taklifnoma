# Taklifnoma - AI Wedding Invitation Platform

> Premium wedding invitation platform with AI-generated content, digital gift tracking, and real-time guest management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- Git

### Local Development

1. **Clone and Setup**
```bash
git clone https://github.com/DilnozaZaripova/Taklifnoma.git
cd Taklifnoma
```

2. **Environment Variables**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials:
# - GOOGLE_GENERATIVE_AI_API_KEY (Gemini API)
# - DATABASE_URL (PostgreSQL connection string)
# - EMAIL_USER and EMAIL_PASS (Gmail app password)
# - JWT_SECRET and JWT_REFRESH_SECRET (random strings)
```

3. **Database Setup**
```bash
# Run Prisma migrations
npx prisma migrate dev
npx prisma generate
```

4. **Install and Run**
```bash
# Install all dependencies (root handles both frontend and backend)
npm install

# Start development servers (frontend + backend)
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

---

## 🐳 Docker Deployment

### Run with Docker Compose
```bash
# Start full stack (backend + PostgreSQL)
docker compose up --build

# Run in background
docker compose up -d

# Stop
docker compose down
```

**Services:**
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432

---

## 📦 Render.com Deployment

### Automatic Deployment

1. **Connect Repository**
   - Go to Render.com Dashboard
   - New → Blueprint
   - Connect your GitHub repository

2. **Environment Variables (Required)**
   ```
   DATABASE_URL=<render_postgres_url>
   GOOGLE_GENERATIVE_AI_API_KEY=<your_gemini_key>
   EMAIL_USER=<your_email@gmail.com>
   EMAIL_PASS=<gmail_app_password>
   ```

3. **Deploy**
   - Render will auto-detect `render.yaml`
   - Click "Apply" to deploy

**Production URL:** `https://taklifnoma-backend.onrender.com`

---

## 🔑 Key Features

### Backend (Node.js + Express + Prisma)
- ✅ **AI Invitation Generator** - Gemini API integration with retry logic
- ✅ **Email Verification** - Nodemailer with 6-digit codes
- ✅ **JWT Authentication** - Access + refresh tokens
- ✅ **Gift Tracking** - Real-time donation management
- ✅ **Media Upload** - Multer file handling
- ✅ **Rate Limiting** - 3 AI requests/minute per user
- ✅ **Health Checks** - `/health` endpoint for monitoring

### Frontend (Next.js 15 + React)
- ✅ **AI-Powered Wizard** - 3-step invitation creation
- ✅ **Dynamic Themes** - Royal Gold, Minimalist, National Heritage
- ✅ **Email Verification Flow** - 2-step registration
- ✅ **Dashboard Analytics** - RSVPs, gifts, wedding count
- ✅ **Guest Portal** - QR code access with gift logging
- ✅ **Responsive Design** - Mobile-first, premium UX

---

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### AI Generation
- `POST /api/ai/generate-invitation` - Generate invitation (authenticated, rate-limited)

### User
- `GET /api/user/stats` - Get dashboard statistics (authenticated)

### Weddings
- `POST /api/weddings` - Create wedding
- `GET /api/weddings/:slug` - Get wedding by slug
- `GET /api/weddings` - List user weddings

### Gifts & Media
- `POST /api/gifts` - Log gift
- `GET /api/gifts/:weddingId` - Get wedding gifts
- `POST /api/media/upload` - Upload media
- `GET /api/media/:weddingId` - Get wedding media

---

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend && npm test

# Frontend build verification
npm run build

# Docker health check
curl http://localhost:5000/health
```

---

## 📂 Project Structure

```
Taklifnoma/
├── backend/                 # Express API
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, ai, weddings, etc.)
│   │   ├── config/         # Configuration
│   │   ├── middlewares/    # Auth, rate limiting
│   │   └── utils/          # Helpers (email, jwt)
│   ├── prisma/             # Database schema
│   └── Dockerfile          # Production container
├── src/                    # Next.js frontend
│   ├── app/                # Pages (dashboard, register, etc.)
│   ├── components/         # React components
│   └── lib/                # Utilities
├── docker-compose.yml      # Local development stack
├── render.yaml             # Render deployment config
└── .env.example            # Environment template
```

---

## 🔒 Security

- ✅ Helmet.js for HTTP headers
- ✅ CORS configured
- ✅ Rate limiting on AI endpoints
- ✅ JWT with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Email verification required
- ✅ Environment variables for secrets

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Troubleshooting

### Database Connection Error
```bash
# Reset database
npx prisma migrate reset
npx prisma generate
```

### Docker Build Fails
```bash
# Clear Docker cache
docker system prune -a
docker compose build --no-cache
```

### Email Not Sending
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail
- Generate App Password in Google Account settings

---

## 📞 Support

- GitHub Issues: [Report Bug](https://github.com/DilnozaZaripova/Taklifnoma/issues)
- Email: support@taklifnoma.uz

---

**Built with ❤️ by Dilnoza Zaripova**
