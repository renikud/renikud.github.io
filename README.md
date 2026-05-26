# renikud.github.io

Intro page for **ReNikud**: Audio-Supervised Hebrew Grapheme-to-Phoneme Conversion.

Static site lives in [`web/`](web/) and deploys to GitHub Pages on push to `main`.

**Preview locally** (must serve the `web/` folder):

```bash
pnpm dev
# or: cd web && python3 -m http.server 8080
# then open http://localhost:8080
```

Do **not** open `index.html` directly as a file — use a local server so CSS loads correctly.

Related: [Phonikud](https://phonikud.github.io) — the prior work on real-time Hebrew G2P and TTS.
