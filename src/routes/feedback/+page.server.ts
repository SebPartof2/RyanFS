import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const message = formData.get('message') as string;

		if (!name || name.length < 2) {
			return fail(400, { error: 'Name must be at least 2 characters', name, email, message });
		}
		if (!message || message.length < 10) {
			return fail(400, { error: 'Message must be at least 10 characters', name, email, message });
		}

		try {
			await db.execute({
				sql: 'INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)',
				args: [name, email || null, message]
			});

			return { success: true };
		} catch (error) {
			console.error('Feedback submission error:', error);
			return fail(500, { error: 'Failed to submit feedback. Please try again.', name, email, message });
		}
	}
};
