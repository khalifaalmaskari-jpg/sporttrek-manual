# SportTrek STT343VBH iPhone Guide

**App version 6** · Original 38-chapter manual content retained · Public edition with VIN removed.

A mobile-friendly, offline-capable React reference for the **2019 SportTrek Touring Edition STT343VBH**. It includes trip checklists, setup and departure workflows, LevelMatePRO guidance, troubleshooting, electrical reference notes, heat-operation guidance, and manual illustrations. Owner-specific identification numbers are intentionally excluded from the public edition.

## Start locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. To make a production version (including the full offline precache):

```bash
npm run build
```

The deployable site is generated in `dist/`. Its generated service worker precaches the complete app and all included diagrams. To make a single HTML file after building:

```bash
python3 make_single_html.py
```

## iPhone use

Open the deployed site in Safari, select Share, and choose **Add to Home Screen**. Version 6 includes a **My RV** dashboard with trip history, editable equipment verification, maintenance logs, safe diagnostic starting points, measurement records, and JSON export/import. All owner-entered information is kept in the device's browser storage, not sent to GitHub. Export backups regularly. The service worker precaches chapters and drawings after an online visit. Test the full app in Airplane Mode before relying on offline access.

## Accuracy and safety

This is an owner-created companion guide, **not an official Venture RV service publication**. Illustrations sourced from general or partial documentation are reference material, not proof of this trailer's installed wiring, plumbing, fuse assignments, structural locations, or component configuration. All labels marked **Verify on RV** require physical confirmation before service. Confirm breaker/fuse ratings, wire gauge, polarity, equipment identifiers, torque specifications, and the exact as-built configuration with the trailer's labels and manufacturer documentation. Never substitute an inferred fuse or relay map for physical identification.

For 120 V electrical, LP gas, brake, chassis, and structural repairs, use qualified technicians when appropriate. Check VIN-specific recalls with the manufacturer and NHTSA.

## Project files

- `src/main.jsx`: interface, navigation, search, and workbook interactions
- `src/manual.json`: structured guide content and verification notes
- `src/style.css`: mobile-first styling
- `src/OwnerTools.jsx`: owner workbook, service history, equipment identification and diagnostic steps
- `public/assets/`: included manual images
- `public/sw.js` and `public/manifest.webmanifest`: offline and home-screen support
- `scripts/generate-sw.mjs`: production precache generator

## Physical verification required before claiming exact specifications

1. Photograph the actual 12 V fuse panel, 120 V breaker panel, each relay/controller label and the related manufacturer data plates.
2. Read tire load/pressure placards, axle markings, battery type, and tongue/cargo ratings.
3. Identify the installed water heater, refrigerator, air-conditioning, slide mechanisms, converter and LevelMatePRO firmware or model.
4. Cross-check each inferred circuit, fuse rating and wiring route with the physical unit and qualified service documentation.

The equipment worksheet deliberately starts **unverified**. Never mark a circuit verified based only on an online or conceptual diagram. Private notes and serial numbers entered on the iPhone must be exported by the owner; they are not synced between devices.

## Visual guides and mobile display

The app uses the native iPhone/system sans-serif font consistently, supports narrow phone layouts and safe-area navigation, and shows two optimized educational illustrations (`guide-hitch-check.webp` and `guide-campsite-level.webp`) alongside the original reference drawing gallery. These newly generated pictures are **illustrative only**, not photographs or schematics of the owner's actual trailer. Compare any depicted hardware with the physical trailer and its manufacturer's instructions before operating or repairing it.

This repository intentionally excludes `node_modules/`, generated `dist/`, and private hosting configuration.
