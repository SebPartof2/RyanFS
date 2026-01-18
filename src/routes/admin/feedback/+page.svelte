<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Feedback } from '$lib/types';

	let { data } = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="feedback-admin">
	<h1>Feedback</h1>
	<p>{data.feedback.length} submission{data.feedback.length !== 1 ? 's' : ''}</p>

	{#if data.feedback.length === 0}
		<div class="empty">No feedback submissions yet.</div>
	{:else}
		<div class="feedback-list">
			{#each data.feedback as item (item.id)}
				<div class="feedback-item" class:unread={!item.read}>
					<div class="feedback-header">
						<div class="feedback-meta">
							<strong>{item.name}</strong>
							{#if item.email}
								<span class="email">({item.email})</span>
							{/if}
						</div>
						<span class="date">{formatDate(item.created_at)}</span>
					</div>
					<p class="message">{item.message}</p>
					<div class="actions">
						{#if item.read}
							<form method="POST" action="?/markUnread" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button type="submit" class="btn-secondary">Mark Unread</button>
							</form>
						{:else}
							<form method="POST" action="?/markRead" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button type="submit" class="btn-primary">Mark Read</button>
							</form>
						{/if}
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={item.id} />
							<button type="submit" class="btn-danger">Delete</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.feedback-admin {
		max-width: 800px;
	}

	h1 {
		font-size: 2rem;
		color: #fff;
		margin: 0 0 0.5rem 0;
	}

	p {
		color: #888;
		margin: 0 0 2rem 0;
	}

	.empty {
		padding: 2rem;
		text-align: center;
		color: #888;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}

	.feedback-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.feedback-item {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1.25rem;
	}

	.feedback-item.unread {
		border-left: 3px solid #4fc3f7;
	}

	.feedback-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
	}

	.feedback-meta strong {
		color: #fff;
	}

	.email {
		color: #888;
		font-size: 0.9rem;
		margin-left: 0.5rem;
	}

	.date {
		color: #666;
		font-size: 0.85rem;
	}

	.message {
		color: #ccc;
		margin: 0 0 1rem 0;
		line-height: 1.5;
		white-space: pre-wrap;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.actions form {
		display: inline;
	}

	button {
		padding: 0.4rem 0.75rem;
		border: none;
		border-radius: 4px;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background: rgba(79, 195, 247, 0.2);
		color: #4fc3f7;
		border: 1px solid rgba(79, 195, 247, 0.5);
	}

	.btn-primary:hover {
		background: rgba(79, 195, 247, 0.3);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: #888;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
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
