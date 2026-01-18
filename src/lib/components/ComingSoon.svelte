<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<div class="coming-soon">
	<h1>{title}</h1>
	<div class="badge">Coming Soon</div>
	<p>This section is currently under construction. Check back later for updates!</p>
</div>

<style>
	.coming-soon {
		text-align: center;
		padding: 3rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1.5rem;
		color: #ffffff;
	}

	.badge {
		display: inline-block;
		background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
		color: #1a1a2e;
		padding: 0.5rem 1.5rem;
		border-radius: 20px;
		font-weight: 600;
		font-size: 1rem;
		margin-bottom: 1.5rem;
	}

	p {
		color: #888;
		font-size: 1.1rem;
		max-width: 400px;
		line-height: 1.6;
	}
</style>
