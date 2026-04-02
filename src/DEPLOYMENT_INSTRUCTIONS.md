# Supabase Edge Function Deployment Instructions

## Your Supabase Project ID: sqgqsdexujosloavpuso

## Method 1: Deploy via Supabase CLI (Recommended)

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link Your Project
```bash
supabase link --project-ref sqgqsdexujosloavpuso
```

### 4. Deploy the Edge Function
```bash
supabase functions deploy make-server-a97df12b
```

### 5. Set Environment Secrets
After deployment, set these secrets in Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/sqgqsdexujosloavpuso/settings/functions
2. Click "Manage secrets"
3. Add these secrets:
   - `SUPABASE_URL` = https://sqgqsdexujosloavpuso.supabase.co
   - `SUPABASE_ANON_KEY` = (your anon key from Project Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key - keep secret!)

### 6. Initialize Sample Data
After deployment, you can populate the database with sample products:

**Option A:** Use curl:
```bash
curl -X POST https://sqgqsdexujosloavpuso.supabase.co/functions/v1/make-server-a97df12b/init-sample-data \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Option B:** Use your browser console on the deployed site:
```javascript
fetch('https://sqgqsdexujosloavpuso.supabase.co/functions/v1/make-server-a97df12b/init-sample-data', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + import.meta.env.VITE_SUPABASE_ANON_KEY
  }
}).then(r => r.json()).then(console.log);
```

---

## Method 2: Manual Deploy via Supabase Dashboard

### 1. Go to Edge Functions
Visit: https://supabase.com/dashboard/project/sqgqsdexujosloavpuso/functions

### 2. Create New Function
- Click "Create a new function"
- Name: `make-server-a97df12b`
- Copy the entire contents of `/supabase/functions/server/index.tsx` into the editor
- **IMPORTANT:** You also need to deploy `kv_store.tsx` in the same function directory

### 3. Deploy Supporting Files
The function also needs `kv_store.tsx`. In the dashboard:
- Make sure both files are in the function package
- Or modify the code to include kv_store inline

### 4. Set Environment Variables
Same as Method 1, step 5

---

## Verification

After deployment, test the health endpoint:
```bash
curl https://sqgqsdexujosloavpuso.supabase.co/functions/v1/make-server-a97df12b/health
```

Expected response:
```json
{"status":"ok","message":"F1 Store server is running"}
```

---

## Troubleshooting

### Error: "Failed to fetch"
- ✅ Check that the Edge Function is deployed
- ✅ Check that environment variables are set in Supabase
- ✅ Check that CORS is enabled (already configured in code)
- ✅ Check Edge Function logs in Supabase Dashboard

### Error: "No products found"
- Run the init-sample-data endpoint to populate products
- Or manually add products via Supabase Dashboard

### Where to Find Your Keys
1. Go to: https://supabase.com/dashboard/project/sqgqsdexujosloavpuso/settings/api
2. Copy `anon` `public` key for SUPABASE_ANON_KEY
3. Copy `service_role` `secret` key for SUPABASE_SERVICE_ROLE_KEY (⚠️ keep secret!)
