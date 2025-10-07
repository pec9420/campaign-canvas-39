#!/bin/bash

echo "🚀 Setting up local Supabase environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop first."
  exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI is not installed."
  echo "Install it with: brew install supabase/tap/supabase"
  exit 1
fi

echo "✅ Docker is running"
echo "✅ Supabase CLI is installed"
echo ""

# Start Supabase
echo "🔄 Starting local Supabase stack..."
supabase start

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo ""
  echo "📝 Creating .env.local file..."

  # Get the anon key from supabase status
  ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')

  cat > .env.local << EOF
# Local Supabase Configuration
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=$ANON_KEY
EOF

  echo "✅ Created .env.local with local Supabase credentials"
else
  echo "ℹ️  .env.local already exists"
fi

echo ""
echo "✨ Local Supabase is ready!"
echo ""
echo "🎯 Next steps:"
echo "1. Run: npm run dev"
echo "2. Visit: http://localhost:8080"
echo "3. Supabase Studio: http://127.0.0.1:54323"
echo ""
echo "📚 Useful commands:"
echo "  supabase stop          - Stop local Supabase"
echo "  supabase db reset      - Reset database (apply migrations)"
echo "  supabase status        - Check what's running"
echo ""
