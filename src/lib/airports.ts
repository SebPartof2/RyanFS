import airports from './airports.json';

export interface Airport {
	name: string;
	iata: string | null;
	icao: string | null;
	country: string;
	region: string;
	lat: number;
	lon: number;
}

const airportData = airports as Record<string, Airport>;

export function getAirport(code: string): Airport | null {
	return airportData[code.toUpperCase()] ?? null;
}

export function getAirportName(code: string): string {
	return airportData[code.toUpperCase()]?.name ?? code;
}
