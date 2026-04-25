# SvelteStrings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an ad-free PWA developer string toolkit with 11 tools, deployed on GitHub Pages.

**Architecture:** SvelteKit static site with a tool registry pattern. A single `registry.ts` defines all tools (id, name, icon, color, route, layout). Shared `ToolLayout.svelte` renders the slim header + panel grid. Each tool is a route page with pure TypeScript logic (tested) and a thin Svelte UI layer.

**Tech Stack:** SvelteKit (Svelte 5/runes), shadcn-svelte, Tailwind CSS v4, TypeScript, @vite-pwa/sveltekit, Lucide icons

**Design Spec:** `docs/superpowers/specs/2026-04-24-sveltestrings-design.md`

---

## Phase 1: Project Scaffold

### Task 1: Initialize SvelteKit Project

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.css`, `src/routes/+page.svelte`

- [ ] **Step 1: Scaffold SvelteKit**

```bash
cd /Users/tombrewer/Code/SvelteStrings
npx sv create . --template minimal --types ts
```

Select defaults when prompted. This creates the SvelteKit skeleton with Svelte 5 and TypeScript.

- [ ] **Step 2: Install the static adapter**

```bash
npm install -D @sveltejs/adapter-static
```

- [ ] **Step 3: Configure svelte.config.js for static adapter + GitHub Pages**

Replace the contents of `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : '/SvelteStrings'
		}
	}
};

export default config;
```

- [ ] **Step 4: Create the root layout with prerender**

Create `src/routes/+layout.ts`:

```typescript
export const prerender = true;
```

- [ ] **Step 5: Add Tailwind CSS v4 via sv**

```bash
npx sv add tailwindcss
```

This installs `tailwindcss`, `@tailwindcss/vite`, and configures `vite.config.ts` and `src/app.css`.

- [ ] **Step 6: Initialize shadcn-svelte**

```bash
npx shadcn-svelte@latest init
```

When prompted:
- Style: **new-york**
- Base color: **zinc**
- Global CSS: `src/app.css`
- Import alias for components: `$lib/components`
- Import alias for utils: `$lib/utils`

- [ ] **Step 7: Add shadcn-svelte components**

```bash
npx shadcn-svelte@latest add button separator tooltip toggle-group badge sidebar
```

- [ ] **Step 8: Install remaining dependencies**

```bash
npm install mode-watcher svelte-sonner svelte-dnd-action lucide-svelte svelte-jsoneditor marked dompurify diff js-md5 @vite-pwa/sveltekit
npm install -D @types/dompurify
```

- [ ] **Step 9: Create static assets**

Create `static/.nojekyll` (empty file).

Create `static/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#18181b"/>
  <text x="16" y="22" font-family="system-ui" font-size="18" font-weight="bold" fill="#a1a1aa" text-anchor="middle">S</text>
</svg>
```

We will generate proper PWA icons (192/512 PNG) in the PWA task. For now, the favicon is sufficient.

- [ ] **Step 10: Verify scaffold works**

```bash
npm run dev
```

Open `http://localhost:5173`. Should see the default SvelteKit page with Tailwind working. Kill the dev server.

- [ ] **Step 11: Commit**

```bash
git init
echo '.superpowers/' >> .gitignore
git add -A
git commit -m "feat: scaffold SvelteKit project with Tailwind v4 and shadcn-svelte"
```

---

## Phase 2: Core Architecture

### Task 2: Color Utilities

**Files:**
- Create: `src/lib/utils/colors.ts`
- Create: `src/lib/utils/__tests__/colors.test.ts`

- [ ] **Step 1: Write failing tests for hexToRgb**

