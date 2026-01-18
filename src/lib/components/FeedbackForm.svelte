<script lang="ts">
	import { enhance } from '$app/forms';

	let {
		form
	}: {
		form: { error?: string; success?: boolean; name?: string; email?: string; message?: string } | null;
	} = $props();

	let submitting = $state(false);
</script>

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
	{#if form?.success}
		<div class="success">Thank you for your feedback!</div>
	{:else}
		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}

		<label>
			<span>Name *</span>
			<input type="text" name="name" value={form?.name ?? ''} required minlength="2" />
		</label>

		<label>
			<span>Email (optional)</span>
			<input type="email" name="email" value={form?.email ?? ''} />
		</label>

		<label>
			<span>Message *</span>
			<textarea name="message" required minlength="10" rows="5">{form?.message ?? ''}</textarea>
		</label>

		<button type="submit" disabled={submitting}>
			{submitting ? 'Sending...' : 'Send Feedback'}
		</button>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
		max-width: 500px;
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
	textarea {
		padding: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.3);
		color: #e4e4e4;
		font-size: 1rem;
		font-family: inherit;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #4fc3f7;
	}

	textarea {
		resize: vertical;
		min-height: 120px;
	}

	button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
		color: #1a1a2e;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.success {
		padding: 1rem;
		background: rgba(76, 175, 80, 0.2);
		border: 1px solid rgba(76, 175, 80, 0.5);
		border-radius: 6px;
		color: #81c784;
		text-align: center;
	}

	.error {
		padding: 1rem;
		background: rgba(244, 67, 54, 0.2);
		border: 1px solid rgba(244, 67, 54, 0.5);
		border-radius: 6px;
		color: #e57373;
	}
</style>
