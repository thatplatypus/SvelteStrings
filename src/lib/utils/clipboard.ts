import { toast } from 'svelte-sonner';

export async function copyToClipboard(text: string, label = 'Copied!'): Promise<void> {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(label);
	} catch {
		toast.error('Failed to copy to clipboard');
	}
}
