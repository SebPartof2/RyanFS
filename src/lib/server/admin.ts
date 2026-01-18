import { db } from './db';
import { redirect } from '@sveltejs/kit';
import type { Session } from '@auth/sveltekit';

export async function isAdmin(discordId: string): Promise<boolean> {
	const result = await db.execute({
		sql: 'SELECT 1 FROM allowed_admins WHERE discord_id = ?',
		args: [discordId]
	});
	return result.rows.length > 0;
}

export async function requireAdmin(session: Session | null): Promise<void> {
	if (!session?.user?.discordId) {
		redirect(303, '/auth/signin?callbackUrl=/admin');
	}

	const adminCheck = await isAdmin(session.user.discordId);
	if (!adminCheck) {
		redirect(303, '/?error=unauthorized');
	}
}
