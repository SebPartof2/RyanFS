import type { PageServerLoad } from './$types';
import { listR2Images } from '$lib/server/r2';

export const load: PageServerLoad = async () => {
	const images = await listR2Images();

	return {
		images
	};
};
