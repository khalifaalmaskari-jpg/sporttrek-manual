# SportTrek STT343VBH iPhone Guide

A mobile-friendly, offline-capable React reference for the **2019 SportTrek Touring Edition STT343VBH**. It includes trip checklists, setup and departure workflows, LevelMatePRO guidance, troubleshooting, electrical reference notes, heat-operation guidance, and manual illustrations. Owner-specific identification numbers are intentionally excluded from the public edition.

## Start locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. To make a production version:

```bash
npm run build
```

The deployable site is generated in `dist/`. To make a single HTML file after building:

```bash
python3 make_single_html.py
```

## iPhone use

Open the deployed site in Safari, select Share, and choose **Add to Home Screen**. The app provides mobile navigation and stores bookmarks/checklist progress in the browser. The service worker supports repeat visits while offline after the app has been loaded online.

## Accuracy and safety

This is an owner-created companion guide, **not an official Venture RV service publication**. Illustrations sourced from general or partial documentation are reference material, not proof of this trailer's installed wiring, plumbing, fuse assignments, structural locations, or component configuration. All labels marked **Verify on RV** require physical confirmation before service. Confirm breaker/fuse ratings, wire gauge, polarity, equipment identifiers, torque specifications, and the exact as-built configuration with the trailer's labels and manufacturer documentation. Never substitute an inferred fuse or relay map for physical identification.

For 120 V electrical, LP gas, brake, chassis, and structural repairs, use qualified technicians when appropriate. Check VIN-specific recalls with the manufacturer and NHTSA.

## Project files

- `src/main.jsx`: interface, navigation, search, and workbook interactions
- `src/manual.json`: structured guide content and verification notes
- `src/style.css`: mobile-first styling
- `public/assets/`: included manual images
- `public/sw.js` and `public/manifest.webmanifest`: offline and home-screen support

This repository intentionally excludes `node_modules/`, generated `dist/`, and private hosting configuration.
