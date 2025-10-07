# Campaign Strategist AI - Project Overview

## 🎯 What Is This?
A social media campaign generator that helps small business owners (who know NOTHING about marketing) create complete, professional social media campaigns in minutes using AI.

## 👥 Target User: Marketing-Beginner Small Business Owners

### Example Users
- **Sarah** - Stack Creamery (ice cream shop): Wants more catering bookings but has no marketing experience
- **Mike** - Quick Fix Plumbing: Needs more emergency calls but doesn't know what to post
- **Lisa** - Yoga studio owner: Wants new students but finds Instagram overwhelming

### User Pain Points
- "I don't know what to post"
- "I don't understand marketing terms like CTAs, funnels, conversion"
- "I don't have time to learn social media strategy"
- "I just want someone to tell me exactly what to create"

## 💡 Core Value Proposition

### Input (ONE TIME)
- Brand info: colors, personality, voice
- Simple goal: "I want more catering bookings"

### Output (INSTANT)
1. **Strategy**: Complete 2-week campaign plan with 6 posts mapped to a conversion funnel
2. **Scripts**: Every caption, hook, hashtag - copy-paste ready
3. **Visuals**: Detailed shot lists - what to film, how to film it, props needed

All customized to their specific brand, industry, and location.

## 🧠 System Architecture

### 3-Agent AI System (MVP)

#### Agent 1: Campaign Strategist
- **Input**: User profile + goal
- **Output**: Strategic campaign plan with conversion funnel
- **Intelligence**: "What content journey moves people from awareness → conversion?"

#### Agent 2: Script Writer
- **Input**: User profile + strategy from Agent 1
- **Output**: Complete scripts for every post (captions, hooks, hashtags)
- **Intelligence**: "How do I write this in THEIR brand voice?"

#### Agent 3: Visual Planner
- **Input**: User profile + strategy + scripts
- **Output**: Shot-by-shot visual direction
- **Intelligence**: "What do they need to film? Make it doable with a phone camera"

### Built-In Intelligence

#### Industry Knowledge
- What works for ice cream shops vs plumbing companies
- Best platforms for each business type
- Proven content angles for each niche
- Conversion funnel templates by goal

#### Personalization Layer
- Brand colors, personality, visual style
- Specific location (e.g., Springfield, IL - not generic)
- Brand voice (words they love/hate)
- Constraints (e.g., can only do 4 events/weekend)
- Content rules (e.g., no owner face allowed)

## 🚀 Future Vision
The MVP has 3 agents, but the built-out version will have specialized agentic systems for deeper industry/platform expertise.

## 📁 Project Structure
```
campaign-canvas-39/
├── src/
│   ├── components/     # UI components
│   ├── services/       # AI agent services
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript types
├── public/             # Static assets
└── PROJECT_OVERVIEW.md # This file
```

## 🛠️ Tech Stack
- **Framework**: Vite + React
- **UI**: Shadcn/UI components
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## 🎨 Current Status
- Dashboard UI with modern layout
- Campaign generator implementation
- Brand profile management
- Social media campaign workflow

## 📝 Key Features
1. **One-time brand setup** - Capture all brand info upfront
2. **Goal-driven campaigns** - Simple goal input → complete strategy
3. **Copy-paste ready content** - No editing required
4. **Phone-camera friendly** - Realistic visual direction
5. **Industry-specific** - Tailored to business type

## 🎓 Design Philosophy
**Beginner-First**: No marketing jargon, just clear instructions on what to create and why it works.
