# GitHub Setup — n3ary / neary

Step-by-step for getting the brand onto the n3ary GitHub org.

---

## 1. Organization avatar

The avatar shows in the org's circle (GitHub crops to circle automatically).

1. Go to **github.com/organizations/n3ary/settings/profile** (or click the org → Settings → Profile)
2. Under **"Organization picture"**, click **"Upload new picture"**
3. Upload either:
   - **`neary-logo.svg`** — preferred (vector, scales cleanly)
   - **`png/neary-512.png`** — fallback (raster)

GitHub accepts SVG for org avatars as of recent updates. If SVG doesn't take, use the 512 PNG.

---

## 2. Repository social preview

This is the 1280 × 640 image shown when the repo is shared on social media or at the top of the repo page.

For each repo (e.g. `neary`, `neary-gtfs`, `cluj-napoca-gtfs-adapter`):

1. Go to the repo → **Settings** → **General** → scroll to **"Social preview"**
2. Click **"Upload an image"**
3. Upload **`social-preview.png`** (1280 × 640)
4. Repeat for each repo in the org

---

## 3. README favicon + branding

For each repo's README, you can reference the brand assets.

### Option A: Link the brand repo

If `n3ary/brand` (or similar) is a public repo holding the brand assets, link them from READMEs:

```markdown
![neary](./brand-assets/neary-logo.svg)
```

### Option B: Inline SVG

Copy the contents of `neary-logo.svg` directly into your README. README renderers (GitHub, GitLab, etc.) support inline SVG.

---

## 4. Web favicon

For any web properties (n3ary.com, docs sites, etc.) include in `<head>`:

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/neary-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/neary-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/neary-180.png">
```

---

## 5. PWA manifest

For PWA installs (if neary ships as a PWA):

```json
{
  "name": "neary",
  "short_name": "neary",
  "icons": [
    { "src": "/neary-logo.svg", "sizes": "any", "type": "image/svg+xml" },
    { "src": "/neary-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/neary-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/neary-logo-maskable.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "maskable" }
  ],
  "theme_color": "#4F46E5",
  "background_color": "#4F46E5"
}
```

---

## Files you'll use most

| File | Purpose |
|---|---|
| `neary-logo.svg` | Org avatar, README inline, web favicon source |
| `png/neary-512.png` | Org avatar fallback, GitHub social preview |
| `social-preview.png` | Repo social preview |
| `favicon.ico` | Browser tab favicon |
| `neary-logo-maskable.svg` | Android adaptive icon |
| `BRANDING.md` | The brand manual — share this with anyone working on neary assets |

Everything else (other PNG sizes, maskable, mono, wordmarks) is in the brand kit but rarely needed for GitHub setup.