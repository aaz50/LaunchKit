# LaunchKit - AI-Powered Launch Package Generator

Generate complete launch packages for your app in minutes using **Agentuity** and **Claude 3.5 Sonnet**!

## 🎯 What It Does

LaunchKit creates everything you need to launch your app:
- 🎨 **Landing Page** - Beautiful, conversion-focused landing page with HTML/React code
- 📊 **Pitch Deck** - Investor-ready 10-12 slide deck with speaker notes
- 📱 **Marketing Content** - Social media posts, Google Ads, email templates

All powered by **Claude 3.5 Sonnet** through **OpenRouter** and orchestrated with **Agentuity**.

## ⚡ Quick Start (5 Minutes)

### 1. Prerequisites

- Node.js 18+ and npm
- Bun runtime (for Agentuity agents)
- Git

### 2. Get Your API Keys

**OpenRouter API Key** (Required):
1. Go to [openrouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Add credits ($5-10 is plenty to start)
4. Create an API key (starts with `sk-or-v1-`)

**Agentuity Keys** (Required for deployment):
1. Go to [agentuity.dev](https://agentuity.dev/)
2. Sign up for an account
3. Get your SDK key and Project key from dashboard

### 3. Configure Environment

Create environment files with your API keys:

**Agentuity Project** (`agentuity-project/.env`):
```env
OPENROUTER_API_KEY=your-openrouter-key-here
AGENTUITY_SDK_KEY=your-agentuity-sdk-key-here
AGENTUITY_PROJECT_KEY=your-agentuity-project-key-here
```

**Next.js App** (`.env.local`):
```env
OPENROUTER_API_KEY=your-openrouter-key-here
AGENTUITY_BASE_URL=http://localhost:3456
AGENTUITY_PROJECT_KEY=your-agentuity-project-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
# Install Next.js dependencies
npm install

# Install Agentuity dependencies
cd agentuity-project
bun install
cd ..
```

### 5. Start Development

**Option 1: One Command (Easiest)**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Option 2: Manual Start**
```bash
# Terminal 1: Start Agentuity agents
cd agentuity-project && bun run dev

# Terminal 2: Start Next.js
npm run dev
```

### 6. Generate Your First Launch Package!

Open [http://localhost:3000](http://localhost:3000) and fill out the form to generate your launch package.

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Next.js Frontend      │
│   (React + Tailwind)    │
└──────────┬──────────────┘
           │
           ↓
┌─────────────────────────┐
│    Agentuity Agents     │
│  ┌──────────────────┐   │
│  │ Landing Page     │   │
│  │ Agent            │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ Pitch Deck       │   │
│  │ Agent            │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ Marketing        │   │
│  │ Agent            │   │
│  └──────────────────┘   │
└──────────┬──────────────┘
           │
           ↓
┌─────────────────────────┐
│     OpenRouter API      │
│  (Claude 3.5 Sonnet)    │
└─────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

### Backend & AI
- **Agentuity** - Agent orchestration framework
- **OpenRouter** - AI API gateway (70% cheaper than direct APIs!)
- **Claude 3.5 Sonnet** - State-of-the-art LLM
- **Bun** - Fast JavaScript runtime for agents

## 📁 Project Structure

```
LaunchKit/
├── src/                          # Next.js application
│   ├── app/
│   │   ├── api/generate/         # Calls Agentuity agents
│   │   ├── page.tsx              # Main UI
│   │   └── layout.tsx
│   ├── components/               # React components
│   │   ├── AppInputForm.tsx      # Multi-step form
│   │   ├── ResultsDashboard.tsx  # Results display
│   │   └── GenerationProgress.tsx # Loading UI
│   └── types/                    # TypeScript definitions
│
├── agentuity-project/            # Agentuity agents
│   ├── src/agents/
│   │   ├── landing-page-agent/   # Landing page generator
│   │   ├── pitch-deck-agent/     # Pitch deck generator
│   │   └── marketing-agent/      # Marketing content generator
│   ├── agentuity.yaml            # Project configuration
│   └── package.json
│
├── start-dev.sh                  # Development startup script
├── verify-setup.sh               # Setup verification script
└── package.json
```

## 🎨 Features

### Input Form
- Multi-step wizard interface
- Brand color picker
- Style preference selection
- Feature management
- Real-time validation

### AI Generation
- Parallel agent execution
- Progress tracking
- Graceful error handling
- Partial success support

### Results Dashboard
- Tabbed preview interface
- Copy-to-clipboard
- Download all formats
- Mobile responsive

### Generated Content

**Landing Page:**
- Hero section with compelling copy
- Feature showcase (5 features)
- Benefits section
- How it works flow
- Testimonial templates
- CTA sections
- Complete HTML & React code

**Pitch Deck:**
- 10-12 professional slides
- Problem/Solution framework
- Market analysis
- Financial projections
- Speaker notes for each slide

**Marketing:**
- 5 Instagram posts with hashtags & image prompts
- 5 Twitter/X posts (280 chars)
- 3 Facebook ad variations
- 3 LinkedIn posts
- 3 Google Ads campaigns
- Email launch template

## 💰 Cost & Performance

### Cost per Generation (via OpenRouter)
- Landing Page: ~$0.05-0.08
- Pitch Deck: ~$0.04-0.06
- Marketing: ~$0.03-0.06
- **Total: ~$0.12-0.20 per complete package**

**70% cheaper than direct GPT-4 API access!**

### Speed
- Average: 60-120 seconds
- Parallel execution across all agents
- No timeout issues with Agentuity

## 🚀 Deployment

### Deploy Agentuity Agents

```bash
cd agentuity-project
agentuity deploy
```

You'll get a production URL like `https://your-project.agentuity.dev`

### Deploy Next.js to Vercel

1. Push your code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `OPENROUTER_API_KEY`
   - `AGENTUITY_BASE_URL` (from your Agentuity deployment)
   - `AGENTUITY_PROJECT_KEY`
4. Deploy!

## 🧪 Testing Agents

Test individual agents directly:

```bash
# Test landing page agent
curl -X POST http://localhost:3456/landing-page-agent \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "TestApp",
    "tagline": "Test tagline",
    "targetAudience": "Developers",
    "problemSolved": "Testing",
    "keyFeatures": ["Feature1", "Feature2", "Feature3"],
    "brandColors": {
      "primary": "#3B82F6",
      "secondary": "#8B5CF6",
      "accent": "#F59E0B"
    },
    "stylePreference": "modern"
  }'
```

## 🎯 Why This Stack?

### OpenRouter Benefits
✅ 70% cheaper than direct API access
✅ Access to Claude, GPT-4, and other models
✅ Fallback support and load balancing
✅ No vendor lock-in
✅ Usage analytics dashboard

### Agentuity Benefits
✅ Professional agent orchestration
✅ Built-in logging and monitoring
✅ Easy deployment and scaling
✅ No timeout limitations
✅ Production-ready infrastructure

### Claude 3.5 Sonnet Benefits
✅ Superior reasoning and creativity
✅ 200K token context window
✅ Better structured output (JSON)
✅ Excellent at marketing and creative writing
✅ State-of-the-art performance

## 🔧 Development

### Making Changes to Agents

```bash
cd agentuity-project/src/agents/landing-page-agent
# Edit index.ts
# Agentuity auto-reloads
```

### Making Changes to UI

```bash
# Edit files in src/
# Next.js hot-reloads automatically
```

### View Logs

```bash
# Agentuity logs
cd agentuity-project && agentuity logs --follow

# Next.js logs
# Check terminal where npm run dev is running
```

### Verify Setup

```bash
./verify-setup.sh
```

## 🐛 Troubleshooting

### "OPENROUTER_API_KEY not found"
- Make sure you've created `.env` in `agentuity-project/` folder
- Make sure you've created `.env.local` in root folder
- Check that your key starts with `sk-or-v1-`

### "Failed to connect to Agentuity"
- Ensure `bun run dev` is running in `agentuity-project` folder
- Check `AGENTUITY_BASE_URL` in `.env.local` is `http://localhost:3456`
- Try accessing http://localhost:3456 directly

### "Agent timeout"
- Claude responses take 30-90 seconds (this is normal)
- Agentuity handles long-running requests automatically
- Don't refresh the page while generating

### "JSON parsing error"
- Agents automatically strip markdown formatting
- Check agent logs in terminal for detailed error messages
- This usually self-corrects on retry

### Generation Fails for One Agent
- Other agents will continue and succeed
- You can regenerate just the failed agent
- Check agent logs for specific error details

## 📝 Environment Variables Reference

### Required Variables

**`.env.local` (Next.js)**:
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `AGENTUITY_BASE_URL` - URL to Agentuity agents (local or production)
- `AGENTUITY_PROJECT_KEY` - Your Agentuity project key
- `NEXT_PUBLIC_APP_URL` - URL where Next.js is running

**`agentuity-project/.env` (Agentuity)**:
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `AGENTUITY_SDK_KEY` - Your Agentuity SDK key
- `AGENTUITY_PROJECT_KEY` - Your Agentuity project key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test locally
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT License - free for personal and commercial use

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Agentuity](https://agentuity.dev/) - Agent orchestration
- [OpenRouter](https://openrouter.ai/) - AI API gateway
- [Claude (Anthropic)](https://anthropic.com/) - AI model
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Support

- **Issues**: Open a GitHub issue
- **Agentuity Support**: https://discord.gg/agentuity
- **OpenRouter Docs**: https://openrouter.ai/docs

---

**Ready to launch?** 🚀

```bash
./start-dev.sh
```

Then open http://localhost:3000 and generate your first AI-powered launch package!

**Built with ❤️ using Agentuity, Claude, and Next.js**
