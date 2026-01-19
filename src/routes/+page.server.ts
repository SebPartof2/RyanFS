import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { getAirportName } from '$lib/airports';
import type { Stream } from '$lib/types';

// Add image filenames here (files should be in static/slideshow/)
const SLIDESHOW_IMAGES = [
	'/slideshow/1.png',
	'/slideshow/2.png',
	'/slideshow/3.png'
];

interface VatsimPilot {
	cid: number;
	name: string;
	callsign: string;
	server: string;
	pilot_rating: number;
	latitude: number;
	longitude: number;
	altitude: number;
	groundspeed: number;
	heading: number;
	flight_plan: {
		flight_rules: string;
		aircraft: string;
		aircraft_faa: string;
		aircraft_short: string;
		departure: string;
		arrival: string;
		alternate: string;
		cruise_tas: string;
		altitude: string;
		route: string;
	} | null;
}

interface VatsimController {
	cid: number;
	name: string;
	callsign: string;
	frequency: string;
	facility: number;
}

interface VatsimData {
	general: {
		version: number;
		update_timestamp: string;
		connected_clients: number;
		unique_users: number;
	};
	pilots: VatsimPilot[];
	controllers: VatsimController[];
}

const RYAN_CID = 1864478;

export const load: PageServerLoad = async ({ fetch }) => {
	const [upcomingResult, pastResult, landingStatsResult, vatsimData] = await Promise.all([
		db.execute(
			"SELECT * FROM streams WHERE datetime(replace(scheduled_at, 'T', ' ')) >= datetime('now', '-2 hours') ORDER BY scheduled_at ASC LIMIT 5"
		),
		db.execute(
			"SELECT * FROM streams WHERE datetime(replace(scheduled_at, 'T', ' ')) < datetime('now', '-2 hours') ORDER BY scheduled_at DESC LIMIT 10"
		),
		db.execute(
			"SELECT landing_type, COUNT(*) as count FROM flight_logs GROUP BY landing_type"
		).catch((e) => {
			console.log('Flight logs table may not exist:', e.message);
			return { rows: [] };
		}),
		fetch('https://data.vatsim.net/v3/vatsim-data.json')
			.then((res) => res.json() as Promise<VatsimData>)
			.catch(() => null)
	]);

	// Process landing stats
	const landingStats = { smooth: 0, dent: 0, crater: 0 };
	for (const row of landingStatsResult.rows) {
		const type = row.landing_type as string;
		const count = row.count as number;
		if (type in landingStats) {
			landingStats[type as keyof typeof landingStats] = count;
		}
	}

	const ryanFlight = vatsimData?.pilots.find((p) => p.cid === RYAN_CID) ?? null;

	if (vatsimData && !ryanFlight) {
		console.log(`VATSIM: ${vatsimData.pilots.length} pilots online, Ryan (CID ${RYAN_CID}) not found`);
	} else if (ryanFlight) {
		console.log(`VATSIM: Ryan found - ${ryanFlight.callsign}`);
	} else {
		console.log('VATSIM: Failed to fetch data');
	}

	const departureCode = ryanFlight?.flight_plan?.departure ?? '????';
	const arrivalCode = ryanFlight?.flight_plan?.arrival ?? '????';

	return {
		upcomingStreams: upcomingResult.rows as unknown as Stream[],
		pastStreams: pastResult.rows as unknown as Stream[],
		landingStats,
		slideshowImages: SLIDESHOW_IMAGES,
		vatsim: ryanFlight
			? {
					online: true,
					callsign: ryanFlight.callsign,
					aircraft: ryanFlight.flight_plan?.aircraft_short ?? 'Unknown',
					departure: departureCode,
					departureName: getAirportName(departureCode),
					arrival: arrivalCode,
					arrivalName: getAirportName(arrivalCode),
					altitude: ryanFlight.altitude,
					groundspeed: ryanFlight.groundspeed
				}
			: { online: false }
	};
};
