import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { Stream } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await db.execute({
		sql: 'SELECT * FROM streams WHERE id = ?',
		args: [params.id]
	});

	if (result.rows.length === 0) {
		error(404, 'Stream not found');
	}

	return {
		stream: result.rows[0] as unknown as Stream
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const scheduled_at = formData.get('scheduled_at') as string;
		const platform = formData.get('platform') as string;
		const url = formData.get('url') as string;

		if (!title || title.length < 2) {
			return fail(400, { error: 'Title is required' });
		}
		if (!scheduled_at) {
			return fail(400, { error: 'Schedule date is required' });
		}

		try {
			await db.execute({
				sql: 'UPDATE streams SET title = ?, description = ?, scheduled_at = ?, platform = ?, url = ? WHERE id = ?',
				args: [title, description || null, scheduled_at, platform || 'youtube', url || null, params.id]
			});

			redirect(303, '/admin/streams');
		} catch (err) {
			console.error('Stream update error:', err);
			return fail(500, { error: 'Failed to update stream' });
		}
	},
	delete: async ({ params }) => {
		await db.execute({
			sql: 'DELETE FROM streams WHERE id = ?',
			args: [params.id]
		});

		redirect(303, '/admin/streams');
	}
};
