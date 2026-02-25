# Git Art Generator 🖥️

Transform your GitHub contribution graph into terminal-style art!

![Terminal Theme](https://img.shields.io/badge/theme-terminal-green)
![GitHub API](https://img.shields.io/badge/api-github-blue)

## Features

**🎨 8 Art Styles:**
- **Classic GitHub** - Traditional contribution graph with terminal colors
- **Rainbow** - Colorful gradient effect
- **Wave Pattern** - Contributions flow like waves  
- **Spiral** - Contributions spiral outward with glow effects
- **Custom Text** - Shape contributions into any text
- **Your Name** - Auto-fetched from GitHub profile!
- **Heatmap** - Intensity-based green heatmap
- **Pixel Art** - Retro pixel-style with borders

**⚡ Features:**
- Real 2026 contribution data from GitHub
- Terminal/Matrix-inspired dark theme
- Auto-fetch user's name from profile
- Download as PNG
- No authentication required

## How It Works

1. **Enter GitHub username** - Fetches real contribution data for current year
2. **Choose art style** - 8 different rendering options
3. **Customize** - For text/name styles, edit the text
4. **Download** - Save your creation as PNG

## Data Source

Uses [github-contributions-api](https://github.com/grubersjoe/github-contributions-api) to reliably fetch actual contribution calendar data without CORS issues or authentication requirements.

## Tech Stack

- **React** + Vite
- **Canvas API** for rendering
- **GitHub REST API** for profile data
- **github-contributions-api** for contribution calendar
- **Terminal theme** - Green on black, monospace fonts

## Run Locally

```bash
npm install
npm run dev
```

## Deploy

Works on Vercel, Netlify, or any static host.

```bash
vercel --prod
```

## Future Ideas

- More art styles (fractal, mandala, matrix rain)
- Color theme customization
- Animation/GIF export
- Social sharing
- Reverse mode: generate commit schedule to draw patterns

---

**Made with 🖤 and `#00ff00` for developers who want their contribution graphs to look like the Matrix**
