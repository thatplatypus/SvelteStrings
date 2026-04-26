export type BackgroundEffect = 'classic' | 'aurora' | 'matrix';

const STORAGE_KEY = 'sveltestrings:settings';

interface SettingsData {
	backgroundEffect: BackgroundEffect;
	accentColor: string;
}

const DEFAULTS: SettingsData = {
	backgroundEffect: 'classic',
	accentColor: '#8b5cf6'
};

function load(): SettingsData {
	if (typeof localStorage === 'undefined') return { ...DEFAULTS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULTS };
		return { ...DEFAULTS, ...JSON.parse(raw) };
	} catch {
		return { ...DEFAULTS };
	}
}

const initial = load();

let backgroundEffect = $state<BackgroundEffect>(initial.backgroundEffect);
let accentColor = $state<string>(initial.accentColor);

function persist() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify({
		backgroundEffect,
		accentColor
	}));
}

export const settings = {
	get backgroundEffect() { return backgroundEffect; },
	set backgroundEffect(value: BackgroundEffect) {
		backgroundEffect = value;
		persist();
	},
	get accentColor() { return accentColor; },
	set accentColor(value: string) {
		accentColor = value;
		persist();
	}
};
