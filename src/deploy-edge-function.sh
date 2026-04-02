#!/bin/bash

# F1 Lanka Store - Edge Function Deployment Script
# This script deploys the Supabase Edge Function

echo "🏎️  F1 Lanka Store - Deploying Edge Function..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if already linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "🔗 Linking to Supabase project..."
    echo "Your project ID: sqgqsdexujosloavpuso"
    supabase link --project-ref sqgqsdexujosloavpuso
else
    echo "✅ Already linked to Supabase project"
fi

# Deploy the function
echo ""
echo "📤 Deploying Edge Function..."
supabase functions deploy make-server-a97df12b

# Check deployment status
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Edge Function deployed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Set environment secrets in Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/sqgqsdexujosloavpuso/settings/functions"
    echo ""
    echo "2. Add these secrets:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "3. Test the deployment:"
    echo "   curl https://sqgqsdexujosloavpuso.supabase.co/functions/v1/make-server-a97df12b/health"
    echo ""
    echo "4. Initialize sample products (optional):"
    echo "   curl -X POST https://sqgqsdexujosloavpuso.supabase.co/functions/v1/make-server-a97df12b/init-sample-data \\"
    echo "     -H \"Authorization: Bearer YOUR_ANON_KEY\""
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Please check the error messages above."
    echo ""
    echo "Common issues:"
    echo "- Not logged in: Run 'supabase login'"
    echo "- Wrong project ID: Check your Supabase dashboard"
    echo "- Missing files: Ensure all files are in /supabase/functions/server/"
fi
