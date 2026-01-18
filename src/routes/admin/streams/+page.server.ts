import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import type { Stream } from '$lib/types';

export const load: PageServerLoad = async () => {
	const result = await db.execute('SELECT * FROM streams ORDER BY scheduled_at DESC');
	return {
		streams: result.rows as unknown as Stream[]
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		await db.execute({
			sql: 'DELETE FROM streams WHERE id = ?',
			args: [id]
		});

		return { success: true };
	}
};