Create `src/lib/utils/__tests__/colors.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { hexToRgb } from '../colors';

describe('hexToRgb', () => {
	it('converts 6-digit hex to rgb string', () => {
		expect(hexToRgb('#8b5cf6')).toBe('139, 92, 246');
	});

	it('converts uppercase hex', () => {
		expect(hexToRgb('#FF0000')).toBe('255, 0, 0');
	});

	it('converts black', () => {
		expect(hexToRgb('#000000')).toBe('0, 0, 0');
	});

	it('converts white', () => {
		expect(hexToRgb('#ffffff')).toBe('255, 255, 255');
	});

	it('handles hex without hash', () => {
		expect(hexToRgb('3b82f6')).toBe('59, 130, 246');
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/utils/__tests__/colors.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement hexToRgb**

Create `src/lib/utils/colors.ts`:

```typescript
export function hexToRgb(hex: string): string {
	const clean = hex.replace('#', '');
	const num = parseInt(clean, 16);
	const r = (num >> 16) & 255;
	const g = (num >> 8) & 255;
	const b = num & 255;
	return `${r}, ${g}, ${b}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/lib/utils/__tests__/colors.test.ts
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/colors.ts src/lib/utils/__tests__/colors.test.ts
git commit -m "feat: add hexToRgb color utility with tests"
```

### Task 3: Clipboard Utility

**Files:**
- Create: `src/lib/utils/clipboard.ts`

- [ ] **Step 1: Create clipboard utility**

Create `src/lib/utils/clipboard.ts`:

```typescript
import { toast } from 'svelte-sonner';

export async function copyToClipboard(text: string, label = 'Copied!'): Promise<void> {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(label);
	} catch {
		toast.error('Failed to copy to clipboard');
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/utils/clipboard.ts
git commit -m "feat: add clipboard utility with toast feedback"
```

### Task 4: Tool Registry

**Files:**
- Create: `src/lib/tools/registry.ts`

- [ ] **Step 1: Create the tool registry**

Create `src/lib/tools/registry.ts`:

```typescript
import type { Component } from 'svelte';
import {
	Braces,
	Binary,
	CaseSensitive,
	Link,
	Hash,
	KeyRound,
	LetterText,
	GitCompare,
	Code,
	Pilcrow,
	FileText
} from 'lucide-svelte';

export interface ToolDefinition {
	id: string;
	name: string;
	description: string;
	icon: Component;
	color: string;
	route: string;
	layout: 'split' | 'single' | 'dual-input';
}

export const tools: ToolDefinition[] = [
	{
		id: 'json-formatter',
		name: 'JSON Formatter',
		description: 'Format, validate & explore JSON',
		icon: Braces,
		color: '#8b5cf6',
		route: '/tools/json-formatter',
		layout: 'single'
	},
	{
		id: 'base64',
		name: 'Base64',
		description: 'Encode & decode Base64 strings',
		icon: Binary,
		color: '#22c55e',
		route: '/tools/base64',
		layout: 'split'
	},
	{
		id: 'case-converter',
		name: 'Case Converter',
		description: 'Transform text between cases',
		icon: CaseSensitive,
		color: '#f59e0b',
		route: '/tools/case-converter',
		layout: 'split'
	},
	{
		id: 'url-encode',
		name: 'URL Encode',
		description: 'Encode & decode URL strings',
		icon: Link,
		color: '#06b6d4',
		route: '/tools/url-encode',
		layout: 'split'
	},
	{
		id: 'hash-generator',
		name: 'Hash Generator',
		description: 'Generate MD5, SHA-1, SHA-256 hashes',
		icon: Hash,
		color: '#a855f7',
		route: '/tools/hash-generator',
		layout: 'split'
	},
	{
		id: 'jwt-decoder',
		name: 'JWT Decoder',
		description: 'Decode and inspect JWT tokens',
		icon: KeyRound,
		color: '#ef4444',
		route: '/tools/jwt-decoder',
		layout: 'split'
	},
	{
		id: 'word-counter',
		name: 'Word Counter',
		description: 'Count words, characters & lines',
		icon: LetterText,
		color: '#3b82f6',
		route: '/tools/word-counter',
		layout: 'split'
	},
	{
		id: 'string-diff',
		name: 'String Diff',
		description: 'Compare two strings side by side',
		icon: GitCompare,
		color: '#f97316',
		route: '/tools/string-diff',
		layout: 'dual-input'
	},
	{
		id: 'html-entities',
		name: 'HTML Entities',
		description: 'Encode & decode HTML entities',
		icon: Code,
		color: '#14b8a6',
		route: '/tools/html-entities',
		layout: 'split'
	},
	{
		id: 'lorem-ipsum',
		name: 'Lorem Ipsum',
		description: 'Generate placeholder text',
		icon: Pilcrow,
		color: '#ec4899',
		route: '/tools/lorem-ipsum',
		layout: 'split'
	},
	{
		id: 'markdown-preview',
		name: 'Markdown Preview',
		description: 'Write markdown, see it rendered',
		icon: FileText,
		color: '#94a3b8',
		route: '/tools/markdown-preview',
		layout: 'split'
	}
];

export const toolMap = new Map(tools.map((t) => [t.id, t]));
export const defaultOrder: string[] = tools.map((t) => t.id);
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/tools/registry.ts
git commit -m "feat: add tool registry with all 11 tool definitions"
```

### Task 5: Card Order Store

**Files:**
- Create: `src/lib/stores/card-order.ts` (pure logic)
- Create: `src/lib/stores/card-order.svelte.ts` (reactive wrapper)
- Create: `src/lib/stores/__tests__/card-order.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/stores/__tests__/card-order.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { loadOrder, validateOrder } from '../card-order';

const defaultOrder = ['a', 'b', 'c', 'd'];

describe('loadOrder', () => {
	it('returns default order when no stored value', () => {
		expect(loadOrder(null, defaultOrder)).toEqual(defaultOrder);
	});

	it('returns default order for invalid JSON', () => {
		expect(loadOrder('not-json', defaultOrder)).toEqual(defaultOrder);
	});

	it('returns stored order when valid', () => {
		const stored = JSON.stringify(['c', 'a', 'b', 'd']);
		expect(loadOrder(stored, defaultOrder)).toEqual(['c', 'a', 'b', 'd']);
	});
});

describe('validateOrder', () => {
	it('strips IDs not in current registry', () => {
		expect(validateOrder(['a', 'removed', 'b', 'c', 'd'], defaultOrder)).toEqual([
			'a',
			'b',
			'c',
			'd'
		]);
	});

	it('appends new tools not in stored order', () => {
		expect(validateOrder(['b', 'a'], ['a', 'b', 'c'])).toEqual(['b', 'a', 'c']);
	});

	it('handles empty stored order', () => {
		expect(validateOrder([], defaultOrder)).toEqual(defaultOrder);
	});

	it('handles stored order with removed and new tools', () => {
		expect(validateOrder(['c', 'removed', 'a'], ['a', 'b', 'c', 'd'])).toEqual([
			'c',
			'a',
			'b',
			'd'
		]);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/stores/__tests__/card-order.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement pure logic**

Create `src/lib/stores/card-order.ts`:

```typescript
export function loadOrder(stored: string | null, defaultOrder: string[]): string[] {
	if (!stored) return defaultOrder;
	try {
		const parsed: string[] = JSON.parse(stored);
		if (!Array.isArray(parsed)) return defaultOrder;
		return validateOrder(parsed, defaultOrder);
	} catch {
		return defaultOrder;
	}
}

export function validateOrder(stored: string[], currentIds: string[]): string[] {
	const currentSet = new Set(currentIds);
	const valid = stored.filter((id) => currentSet.has(id));
	const validSet = new Set(valid);
	for (const id of currentIds) {
		if (!validSet.has(id)) valid.push(id);
	}
	return valid;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/lib/stores/__tests__/card-order.test.ts
```

Expected: all 7 tests PASS.

- [ ] **Step 5: Create reactive wrapper**

Create `src/lib/stores/card-order.svelte.ts`:

```typescript
import { tools, defaultOrder, type ToolDefinition } from '$lib/tools/registry';
import { loadOrder } from './card-order';

const STORAGE_KEY = 'sveltestrings:card-order';

function getStored(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem(STORAGE_KEY);
}

let order = $state<string[]>(loadOrder(getStored(), defaultOrder));

export function getOrderedTools(): ToolDefinition[] {
	const map = new Map(tools.map((t) => [t.id, t]));
	return order.map((id) => map.get(id)!);
}

export function getOrder(): string[] {
	return order;
}

export function setOrder(newOrder: string[]): void {
	order = newOrder;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
}

export function resetOrder(): void {
	order = [...defaultOrder];
	localStorage.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/stores/
git commit -m "feat: add card order store with localStorage persistence and tests"
```

---

## Phase 3: App Shell

### Task 6: Root Layout with Sidebar

**Files:**
- Modify: `src/routes/+layout.svelte`
- Create: `src/lib/components/layout/AppSidebar.svelte`

- [ ] **Step 1: Create AppSidebar component**

Create `src/lib/components/layout/AppSidebar.svelte`:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { tools } from '$lib/tools/registry';
	import { hexToRgb } from '$lib/utils/colors';
	import * as Sidebar from '$lib/components/ui/sidebar';

	let { footer }: { footer?: Snippet } = $props();
	const currentPath = $derived($page.url.pathname);
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<a href="{base}/" class="flex items-center gap-2 px-2 py-1.5">
			<span class="text-lg font-bold tracking-tight">SvelteStrings</span>
		</a>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each tools as tool (tool.id)}
						{@const isActive = currentPath === `${base}${tool.route}`}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								asChild
								isActive={isActive}
								class={isActive ? 'font-medium' : ''}
							>
								{#snippet child({ props })}
									<a
										href="{base}{tool.route}"
										{...props}
										style={isActive
											? `color: ${tool.color}; --sidebar-accent: rgba(${hexToRgb(tool.color)}, 0.1); --sidebar-accent-foreground: ${tool.color};`
											: ''}
									>
										<svelte:component this={tool.icon} class="size-4" />
										<span>{tool.name}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<div class="flex items-center gap-1 px-2">
			{@render footer?.()}
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
```

Note: The `asChild` + `child` snippet pattern is how shadcn-svelte v2 renders custom elements inside menu buttons. The `child` snippet receives forwarded props. If the generated sidebar components use a different API, adjust accordingly.

- [ ] **Step 2: Create the root layout**

Replace `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/layout/AppSidebar.svelte';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster richColors />

<Sidebar.Provider>
	<AppSidebar>
		{#snippet footer()}
			<ThemeToggle />
			<a
				href="https://github.com/user/SvelteStrings"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
					/>
					<path d="M9 18c-4.51 2-5-2-7-2" />
				</svg>
			</a>
		{/snippet}
	</AppSidebar>

	<Sidebar.Inset>
		<main class="flex h-screen flex-col overflow-hidden">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
```

Note: The Sidebar component's snippet API for `footer` uses named slots passed as snippets. If the generated AppSidebar does not support the `footer` snippet, refactor to move the footer content directly into AppSidebar.svelte's `<Sidebar.Footer>` section.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/layout/AppSidebar.svelte src/routes/+layout.svelte
git commit -m "feat: add root layout with collapsible sidebar navigation"
```

### Task 7: Theme Toggle

**Files:**
- Create: `src/lib/components/layout/ThemeToggle.svelte`

- [ ] **Step 1: Create ThemeToggle component**

Create `src/lib/components/layout/ThemeToggle.svelte`:

```svelte
<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon } from 'lucide-svelte';
</script>

<button
	onclick={toggleMode}
	class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
	aria-label="Toggle theme"
>
	<Sun class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
	<Moon
		class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
</button>
```

- [ ] **Step 2: Verify sidebar renders with toggle and GitHub link**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify:
- Sidebar shows all 11 tools
- Theme toggle works (switches between light/dark)
- GitHub icon is visible in sidebar footer
- Sidebar collapses to icon-only mode

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/layout/ThemeToggle.svelte
git commit -m "feat: add theme toggle with light/dark mode support"
```

### Task 8: Home Page with Tool Cards

**Files:**
- Create: `src/lib/components/home/ToolCard.svelte`
- Create: `src/lib/components/home/ToolGrid.svelte`
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Create ToolCard component with gradient glow**

Create `src/lib/components/home/ToolCard.svelte`:

```svelte
<script lang="ts">
	import { base } from '$app/paths';
	import type { ToolDefinition } from '$lib/tools/registry';
	import { hexToRgb } from '$lib/utils/colors';

	let { tool }: { tool: ToolDefinition } = $props();

	const rgb = $derived(hexToRgb(tool.color));
</script>

<a
	href="{base}{tool.route}"
	class="tool-card group relative overflow-hidden rounded-xl border p-6 transition-all duration-200 ease-out"
	style="
		--card-rgb: {rgb};
		--card-color: {tool.color};
		border-color: rgba({rgb}, 0.1);
	"
>
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-300 ease-out group-hover:opacity-[0.18]"
		style="background: radial-gradient(ellipse at top left, rgba({rgb}, 0.6), transparent 70%)"
	></div>

	<div class="relative">
		<svelte:component
			this={tool.icon}
			class="size-8 opacity-80 transition-opacity duration-200 group-hover:opacity-100"
			style="color: {tool.color}"
		/>
		<h3 class="mt-3 font-semibold text-foreground">{tool.name}</h3>
		<p class="mt-1 text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground/70">
			{tool.description}
		</p>
	</div>
</a>

<style>
	.tool-card:hover {
		border-color: rgba(var(--card-rgb), 0.4);
		box-shadow:
			0 0 20px rgba(var(--card-rgb), 0.15),
			0 0 40px rgba(var(--card-rgb), 0.05);
	}
</style>
```

- [ ] **Step 2: Create ToolGrid component (static for now, drag in next task)**

Create `src/lib/components/home/ToolGrid.svelte`:

```svelte
<script lang="ts">
	import { getOrderedTools } from '$lib/stores/card-order.svelte';
	import ToolCard from './ToolCard.svelte';

	const tools = $derived(getOrderedTools());
</script>

<div class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each tools as tool (tool.id)}
		<ToolCard {tool} />
	{/each}
</div>
```

- [ ] **Step 3: Update home page**

Replace `src/routes/+page.svelte`:

```svelte
<script lang="ts">
	import ToolGrid from '$lib/components/home/ToolGrid.svelte';
</script>

<div class="flex-1 overflow-auto">
	<div class="mx-auto max-w-7xl">
		<div class="px-6 pt-6">
			<h1 class="text-2xl font-bold tracking-tight">SvelteStrings</h1>
			<p class="mt-1 text-muted-foreground">Ad-free developer string toolkit</p>
		</div>
		<ToolGrid />
	</div>
</div>
```

- [ ] **Step 4: Verify home page in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify:
- Card grid renders all 11 tools
- Gradient glow appears on hover (subtle at rest, blooms on hover)
- Each card has its accent color
- Cards link to tool routes (404 for now, that's expected)
- Responsive: resize to see 1/2/3/4 column layouts

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/home/ src/routes/+page.svelte
git commit -m "feat: add home page with gradient glow tool cards"
```

### Task 9: Drag-to-Reorder Cards

**Files:**
- Modify: `src/lib/components/home/ToolGrid.svelte`

- [ ] **Step 1: Add drag-and-drop to ToolGrid**

Replace `src/lib/components/home/ToolGrid.svelte`:

```svelte
<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { getOrderedTools, setOrder } from '$lib/stores/card-order.svelte';
	import ToolCard from './ToolCard.svelte';

	let items = $state(getOrderedTools().map((t) => ({ ...t })));
	const flipDurationMs = 200;

	function handleConsider(e: CustomEvent<{ items: typeof items }>) {
		items = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<{ items: typeof items }>) {
		items = e.detail.items;
		setOrder(items.map((i) => i.id));
	}
</script>

<div
	class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	use:dndzone={{ items, flipDurationMs, type: 'tools' }}
	onconsider={handleConsider}
	onfinalize={handleFinalize}
>
	{#each items as tool (tool.id)}
		<ToolCard {tool} />
	{/each}
</div>
```

Note: `svelte-dnd-action` requires items to have an `id` property, which our tools already have. The events are `onconsider` and `onfinalize` (Svelte 5 style without colon). If the library uses `on:consider`/`on:finalize` at your installed version, adjust accordingly.

- [ ] **Step 2: Verify drag-and-drop in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify:
- Cards can be dragged and reordered
- Smooth animation during drag (~200ms flip)
- After reorder, refresh the page: order should persist
- Open DevTools > Application > Local Storage: `sveltestrings:card-order` key present

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/home/ToolGrid.svelte
git commit -m "feat: add drag-to-reorder cards with localStorage persistence"
```

---

## Phase 4: Tool Infrastructure

### Task 10: Shared ToolLayout Component

**Files:**
- Create: `src/lib/components/layout/ToolLayout.svelte`
- Create: `src/lib/components/shared/CopyButton.svelte`
- Create: `src/lib/components/shared/ClearButton.svelte`

- [ ] **Step 1: Create CopyButton**

Create `src/lib/components/shared/CopyButton.svelte`:

```svelte
<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';

	let { text = '' }: { text: string } = $props();
	let copied = $state(false);

	async function handleCopy() {
		if (!text) return;
		await copyToClipboard(text);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<button
	onclick={handleCopy}
	class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
	disabled={!text}
	aria-label="Copy to clipboard"
>
	{#if copied}
		<Check class="size-3.5 text-green-500" />
	{:else}
		<Copy class="size-3.5" />
	{/if}
</button>
```

- [ ] **Step 2: Create ClearButton**

Create `src/lib/components/shared/ClearButton.svelte`:

```svelte
<script lang="ts">
	import { X } from 'lucide-svelte';

	let { onclick, disabled = false }: { onclick: () => void; disabled?: boolean } = $props();
</script>

<button
	{onclick}
	class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
	{disabled}
	aria-label="Clear"
>
	<X class="size-3.5" />
</button>
```

- [ ] **Step 3: Create ToolLayout component**

Create `src/lib/components/layout/ToolLayout.svelte`:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ToolDefinition } from '$lib/tools/registry';
	import { hexToRgb } from '$lib/utils/colors';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import ClearButton from '$lib/components/shared/ClearButton.svelte';

	let {
		tool,
		input,
		output,
		controls,
		secondInput,
		outputText = '',
		onClear,
		onClearSecond
	}: {
		tool: ToolDefinition;
		input: Snippet;
		output?: Snippet;
		controls?: Snippet;
		secondInput?: Snippet;
		outputText?: string;
		onClear?: () => void;
		onClearSecond?: () => void;
	} = $props();

	const rgb = hexToRgb(tool.color);
</script>

<div class="flex h-full flex-col" style="--tool-accent: {tool.color}; --tool-accent-rgb: {rgb};">
	<!-- Slim header -->
	<div class="flex items-center gap-3 border-b px-4 py-2.5">
		<svelte:component this={tool.icon} class="size-5" style="color: {tool.color}" />
		<h1 class="text-sm font-semibold">{tool.name}</h1>
		{#if controls}
			<div class="ml-auto flex items-center gap-2">
				{@render controls()}
			</div>
		{/if}
	</div>

	<!-- Content area -->
	<div class="flex-1 overflow-hidden p-4">
		{#if tool.layout === 'split'}
			<div class="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Input panel -->
				<div class="flex flex-col overflow-hidden rounded-lg border">
					<div class="flex items-center justify-between border-b px-3 py-1.5">
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
							>Input</span
						>
						{#if onClear}
							<ClearButton onclick={onClear} />
						{/if}
					</div>
					<div class="flex-1 overflow-auto p-3">
						{@render input()}
					</div>
				</div>
				<!-- Output panel -->
				<div class="flex flex-col overflow-hidden rounded-lg border">
					<div class="flex items-center justify-between border-b px-3 py-1.5">
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
							>Output</span
						>
						<CopyButton text={outputText} />
					</div>
					<div class="flex-1 overflow-auto p-3">
						{@render output()}
					</div>
				</div>
			</div>
		{:else if tool.layout === 'single'}
			<div class="h-full overflow-hidden rounded-lg border">
				{@render input()}
			</div>
		{:else if tool.layout === 'dual-input'}
			<div class="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex flex-col gap-4">
					<!-- First input -->
					<div class="flex flex-1 flex-col overflow-hidden rounded-lg border">
						<div class="flex items-center justify-between border-b px-3 py-1.5">
							<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
								>Original</span
							>
							{#if onClear}
								<ClearButton onclick={onClear} />
							{/if}
						</div>
						<div class="flex-1 overflow-auto p-3">
							{@render input()}
						</div>
					</div>
					<!-- Second input -->
					{#if secondInput}
						<div class="flex flex-1 flex-col overflow-hidden rounded-lg border">
							<div class="flex items-center justify-between border-b px-3 py-1.5">
								<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
									>Modified</span
								>
								{#if onClearSecond}
									<ClearButton onclick={onClearSecond} />
								{/if}
							</div>
							<div class="flex-1 overflow-auto p-3">
								{@render secondInput()}
							</div>
						</div>
					{/if}
				</div>
				<!-- Output -->
				<div class="flex flex-col overflow-hidden rounded-lg border">
					<div class="flex items-center justify-between border-b px-3 py-1.5">
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
							>Diff</span
						>
						<CopyButton text={outputText} />
					</div>
					<div class="flex-1 overflow-auto p-3">
						{@render output()}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/shared/ src/lib/components/layout/ToolLayout.svelte
git commit -m "feat: add shared ToolLayout with CopyButton and ClearButton"
```

---

## Phase 5: Tools

### Task 11: Base64 Encode/Decode

**Files:**
- Create: `src/lib/tools/base64.ts`
- Create: `src/lib/tools/__tests__/base64.test.ts`
- Create: `src/routes/tools/base64/+page.svelte`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tools/__tests__/base64.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { base64Encode, base64Decode } from '../base64';

describe('base64Encode', () => {
	it('encodes ASCII string', () => {
		expect(base64Encode('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==');
	});

	it('encodes empty string', () => {
		expect(base64Encode('')).toBe('');
	});

	it('encodes UTF-8 characters', () => {
		const encoded = base64Encode('Hello 🌍');
		expect(base64Decode(encoded)).toBe('Hello 🌍');
	});
});

describe('base64Decode', () => {
	it('decodes Base64 string', () => {
		expect(base64Decode('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!');
	});

	it('decodes empty string', () => {
		expect(base64Decode('')).toBe('');
	});

	it('returns error message for invalid Base64', () => {
		expect(base64Decode('not-valid-base64!!!')).toContain('Error');
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/tools/__tests__/base64.test.ts
```

- [ ] **Step 3: Implement Base64 logic**

Create `src/lib/tools/base64.ts`:

```typescript
export function base64Encode(input: string): string {
	if (!input) return '';
	const bytes = new TextEncoder().encode(input);
	const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
	return btoa(binary);
}

export function base64Decode(input: string): string {
	if (!input) return '';
	try {
		const binary = atob(input);
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	} catch {
		return 'Error: Invalid Base64 string';
	}
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/lib/tools/__tests__/base64.test.ts
```

- [ ] **Step 5: Create the tool page**

Create `src/routes/tools/base64/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { base64Encode, base64Decode } from '$lib/tools/base64';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	const tool = toolMap.get('base64')!;
	let inputText = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	const outputText = $derived(mode === 'encode' ? base64Encode(inputText) : base64Decode(inputText));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet controls()}
		<ToggleGroup.Root type="single" value={mode} onValueChange={(v) => v && (mode = v)}>
			<ToggleGroup.Item value="encode" class="text-xs">Encode</ToggleGroup.Item>
			<ToggleGroup.Item value="decode" class="text-xs">Decode</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 to decode...'}
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<pre class="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
	{/snippet}
</ToolLayout>
```

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

Navigate to the Base64 tool via sidebar or card click. Verify:
- Encode/Decode toggle works
- Typing input shows live output
- Copy button copies output
- Clear button clears input
- UTF-8 characters round-trip correctly

- [ ] **Step 7: Commit**

```bash
git add src/lib/tools/base64.ts src/lib/tools/__tests__/base64.test.ts src/routes/tools/base64/
git commit -m "feat: add Base64 encode/decode tool with tests"
```

### Task 12: URL Encode/Decode

**Files:**
- Create: `src/lib/tools/url-encode.ts`
- Create: `src/lib/tools/__tests__/url-encode.test.ts`
- Create: `src/routes/tools/url-encode/+page.svelte`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tools/__tests__/url-encode.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { urlEncode, urlDecode } from '../url-encode';

describe('urlEncode', () => {
	it('encodes special characters', () => {
		expect(urlEncode('hello world&foo=bar')).toBe('hello%20world%26foo%3Dbar');
	});

	it('encodes empty string', () => {
		expect(urlEncode('')).toBe('');
	});

	it('preserves unreserved characters', () => {
		expect(urlEncode('hello-world_test.123~')).toBe('hello-world_test.123~');
	});
});

describe('urlDecode', () => {
	it('decodes percent-encoded string', () => {
		expect(urlDecode('hello%20world%26foo%3Dbar')).toBe('hello world&foo=bar');
	});

	it('decodes empty string', () => {
		expect(urlDecode('')).toBe('');
	});

	it('returns error for malformed input', () => {
		expect(urlDecode('%ZZ')).toContain('Error');
	});
});
```

- [ ] **Step 2: Implement URL encode logic**

Create `src/lib/tools/url-encode.ts`:

```typescript
export function urlEncode(input: string): string {
	if (!input) return '';
	return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
	if (!input) return '';
	try {
		return decodeURIComponent(input);
	} catch {
		return 'Error: Invalid URL-encoded string';
	}
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/tools/__tests__/url-encode.test.ts
```

Expected: all PASS.

- [ ] **Step 4: Create tool page**

Create `src/routes/tools/url-encode/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { urlEncode, urlDecode } from '$lib/tools/url-encode';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	const tool = toolMap.get('url-encode')!;
	let inputText = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	const outputText = $derived(mode === 'encode' ? urlEncode(inputText) : urlDecode(inputText));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet controls()}
		<ToggleGroup.Root type="single" value={mode} onValueChange={(v) => v && (mode = v)}>
			<ToggleGroup.Item value="encode" class="text-xs">Encode</ToggleGroup.Item>
			<ToggleGroup.Item value="decode" class="text-xs">Decode</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder={mode === 'encode' ? 'Text to encode...' : 'URL-encoded text to decode...'}
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<pre class="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
	{/snippet}
</ToolLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/url-encode.ts src/lib/tools/__tests__/url-encode.test.ts src/routes/tools/url-encode/
git commit -m "feat: add URL encode/decode tool with tests"
```

### Task 13: HTML Entity Encode/Decode

**Files:**
- Create: `src/lib/tools/html-entities.ts`
- Create: `src/lib/tools/__tests__/html-entities.test.ts`
- Create: `src/routes/tools/html-entities/+page.svelte`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tools/__tests__/html-entities.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { htmlEncode, htmlDecode } from '../html-entities';

describe('htmlEncode', () => {
	it('encodes basic HTML characters', () => {
		expect(htmlEncode('<div class="test">&</div>')).toBe(
			'&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;'
		);
	});

	it('encodes empty string', () => {
		expect(htmlEncode('')).toBe('');
	});

	it('encodes single quotes', () => {
		expect(htmlEncode("it's")).toBe('it&#39;s');
	});

	it('leaves normal text unchanged', () => {
		expect(htmlEncode('Hello World')).toBe('Hello World');
	});
});

describe('htmlDecode', () => {
	it('decodes named entities', () => {
		expect(htmlDecode('&lt;div&gt;&amp;&lt;/div&gt;')).toBe('<div>&</div>');
	});

	it('decodes numeric entities', () => {
		expect(htmlDecode('&#60;&#62;')).toBe('<>');
	});

	it('decodes hex entities', () => {
		expect(htmlDecode('&#x3C;&#x3E;')).toBe('<>');
	});

	it('decodes empty string', () => {
		expect(htmlDecode('')).toBe('');
	});
});
```

- [ ] **Step 2: Implement HTML entities logic**

Create `src/lib/tools/html-entities.ts`:

```typescript
const ENCODE_MAP: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

const DECODE_MAP: Record<string, string> = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': "'",
	'&apos;': "'"
};

export function htmlEncode(input: string): string {
	if (!input) return '';
	return input.replace(/[&<>"']/g, (ch) => ENCODE_MAP[ch] ?? ch);
}

export function htmlDecode(input: string): string {
	if (!input) return '';
	return input
		.replace(/&(?:#x([0-9a-fA-F]+)|#(\d+)|(\w+));/g, (match, hex, dec, named) => {
			if (hex) return String.fromCharCode(parseInt(hex, 16));
			if (dec) return String.fromCharCode(parseInt(dec, 10));
			const namedEntity = `&${named};`;
			return DECODE_MAP[namedEntity] ?? match;
		});
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/tools/__tests__/html-entities.test.ts
```

Expected: all PASS.

- [ ] **Step 4: Create tool page**

Create `src/routes/tools/html-entities/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { htmlEncode, htmlDecode } from '$lib/tools/html-entities';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	const tool = toolMap.get('html-entities')!;
	let inputText = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	const outputText = $derived(mode === 'encode' ? htmlEncode(inputText) : htmlDecode(inputText));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet controls()}
		<ToggleGroup.Root type="single" value={mode} onValueChange={(v) => v && (mode = v)}>
			<ToggleGroup.Item value="encode" class="text-xs">Encode</ToggleGroup.Item>
			<ToggleGroup.Item value="decode" class="text-xs">Decode</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder={mode === 'encode' ? 'HTML to encode...' : 'Entities to decode...'}
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<pre class="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
	{/snippet}
</ToolLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/html-entities.ts src/lib/tools/__tests__/html-entities.test.ts src/routes/tools/html-entities/
git commit -m "feat: add HTML entity encode/decode tool with tests"
```

### Task 14: Case Converter

**Files:**
- Create: `src/lib/tools/case-converter.ts`
- Create: `src/lib/tools/__tests__/case-converter.test.ts`
- Create: `src/routes/tools/case-converter/+page.svelte`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tools/__tests__/case-converter.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { convertCase, type CaseType } from '../case-converter';

describe('convertCase', () => {
	const input = 'hello world example';

	it('converts to camelCase', () => {
		expect(convertCase(input, 'camel')).toBe('helloWorldExample');
	});

	it('converts to PascalCase', () => {
		expect(convertCase(input, 'pascal')).toBe('HelloWorldExample');
	});

	it('converts to snake_case', () => {
		expect(convertCase(input, 'snake')).toBe('hello_world_example');
	});

	it('converts to kebab-case', () => {
		expect(convertCase(input, 'kebab')).toBe('hello-world-example');
	});

	it('converts to SCREAMING_SNAKE_CASE', () => {
		expect(convertCase(input, 'screaming')).toBe('HELLO_WORLD_EXAMPLE');
	});

	it('handles camelCase input', () => {
		expect(convertCase('helloWorldExample', 'snake')).toBe('hello_world_example');
	});

	it('handles PascalCase input', () => {
		expect(convertCase('HelloWorldExample', 'kebab')).toBe('hello-world-example');
	});

	it('handles snake_case input', () => {
		expect(convertCase('hello_world_example', 'camel')).toBe('helloWorldExample');
	});

	it('handles empty string', () => {
		expect(convertCase('', 'camel')).toBe('');
	});
});
```

- [ ] **Step 2: Implement case converter logic**

Create `src/lib/tools/case-converter.ts`:

```typescript
export type CaseType = 'camel' | 'pascal' | 'snake' | 'kebab' | 'screaming';

export const caseTypes: { value: CaseType; label: string }[] = [
	{ value: 'camel', label: 'camelCase' },
	{ value: 'pascal', label: 'PascalCase' },
	{ value: 'snake', label: 'snake_case' },
	{ value: 'kebab', label: 'kebab-case' },
	{ value: 'screaming', label: 'SCREAMING_SNAKE' }
];

function tokenize(input: string): string[] {
	return input
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.replace(/[_\-\s]+/g, ' ')
		.trim()
		.toLowerCase()
		.split(' ')
		.filter(Boolean);
}

export function convertCase(input: string, target: CaseType): string {
	if (!input) return '';
	const words = tokenize(input);
	if (words.length === 0) return '';

	switch (target) {
		case 'camel':
			return words[0] + words.slice(1).map(capitalize).join('');
		case 'pascal':
			return words.map(capitalize).join('');
		case 'snake':
			return words.join('_');
		case 'kebab':
			return words.join('-');
		case 'screaming':
			return words.join('_').toUpperCase();
	}
}

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/tools/__tests__/case-converter.test.ts
```

Expected: all PASS.

- [ ] **Step 4: Create tool page**

Create `src/routes/tools/case-converter/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { convertCase, caseTypes, type CaseType } from '$lib/tools/case-converter';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	const tool = toolMap.get('case-converter')!;
	let inputText = $state('');
	let targetCase = $state<CaseType>('camel');
	const outputText = $derived(convertCase(inputText, targetCase));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet controls()}
		<ToggleGroup.Root
			type="single"
			value={targetCase}
			onValueChange={(v) => v && (targetCase = v)}
		>
			{#each caseTypes as ct (ct.value)}
				<ToggleGroup.Item value={ct.value} class="text-xs">{ct.label}</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	{/snippet}
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Text to convert..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<pre class="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
	{/snippet}
</ToolLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/case-converter.ts src/lib/tools/__tests__/case-converter.test.ts src/routes/tools/case-converter/
git commit -m "feat: add case converter tool with 5 case types and tests"
```

### Task 15: Word/Character Counter

**Files:**
- Create: `src/lib/tools/word-counter.ts`
- Create: `src/lib/tools/__tests__/word-counter.test.ts`
- Create: `src/routes/tools/word-counter/+page.svelte`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tools/__tests__/word-counter.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { countStats, type TextStats } from '../word-counter';

describe('countStats', () => {
	it('counts basic text', () => {
		const stats = countStats('Hello world');
		expect(stats.words).toBe(2);
		expect(stats.characters).toBe(11);
		expect(stats.charactersNoSpaces).toBe(10);
		expect(stats.lines).toBe(1);
	});

	it('counts sentences', () => {
		const stats = countStats('Hello world. How are you? Fine!');
		expect(stats.sentences).toBe(3);
	});

	it('counts paragraphs', () => {
		const stats = countStats('First paragraph.\n\nSecond paragraph.\n\nThird.');
		expect(stats.paragraphs).toBe(3);
	});

	it('counts multiline text', () => {
		const stats = countStats('Line one\nLine two\nLine three');
		expect(stats.lines).toBe(3);
		expect(stats.words).toBe(6);
	});

	it('handles empty string', () => {
		const stats = countStats('');
		expect(stats.words).toBe(0);
		expect(stats.characters).toBe(0);
		expect(stats.lines).toBe(0);
		expect(stats.sentences).toBe(0);
		expect(stats.paragraphs).toBe(0);
	});

	it('handles whitespace only', () => {
		const stats = countStats('   \n\n   ');
		expect(stats.words).toBe(0);
	});
});
```

- [ ] **Step 2: Implement word counter logic**

Create `src/lib/tools/word-counter.ts`:

```typescript
export interface TextStats {
	words: number;
	characters: number;
	charactersNoSpaces: number;
	lines: number;
	sentences: number;
	paragraphs: number;
}

export function countStats(input: string): TextStats {
	if (!input.trim()) {
		return { words: 0, characters: 0, charactersNoSpaces: 0, lines: 0, sentences: 0, paragraphs: 0 };
	}

	const words = input.trim().split(/\s+/).filter(Boolean).length;
	const characters = input.length;
	const charactersNoSpaces = input.replace(/\s/g, '').length;
	const lines = input.split('\n').length;
	const sentences = input.split(/[.!?]+/).filter((s) => s.trim()).length;
	const paragraphs = input.split(/\n\s*\n/).filter((p) => p.trim()).length;

	return { words, characters, charactersNoSpaces, lines, sentences, paragraphs };
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/tools/__tests__/word-counter.test.ts
```

Expected: all PASS.

- [ ] **Step 4: Create tool page**

Create `src/routes/tools/word-counter/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { countStats } from '$lib/tools/word-counter';

	const tool = toolMap.get('word-counter')!;
	let inputText = $state('');
	const stats = $derived(countStats(inputText));

	const statItems = $derived([
		{ label: 'Words', value: stats.words },
		{ label: 'Characters', value: stats.characters },
		{ label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
		{ label: 'Lines', value: stats.lines },
		{ label: 'Sentences', value: stats.sentences },
		{ label: 'Paragraphs', value: stats.paragraphs }
	]);

	const outputText = $derived(statItems.map((s) => `${s.label}: ${s.value}`).join('\n'));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Paste or type text to analyze..."
			class="h-full w-full resize-none bg-transparent text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<div class="grid gap-3">
			{#each statItems as stat (stat.label)}
				<div class="flex items-center justify-between rounded-md border px-4 py-3">
					<span class="text-sm text-muted-foreground">{stat.label}</span>
					<span class="text-2xl font-bold tabular-nums" style="color: var(--tool-accent)">
						{stat.value}
					</span>
				</div>
			{/each}
		</div>
	{/snippet}
</ToolLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/word-counter.ts src/lib/tools/__tests__/word-counter.test.ts src/routes/tools/word-counter/
git commit -m "feat: add word/character counter tool with tests"
```

### Task 16: Lorem Ipsum Generator

**Files:**
- Create: `src/lib/tools/lorem-ipsum.ts`
- Create: `src/lib/tools/__tests__/lorem-ipsum.test.ts`
- Create: `src/routes/tools/lorem-ipsum/+page.svelte`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tools/__tests__/lorem-ipsum.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { generateLorem } from '../lorem-ipsum';

describe('generateLorem', () => {
	it('generates requested number of paragraphs', () => {
		const result = generateLorem({ paragraphs: 3 });
		expect(result.split('\n\n').length).toBe(3);
	});

	it('starts with "Lorem ipsum" when option enabled', () => {
		const result = generateLorem({ paragraphs: 1, startWithLorem: true });
		expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
	});

	it('does not start with "Lorem ipsum" when disabled', () => {
		const result = generateLorem({ paragraphs: 1, startWithLorem: false });
		expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(false);
	});

	it('wraps in <p> tags when option enabled', () => {
		const result = generateLorem({ paragraphs: 2, htmlTags: true });
		expect(result).toContain('<p>');
		expect(result).toContain('</p>');
	});

	it('generates at least some text', () => {
		const result = generateLorem({ paragraphs: 1 });
		expect(result.length).toBeGreaterThan(50);
	});
});
```

- [ ] **Step 2: Implement Lorem Ipsum logic**

Create `src/lib/tools/lorem-ipsum.ts`:

```typescript
const WORDS = [
	'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
	'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
	'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
	'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
	'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
	'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
	'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
	'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'vitae', 'autem',
	'vel', 'eum', 'fugit', 'quo', 'voluptas', 'aspernatur', 'aut', 'odit',
	'fugiat', 'nihil', 'molestiae', 'consequatur', 'illum', 'dolorem', 'quia'
];

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

export interface LoremOptions {
	paragraphs: number;
	startWithLorem?: boolean;
	htmlTags?: boolean;
}

function randomWord(): string {
	return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(wordCount?: number): string {
	const count = wordCount ?? (5 + Math.floor(Math.random() * 10));
	const words = Array.from({ length: count }, randomWord);
	words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
	return words.join(' ') + '.';
}

function generateParagraph(): string {
	const sentenceCount = 3 + Math.floor(Math.random() * 4);
	return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
}

export function generateLorem(options: LoremOptions): string {
	const { paragraphs, startWithLorem = true, htmlTags = false } = options;

	const paras: string[] = [];
	for (let i = 0; i < paragraphs; i++) {
		if (i === 0 && startWithLorem) {
			const rest = generateParagraph();
			paras.push(LOREM_START + '. ' + rest);
		} else {
			paras.push(generateParagraph());
		}
	}

	if (htmlTags) {
		return paras.map((p) => `<p>${p}</p>`).join('\n\n');
	}
	return paras.join('\n\n');
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/tools/__tests__/lorem-ipsum.test.ts
```

Expected: all PASS.

- [ ] **Step 4: Create tool page**

Create `src/routes/tools/lorem-ipsum/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { generateLorem } from '$lib/tools/lorem-ipsum';
	import { Button } from '$lib/components/ui/button';

	const tool = toolMap.get('lorem-ipsum')!;
	let paragraphs = $state(3);
	let startWithLorem = $state(true);
	let htmlTags = $state(false);
	let outputText = $state(generateLorem({ paragraphs, startWithLorem, htmlTags }));

	function regenerate() {
		outputText = generateLorem({ paragraphs, startWithLorem, htmlTags });
	}
</script>

<ToolLayout {tool} {outputText} onClear={() => (outputText = '')}>
	{#snippet controls()}
		<Button variant="outline" size="sm" class="text-xs" onclick={regenerate}>Generate</Button>
	{/snippet}
	{#snippet input()}
		<div class="grid gap-4">
			<div class="flex items-center gap-3">
				<label for="para-count" class="text-sm text-muted-foreground">Paragraphs</label>
				<input
					id="para-count"
					type="number"
					min="1"
					max="50"
					bind:value={paragraphs}
					class="w-20 rounded-md border bg-transparent px-2 py-1 text-sm"
				/>
			</div>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" bind:checked={startWithLorem} class="rounded" />
				Start with "Lorem ipsum..."
			</label>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" bind:checked={htmlTags} class="rounded" />
				Wrap in &lt;p&gt; tags
			</label>
		</div>
	{/snippet}
	{#snippet output()}
		<pre class="whitespace-pre-wrap text-sm">{outputText}</pre>
	{/snippet}
</ToolLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/lorem-ipsum.ts src/lib/tools/__tests__/lorem-ipsum.test.ts src/routes/tools/lorem-ipsum/
git commit -m "feat: add lorem ipsum generator tool with tests"
```

### Task 17: Hash Generator

**Files:**
- Create: `src/lib/tools/hash-generator.ts`
- Create: `src/lib/tools/__tests__/hash-generator.test.ts`
- Create: `src/routes/tools/hash-generator/+page.svelte`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tools/__tests__/hash-generator.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { generateHash } from '../hash-generator';

describe('generateHash', () => {
	it('generates MD5 hash', async () => {
		const hash = await generateHash('hello', 'md5');
		expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
	});

	it('generates SHA-1 hash', async () => {
		const hash = await generateHash('hello', 'sha1');
		expect(hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
	});

	it('generates SHA-256 hash', async () => {
		const hash = await generateHash('hello', 'sha256');
		expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
	});

	it('handles empty string', async () => {
		const hash = await generateHash('', 'sha256');
		expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
	});
});
```

- [ ] **Step 2: Implement hash generator logic**

Create `src/lib/tools/hash-generator.ts`:

```typescript
import md5 from 'js-md5';

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256';

export const algorithms: { value: HashAlgorithm; label: string; warning?: string }[] = [
	{ value: 'md5', label: 'MD5', warning: 'Not cryptographically secure' },
	{ value: 'sha1', label: 'SHA-1' },
	{ value: 'sha256', label: 'SHA-256' }
];

async function webCryptoHash(input: string, algorithm: string): Promise<string> {
	const data = new TextEncoder().encode(input);
	const hashBuffer = await crypto.subtle.digest(algorithm, data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function generateHash(input: string, algorithm: HashAlgorithm): Promise<string> {
	switch (algorithm) {
		case 'md5':
			return md5(input);
		case 'sha1':
			return webCryptoHash(input, 'SHA-1');
		case 'sha256':
			return webCryptoHash(input, 'SHA-256');
	}
}

export async function generateAllHashes(
	input: string
): Promise<{ algorithm: HashAlgorithm; label: string; hash: string; warning?: string }[]> {
	return Promise.all(
		algorithms.map(async (a) => ({
			algorithm: a.value,
			label: a.label,
			hash: await generateHash(input, a.value),
			warning: a.warning
		}))
	);
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/tools/__tests__/hash-generator.test.ts
```

Expected: all PASS. Note: `crypto.subtle` is available in Node.js 18+ and in vitest's environment.

- [ ] **Step 4: Create tool page**

Create `src/routes/tools/hash-generator/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { generateAllHashes } from '$lib/tools/hash-generator';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { Badge } from '$lib/components/ui/badge';

	const tool = toolMap.get('hash-generator')!;
	let inputText = $state('');
	let hashes = $state<{ algorithm: string; label: string; hash: string; warning?: string }[]>([]);

	$effect(() => {
		generateAllHashes(inputText).then((results) => {
			hashes = results;
		});
	});

	const outputText = $derived(hashes.map((h) => `${h.label}: ${h.hash}`).join('\n'));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Text to hash..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<div class="grid gap-3">
			{#each hashes as item (item.algorithm)}
				<div class="rounded-md border px-4 py-3">
					<div class="mb-1 flex items-center gap-2">
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							{item.label}
						</span>
						{#if item.warning}
							<Badge variant="outline" class="text-[10px] text-yellow-500 border-yellow-500/30">
								{item.warning}
							</Badge>
						{/if}
						<div class="ml-auto">
							<CopyButton text={item.hash} />
						</div>
					</div>
					<pre class="break-all font-mono text-sm">{item.hash}</pre>
				</div>
			{/each}
		</div>
	{/snippet}
</ToolLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/hash-generator.ts src/lib/tools/__tests__/hash-generator.test.ts src/routes/tools/hash-generator/
git commit -m "feat: add hash generator tool (MD5, SHA-1, SHA-256) with tests"
```

### Task 18: JWT Decoder

**Files:**
- Create: `src/lib/tools/jwt-decoder.ts`
- Create: `src/lib/tools/__tests__/jwt-decoder.test.ts`
- Create: `src/routes/tools/jwt-decoder/+page.svelte`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tools/__tests__/jwt-decoder.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { decodeJwt } from '../jwt-decoder';

const VALID_JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJwt', () => {
	it('decodes a valid JWT', () => {
		const result = decodeJwt(VALID_JWT);
		expect(result.valid).toBe(true);
		expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' });
		expect(result.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 });
	});

	it('returns invalid for garbage input', () => {
		const result = decodeJwt('not-a-jwt');
		expect(result.valid).toBe(false);
		expect(result.error).toBeDefined();
	});

	it('returns invalid for empty string', () => {
		const result = decodeJwt('');
		expect(result.valid).toBe(false);
	});

	it('detects expired tokens', () => {
		const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 3600 }));
		const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.sig`;
		const result = decodeJwt(token);
		expect(result.expired).toBe(true);
	});

	it('detects non-expired tokens', () => {
		const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
		const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.sig`;
		const result = decodeJwt(token);
		expect(result.expired).toBe(false);
	});
});
```

- [ ] **Step 2: Implement JWT decoder logic**

Create `src/lib/tools/jwt-decoder.ts`:

```typescript
export interface JwtResult {
	valid: boolean;
	header?: Record<string, unknown>;
	payload?: Record<string, unknown>;
	expired?: boolean;
	error?: string;
}

function base64UrlDecode(str: string): string {
	const padded = str.replace(/-/g, '+').replace(/_/g, '/');
	const pad = padded.length % 4;
	const final = pad ? padded + '='.repeat(4 - pad) : padded;
	return atob(final);
}

export function decodeJwt(token: string): JwtResult {
	if (!token.trim()) {
		return { valid: false, error: 'Empty token' };
	}

	const parts = token.trim().split('.');
	if (parts.length !== 3) {
		return { valid: false, error: 'JWT must have 3 parts separated by dots' };
	}

	try {
		const header = JSON.parse(base64UrlDecode(parts[0]));
		const payload = JSON.parse(base64UrlDecode(parts[1]));

		let expired: boolean | undefined;
		if (typeof payload.exp === 'number') {
			expired = payload.exp < Math.floor(Date.now() / 1000);
		}

		return { valid: true, header, payload, expired };
	} catch {
		return { valid: false, error: 'Failed to decode token' };
	}
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/tools/__tests__/jwt-decoder.test.ts
```

Expected: all PASS.

- [ ] **Step 4: Create tool page**

Create `src/routes/tools/jwt-decoder/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { decodeJwt } from '$lib/tools/jwt-decoder';
	import { Badge } from '$lib/components/ui/badge';

	const tool = toolMap.get('jwt-decoder')!;
	let inputText = $state('');
	const result = $derived(decodeJwt(inputText));
	const outputText = $derived(
		result.valid
			? JSON.stringify({ header: result.header, payload: result.payload }, null, 2)
			: result.error ?? ''
	);
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet controls()}
		{#if inputText.trim()}
			{#if result.valid}
				<Badge variant="outline" class="text-green-500 border-green-500/30">Valid</Badge>
				{#if result.expired === true}
					<Badge variant="outline" class="text-red-500 border-red-500/30">Expired</Badge>
				{:else if result.expired === false}
					<Badge variant="outline" class="text-green-500 border-green-500/30">Active</Badge>
				{/if}
			{:else}
				<Badge variant="outline" class="text-red-500 border-red-500/30">Invalid</Badge>
			{/if}
		{/if}
	{/snippet}
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Paste a JWT token..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		{#if result.valid}
			<div class="grid gap-4">
				<div>
					<h3 class="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Header
					</h3>
					<pre class="rounded-md bg-muted/50 p-3 font-mono text-sm">{JSON.stringify(result.header, null, 2)}</pre>
				</div>
				<div>
					<h3 class="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Payload
					</h3>
					<pre class="rounded-md bg-muted/50 p-3 font-mono text-sm">{JSON.stringify(result.payload, null, 2)}</pre>
				</div>
			</div>
		{:else if result.error}
			<p class="text-sm text-destructive">{result.error}</p>
		{/if}
	{/snippet}
</ToolLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/jwt-decoder.ts src/lib/tools/__tests__/jwt-decoder.test.ts src/routes/tools/jwt-decoder/
git commit -m "feat: add JWT decoder tool with expiration detection and tests"
```

### Task 19: String Diff Viewer

**Files:**
- Create: `src/routes/tools/string-diff/+page.svelte`

- [ ] **Step 1: Create tool page**

Create `src/routes/tools/string-diff/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { diffLines, type Change } from 'diff';

	const tool = toolMap.get('string-diff')!;
	let originalText = $state('');
	let modifiedText = $state('');
	const changes = $derived<Change[]>(diffLines(originalText, modifiedText));
	const outputText = $derived(
		changes.map((c) => {
			const prefix = c.added ? '+ ' : c.removed ? '- ' : '  ';
			return c.value
				.split('\n')
				.filter((l) => l !== '')
				.map((l) => prefix + l)
				.join('\n');
		}).join('\n')
	);
</script>

<ToolLayout
	{tool}
	{outputText}
	onClear={() => (originalText = '')}
	onClearSecond={() => (modifiedText = '')}
>
	{#snippet input()}
		<textarea
			bind:value={originalText}
			placeholder="Original text..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet secondInput()}
		<textarea
			bind:value={modifiedText}
			placeholder="Modified text..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<div class="font-mono text-sm">
			{#each changes as change}
				{#each change.value.split('\n').filter((l) => l !== '') as line}
					<div
						class="px-2 py-0.5"
						class:bg-green-500/10={change.added}
						class:text-green-400={change.added}
						class:bg-red-500/10={change.removed}
						class:text-red-400={change.removed}
						class:text-muted-foreground={!change.added && !change.removed}
					>
						<span class="mr-2 select-none opacity-50">
							{change.added ? '+' : change.removed ? '-' : ' '}
						</span>{line}
					</div>
				{/each}
			{/each}
		</div>
	{/snippet}
</ToolLayout>
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Navigate to String Diff. Paste different text in both panels. Verify:
- Added lines highlighted green
- Removed lines highlighted red
- Unchanged lines shown dim
- Copy button copies unified diff format

- [ ] **Step 3: Commit**

```bash
git add src/routes/tools/string-diff/
git commit -m "feat: add string diff viewer tool"
```

### Task 20: Markdown Preview

**Files:**
- Create: `src/routes/tools/markdown-preview/+page.svelte`

- [ ] **Step 1: Create tool page**

Create `src/routes/tools/markdown-preview/+page.svelte`:

```svelte
<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	const tool = toolMap.get('markdown-preview')!;

	const DEFAULT_MARKDOWN = `# Hello World

This is a **markdown** preview tool.

- Item one
- Item two
- Item three

\`\`\`javascript
console.log('Hello!');
\`\`\`
`;

	let inputText = $state(DEFAULT_MARKDOWN);
	const outputText = $derived(inputText);
	const renderedHtml = $derived(DOMPurify.sanitize(marked.parse(inputText) as string));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Write markdown..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<div class="prose prose-sm dark:prose-invert max-w-none">
			{@html renderedHtml}
		</div>
	{/snippet}
</ToolLayout>
```

Note: `@tailwindcss/typography` is needed for the `prose` class. Install it if not already present:

```bash
npm install -D @tailwindcss/typography
```

Add to `src/app.css` (after the tailwindcss import):

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Navigate to Markdown Preview. Verify:
- Default markdown renders correctly
- Headings, bold, lists, code blocks render
- Editing updates preview in real-time
- HTML is sanitized (try `<script>alert('xss')</script>` - should not execute)

- [ ] **Step 3: Commit**

```bash
git add src/routes/tools/markdown-preview/ src/app.css package*.json
git commit -m "feat: add markdown preview tool with sanitized rendering"
```

### Task 21: JSON Formatter

**Files:**
- Create: `src/routes/tools/json-formatter/+page.svelte`
- Create: `src/routes/tools/json-formatter/json-editor.css`

- [ ] **Step 1: Create JSON editor CSS overrides**

Create `src/routes/tools/json-formatter/json-editor.css`:

```css
.json-editor-wrapper :global(.jse-main) {
	--jse-background-color: hsl(var(--background));
	--jse-text-color: hsl(var(--foreground));
	--jse-panel-background: hsl(var(--card));
	--jse-panel-border: hsl(var(--border));
	--jse-delimiter-color: hsl(var(--muted-foreground));
	--jse-key-color: var(--tool-accent);
	--jse-value-color-string: hsl(var(--foreground));
	--jse-value-color-number: #22c55e;
	--jse-value-color-boolean: #f59e0b;
	--jse-value-color-null: hsl(var(--muted-foreground));
	--jse-menu-color: hsl(var(--foreground));
	--jse-context-menu-background: hsl(var(--popover));
	--jse-context-menu-color: hsl(var(--popover-foreground));
	--jse-selection-background-color: rgba(var(--tool-accent-rgb), 0.15);
	--jse-input-background: hsl(var(--input));
	--jse-input-border: hsl(var(--border));
	--jse-button-primary-background: var(--tool-accent);
	--jse-tag-background: rgba(var(--tool-accent-rgb), 0.1);
	--jse-tag-color: var(--tool-accent);
	border: none;
	height: 100%;
}

.json-editor-wrapper :global(.jse-main .jse-menu) {
	border-bottom: 1px solid hsl(var(--border));
}

.json-editor-wrapper {
	height: 100%;
	display: flex;
	flex-direction: column;
}
```

- [ ] **Step 2: Create tool page**

Create `src/routes/tools/json-formatter/+page.svelte`:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import './json-editor.css';

	const tool = toolMap.get('json-formatter')!;

	let JSONEditor: typeof import('svelte-jsoneditor').JSONEditor;
	let content = $state<{ json?: unknown; text?: string }>({
		text: '{\n  "hello": "world",\n  "number": 42,\n  "array": [1, 2, 3]\n}'
	});

	onMount(async () => {
		const mod = await import('svelte-jsoneditor');
		JSONEditor = mod.JSONEditor;
	});
</script>

<ToolLayout {tool}>
	{#snippet input()}
		<div class="json-editor-wrapper">
			{#if JSONEditor}
				<svelte:component this={JSONEditor} bind:content />
			{:else}
				<div class="flex h-full items-center justify-center text-muted-foreground">
					Loading editor...
				</div>
			{/if}
		</div>
	{/snippet}
</ToolLayout>
```

Note: The JSON editor is dynamically imported (`onMount` + dynamic `import()`) to avoid SSR issues since `svelte-jsoneditor` uses browser APIs. The `single` layout variant in ToolLayout renders only the input snippet as a full-width panel.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Navigate to JSON Formatter. Verify:
- Editor loads and displays JSON
- Tree mode, text mode, and table mode work
- Colors match shadcn theme (not the default jsoneditor theme)
- Dark mode: switch theme, verify editor adapts
- Format/validate/search work

- [ ] **Step 4: Commit**

```bash
git add src/routes/tools/json-formatter/
git commit -m "feat: add JSON formatter tool with themed svelte-jsoneditor"
```

---

## Phase 6: PWA & Deployment

### Task 22: PWA Configuration

**Files:**
- Modify: `vite.config.ts`
- Create: `static/icon-192.png` (placeholder)
- Create: `static/icon-512.png` (placeholder)

- [ ] **Step 1: Update vite.config.ts with PWA plugin**

Add the PWA plugin to `vite.config.ts`. The file already has `sveltekit()` and `tailwindcss()` plugins from the scaffold. Add `SvelteKitPWA()`:

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'SvelteStrings',
				short_name: 'SvelteStrings',
				description: 'Ad-free developer string toolkit',
				theme_color: '#09090b',
				background_color: '#09090b',
				display: 'standalone',
				scope: '/SvelteStrings/',
				start_url: '/SvelteStrings/',
				icons: [
					{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}']
			}
		})
	]
});
```

- [ ] **Step 2: Create placeholder PWA icons**

Generate simple placeholder icons. These can be replaced with proper designed icons later.

Create a simple SVG and convert it, or create minimal PNG placeholders:

```bash
# Create placeholder PNGs using the favicon SVG
# If ImageMagick/rsvg is not available, create 1x1 PNGs as placeholders
# and replace with proper icons later
cp static/favicon.svg static/icon-source.svg
```

For now, create basic placeholder files. The PWA will work without proper icons for development; proper icons should be created before production deployment.

- [ ] **Step 3: Verify PWA works**

```bash
npm run build
npx serve build
```

Open `http://localhost:3000/SvelteStrings/`. Verify:
- App loads correctly from the built output
- Check DevTools > Application > Manifest: manifest loads
- Check DevTools > Application > Service Workers: SW registered
- Test offline: enable offline in DevTools Network tab, reload. App should still work.

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts static/
git commit -m "feat: add PWA configuration with offline support"
```

### Task 23: GitHub Actions Deploy Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deploy workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Pages deployment workflow"
```

---

## Phase 7: Final Verification

### Task 24: End-to-End Verification

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass (colors, card-order, base64, url-encode, html-entities, case-converter, word-counter, lorem-ipsum, hash-generator, jwt-decoder).

- [ ] **Step 2: Run the build**

```bash
npm run build
```

Expected: builds successfully with no errors.

- [ ] **Step 3: Verify all tools in the dev server**

```bash
npm run dev
```

Walk through each tool via sidebar:
1. JSON Formatter: paste JSON, switch tree/text/table modes
2. Base64: encode "Hello 🌍", decode the result
3. Case Converter: type "hello world example", cycle through all 5 cases
4. URL Encode: encode "foo=bar&baz=qux", decode result
5. Hash Generator: type "test", verify MD5/SHA-1/SHA-256 results
6. JWT Decoder: paste a JWT, verify header/payload/status
7. Word Counter: paste a paragraph, check all stats
8. String Diff: paste different text in each panel, verify diff rendering
9. HTML Entities: encode "<div>", decode result
10. Lorem Ipsum: set 3 paragraphs, generate, toggle options
11. Markdown Preview: type markdown, verify rendered output

- [ ] **Step 4: Verify home page interactions**

- Drag cards to reorder, refresh page, verify order persists
- Click a card, verify navigation to tool
- Toggle light/dark mode, verify all tools render in both themes
- Collapse sidebar to icon-only, verify tool page header shows current tool

- [ ] **Step 5: Verify mobile responsive**

Open DevTools, toggle device mode (iPhone 12 or similar):
- Home page: single column card grid
- Tool pages: stacked (input above output)
- Sidebar: collapsed or hidden

- [ ] **Step 6: Verify build output**

```bash
npx serve build
```

Navigate to `http://localhost:3000/SvelteStrings/`:
- All routes work
- All tools function
- Service worker registered (check Application tab)
- Go offline: app still works

- [ ] **Step 7: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final verification and polish"
```
