import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { getAirportName } from '$lib/airports';
import type { FlightLog } from '$lib/types';

export const load: PageServerLoad = async () => {
	try {
		const result = await db.execute(
			'SELECT * FROM flight_logs ORDER BY flight_date DESC'
		);

		const flights = (result.rows as unknown as FlightLog[]).map((flight) => ({
			...flight,
			originName: getAirportName(flight.origin),
			destinationName: getAirportName(flight.destination)
		}));

		// Calculate landing stats
		const stats = {
			total: flights.length,
			smooth: flights.filter((f) => f.landing_type === 'smooth').length,
			dent: flights.filter((f) => f.landing_type === 'dent').length,
			crater: flights.filter((f) => f.landing_type === 'crater').length
		};

		return { flights, stats };
	} catch (e) {
		console.log('Flight logs table may not exist:', e);
		return {
			flights: [],
			stats: { total: 0, smooth: 0, dent: 0, crater: 0 }
		};
	}
};
