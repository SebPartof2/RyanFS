<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let submitting = $state(false);

	function formatDateForInput(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toISOString().slice(0, 16);
	}
</script>

<div class="edit-stream">
	<div class="header">
		<h1>Edit Stream</h1>
		<form method="POST" action="?/delete" use:enhance class="delete-form">
			<button type="submit" class="btn-danger">Delete Stream</button>
		</form>
	</div>

	<form
		method="POST"
		action="?/update"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				submitting = false;
				await update();
			};
		}}
	>
		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}

		<label>
			<span>Title *</span>
			<input type="text" name="title" value={data.stream.title} required minlength="2" />
		</label>

		<label>
			<span>Description</span>
			<textarea name="description" rows="3">{data.stream.description ?? ''}</textarea>
		</label>

		<label>
			<span>Scheduled Date & Time *</span>
			<input
				type="datetime-local"
				name="scheduled_at"
				value={formatDateForInput(data.stream.scheduled_at)}
				required
			/>
		</label>

		<label>
			<span>Platform</span>
			<select name="platform">
				<option value="youtube" selected={data.stream.platform === 'youtube'}>YouTube</option>
				<option value="twitch" selected={data.stream.platform === 'twitch'}>Twitch</option>
				<option value="other" selected={data.stream.platform === 'other'}>Other</option>
			</select>
		</label>

		<label>
			<span>Stream URL</span>
			<input type="url" name="url" value={data.stream.url ?? ''} placeholder="https://..." />
		</label>

		<div class="actions">
			<a href="/admin/streams" class="btn-secondary">Cancel</a>
			<button type="submit" class="btn-primary" disabled={submitting}>
				{submitting ? 'Saving...' : 'Save Changes'}
			</button>
		</div>
	</form>
</div>

<style>
	.edit-stream {
		max-width: 600px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		color: #fff;
		margin: 0;
	}

	.delete-form {
		display: inline;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label span {
		font-size: 0.9rem;
		color: #b0b0b0;
	}

	input,
	textarea,
	select {
		padding: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.3);
		color: #e4e4e4;
		font-size: 1rem;
		font-family: inherit;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: #4fc3f7;
	}

	select {
		cursor: pointer;
	}

	select option {
		background: #1a1a2e;
	}

	.error {
		padding: 1rem;
		background: rgba(244, 67, 54, 0.2);
		border: 1px solid rgba(244, 67, 54, 0.5);
		border-radius: 6px;
		color: #e57373;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1rem;
	}

	.btn-primary {
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
		color: #1a1a2e;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		color: #888;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		font-size: 1rem;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
	}

	.btn-danger {
		padding: 0.5rem 1rem;
		background: rgba(244, 67, 54, 0.2);
		color: #e57373;
		border: 1px solid rgba(244, 67, 54, 0.5);
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-danger:hover {
		background: rgba(244, 67, 54, 0.3);
	}
</style>
