import { db } from './db';
import { WEBHOOK_URL, WEBHOOK_API_KEY } from '$env/static/private';

interface WebhookStream {
	date: string;
	time: string;
	title: string;
	description?: string;
}

function formatStreamDate(scheduledAt: string): { date: string; time: string } {
	const date = new Date(scheduledAt);

	// Format date like "Saturday, Jan 18"
	const dateStr = date.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'short',
		day: 'numeric',
		timeZone: 'America/New_York'
	});

	// Format time like "7:00 PM EST"
	const timeStr = date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
		timeZone: 'America/New_York',
		timeZoneName: 'short'
	});

	return { date: dateStr, time: timeStr };
}

export async function sendScheduleWebhook(): Promise<{ success: boolean; error?: string }> {
	if (!WEBHOOK_URL || WEBHOOK_URL === 'http://your-vps-ip:3000/schedule') {
		console.log('Webhook not configured, skipping');
		return { success: true };
	}

	try {
		// Fetch upcoming streams from the database (include streams up to 2 hours past start)
		const result = await db.execute(
			"SELECT * FROM streams WHERE datetime(replace(scheduled_at, 'T', ' ')) >= datetime('now', '-2 hours') ORDER BY scheduled_at ASC"
		);

		const streams: WebhookStream[] = result.rows.map((row) => {
			const { date, time } = formatStreamDate(row.scheduled_at as string);
			return {
				date,
				time,
				title: row.title as string,
				description: (row.description as string) || undefined
			};
		});

		const response = await fetch(WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': WEBHOOK_API_KEY || ''
			},
			body: JSON.stringify({ streams })
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Webhook error:', response.status, errorText);
			return { success: false, error: `Webhook returned ${response.status}` };
		}

		console.log(`Webhook sent successfully with ${streams.length} streams`);
		return { success: true };
	} catch (error) {
		console.error('Webhook failed:', error);
		return { success: false, error: String(error) };
	}
}
