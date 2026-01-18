import type { LayoutServerLoad } from './$types';
import { requireAdmin } from '$lib/server/admin';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	await requireAdmin(session);

	return {
		session
	};
};
