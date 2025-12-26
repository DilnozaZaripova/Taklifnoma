# Walkthrough: Taklifnoma Professional Backend

I have successfully implemented a production-ready, modular backend for the Taklifnoma platform. This architecture is designed for scalability, security, and ease of maintenance.

## Tech Stack & Architecture
- **Framework**: Node.js + Express + TypeScript
- **ORM**: Prisma with PostgreSQL
- **Security**: JWT (Access & Refresh), Helmet, CORS, RBAC
- **Structure**: Clean Modular Architecture (each feature in its own module)

## Implemented Modules

### 1. Authentication & Users
- **Logic**: Secure registration and login with bcrypt password hashing.
- **JWT**: Token-based auth with refresh token rotation for enhanced security.
- **RBAC**: Middleware to distinguish between `USER` (Couples) and `ADMIN` roles.

### 2. Wedding Management
- **CRUD**: Full lifecycle management for wedding events.
- **SEO/Access**: Unique slug generation for guest invitation pages.
- **Relations**: Linked to AI invitations, media, and gift tracking.

### 3. AI Invitation (Gemini Integration)
- **Secure**: All AI calls and prompt engineering occur strictly on the server side.
- **Integration**: Prepared for Google Gemini Pro using environment variables.

### 4. Gifts (To'yana)
- **Tracking**: Real-time logging of guest donations and messages.
- **Visibility**: Aggregated statistics accessible only to the wedding owner.

### 5. Media Gallery
- **Guest Experience**: Allows guests to upload photos/videos via QR-linked pages.
- **Scalability**: Local MVP storage with easy integration points for Cloudinary or S3.

### 6. Admin Panel
- **Analytics**: System-wide statistics (total users, weddings, gifts, and AI usage).
- **User Management**: Unified view for platform administrators.

## Deployment & Setup
1. **Database**: Configure your PostgreSQL connection string in `backend/.env`.
2. **Environment**: Set `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `GOOGLE_GENERATIVE_AI_API_KEY`.
3. **Run**:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run dev
   ```

The backend is now ready to support both the web platform and future mobile applications.
