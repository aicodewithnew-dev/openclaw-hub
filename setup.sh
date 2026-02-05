#!/bin/bash

echo "🚀 OpenClaw Hub - Quick Setup Script"
echo "===================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Skipping environment setup."
    echo "   If you want to reconfigure, delete .env.local and run this script again."
else
    echo "📝 Setting up environment variables..."
    cp .env.local.example .env.local
    
    echo ""
    echo "Please provide the following information:"
    echo ""
    
    read -p "Supabase URL: " SUPABASE_URL
    read -p "Supabase Anon Key: " SUPABASE_KEY
    read -p "GitHub Client ID: " GITHUB_ID
    read -p "GitHub Client Secret: " GITHUB_SECRET
    
    # Generate NextAuth secret
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Update .env.local
    sed -i '' "s|your-supabase-url|$SUPABASE_URL|g" .env.local
    sed -i '' "s|your-supabase-anon-key|$SUPABASE_KEY|g" .env.local
    sed -i '' "s|your-github-client-id|$GITHUB_ID|g" .env.local
    sed -i '' "s|your-github-client-secret|$GITHUB_SECRET|g" .env.local
    sed -i '' "s|your-nextauth-secret|$NEXTAUTH_SECRET|g" .env.local
    
    echo ""
    echo "✅ Environment variables configured!"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure you've run the SQL schema in Supabase (see DEPLOYMENT.md)"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For production deployment, see DEPLOYMENT.md"
