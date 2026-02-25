# OG Preview Image TODO

The `index.html` references `/og-preview.png` for social media sharing previews.

## How to Add:

1. **Take a screenshot** of the app in action (ideally showing a nice Rainbow or Pac-Man visualization)
2. **Dimensions:** 1200x630px (optimal for Twitter/Facebook/LinkedIn)
3. **Save as:** `public/og-preview.png`
4. **Commit and deploy**

## Quick Method:

```bash
# Take a screenshot, resize it, and save to public/
# Example using ImageMagick:
convert screenshot.png -resize 1200x630^ -gravity center -extent 1200x630 public/og-preview.png

# Or use any image editor (Figma, Photoshop, etc.)
```

## Alternative:

Use a tool like [metatags.io](https://metatags.io) to preview and generate the image.

---

**Current:** The meta tags are set up, just missing the actual image file.
**Next:** Add the image and it will auto-populate on Twitter/Facebook/Discord when sharing the link!
