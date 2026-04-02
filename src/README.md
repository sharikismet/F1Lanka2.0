# F1 Lanka - Formula 1 Merchandise Store

E-commerce website for selling F1 merchandise in Sri Lanka with WhatsApp checkout integration.

## Features

- 🏎️ Product catalog with filtering by category, gender, and F1 team
- 🔍 Search functionality
- 🛒 Shopping cart with toast notifications
- 📱 Fully mobile responsive
- 💬 WhatsApp checkout integration
- 📄 Legal documents (Privacy Policy, Terms & Conditions, etc.)
- 🇱🇰 Sri Lankan PDPA compliant

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sharikismet/F1Lanka)

### Environment Variables Required

Add these in Vercel dashboard during deployment:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from: Supabase Dashboard → Settings → API

## Setup Supabase Backend

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create new project
- Save your credentials

### 2. Create Database Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS kv_store_a97df12b (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_a97df12b(key);

ALTER TABLE kv_store_a97df12b ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access" ON kv_store_a97df12b
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Anon can read" ON kv_store_a97df12b
  FOR SELECT TO anon USING (true);
```

### 3. Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy make-server-a97df12b
```

### 4. Load Sample Products

Visit your deployed site and click "Load Sample Products" or add products via Supabase Dashboard.

## Contact Information

- **WhatsApp:** +94 71 077 3717
- **Email:** f1lankabusiness@gmail.com

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- Supabase (Database + Edge Functions)
- Vercel (Hosting)

## License

Proprietary - F1 Lanka © 2026
