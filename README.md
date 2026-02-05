# OpenClaw Hub

A community platform for sharing and discovering OpenClaw agent configurations.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend as a service (PostgreSQL + Auth)
- **NextAuth.js** - GitHub OAuth authentication

## Features

- 🔐 GitHub OAuth login
- 📤 Upload agent configurations (SOUL.md, AGENTS.md, TOOLS.md)
- 🔍 Search agents by name or description
- ❤️ Like/unlike agents
- 👤 User profiles with avatar
- 📱 Responsive design

## Setup Instructions

### 1. Clone the Repository

```bash
cd ~/project
git clone https://github.com/aicodewithnew-dev/openclaw-hub.git
cd openclaw-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings** → **API** and copy:
   - Project URL
   - Anon/Public key
3. Go to **SQL Editor** and run the schema from `supabase/schema.sql`

### 4. Set Up GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - **Application name**: OpenClaw Hub
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and generate a Client Secret

### 5. Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
```

Generate a random secret for `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your `openclaw-hub` repository
4. Configure environment variables (same as `.env.local`)
5. Click **Deploy**

### 3. Update GitHub OAuth

After deployment, update your GitHub OAuth App:
- **Homepage URL**: `https://your-app.vercel.app`
- **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`

Update `NEXTAUTH_URL` in Vercel environment variables to your production URL.

## Project Structure

```
openclaw-hub/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth configuration
│   │   ├── agents/route.ts              # Agents API
│   │   └── likes/route.ts               # Likes API
│   ├── agent/[id]/page.tsx              # Agent detail page
│   ├── upload/page.tsx                  # Upload agent page
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Home page
├── components/
│   ├── AgentCard.tsx                    # Agent card component
│   ├── AgentList.tsx                    # Agent list with search
│   ├── Header.tsx                       # Navigation header
│   └── Providers.tsx                    # NextAuth provider
├── lib/
│   └── supabase.ts                      # Supabase client
├── supabase/
│   └── schema.sql                       # Database schema
└── .env.local.example                   # Environment template
```

## Database Schema

### users
- `id` (UUID, primary key)
- `github_id` (text, unique)
- `username` (text)
- `avatar_url` (text, nullable)
- `created_at` (timestamp)

### agents
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users)
- `name` (text)
- `description` (text, nullable)
- `soul_md` (text, nullable)
- `agents_md` (text, nullable)
- `tools_md` (text, nullable)
- `other_files` (jsonb, nullable)
- `likes_count` (integer, default 0)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### likes
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users)
- `agent_id` (UUID, foreign key → agents)
- `created_at` (timestamp)
- Unique constraint on (user_id, agent_id)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
