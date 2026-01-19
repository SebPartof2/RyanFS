<script lang="ts">
	let { data } = $props();
</script>

<div class="dashboard">
	<h1>Dashboard</h1>
	<p>Welcome back, {data.session?.user?.name ?? 'Admin'}!</p>

	<div class="stats">
		<a href="/admin/feedback" class="stat-card">
			<h3>Feedback</h3>
			<p>View and manage feedback submissions</p>
		</a>
		<a href="/admin/streams" class="stat-card">
			<h3>Streams</h3>
			<p>Manage upcoming streams</p>
		</a>
		<a href="/admin/flights" class="stat-card">
			<h3>Flight Log</h3>
			<p>Log flights and track landings</p>
		</a>
	</div>
</div>

<style>
	.dashboard {
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

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.stat-card {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.stat-card:hover {
		border-color: #4fc3f7;
		transform: translateY(-2px);
	}

	.stat-card h3 {
		margin: 0 0 0.5rem 0;
		color: #4fc3f7;
		font-size: 1.25rem;
	}

	.stat-card p {
		margin: 0;
		font-size: 0.9rem;
	}
</style>
