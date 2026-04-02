# Deploy F1 Lanka to Vercel

## Quick Deploy (3 Steps)

### 1. Deploy Frontend to Vercel

Click this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sharikismet/F1Lanka)

Or manually:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables (see below)
4. Click Deploy

**Environment Variables:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```
*(Get from Supabase Dashboard → Settings → API)*

---

### 2. Setup Supabase Database

**Create table in Supabase SQL Editor:**

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

---

### 3. Deploy Backend to Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy Edge Function
supabase functions deploy make-server-a97df12b
```

---

## That's It! 🎉

Visit your Vercel URL and click "Load Sample Products" to get started.

**Contact:** +94 71 077 3717 | f1lankabusiness@gmail.com
