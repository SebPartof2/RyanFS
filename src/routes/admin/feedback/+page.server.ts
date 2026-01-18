import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import type { Feedback } from '$lib/types';

export const load: PageServerLoad = async () => {
	const result = await db.execute('SELECT * FROM feedback ORDER BY created_at DESC');
	return {
		feedback: result.rows as unknown as Feedback[]
	};
};

export const actions: Actions = {
	markRead: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		await db.execute({
			sql: 'UPDATE feedback SET read = 1 WHERE id = ?',
			args: [id]
		});

		return { success: true };
	},
	markUnread: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		await db.execute({
			sql: 'UPDATE feedback SET read = 0 WHERE id = ?',
			args: [id]
		});

		return { success: true };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		await db.execute({
			sql: 'DELETE FROM feedback WHERE id = ?',
			args: [id]
		});

		return { success: true };
	}
};
