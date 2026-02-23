# 🏠 DayShare - Family Hub

DayShare is a private, full-stack family hub built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. Stay connected with your family by sharing daily updates, managing events, tracking tasks, celebrating birthdays, and storing cherished memories—all in one place.

## ✨ Features

- **📰 Family Feed** – Share posts with emoji reactions, delete your own posts
- **📅 Calendar** – Color-coded family events with react-big-calendar
- **✅ Tasks** – Create, assign, and track family tasks with priority levels and progress bar
- **🎂 Birthdays & Anniversaries** – Countdown to special dates, confetti on birthdays!
- **📷 Photo Album** – Upload and browse family photos with lightbox
- **👤 Profile Pages** – Individual family member profiles with mood & bio
- **⚙️ Settings** – Edit profile, update password, set mood
- **🔔 Notifications** – In-app notification system

## 🎨 Design

| Token | Color | Hex |
|-------|-------|-----|
| Primary | Soft Sky Blue | `#4A90D9` |
| Accent | Warm Amber | `#F5A623` |
| Background | Off White | `#F9F7F4` |
| Text | Deep Charcoal | `#2D2D2D` |
| Success | Soft Green | `#5CB85C` |

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Calendar**: react-big-calendar + date-fns
- **Notifications**: Sonner toasts
- **Icons**: Lucide React
- **Language**: TypeScript

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd dayshare
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
3. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Set Up Database

Run the migration in your Supabase SQL editor:

```bash
# Copy and run the contents of:
supabase/migrations/001_initial.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
dayshare/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard (home)
│   ├── login/              # Authentication
│   ├── feed/               # Family feed
│   ├── calendar/           # Events calendar
│   ├── tasks/              # Task management
│   ├── birthdays/          # Birthdays & anniversaries
│   ├── photos/             # Photo album
│   ├── profile/[id]/       # Member profile
│   └── settings/           # User settings
├── components/
│   ├── layout/             # Navbar, Sidebar
│   └── ui/                 # shadcn/ui + custom components
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── usePosts.ts
│   ├── useEvents.ts
│   ├── useTasks.ts
│   └── useNotifications.ts
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── database.types.ts   # TypeScript DB types
│   └── utils.ts            # Helper functions
└── supabase/
    └── migrations/         # SQL migrations
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Family members can view shared data (posts, events, tasks, etc.)
- Users can only modify their own content
- Auth handled by Supabase Auth

## 📦 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or use the included `vercel.json` configuration.

## 🤝 Contributing

This is a private family hub. Fork it and make it your own!

---

Made with ❤️ for families everywhere
