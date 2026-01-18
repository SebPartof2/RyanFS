<script lang="ts">
	import FeedbackForm from '$lib/components/FeedbackForm.svelte';

	let { form } = $props();
</script>

<div class="feedback-page">
	<h1>Feedback</h1>
	<p>Have suggestions, questions, or just want to say hi? Send me a message!</p>
	<FeedbackForm {form} />
</div>

<style>
	.feedback-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
		max-width: 600px;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		color: #ffffff;
		margin: 0;
	}

	p {
		color: #888;
		text-align: center;
		margin: 0;
	}
</style>
