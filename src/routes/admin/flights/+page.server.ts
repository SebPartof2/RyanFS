import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { getAirportName } from '$lib/airports';
import type { FlightLog } from '$lib/types';

export const load: PageServerLoad = async () => {
	const result = await db.execute(
		'SELECT * FROM flight_logs ORDER BY flight_date DESC'
	);

	const flights = (result.rows as unknown as FlightLog[]).map((flight) => ({
		...flight,
		originName: getAirportName(flight.origin),
		destinationName: getAirportName(flight.destination)
	}));

	return { flights };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const origin = (formData.get('origin') as string).toUpperCase();
		const destination = (formData.get('destination') as string).toUpperCase();
		const callsign = (formData.get('callsign') as string).toUpperCase();
		const landing_type = formData.get('landing_type') as string;
		const notes = formData.get('notes') as string || null;
		const flight_date = formData.get('flight_date') as string || new Date().toISOString();

		await db.execute({
			sql: 'INSERT INTO flight_logs (origin, destination, callsign, landing_type, notes, flight_date) VALUES (?, ?, ?, ?, ?, ?)',
			args: [origin, destination, callsign, landing_type, notes, flight_date]
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		await db.execute({
			sql: 'DELETE FROM flight_logs WHERE id = ?',
			args: [id]
		});

		return { success: true };
	}
};
