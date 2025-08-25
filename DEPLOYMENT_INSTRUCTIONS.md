# DSA Visualizer - Deployment Instructions

## 🚀 **Recommended Deployment: Vercel (Easiest)**

This is a **full-stack Next.js application** with:
- Frontend: React components for DSA visualization
- Backend: API routes for authentication and user management
- Database: MongoDB integration

**GitHub Pages will NOT work** because it only supports static files, not server-side functionality.

## 📋 **Deployment Options**

### Option 1: Vercel (Recommended) ⭐
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_JWT_SECRET`: Your JWT secret key

### Option 2: Netlify
1. **Build Command:** `npm run build`
2. **Publish Directory:** `.next`
3. **Environment Variables:** Same as Vercel

### Option 3: Railway/Render
1. **Build Command:** `npm run build`
2. **Start Command:** `npm start`
3. **Environment Variables:** Same as Vercel

## 🔧 **Local Development**

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.template .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

## 🌐 **Environment Variables Required**

Create a `.env.local` file with:
```env
MONGODB_URI=mongodb://your-mongodb-connection-string
NEXT_PUBLIC_JWT_SECRET=your-secret-key-here
```

## ❌ **Why GitHub Pages Won't Work**

- **API Routes**: Authentication, user management, progress tracking
- **Server-Side Features**: Database connections, JWT handling
- **Dynamic Content**: User-specific data and sessions

## ✅ **What Will Work on Vercel/Netlify**

- ✅ All DSA visualizations
- ✅ User authentication
- ✅ Progress tracking
- ✅ Database operations
- ✅ API endpoints
- ✅ Responsive design

## 🚀 **Quick Deploy to Vercel**

1. **Push your code to GitHub**
2. **Go to [vercel.com](https://vercel.com)**
3. **Import your GitHub repository**
4. **Set environment variables**
5. **Deploy!**

Your app will be live with a URL like: `https://your-project.vercel.app`
