# 🚀 GreenGrove Deployment Guide

## Step-by-Step Guide to Deploy on Vercel

### **Step 1: Prepare Your Project**

1. **Create a `.env.example` file** in your project root:
```env
# Database
DATABASE_URL="your_database_url_here"

# UploadThing (optional)
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"

# Next.js
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

2. **Update package.json scripts** (already done):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### **Step 2: Push to GitHub**

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - GreenGrove Nursery Management"
```

2. **Create GitHub Repository**:
   - Go to [GitHub.com](https://github.com)
   - Click "New Repository"
   - Name: `greengrove-nursery`
   - Make it Public
   - Don't initialize with README (we already have files)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/greengrove-nursery.git
git branch -M main
git push -u origin main
```

### **Step 3: Deploy on Vercel**

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select your `greengrove-nursery` repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Environment Variables** (Optional for demo):
   - Add `DATABASE_URL` if you have a database
   - Leave empty for demo mode (uses mock data)

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)

### **Step 4: Post-Deployment**

1. **Access Your Site**:
   - Vercel will provide a URL like: `https://greengrove-nursery-xyz.vercel.app`
   - Your site is now live!

2. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS settings as instructed

### **Step 5: Database Setup (Optional)**

If you want to use a real database:

1. **Choose Database Provider**:
   - **Neon** (recommended for PostgreSQL)
   - **PlanetScale** (MySQL)
   - **Supabase** (PostgreSQL)

2. **Get Database URL**:
   - Create database
   - Copy connection string
   - Add to Vercel Environment Variables

3. **Run Migrations**:
```bash
npx prisma db push
```

### **Features Available After Deployment:**

✅ **Dashboard** - Overview with metrics
✅ **Plant Management** - Inventory system
✅ **Customer Management** - Customer profiles
✅ **Order Tracking** - Order management
✅ **Care Schedule** - Plant care tasks
✅ **Reports** - Analytics dashboard
✅ **Inventory** - Stock management

### **Troubleshooting:**

1. **Build Errors**:
   - Check Vercel build logs
   - Ensure all dependencies are in package.json

2. **Environment Variables**:
   - Add missing variables in Vercel dashboard
   - Redeploy after adding variables

3. **Database Issues**:
   - Check DATABASE_URL format
   - Ensure database is accessible from Vercel

### **Cost:**
- **Vercel**: Free tier (100GB bandwidth, unlimited deployments)
- **Database**: Free tier available on most providers
- **Total Cost**: $0 for basic usage

### **Next Steps:**
1. Test all features on live site
2. Set up custom domain (optional)
3. Configure database (optional)
4. Add real data
5. Share your live nursery management system!

---

**Your GreenGrove Nursery Management System will be live at:**
`https://your-project-name.vercel.app`

🌿 **Happy Deploying!** 🌿
