import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

async function initTable() {
	await db.execute(`
		CREATE TABLE IF NOT EXISTS flight_logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			origin TEXT NOT NULL,
			destination TEXT NOT NULL,
			callsign TEXT NOT NULL,
			landing_type TEXT NOT NULL CHECK(landing_type IN ('smooth', 'solid', 'dent', 'crater')),
			notes TEXT,
			flight_date TEXT NOT NULL DEFAULT (datetime('now')),
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		)
	`);
}

export const GET: RequestHandler = async () => {
	try {
		await initTable();
		return json({ success: true, message: 'Flight logs table created' });
	} catch (error) {
		console.error('Init error:', error);
		return json({ error: 'Failed to initialize flight logs table' }, { status: 500 });
	}
};

export const POST: RequestHandler = async () => {
	try {
		await initTable();
		return json({ success: true, message: 'Flight logs table created' });
	} catch (error) {
		console.error('Init error:', error);
		return json({ error: 'Failed to initialize flight logs table' }, { status: 500 });
	}
};
