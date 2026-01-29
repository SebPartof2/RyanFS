import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } from '$env/static/private';

export interface GalleryImage {
	id: string;
	name: string;
	url: string;
	thumbnailUrl: string;
	key: string;
}

function getR2Client() {
	if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
		return null;
	}

	return new S3Client({
		region: 'auto',
		endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: R2_ACCESS_KEY_ID,
			secretAccessKey: R2_SECRET_ACCESS_KEY
		}
	});
}

export async function uploadToR2(file: File, filename: string): Promise<string | null> {
	const client = getR2Client();
	if (!client || !R2_BUCKET_NAME) {
		console.error('R2 not configured');
		return null;
	}

	const key = `gallery/${Date.now()}-${filename}`;
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	try {
		await client.send(new PutObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: file.type
		}));

		return key;
	} catch (error) {
		console.error('Error uploading to R2:', error);
		return null;
	}
}

export async function deleteFromR2(key: string): Promise<boolean> {
	const client = getR2Client();
	if (!client || !R2_BUCKET_NAME) {
		return false;
	}

	try {
		await client.send(new DeleteObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key
		}));
		return true;
	} catch (error) {
		console.error('Error deleting from R2:', error);
		return false;
	}
}

export async function listR2Images(): Promise<GalleryImage[]> {
	const client = getR2Client();
	if (!client || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
		console.log('R2 not configured');
		return [];
	}

	try {
		const response = await client.send(new ListObjectsV2Command({
			Bucket: R2_BUCKET_NAME,
			Prefix: 'gallery/'
		}));

		const contents = response.Contents || [];

		return contents
			.filter(item => item.Key && item.Key !== 'gallery/')
			.map(item => {
				const key = item.Key!;
				const name = key.split('/').pop() || key;
				const url = `${R2_PUBLIC_URL}/${key}`;

				return {
					id: key,
					name,
					url,
					thumbnailUrl: url,
					key
				};
			})
			.sort((a, b) => b.name.localeCompare(a.name));
	} catch (error) {
		console.error('Error listing R2 images:', error);
		return [];
	}
}

export function getPublicUrl(key: string): string {
	return `${R2_PUBLIC_URL}/${key}`;
}
