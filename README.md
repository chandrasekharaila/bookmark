# 📘 Smart Bookmark App

## 🔗 Live Demo

**Live URL:**  
https://bookmark1-five.vercel.app/

**GitHub Repository:**  
https://github.com/chandrasekharaila/bookmark

---

## 🧠 Overview

This is a smart bookmark manager built for a full-stack/GenAI screening task.

Users can sign in using Google OAuth, view a list of posts, and add or remove bookmarks.  
All bookmarks are user-specific and update in realtime across multiple tabs.

The primary focus of this project is:

- Authentication flow
- Secure user-specific data handling (RLS)
- Realtime updates
- Clean deployment

---

## ⚙️ Tech Stack

- **Next.js (App Router)**
- **Supabase**
  - Google OAuth authentication
  - PostgreSQL database
  - Realtime subscriptions
  - Row Level Security (RLS)
- **Tailwind CSS**
- **Vercel** (deployment)

---

## ✨ Features

### 🔐 Authentication

- Sign in with Google using Supabase OAuth
- Protected dashboard route
- Persistent session handling

### 🔖 Bookmark System

- Add bookmark
- Remove bookmark
- User-specific bookmarks
- Row Level Security ensures data privacy

### ⚡ Realtime Sync

- Bookmark updates reflect instantly across multiple tabs
- Implemented using Supabase realtime subscriptions

### 🌐 Deployment

- Fully deployed on Vercel
- Production environment variables configured
- Accessible via public URL for testing

---

## 🗄️ Database Schema

### `user_bookmarks`

| Column     | Type                         |
| ---------- | ---------------------------- |
| id         | uuid (primary key)           |
| user_id    | uuid (references auth.users) |
| post_id    | text                         |
| created_at | timestamp                    |

### 🔒 Security

Row Level Security (RLS) enabled so users can only access their own bookmarks.

---

## 🧩 Architecture Decisions

- Supabase used as backend (auth + database + realtime)
- Static posts rendered on frontend for simplicity
- Bookmarks stored per-user in database
- Realtime listeners update UI instantly on database changes
- Next.js App Router used as required in task

---

## ⚠️ Challenges Faced

- Configuring Google OAuth redirect correctly
- Setting up Row Level Security policies
- Handling realtime updates across multiple tabs
- Managing environment variables during Vercel deployment

---

## 🚀 Future Improvements

- Bookmark folders/categories
- Search and filtering
- Optimistic UI improvements
- Mobile responsiveness
- Browser extension for saving bookmarks

---

## 🧑‍💻 Run Locally

```bash
git clone https://github.com/chandrasekharaila/bookmark
cd bookmark
npm install
npm run dev
```
