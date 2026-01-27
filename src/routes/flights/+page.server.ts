import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { getAirport, getAirportName } from '$lib/airports';
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
			solid: flights.filter((f) => f.landing_type === 'solid').length,
			dent: flights.filter((f) => f.landing_type === 'dent').length,
			crater: flights.filter((f) => f.landing_type === 'crater').length
		};

		// Calculate route statistics
		const routeCounts: Record<string, number> = {};
		const airportCounts: Record<string, number> = {};
		const countryCounts: Record<string, number> = {};

		for (const flight of flights) {
			// Count routes
			const route = `${flight.origin}-${flight.destination}`;
			routeCounts[route] = (routeCounts[route] || 0) + 1;

			// Count airports (both origin and destination)
			airportCounts[flight.origin] = (airportCounts[flight.origin] || 0) + 1;
			airportCounts[flight.destination] = (airportCounts[flight.destination] || 0) + 1;

			// Count countries
			const originAirport = getAirport(flight.origin);
			const destAirport = getAirport(flight.destination);
			if (originAirport?.country) {
				countryCounts[originAirport.country] = (countryCounts[originAirport.country] || 0) + 1;
			}
			if (destAirport?.country) {
				countryCounts[destAirport.country] = (countryCounts[destAirport.country] || 0) + 1;
			}
		}

		// Sort and get top items
		const topRoutes = Object.entries(routeCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([route, count]) => {
				const [origin, destination] = route.split('-');
				return {
					origin,
					destination,
					originName: getAirportName(origin),
					destinationName: getAirportName(destination),
					count
				};
			});

		const topAirports = Object.entries(airportCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([code, count]) => ({
				code,
				name: getAirportName(code),
				country: getAirport(code)?.country || '',
				count
			}));

		const topCountries = Object.entries(countryCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([code, count]) => ({ code, count }));

		return {
			flights,
			stats,
			topRoutes,
			topAirports,
			topCountries,
			uniqueAirports: Object.keys(airportCounts).length,
			uniqueCountries: Object.keys(countryCounts).length
		};
	} catch (e) {
		console.log('Flight logs table may not exist:', e);
		return {
			flights: [],
			stats: { total: 0, smooth: 0, solid: 0, dent: 0, crater: 0 },
			topRoutes: [],
			topAirports: [],
			topCountries: [],
			uniqueAirports: 0,
			uniqueCountries: 0
		};
	}
};
