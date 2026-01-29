import { google } from 'googleapis';
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID } from '$env/static/private';

export interface DriveImage {
	id: string;
	name: string;
	url: string;
	thumbnailUrl: string;
	createdTime: string;
}

let cachedImages: DriveImage[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getAuth() {
	if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
		return null;
	}

	return new google.auth.GoogleAuth({
		credentials: {
			client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
			private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
		},
		scopes: ['https://www.googleapis.com/auth/drive.readonly']
	});
}

export async function getDriveImages(): Promise<DriveImage[]> {
	// Return cached images if still valid
	if (cachedImages && Date.now() - cacheTime < CACHE_DURATION) {
		return cachedImages;
	}

	const auth = getAuth();
	if (!auth || !GOOGLE_DRIVE_FOLDER_ID) {
		console.log('Google Drive not configured');
		return [];
	}

	try {
		const drive = google.drive({ version: 'v3', auth });

		const response = await drive.files.list({
			q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
			fields: 'files(id, name, createdTime, thumbnailLink)',
			orderBy: 'createdTime desc',
			pageSize: 100
		});

		const files = response.data.files || [];

		cachedImages = files.map((file) => ({
			id: file.id!,
			name: file.name || 'Untitled',
			url: `https://drive.google.com/uc?export=view&id=${file.id}`,
			thumbnailUrl: file.thumbnailLink?.replace('=s220', '=s800') || `https://drive.google.com/uc?export=view&id=${file.id}`,
			createdTime: file.createdTime || new Date().toISOString()
		}));

		cacheTime = Date.now();
		console.log(`Google Drive: Fetched ${cachedImages.length} images`);

		return cachedImages;
	} catch (error) {
		console.error('Error fetching from Google Drive:', error);
		return cachedImages || [];
	}
}

export function clearDriveCache() {
	cachedImages = null;
	cacheTime = 0;
}
