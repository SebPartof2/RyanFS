<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let syncing = $state(false);
	let syncMessage = $state('');

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function isPast(dateStr: string): boolean {
		return new Date(dateStr) < new Date();
	}

	async function syncFromYouTube() {
		syncing = true;
		syncMessage = '';
		try {
			const response = await fetch('/api/sync-streams', {
				method: 'POST',
				headers: { 'x-admin-sync': 'true' }
			});
			const result = await response.json();
			if (response.ok) {
				syncMessage = result.message;
				await invalidateAll();
			} else {
				syncMessage = result.error || 'Sync failed';
			}
		} catch {
			syncMessage = 'Failed to sync';
		} finally {
			syncing = false;
			setTimeout(() => (syncMessage = ''), 5000);
		}
	}
</script>

<div class="streams-admin">
	<div class="header">
		<div>
			<h1>Streams</h1>
			<p>{data.streams.length} stream{data.streams.length !== 1 ? 's' : ''}</p>
		</div>
		<div class="header-actions">
			<button onclick={syncFromYouTube} class="btn-sync" disabled={syncing}>
				{syncing ? 'Syncing...' : 'Sync from YouTube'}
			</button>
			<a href="/admin/streams/new" class="btn-primary">+ New Stream</a>
		</div>
	</div>

	{#if syncMessage}
		<div class="sync-message">{syncMessage}</div>
	{/if}

	{#if data.streams.length === 0}
		<div class="empty">No streams scheduled. Create one to get started!</div>
	{:else}
		<div class="streams-list">
			{#each data.streams as stream (stream.id)}
				<div class="stream-item" class:past={isPast(stream.scheduled_at)}>
					<div class="stream-info">
						<h3>{stream.title}</h3>
						{#if stream.description}
							<p class="description">{stream.description}</p>
						{/if}
						<div class="meta">
							<span class="platform">{stream.platform}</span>
							<span class="date">{formatDate(stream.scheduled_at)}</span>
							{#if stream.url}
								<a href={stream.url} target="_blank" rel="noopener noreferrer">View</a>
							{/if}
						</div>
					</div>
					<div class="actions">
						<a href="/admin/streams/{stream.id}" class="btn-secondary">Edit</a>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={stream.id} />
							<button type="submit" class="btn-danger">Delete</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.streams-admin {
		max-width: 800px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		color: #fff;
		margin: 0 0 0.5rem 0;
	}

	p {
		color: #888;
		margin: 0;
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.btn-primary {
		display: inline-block;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
		color: #1a1a2e;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		transition: all 0.2s ease;
		border: none;
		cursor: pointer;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
	}

	.btn-sync {
		padding: 0.75rem 1.25rem;
		background: rgba(255, 255, 255, 0.1);
		color: #888;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-sync:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
	}

	.btn-sync:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.sync-message {
		padding: 0.75rem 1rem;
		background: rgba(76, 175, 80, 0.2);
		border: 1px solid rgba(76, 175, 80, 0.5);
		border-radius: 6px;
		color: #81c784;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.empty {
		padding: 2rem;
		text-align: center;
		color: #888;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}

	.streams-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.stream-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1.25rem;
	}

	.stream-item.past {
		opacity: 0.6;
	}

	.stream-info {
		flex: 1;
	}

	.stream-info h3 {
		margin: 0 0 0.5rem 0;
		color: #fff;
		font-size: 1.1rem;
	}

	.description {
		color: #aaa;
		font-size: 0.9rem;
		margin: 0 0 0.75rem 0;
	}

	.meta {
		display: flex;
		gap: 1rem;
		font-size: 0.85rem;
	}

	.platform {
		color: #4fc3f7;
		text-transform: capitalize;
	}

	.date {
		color: #888;
	}

	.meta a {
		color: #4fc3f7;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.actions form {
		display: inline;
	}

	.btn-secondary {
		padding: 0.4rem 0.75rem;
		background: rgba(255, 255, 255, 0.1);
		color: #888;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		font-size: 0.85rem;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
	}

	button {
		padding: 0.4rem 0.75rem;
		border: none;
		border-radius: 4px;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-danger {
		background: rgba(244, 67, 54, 0.2);
		color: #e57373;
		border: 1px solid rgba(244, 67, 54, 0.5);
	}

	.btn-danger:hover {
		background: rgba(244, 67, 54, 0.3);
	}
</style>
