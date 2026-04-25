import type { Component } from 'svelte';
import {
	Braces,
	Binary,
	CaseSensitive,
	Link,
	Hash,
	KeyRound,
	TextInitial,
	GitCompare,
	Code,
	Pilcrow,
	FileText
} from '@lucide/svelte';

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
		icon: TextInitial,
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
