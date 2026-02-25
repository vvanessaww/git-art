# Git Art Generator 🎨

Transform your GitHub contribution graph into terminal-style art!

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://git-art-theta.vercel.app)
![Terminal Theme](https://img.shields.io/badge/theme-terminal-green)
![GitHub API](https://img.shields.io/badge/api-github-blue)

## ✨ Features

### 🎮 7 Art Styles:
1. **GitHub Classic** - Traditional contribution graph with terminal colors
2. **Rainbow** - Colorful gradient effect with glow
3. **Tetris** - Blocks stacking based on weekly activity
4. **Pac-Man** - Classic arcade maze with ghosts and pellets
5. **Custom Text** - Shape contributions into any text (up to 9 chars)
6. **Your Name** - Auto-fetched from GitHub profile!
7. **Heatmap** - Intensity-based heat gradient

### ⚡ Key Features:
- ✅ Real 2026 contribution data from GitHub
- 🎨 Terminal/Matrix-inspired dark theme
- 📅 Month labels (Jan-Dec) + day labels (Mon/Wed/Fri)
- 👤 Auto-fetch user's name from profile
- 💾 Download as PNG
- 📱 Mobile responsive
- 🔒 No authentication required
- 🚀 Fast & lightweight

## 🖼️ Add to Your GitHub Profile

Want to show off your art in your GitHub profile README?

### Method 1: Download & Upload
1. Generate your art at [git-art-theta.vercel.app](https://git-art-theta.vercel.app)
2. Click "Download as PNG"
3. Upload the image to your profile repo (e.g., `username/username`)
4. Add to your `README.md`:

```markdown
![My GitHub Contribution Art](./your-art.png)
```

### Method 2: Link to Live Version
Add a direct link in your README:

```markdown
**🎨 Check out my [GitHub Contribution Art](https://git-art-theta.vercel.app/?username=yourusername)**
```

### Pro Tip: Multiple Styles
Create a gallery in your README:

```markdown
## 🎨 My Contribution Art Gallery

| Rainbow | Tetris | Pac-Man |
|---------|--------|---------|
| ![Rainbow](./art-rainbow.png) | ![Tetris](./art-tetris.png) | ![Pacman](./art-pacman.png) |
```

## 🚀 How It Works

1. **Enter GitHub username** - Fetches real contribution data for current year
2. **Choose art style** - 7 different rendering options
3. **Customize** - For text/name styles, edit the text (max 9 characters)
4. **Download** - Save your creation as PNG for your README

## 📊 Data Source

Uses [github-contributions-api](https://github.com/grubersjoe/github-contributions-api) to reliably fetch actual contribution calendar data without CORS issues or authentication requirements.

## 🛠️ Tech Stack

- **React** + Vite
- **Canvas API** for rendering
- **GitHub REST API** for profile data
- **github-contributions-api** for contribution calendar
- **Terminal theme** - Green on black, monospace fonts

## 💻 Run Locally

```bash
# Clone the repo
git clone https://github.com/vvanessaww/git-art.git
cd git-art

# Install dependencies
npm install

# Start dev server
npm run dev
```

## 🚀 Deploy

Works on Vercel, Netlify, or any static host.

```bash
# Deploy to Vercel
vercel --prod

# Or build for static hosting
npm run build
# Upload the 'dist' folder
```

## 🎯 Future Ideas

- [ ] More art styles (fractal, mandala, matrix rain, constellation)
- [ ] Color theme customization
- [ ] Animation/GIF export
- [ ] Social sharing with auto-generated preview
- [ ] Reverse mode: generate commit schedule to draw patterns
- [ ] API endpoint for programmatic access
- [ ] Contribution stats overlay

## 🤝 Contributing

Found a bug? Want to add a new art style? PRs welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this for your own projects!

## 💖 Credits

Made with 🖤 and `#00ff00` for developers who want their contribution graphs to look like art.

**Author:** [vvanessaww](https://github.com/vvanessaww)  
**Live Demo:** [git-art-theta.vercel.app](https://git-art-theta.vercel.app)

---

*Star ⭐ this repo if you found it useful!*
