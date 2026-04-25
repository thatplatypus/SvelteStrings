# SvelteStrings - Design Specification

## Context

Developers frequently need simple string manipulation utilities (Base64 encoding, JSON formatting, case conversion, etc.) and end up on ad-ridden, single-purpose websites of questionable quality. SvelteStrings is an ad-free, self-hosted developer string toolkit that bundles 11 tools into a single PWA, deployed for free on GitHub Pages with full offline support.

## Tech Stack

- **SvelteKit** (Svelte 5, runes) with `@sveltejs/adapter-static`
- **shadcn-svelte** + **Tailwind CSS v4** (Vite plugin, no config file)
- **TypeScript** throughout (`.svelte.ts` for rune modules, typed interfaces)
- **PWA** via `@vite-pwa/sveltekit` with Workbox, full offline caching
- **Lucide icons** (from shadcn-svelte)
- Hosted on **GitHub Pages** at `/SvelteStrings/`

## File Structure

```
src/
├── app.css                              # Tailwind imports + shadcn CSS vars
├── app.html                             # HTML shell with PWA meta tags
├── lib/
│   ├── components/
│   │   ├── ui/                          # shadcn-svelte components (generated)
│   │   ├── layout/
│   │   │   ├── AppSidebar.svelte        # Collapsible sidebar nav
│   │   │   ├── ToolLayout.svelte        # Shared tool page layout (split/single/dual-input)
│   │   │   └── ThemeToggle.svelte       # Light/dark mode toggle
│   │   ├── home/
│   │   │   ├── ToolCard.svelte          # Gradient glow card
│   │   │   └── ToolGrid.svelte          # Draggable grid wrapper
│   │   └── shared/
│   │       ├── CopyButton.svelte        # Reusable copy-to-clipboard
│   │       └── ClearButton.svelte       # Reusable clear action
│   ├── tools/
│   │   └── registry.ts                  # Tool registry (single source of truth)
│   ├── stores/
│   │   └── card-order.svelte.ts         # Card order localStorage persistence (runes)
│   └── utils/
│       ├── cn.ts                        # clsx + tailwind-merge (from shadcn init)
│       ├── colors.ts                    # hexToRgb and accent color helpers
│       ├── clipboard.ts                 # Copy-to-clipboard helper
│       └── local-storage.svelte.ts      # Generic localStorage reactive helper
└── routes/
    ├── +layout.svelte                   # Root layout: sidebar + main content
    ├── +layout.ts                       # prerender = true
    ├── +page.svelte                     # Home page: ToolGrid with ToolCards
    └── tools/
        ├── json-formatter/+page.svelte
        ├── word-counter/+page.svelte
        ├── lorem-ipsum/+page.svelte
        ├── case-converter/+page.svelte
        ├── base64/+page.svelte
        ├── url-encode/+page.svelte
        ├── string-diff/+page.svelte
        ├── hash-generator/+page.svelte
        ├── jwt-decoder/+page.svelte
        ├── html-entities/+page.svelte
        └── markdown-preview/+page.svelte
static/
├── favicon.svg
├── icon-192.png
├── icon-512.png
└── .nojekyll
```

## Architecture

### Tool Registry

`src/lib/tools/registry.ts` is the single source of truth for all tool metadata. Every surface (sidebar, home cards, tool page headers) imports from it.

```typescript
export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: Component;
  color: string;
  route: string;
  layout: 'split' | 'single' | 'dual-input';
}

export const tools: ToolDefinition[] = [ /* all 11 tools */ ];
export const toolMap = new Map(tools.map(t => [t.id, t]));
export const defaultOrder: string[] = tools.map(t => t.id);
```

Adding a new tool = one registry entry + one route directory.

### Accent Color System

Each tool page sets CSS custom properties on its container:

```svelte
<div style="--tool-accent: {tool.color}; --tool-accent-rgb: {hexToRgb(tool.color)}">
```

All themed elements (buttons, borders, headers, panel highlights) reference `var(--tool-accent)` and `rgba(var(--tool-accent-rgb), <opacity>)`. This avoids needing 11 Tailwind color configurations and keeps everything dynamic.

### Shared Tool Layout

`ToolLayout.svelte` accepts a `ToolDefinition` and Svelte 5 snippet props (`input`, `output`, optionally `secondInput`, `controls`). It renders:

1. **Slim inline header** (~44px): tool icon + name on the left, per-tool controls area on the right. The `controls` snippet slot lets each tool render its own controls (encode/decode toggle, case selection buttons, etc.) in a consistent location. This header provides "you are here" context when the sidebar is collapsed to icons.

