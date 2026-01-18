import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const scheduled_at = formData.get('scheduled_at') as string;
		const platform = formData.get('platform') as string;
		const url = formData.get('url') as string;

		if (!title || title.length < 2) {
			return fail(400, { error: 'Title is required', title, description, scheduled_at, platform, url });
		}
		if (!scheduled_at) {
			return fail(400, { error: 'Schedule date is required', title, description, scheduled_at, platform, url });
		}

		// Convert local time to UTC for storage
		const scheduledUtc = new Date(scheduled_at).toISOString();

		try {
			await db.execute({
				sql: 'INSERT INTO streams (title, description, scheduled_at, platform, url) VALUES (?, ?, ?, ?, ?)',
				args: [title, description || null, scheduledUtc, platform || 'youtube', url || null]
			});
		} catch (error) {
			console.error('Stream creation error:', error);
			return fail(500, { error: 'Failed to create stream', title, description, scheduled_at, platform, url });
		}

		redirect(303, '/admin/streams');
	}
};
