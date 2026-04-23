# kasidit-site

Static MVP landing page for the Kasidit framework. Pure HTML + Tailwind CDN. No build step.

## Preview locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create an empty repo on GitHub (e.g. `kasidit-wansudon/kasidit-site`).
2. Push this directory:

   ```bash
   git init
   git add .
   git commit -m "init: kasidit landing mvp"
   git branch -M main
   git remote add origin git@github.com:kasidit-wansudon/kasidit-site.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**
   - Save.

4. Wait ~1 minute. Site goes live at `https://kasidit-wansudon.github.io/kasidit-site/`.

For a custom domain, add a `CNAME` file containing the domain and configure DNS per the GitHub Pages docs.

## Structure

```
.
├── index.html          # single-page landing
├── assets/
│   └── favicon.svg     # "K" glyph
├── README.md
├── LICENSE             # MIT
└── .gitignore
```

## Stack

- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) — no npm, no build
- Vanilla JS: theme toggle + copy-to-clipboard
- System font stack (default Tailwind `font-sans`)

## License

MIT — see `LICENSE`.
