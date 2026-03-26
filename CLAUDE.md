# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A clickable prototype of "Vieri Bestilling", a Norwegian B2B ordering system. Originally created as a concept design for a UI refresh, it is now being extended with additional functionality to serve as a usability-test prototype. Pure vanilla HTML/CSS/JavaScript with no build system, no package manager, and no external dependencies (aside from Google Fonts and Material Symbols loaded via CDN).

The UI is entirely in Norwegian (Bokmål).

The root `index.html` redirects straight to the dashboard — there is no landing/index page in the test flow.

## Running Locally

- **demo.html** — Self-contained, open directly in browser (no server needed)
- **index.html** and page directories — Require a local server (`npx serve` or VS Code Live Server) because they use `fetch()` to load HTML component fragments

### Claude Code Preview Server

The `.claude/launch.json` is configured to use `node` to run `serve` directly (not via `npx`) because `spawn` on Windows fails with `.cmd` shims. If `serve` is not installed globally, run `npm install -g serve` first. The launch config points to the global `serve` module's main.js entry point.

## Architecture

The project uses a component-based architecture without any framework:

- **shared/** — Global styles (`global.css`), component loader + nav toggle (`main.js`), and reusable components (`header.html/css`, `nav.html/css`)
- **dashboard/** — Dashboard page with its own `main.js`, `style.css`, and HTML fragment components in `components/` (loaded at runtime via `fetch()`)
- **order/** — Order/shop page with filter panel, product grid, quantity controls

Each page's `index.html` includes `shared/main.js` which handles loading shared components (header, nav) into placeholder elements, plus the page's own `main.js` for page-specific logic.

## CSS Design System

- Uses CSS custom properties for spacing, layout, and border-radius
- Glassmorphism design: `backdrop-filter`, `rgba` colors, blur effects
- Container queries (`@container`) for component-level responsive design
- Media query breakpoints: 1200px, 1024px, 800px, 480px
- Primary palette: teal (`#07434b` → `#5a8f99`), accent mint (`#a3e1d4`), accent purple (`#f6eaf6`)
- Fixed gradient background (teal to purple) on the body

## Code Style

- Prettier with 4-space indentation (`.prettierrc`)
- No semicolons or other custom JS style — just the tab width config
