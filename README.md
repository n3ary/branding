# n3ary/branding

The visual identity for **neary** (the product) and the **n3ary** org.
Source of truth for logos, wordmarks, and the brand manual.

## What's a source, what's an artefact

| What | Where | How it gets produced |
|---|---|---|
| Primary mark + variants (SVG) | [`src/logo/`](src/logo/) | hand-edited |
| Social preview (SVG) | [`src/social/`](src/social/) | hand-edited |
| Brand manual (prose) | [`docs/concepts/brand-manual.md`](docs/concepts/brand-manual.md) | hand-edited |
| GitHub asset setup (prose) | [`docs/specs/github-asset-setup.md`](docs/specs/github-asset-setup.md) | hand-edited |
| Visual brand manual (HTML) | [`site/index.html`](site/index.html) | hand-edited |
| PNG exports (9 sizes) | `dist/neary-{16…1024}.png` | `pnpm build` |
| Favicon (multi-res) | `dist/favicon.ico` | `pnpm build` |
| Social preview (1280×640) | `dist/social-preview.png` | `pnpm build` |

`dist/` is gitignored. The CI deploys it (plus `site/`) to
[branding.n3ary.com](https://branding.n3ary.com) on every push to `main`.

## Quick start

```bash
pnpm install
pnpm build      # regenerates dist/
pnpm check      # tsc --noEmit on the regen scripts
```

## Consuming the brand

- **Web favicon** — `<link rel="icon" href="https://branding.n3ary.com/favicon.ico">`
- **PNG icon (e.g. PWA / app icon)** — `https://branding.n3ary.com/neary-192.png` (or any of 16/32/64/128/180/192/256/512/1024)
- **SVG mark** — `https://branding.n3ary.com/../src/logo/neary-logo.svg` (served from the repo, since SVG is hand-edited and small)
- **Social card** — `https://branding.n3ary.com/social-preview.png`

The full setup recipe per consumer is in
[docs/specs/github-asset-setup.md](docs/specs/github-asset-setup.md).

## Repo layout

```
branding/
├── AGENTS.md                  how to work here
├── README.md                  this file
├── package.json               pnpm + sharp
├── pnpm-lock.yaml             committed
├── tsconfig.json
├── .gitignore                 dist/, node_modules/, .DS_Store, …
├── .npmrc
├── src/
│   ├── logo/                  vector SVGs (hand-edited, the actual sources)
│   │   ├── neary-logo.svg
│   │   ├── neary-logo-maskable.svg
│   │   ├── neary-logo-mono.svg
│   │   ├── neary-wordmark.svg
│   │   └── n3ary-wordmark.svg
│   └── social/
│       └── social-preview.svg
├── scripts/                   regen scripts (TypeScript)
│   ├── paths.ts
│   ├── gen-pngs.ts
│   ├── gen-ico.ts
│   └── gen-social.ts
├── dist/                      build artefacts (gitignored, rebuilt by `pnpm build`)
├── site/                      the brand-manual HTML served at branding.n3ary.com/
│   └── index.html
├── docs/
│   ├── README.md
│   ├── concepts/
│   │   └── brand-manual.md    the brand manual prose
│   └── specs/
│       └── github-asset-setup.md
└── .github/
    └── workflows/
        ├── pr-validation.yml  builds + checks on every PR
        └── deploy.yml         deploys to branding.n3ary.com on push to main
```

## Cross-references

- [AGENTS.md](AGENTS.md) — how to work here.
- [docs/concepts/brand-manual.md](docs/concepts/brand-manual.md) — the brand itself.
- [docs/specs/github-asset-setup.md](docs/specs/github-asset-setup.md) — consumer setup.
- [n3ary/standards](https://github.com/n3ary/standards) — the org standards.

## License

[Creative Commons Attribution 4.0 International (CC BY 4.0)](./LICENSE) — free to use, share, and adapt, even commercially, as long as you credit the source. See the LICENSE file for the full terms.



