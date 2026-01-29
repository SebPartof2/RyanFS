import type { PageServerLoad, Actions } from './$types';
import { listR2Images, uploadToR2, deleteFromR2 } from '$lib/server/r2';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const images = await listR2Images();

	return {
		images
	};
};

export const actions: Actions = {
	upload: async ({ request }) => {
		const formData = await request.formData();
		const files = formData.getAll('files') as File[];

		if (!files || files.length === 0) {
			return fail(400, { error: 'No files provided' });
		}

		const results: { name: string; success: boolean; error?: string }[] = [];

		for (const file of files) {
			if (!file.type.startsWith('image/')) {
				results.push({ name: file.name, success: false, error: 'Not an image file' });
				continue;
			}

			if (file.size > 10 * 1024 * 1024) {
				results.push({ name: file.name, success: false, error: 'File too large (max 10MB)' });
				continue;
			}

			const key = await uploadToR2(file, file.name);
			if (key) {
				results.push({ name: file.name, success: true });
			} else {
				results.push({ name: file.name, success: false, error: 'Upload failed' });
			}
		}

		const successCount = results.filter((r) => r.success).length;
		const failCount = results.filter((r) => !r.success).length;

		return {
			success: true,
			message: `Uploaded ${successCount} image${successCount !== 1 ? 's' : ''}${failCount > 0 ? `, ${failCount} failed` : ''}`,
			results
		};
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const key = formData.get('key') as string;

		if (!key) {
			return fail(400, { error: 'No image key provided' });
		}

		const success = await deleteFromR2(key);

		if (!success) {
			return fail(500, { error: 'Failed to delete image' });
		}

		return { success: true };
	}
};
