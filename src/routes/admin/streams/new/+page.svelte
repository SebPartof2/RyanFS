<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitting = $state(false);
</script>

<div class="new-stream">
	<h1>New Stream</h1>

	<form
		method="POST"
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
			<input type="text" name="title" value={form?.title ?? ''} required minlength="2" />
		</label>

		<label>
			<span>Description</span>
			<textarea name="description" rows="3">{form?.description ?? ''}</textarea>
		</label>

		<label>
			<span>Scheduled Date & Time *</span>
			<input type="datetime-local" name="scheduled_at" value={form?.scheduled_at ?? ''} required />
		</label>

		<label>
			<span>Platform</span>
			<select name="platform">
				<option value="youtube" selected={form?.platform === 'youtube'}>YouTube</option>
				<option value="twitch" selected={form?.platform === 'twitch'}>Twitch</option>
				<option value="other" selected={form?.platform === 'other'}>Other</option>
			</select>
		</label>

		<label>
			<span>Stream URL</span>
			<input type="url" name="url" value={form?.url ?? ''} placeholder="https://..." />
		</label>

		<div class="actions">
			<a href="/admin/streams" class="btn-secondary">Cancel</a>
			<button type="submit" class="btn-primary" disabled={submitting}>
				{submitting ? 'Creating...' : 'Create Stream'}
			</button>
		</div>
	</form>
</div>

<style>
	.new-stream {
		max-width: 600px;
	}

	h1 {
		font-size: 2rem;
		color: #fff;
		margin: 0 0 2rem 0;
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
		gap: 1rem;
		justify-content: flex-end;
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
</style>