2. **Content area** with three variants driven by the `layout` discriminant:
   - **`split`** (default): two panels side-by-side on desktop (`grid grid-cols-2`), stacked on mobile (`grid-cols-1`). Left = input, right = output.
   - **`single`**: one full-width panel. Used by JSON Formatter.
   - **`dual-input`**: two stacked inputs on the left, output on the right. Used by String Diff.

Each panel has a small label (Input/Output) and action buttons (Copy, Clear).

## Home Page

### Card Grid

Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` with `gap-4` and `p-6`.

Default sort order by estimated usage frequency:

1. JSON Formatter
2. Base64 Encode/Decode
3. Case Converter
4. URL Encode/Decode
5. Hash Generator
6. JWT Decoder
7. Word/Character Counter
8. String Diff Viewer
9. HTML Entity Encode/Decode
10. Lorem Ipsum Generator
11. Markdown Preview

### Drag-to-Reorder

`svelte-dnd-action` (`use:dndzone`) wraps the grid. On `onfinalize`, the new order is persisted to localStorage under key `sveltestrings:card-order`. On load, the stored order is validated against the current registry (stale IDs stripped, new tools appended at the end).

### Card Design (Gradient Glow)

Each card is an `<a>` link to the tool's route with the tool's accent color driving the visual treatment:

**Resting state:**
- Background: radial gradient from the accent color at 5% opacity
- Border: accent color at 10% opacity
- Icon: 0.8 opacity

**Hover state (200-300ms ease transition):**
- Background gradient: blooms to 18% opacity
- Border: sharpens to 40% opacity
- Box shadow: `0 0 20px rgba(accent, 0.15), 0 0 40px rgba(accent, 0.05)`
- Icon: 1.0 opacity
- Subtitle text: slightly brighter

Implementation uses a `group` class on the card with `group-hover:` Tailwind variants where possible, plus a small scoped style block for properties that need the dynamic `var()` references (border-color, box-shadow).

## Sidebar

Uses the shadcn-svelte sidebar component. Shows icon + tool name for each tool, with the active tool highlighted using its accent color. Collapses to icon-only mode.

**Footer controls**: Light/dark toggle and GitHub repo link icon live in the sidebar footer. When collapsed, these render as small icon buttons stacked vertically. No top app bar; the sidebar owns all chrome.

## Light/Dark Mode

`mode-watcher` manages the theme, applying a `.dark` class to `<html>`. Default follows system preference. A toggle in the sidebar allows manual override. shadcn-svelte's CSS variables automatically respond to the `.dark` class.

## Tools

### Tool Color Assignments

| Tool | Color Name | Hex |
|------|-----------|-----|
| JSON Formatter | Violet | #8b5cf6 |
| Word/Character Counter | Blue | #3b82f6 |
| Lorem Ipsum Generator | Pink | #ec4899 |
| Case Converter | Amber | #f59e0b |
| Base64 Encode/Decode | Green | #22c55e |
| URL Encode/Decode | Cyan | #06b6d4 |
| String Diff Viewer | Orange | #f97316 |
| Hash Generator | Purple | #a855f7 |
| JWT Decoder | Red | #ef4444 |
| HTML Entity Encode/Decode | Teal | #14b8a6 |
| Markdown Preview | Slate | #94a3b8 |

### Tool Specifications

**1. JSON Formatter** (Violet, `single` layout)
- Uses `svelte-jsoneditor` mounted in a wrapper div
- CSS variable overrides (~15-20 vars) scoped via `:global(.jse-main)` to map the editor's theme to shadcn design tokens
- Dark mode handled via `.dark` class selector
- Editor's built-in tree/text/table modes, search, validation, and undo/redo
- No separate input/output; the editor is the tool

**2. Word/Character Counter** (Blue, `split` layout)
- Input: textarea for pasting/typing text
- Output: live stats panel showing word count, character count (with/without spaces), line count, sentence count, paragraph count
- Pure TypeScript, no dependencies

**3. Lorem Ipsum Generator** (Pink, `split` layout)
- Input: controls for paragraphs/sentences/words count, options checkboxes (start with "Lorem ipsum...", HTML `<p>` tags)
- Output: generated text with copy button
- Pure TypeScript with a static word list (~50 Latin words)

**4. Case Converter** (Amber, `split` layout)
- Input: textarea for source text
- Output: buttons to select target case (camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE_CASE), converted result displayed below with copy button
- Pure TypeScript

**5. Base64 Encode/Decode** (Green, `split` layout)
- Input: textarea with encode/decode toggle
- Output: result with copy button
- Uses native `btoa`/`atob` with `TextEncoder`/`TextDecoder` for UTF-8 safety

**6. URL Encode/Decode** (Cyan, `split` layout)
- Input: textarea with encode/decode toggle
- Output: result with copy button
- Uses native `encodeURIComponent`/`decodeURIComponent`

**7. String Diff Viewer** (Orange, `dual-input` layout)
- Two input textareas (original + modified)
- Output: unified diff view with added/removed lines highlighted in green/red
- Uses `diff` library for text comparison

**8. Hash Generator** (Purple, `split` layout)
- Input: textarea for source text
- Output: all hash results displayed simultaneously (MD5, SHA-1, SHA-256) with individual copy buttons
- SHA-1 and SHA-256 via Web Crypto API (`crypto.subtle.digest()`)
- MD5 via `js-md5` library (~4KB gzipped) since Web Crypto deliberately excludes it
- MD5 labeled as "not cryptographically secure"

**9. JWT Decoder** (Red, `split` layout)
- Input: textarea for pasting a JWT token
- Output: decoded header and payload as formatted JSON, with expiration status indicator
- Pure TypeScript: split on `.`, Base64url decode each part, `JSON.parse`
- Shows validation state (valid/invalid/expired)

**10. HTML Entity Encode/Decode** (Teal, `split` layout)
- Input: textarea with encode/decode toggle
- Output: result with copy button
- Pure TypeScript implementation (~30 lines covering named entities and numeric references)

**11. Markdown Preview** (Slate, `split` layout)
- Input: textarea/code editor for writing markdown
- Output: rendered HTML preview
- Uses `marked` for parsing + `dompurify` to sanitize rendered HTML
- Inherently side-by-side; the split layout is its natural form

### Shared Tool UX

- **Slim header**: tool icon + name on the left, tool-specific controls on the right (encode/decode toggle, case buttons, etc.)
- **Panels**: input/output with small labels and action buttons (Copy, Clear)
- No description or tips sections
- Copy uses `navigator.clipboard.writeText()` with a sonner toast for confirmation
- Toast notifications via `svelte-sonner` for copy confirmation and error feedback

## Dependencies

### Core
- `svelte`, `@sveltejs/kit`, `@sveltejs/adapter-static`, `vite`, `typescript`

### Styling & UI
- `tailwindcss`, `@tailwindcss/vite` (v4)
- `bits-ui`, `clsx`, `tailwind-merge`, `tailwind-variants` (shadcn-svelte)
- `lucide-svelte` (icons)
- `mode-watcher` (dark mode)
- `svelte-sonner` (toast notifications)
- `svelte-dnd-action` (drag-and-drop card reorder)

### Tool-Specific
- `svelte-jsoneditor` (JSON Formatter)
- `marked` (Markdown Preview)
- `dompurify` + `@types/dompurify` (sanitize rendered markdown)
- `diff` (String Diff Viewer)
- `js-md5` (Hash Generator, MD5 only)

### PWA
- `@vite-pwa/sveltekit`

### Browser-Native (no library needed)
- Base64: `btoa`/`atob` + `TextEncoder`/`TextDecoder`
- URL encoding: `encodeURIComponent`/`decodeURIComponent`
- SHA-1/SHA-256: `crypto.subtle.digest()`
- JWT decoding: `JSON.parse(atob(base64url))`
- HTML entities: manual encode/decode (~30 lines)
- Lorem ipsum: static word list with generator function

## PWA Configuration

- `@vite-pwa/sveltekit` with `registerType: 'autoUpdate'` (silent updates, no prompt)
- Workbox `globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}']` for full offline caching
- Manifest: `display: 'standalone'`, `scope` and `start_url` set to `/SvelteStrings/`
- Icons: 192x192 and 512x512 PNG (maskable variant for 512)
- `paths.base` in `svelte.config.js` set to `/SvelteStrings` for GitHub Pages

## GitHub Pages Deployment

- GitHub Actions workflow at `.github/workflows/deploy.yml`
- Triggers on push to `main`
- Runs `npm run build`, deploys `build/` directory
- `.nojekyll` in `static/` to bypass Jekyll processing
- Static adapter with `fallback: '404.html'` for client-side routing

## Verification

1. `npm run dev` starts the dev server; verify sidebar navigation, home page card grid, and at least one tool works end-to-end
2. Drag a card on the home page, refresh the page, confirm the new order persists
3. Toggle light/dark mode, verify all tools and cards render correctly in both
4. `npm run build` succeeds with no errors
5. Serve the built output locally (`npx serve build`), verify all routes work and tools function
6. Test offline: load the app, go offline in DevTools, confirm all tools still work
7. Check mobile viewport: sidebar collapses, tool layouts stack to single column
8. For JSON Formatter specifically: verify the editor feels integrated (colors, borders, fonts match shadcn theme in both light and dark mode)
