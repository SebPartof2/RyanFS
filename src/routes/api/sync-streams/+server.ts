import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { sendScheduleWebhook } from '$lib/server/webhook';
import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from '$env/static/private';

interface YouTubeLiveBroadcast {
	id: string;
	snippet: {
		title: string;
		description: string;
		scheduledStartTime: string;
		liveChatId?: string;
	};
	status: {
		lifeCycleStatus: string;
	};
}

interface YouTubeSearchResult {
	id: {
		videoId: string;
	};
	snippet: {
		title: string;
		description: string;
		publishedAt: string;
		liveBroadcastContent: string;
	};
}

export const POST: RequestHandler = async ({ fetch, request }) => {
	// Simple auth check - require a secret or admin session
	const authHeader = request.headers.get('Authorization');
	const expectedToken = `Bearer ${YOUTUBE_API_KEY.slice(0, 16)}`;

	if (authHeader !== expectedToken && !request.headers.get('x-admin-sync')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
		return json({ error: 'YouTube API not configured' }, { status: 500 });
	}

	try {
		// Fetch upcoming live streams from the channel
		const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
		searchUrl.searchParams.set('part', 'snippet');
		searchUrl.searchParams.set('channelId', YOUTUBE_CHANNEL_ID);
		searchUrl.searchParams.set('eventType', 'upcoming');
		searchUrl.searchParams.set('type', 'video');
		searchUrl.searchParams.set('maxResults', '10');
		searchUrl.searchParams.set('key', YOUTUBE_API_KEY);

		const searchResponse = await fetch(searchUrl.toString());

		if (!searchResponse.ok) {
			const error = await searchResponse.text();
			console.error('YouTube API error:', error);
			return json({ error: 'YouTube API error' }, { status: 500 });
		}

		const searchData = await searchResponse.json();
		const upcomingVideos: YouTubeSearchResult[] = searchData.items || [];

		if (upcomingVideos.length === 0) {
			return json({ message: 'No upcoming streams found', synced: 0 });
		}

		// Get video details for scheduled start times
		const videoIds = upcomingVideos.map((v) => v.id.videoId).join(',');
		const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
		videosUrl.searchParams.set('part', 'snippet,liveStreamingDetails');
		videosUrl.searchParams.set('id', videoIds);
		videosUrl.searchParams.set('key', YOUTUBE_API_KEY);

		const videosResponse = await fetch(videosUrl.toString());
		const videosData = await videosResponse.json();

		let synced = 0;
		let skipped = 0;

		for (const video of videosData.items || []) {
			const scheduledStart = video.liveStreamingDetails?.scheduledStartTime;
			if (!scheduledStart) continue;

			const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
			// Get the best available thumbnail
			const thumbnails = video.snippet.thumbnails;
			const thumbnail =
				thumbnails?.maxres?.url ||
				thumbnails?.high?.url ||
				thumbnails?.medium?.url ||
				thumbnails?.default?.url ||
				null;

			// Check if stream already exists by URL
			const existing = await db.execute({
				sql: 'SELECT id FROM streams WHERE url = ?',
				args: [videoUrl]
			});

			if (existing.rows.length > 0) {
				// Update existing stream
				await db.execute({
					sql: 'UPDATE streams SET title = ?, description = ?, scheduled_at = ?, thumbnail = ? WHERE url = ?',
					args: [
						video.snippet.title,
						video.snippet.description?.slice(0, 500) || null,
						scheduledStart,
						thumbnail,
						videoUrl
					]
				});
				skipped++;
			} else {
				// Insert new stream
				await db.execute({
					sql: 'INSERT INTO streams (title, description, scheduled_at, platform, url, thumbnail) VALUES (?, ?, ?, ?, ?, ?)',
					args: [
						video.snippet.title,
						video.snippet.description?.slice(0, 500) || null,
						scheduledStart,
						'youtube',
						videoUrl,
						thumbnail
					]
				});
				synced++;
			}
		}

		// Send webhook to external VPS
		const webhookResult = await sendScheduleWebhook();

		return json({
			message: `Synced ${synced} new streams, updated ${skipped} existing`,
			synced,
			updated: skipped,
			webhook: webhookResult.success ? 'sent' : webhookResult.error
		});
	} catch (error) {
		console.error('Sync error:', error);
		return json({ error: 'Failed to sync streams' }, { status: 500 });
	}
};

// GET endpoint for Vercel cron jobs
export const GET: RequestHandler = async ({ fetch, request }) => {
	// For cron jobs, check for Vercel cron secret
	const authHeader = request.headers.get('Authorization');

	if (authHeader !== `Bearer ${YOUTUBE_API_KEY.slice(0, 16)}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Reuse POST logic
	const response = await POST({ fetch, request } as any);
	return response;
};
