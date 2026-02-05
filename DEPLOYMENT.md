# Deployment Guide

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd ~/project/openclaw-hub
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: openclaw-hub
   - Database Password: (generate a strong password)
   - Region: (choose closest to you)
4. Wait for project to be created (~2 minutes)

#### Get API Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

#### Set Up Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

### 3. Set Up GitHub OAuth

#### Create GitHub OAuth App
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: OpenClaw Hub (Local)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy it

### 4. Configure Environment Variables

Create `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Supabase (from step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# GitHub OAuth (from step 3)
GITHUB_CLIENT_ID=Iv1.xxxxx
GITHUB_CLIENT_SECRET=xxxxx

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Production Deployment (Vercel)

### 1. Prepare for Production

Make sure all changes are committed:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd ~/project/openclaw-hub
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (select your account)
- Link to existing project? **N**
- What's your project's name? **openclaw-hub**
- In which directory is your code located? **./**
- Want to override the settings? **N**

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import `aicodewithnew-dev/openclaw-hub`
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **./**
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Configure Production Environment Variables

In Vercel dashboard (or during CLI setup):

```env
# Supabase (same as local)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# GitHub OAuth (DIFFERENT - see step 4)
GITHUB_CLIENT_ID=Iv1.xxxxx
GITHUB_CLIENT_SECRET=xxxxx

# NextAuth (DIFFERENT - use production URL)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-here
```

### 4. Update GitHub OAuth for Production

After first deployment, you'll get a URL like `https://openclaw-hub.vercel.app`

#### Create a NEW GitHub OAuth App for Production
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: OpenClaw Hub (Production)
   - **Homepage URL**: `https://openclaw-hub.vercel.app`
   - **Authorization callback URL**: `https://openclaw-hub.vercel.app/api/auth/callback/github`
4. Copy Client ID and Secret
5. Update Vercel environment variables with production credentials

### 5. Redeploy

After updating environment variables:
```bash
vercel --prod
```

Or in Vercel dashboard: **Deployments** → **Redeploy**

---

## Verification Checklist

### Local Development
- [ ] Can access http://localhost:3000
- [ ] "Sign in with GitHub" button appears
- [ ] Can sign in successfully
- [ ] Can upload an agent
- [ ] Can see agents on homepage
- [ ] Can search agents
- [ ] Can like/unlike agents
- [ ] Can view agent details

### Production
- [ ] Can access production URL
- [ ] GitHub OAuth works
- [ ] All features work as in local
- [ ] No console errors
- [ ] Images load correctly

---

## Troubleshooting

### "Invalid client_id" error
- Make sure you're using the correct GitHub OAuth app (local vs production)
- Check that callback URL matches exactly

### "Supabase client error"
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Make sure schema.sql was run successfully

### "Session not found" error
- Regenerate NEXTAUTH_SECRET
- Clear browser cookies
- Restart dev server

### Database connection issues
- Check Supabase project is active
- Verify RLS policies are enabled
- Check SQL Editor for any errors

### Build fails on Vercel
- Check build logs for specific errors
- Verify all environment variables are set
- Make sure TypeScript has no errors: `npm run build` locally

---

## Custom Domain (Optional)

### 1. Add Domain in Vercel
1. Go to project settings → **Domains**
2. Add your domain (e.g., `hub.openclaw.com`)
3. Follow DNS configuration instructions

### 2. Update GitHub OAuth
1. Update callback URL to use custom domain
2. Update `NEXTAUTH_URL` in Vercel environment variables

### 3. Update Supabase (if needed)
1. Go to **Authentication** → **URL Configuration**
2. Add custom domain to allowed redirect URLs

---

## Monitoring & Maintenance

### Check Logs
```bash
# Vercel CLI
vercel logs

# Or in Vercel dashboard
Project → Deployments → [deployment] → Logs
```

### Database Monitoring
- Supabase dashboard → **Database** → **Usage**
- Monitor table sizes, query performance

### Analytics (Optional)
Add Vercel Analytics:
```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

// Add in body
<Analytics />
```

---

## Next Steps

1. **Add more features**:
   - Comments on agents
   - Agent categories/tags
   - User profiles
   - Download agent configs as ZIP

2. **Improve SEO**:
   - Add meta tags
   - Generate sitemap
   - Add Open Graph images

3. **Add testing**:
   - Unit tests with Jest
   - E2E tests with Playwright

4. **Set up CI/CD**:
   - GitHub Actions for tests
   - Automatic deployments on push

---

## Support

- GitHub Issues: https://github.com/aicodewithnew-dev/openclaw-hub/issues
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
