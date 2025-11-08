#!/bin/bash

# LaunchKit Development Startup Script
# Starts both Agentuity agents and Next.js app

echo "🚀 Starting LaunchKit with Agentuity + Claude..."
echo ""

# Check if .env files exist
if [ ! -f "agentuity-project/.env" ]; then
    echo "❌ Missing agentuity-project/.env"
    echo "   Create it with: echo 'ANTHROPIC_API_KEY=your-key' > agentuity-project/.env"
    exit 1
fi

if [ ! -f ".env.local" ]; then
    echo "❌ Missing .env.local"
    echo "   Copy from .env.example.new and add your keys"
    exit 1
fi

# Start Agentuity agents in background
echo "📦 Starting Agentuity agents..."
cd agentuity-project
bun run dev > ../agentuity.log 2>&1 &
AGENTUITY_PID=$!
cd ..

# Wait for Agentuity to start
echo "⏳ Waiting for agents to initialize..."
sleep 5

# Check if Agentuity is running
if ! curl -s http://localhost:3456 > /dev/null; then
    echo "❌ Failed to start Agentuity agents"
    echo "   Check agentuity.log for errors"
    kill $AGENTUITY_PID 2>/dev/null
    exit 1
fi

echo "✅ Agentuity agents running on http://localhost:3456"
echo ""

# Start Next.js app
echo "🌐 Starting Next.js app..."
echo "   Access at: http://localhost:3000"
echo ""
echo "📝 Logs:"
echo "   Agentuity: tail -f agentuity.log"
echo "   Next.js: Check terminal below"
echo ""
echo "⛔ To stop: Press Ctrl+C, then run: kill $AGENTUITY_PID"
echo ""

# Trap to cleanup on exit
trap "echo ''; echo '🛑 Stopping Agentuity agents...'; kill $AGENTUITY_PID 2>/dev/null" EXIT

# Start Next.js (this runs in foreground)
npm run dev

