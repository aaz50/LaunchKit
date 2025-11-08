#!/bin/bash

echo "🔍 Verifying LaunchKit Setup with OpenRouter..."
echo ""

# Check if .env files exist
echo "1. Checking environment files..."
if [ -f "agentuity-project/.env" ]; then
    echo "   ✅ agentuity-project/.env exists"
    if grep -q "OPENROUTER_API_KEY=sk-or-v1" agentuity-project/.env; then
        echo "   ✅ OpenRouter API key configured"
    else
        echo "   ❌ OpenRouter API key not found"
    fi
else
    echo "   ❌ agentuity-project/.env missing"
fi

if [ -f ".env.local" ]; then
    echo "   ✅ .env.local exists"
    if grep -q "OPENROUTER_API_KEY=sk-or-v1" .env.local; then
        echo "   ✅ OpenRouter API key configured"
    else
        echo "   ❌ OpenRouter API key not found"
    fi
else
    echo "   ❌ .env.local missing"
fi

echo ""
echo "2. Checking agent files..."
if [ -f "agentuity-project/src/agents/landing-page-agent/index.ts" ]; then
    if grep -q "OPENROUTER_API_URL" agentuity-project/src/agents/landing-page-agent/index.ts; then
        echo "   ✅ Landing Page Agent uses OpenRouter"
    else
        echo "   ❌ Landing Page Agent not configured for OpenRouter"
    fi
fi

if [ -f "agentuity-project/src/agents/pitch-deck-agent/index.ts" ]; then
    if grep -q "OPENROUTER_API_URL" agentuity-project/src/agents/pitch-deck-agent/index.ts; then
        echo "   ✅ Pitch Deck Agent uses OpenRouter"
    else
        echo "   ❌ Pitch Deck Agent not configured for OpenRouter"
    fi
fi

if [ -f "agentuity-project/src/agents/marketing-agent/index.ts" ]; then
    if grep -q "OPENROUTER_API_URL" agentuity-project/src/agents/marketing-agent/index.ts; then
        echo "   ✅ Marketing Agent uses OpenRouter"
    else
        echo "   ❌ Marketing Agent not configured for OpenRouter"
    fi
fi

echo ""
echo "3. Checking dependencies..."
cd agentuity-project
if ! grep -q "@anthropic-ai/sdk" package.json; then
    echo "   ✅ Anthropic SDK removed"
else
    echo "   ⚠️  Anthropic SDK still in package.json"
fi

if grep -q "@agentuity/sdk" package.json; then
    echo "   ✅ Agentuity SDK installed"
else
    echo "   ❌ Agentuity SDK not installed"
fi
cd ..

echo ""
echo "4. Checking Agentuity agents..."
cd agentuity-project
agent_count=$(agentuity agents list 2>/dev/null | grep -c "agent_" || echo "0")
if [ "$agent_count" -eq "3" ]; then
    echo "   ✅ All 3 agents registered with Agentuity"
else
    echo "   ⚠️  Found $agent_count agents (expected 3)"
fi
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Verification Complete!"
echo ""
echo "🚀 Ready to start? Run:"
echo "   ./start-dev.sh"
echo ""
echo "📖 For detailed setup info, see:"
echo "   README.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

