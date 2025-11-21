# AI Coding Agent Instructions for AIKYAM Static Site

These instructions document the actual patterns in this repository so an AI agent can contribute productively.

## Overview & Architecture
- Project type: Static HTML/CSS/vanilla JS site (no build step, no framework).
- Dynamic behavior achieved client-side via `fetch()` of HTML partials (`common/header.html`, `common/footer.html`) and JSON data under `data/`.
- All pages (e.g. `index.html`, `gallery.html`, `vendors.html`) rely on shared assets: `script.js`, `styles.css`, `assets/`.
- No bundler: keep ES5+/DOM-compatible code directly in `script.js`.
- Serve locally via simple HTTP (required for JSON fetch). Primary documented workflow: `python3 -m http.server 8000` (or `make serve`).

## Local Dev Workflow
```bash
python3 -m http.server 8000  # serve from repo root
make serve                   # alternative if Makefile present (mentioned in ReadMe)
make stop                    # stop server
```
- Do NOT open files via `file://` or fetch() calls will fail.
- Relative paths assume pages are at repo root; keep JSON paths `./data/*.json` and partial paths `./common/*.html`.

## Data Loading Patterns (script.js)
- `loadHeader()` / `loadFooter()` insert partials into placeholders with IDs `header-placeholder` and `footer-placeholder`; after header load, navigation init functions run (`initMobileNav()`, `setActiveNavItem()`).
- `loadData()` performs sequential fetches: core team, events (upcoming + completed), board, vendors; each render block guards for target container existence.
- Image fallback pattern: on `error` event, replace `<img>` with dynamically constructed gradient placeholder using initials/titles.
- Marquee/loop effects: events and gallery duplicate arrays (`[...events, ...events, ...events]`) to create continuous scroll visuals.
- Vendors: global array `globalVendors` cached; dynamic category filter buttons generated (`generateVendorFilters`) from `Category` field; filtering uses main category match or includes.
- Calendar and countdown logic rely on `upcomingEvents.json` fields: `id`, `title`, `start`, optional `end`, `tbd`, `location`, `price`.

## JSON Schemas (Examples)
- Upcoming Event object: `{ id, title, start (ISO), end (ISO optional), location, price (number), img, desc, tbd? }`.
- Vendor object: `{ Category, Sub-Category, "Vendor Name", "Vendor Phone", "Referred By", "Referral Comment about Vendor" }` (note multi-word keys, preserve exact casing & spaces).
- Board data (from `boardMembers.json`) expected shape: `{ chairman: {...}, members: [ {...}, ... ] }` (see render logic).

## UI/Styling Conventions (styles.css)
- Design system uses CSS custom properties (theme tokens) defined on `:root` and toggled by adding `body.light` class.
- BEM-inspired naming for reusable components: `.btn`, `.btn--primary`, `.card`, `.card--horizontal`, `.vendor-card`.
- Interaction states rely on transitions; preserve existing class semantics to avoid regressions (e.g., `.btn-click-effect`, `[data-filter].active`).
- Layout containers commonly use `max-width: var(--maxw)` and responsive grids via `repeat(auto-fit, minmax(...))`.

## Navigation & Active State
- Active link logic differentiates between homepage hash navigation and other pages; modifying nav requires updating logic in `setActiveNavItem()` & `updateActiveNavOnScroll()` if structure changes.
- Hash-based section activation uses IDs: `home`, `team`, `events`, `reviews-section`.

## Accessibility & Feedback Patterns
- Screen reader announcements use temporary live regions (`announceToScreenReader`). Maintain this pattern when adding dynamic UI updates.
- Error handling: single catch in `loadData()` creates a fixed-position toast-like element advising refresh.

## Theming & State Persistence
- Theme selection stored in `localStorage` key `AIKYAM_theme`; default 'dark'. When adding new theme-dependent styles, rely on existing CSS variables to avoid branching logic.

## Adding / Updating Content
- New events: append objects to `data/upcomingEvents.json`; if date TBD set `"tbd": true` and omit `start`/`end` (or keep placeholders) and logic will adjust labels.
- Completed events: add to `data/completedEvents.json`; marquee duplication expects straightforward array of past events.
- Vendors: maintain consistent `Category` values to keep filter buttons clean; avoid introducing near-duplicate category names.
- Images: place under appropriate `assets/events/`, `assets/gallery/`, etc. Provide reasonably sized images; rely on `loading="lazy"` already present.

## Safe Change Guidelines
- Keep fetch paths relative (`./data/...`, `./common/...`) to avoid breaking deploys under subpaths.
- Avoid introducing frameworks or build steps unless explicitly requested; simplicity is intentional.
- Preserve existing IDs and classes referenced by JS; if altered, update corresponding selectors in `script.js`.
- Test JSON syntax after edits—invalid JSON silently breaks sections; use an online validator or a quick `python -m json.tool data/file.json` before committing.

## Common Extension Points
- New section rendering: follow pattern in `loadData()`—fetch -> guard container -> build DOM -> attach listeners.
- Additional filters/sorting for vendors: extend `renderVendors` ensuring accessibility announcement is preserved.
- Calendar enhancements: modify `renderCalendar(upcomingEvents)`; reuse `sameDate()` helper.

## Deployment Assumptions
- Static host (e.g., GitHub Pages / simple HTTP) with no server-side templating; all dynamic composition client-side.
- Ensure any subpath deployment retains leading `./` relative references (avoid absolute `/assets/...` unless root guaranteed).

## Quick Quality Checklist Before PR
1. Served locally and verified fetch() succeeded (no console 404s).
2. JSON additions validate & render in corresponding sections.
3. Navigation active states still correct on homepage and other pages.
4. Theme toggle unaffected by new styles (variables reused).

Provide concise commit messages referencing changed data or component (e.g., "Add Diwali event (tbd)" / "Enhance vendor filter styling").
