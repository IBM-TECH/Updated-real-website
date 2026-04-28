# Cyberpunk Artist Portfolio

A premium dark cyberpunk React + Vite static portfolio with a 3D animated background, neon/glow accents, glassmorphism, smooth animations, and a built-in Decap CMS admin panel for editing all content from your browser. Designed to be deployed on **Netlify** in under 5 minutes.

## Stack

- React 19 + Vite 7 + TypeScript
- Tailwind CSS v4 with a custom cyberpunk theme (CMS-editable colors)
- react-three-fiber + drei (with a CSS fallback when WebGL is unavailable)
- framer-motion for animations
- wouter for client routing
- Decap CMS for git-backed content editing at `/admin/`

## Quick start (local)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run serve    # preview the production build
```

## Deploying to Netlify

The cleanest path — and the only one where the **admin / CMS works** — is a Git-connected deploy. Netlify Drop only publishes static files and cannot let the CMS commit changes back to a repo.

### Step 1 — Push to GitHub (do this from a desktop, not a phone)

> **Important:** Do NOT use GitHub's web "Upload files" button on a phone — it does not reliably upload nested folders, and your `src/` folder may end up missing. The build will fail with `Failed to resolve /src/main.tsx` if `src/` is not in the repo. Use a desktop browser, GitHub Desktop, or the command line below.

From a desktop terminal, inside this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

After pushing, **verify** the repo on github.com has these top-level entries:
- `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`, `netlify.toml`, `README.md`
- `src/` folder (open it — it must contain `main.tsx`, `App.tsx`, `index.css`, `components/`, `pages/`, `lib/`, `hooks/`)
- `public/` folder (with `admin/`, `uploads/`, `favicon.svg`, `opengraph.jpg`)
- `content/` folder (with `categories/`, `pages/`, `portfolio/`, `settings/`, `skills/`, `timeline/`)

If `src/` is missing or empty on github.com, the deploy will fail. Re-upload using a desktop or git CLI.

### Step 2 — Create a Netlify site from the repo

1. Go to https://app.netlify.com → **Add new site** → **Import an existing project** → **Deploy with GitHub**.
2. Authorize Netlify and pick the repo.
3. Build settings auto-fill from `netlify.toml`:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
4. Click **Deploy site**.

### Step 3 — Enable Identity AND Git Gateway (both required)

In your Netlify site dashboard:

1. **Site configuration → Identity → Enable Identity**
2. Still on the Identity page, scroll to **Registration preferences → Invite only** (recommended).
3. Scroll to **Services → Git Gateway → Enable Git Gateway**. *(This is the step that lets the CMS write commits back to your repo. Without it, login works but saving fails.)*
4. Go to **Identity → Invite users** and invite your email.
5. Open the invitation email on the same browser. The Identity widget will pop up and ask you to set a password.
6. After setting your password you'll be auto-redirected to `/admin/` and signed in.

> The site's `index.html` includes the Netlify Identity widget script — that's what makes the invite/login pop-up appear.

## Editing content

Once logged in at `/admin/`, you can edit:

- **Site Settings** — site title, logo, theme colors, social URLs
- **About page** — bio, profile image, skills, timeline
- **Contact page** — heading, subheading, email, social handles (Discord, Telegram, Fiverr, etc.)
- **11 Portfolio Categories** — title, description, cover image, slug, order
- **Portfolio Items** — title, category, cover image, gallery (image / video / YouTube / Vimeo), description, featured/visible flags, order

Every save commits to your GitHub repo. Netlify rebuilds automatically — usually live in ~30 seconds.

## Project structure

```
.
├── content/                # All editable content (CMS commits here)
├── public/
│   ├── admin/              # Decap CMS UI (config.yml + index.html)
│   ├── uploads/            # CMS-uploaded images
│   ├── favicon.svg
│   └── opengraph.jpg
├── src/                    # ← MUST be present in the repo
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── pages/
│   ├── components/
│   ├── lib/
│   └── hooks/
├── netlify.toml
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## License

Use freely for personal or commercial portfolios.
