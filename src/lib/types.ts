export interface Feedback {
	id: number;
	name: string;
	email: string | null;
	message: string;
	created_at: string;
	read: number;
}

export interface Stream {
	id: number;
	title: string;
	description: string | null;
	scheduled_at: string;
	platform: string;
	url: string | null;
	thumbnail: string | null;
	created_at: string;
}

export interface AllowedAdmin {
	discord_id: string;
	added_at: string;
}

export type LandingType = 'smooth' | 'solid' | 'dent' | 'crater';

export interface FlightLog {
	id: number;
	origin: string;
	destination: string;
	callsign: string;
	landing_type: LandingType;
	notes: string | null;
	flight_date: string;
	created_at: string;
}
