# renikud.github.io

Intro page for **ReNikud**: Audio-Supervised Hebrew Grapheme-to-Phoneme Conversion. Accepted to IEEE SLT 2026.

Static site lives in [`web/`](web/) and deploys to GitHub Pages on push to `main`.

**Preview locally** (must serve the `web/` folder):

```bash
pnpm dev
# or: cd web && python3 -m http.server 8080
# then open http://localhost:8080
```

Do **not** open `index.html` directly as a file — use a local server so CSS loads correctly.

Related: [Phonikud](https://phonikud.github.io) — the prior work on real-time Hebrew G2P and TTS.

## Citation

```bibtex
@inproceedings{melichov2026renikud,
  title={ReNikud: Audio-Supervised Hebrew Grapheme-to-Phoneme Conversion},
  author={Maxim Melichov and Yakov Kolani and Morris Alper},
  booktitle={Proc. IEEE SLT 2026},
  year={2026},
  url={https://arxiv.org/pdf/2606.20179},
}
```
