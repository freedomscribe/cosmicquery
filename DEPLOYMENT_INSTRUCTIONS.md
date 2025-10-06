# 🚀 CosmicQuery - Deployment Instructions

## Quick Start (5 Minutes to Deploy!)

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Navigate to this directory**
```bash
cd cosmicquery-deploy-package
```

3. **Install dependencies**
```bash
npm install
# or
pnpm install
```

4. **Login to Vercel**
```bash
vercel login
```

5. **Deploy**
```bash
vercel --prod
```

That's it! You'll get a permanent URL like: `https://cosmicquery.vercel.app`

---

### Option 2: Deploy to Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

4. **Login to Netlify**
```bash
netlify login
```

5. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

---

### Option 3: Deploy via Vercel Website (No CLI)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import this directory (or push to GitHub first)
5. Vercel auto-detects settings
6. Click "Deploy"

---

### Option 4: Deploy via Netlify Website (Drag & Drop)

1. Build locally:
```bash
npm install
npm run build
```

2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the `dist` folder onto the page
4. Instant deployment!

---

## Project Structure

```
cosmicquery-deploy-package/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── StarField.jsx    # 3D star field
│   │   ├── Header.jsx       # Navigation
│   │   ├── Hero.jsx         # Hero section
│   │   ├── QueryInterface.jsx  # Query UI
│   │   └── Footer.jsx       # Footer
│   ├── App.jsx              # Main app
│   ├── App.css              # Styles
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite config
└── README.md                # Documentation
```

---

## Environment Variables (Optional)

If you add backend integration later, create `.env`:

```bash
VITE_API_URL=https://your-api.com
VITE_NASA_API_KEY=your-key
```

---

## Custom Domain Setup

### On Vercel:
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed

### On Netlify:
1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Update DNS records

---

## Troubleshooting

### Build fails?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on refresh?
- Vercel: Automatically handled
- Netlify: Add `public/_redirects`:
```
/*    /index.html   200
```

---

## Next Steps

1. **Deploy the frontend** (this package)
2. **Set up backend** (see backend_implementation.md)
3. **Get API keys**:
   - NASA: https://api.nasa.gov/
   - OpenAI: https://platform.openai.com/
4. **Add features** from the implementation plan

---

## Support

- Documentation: See all .md files in parent directory
- Issues: Check the README.md
- Questions: Review implementation_plan.md

**Happy deploying! 🌌✨**
