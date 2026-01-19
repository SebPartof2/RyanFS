<script lang="ts">
	let { data } = $props();

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getLandingEmoji(type: string): string {
		switch (type) {
			case 'smooth':
				return 'butter';
			case 'dent':
				return 'dent';
			case 'crater':
				return 'crater';
			default:
				return '';
		}
	}

	function getLandingLabel(type: string): string {
		switch (type) {
			case 'smooth':
				return 'Butter';
			case 'dent':
				return 'Dent';
			case 'crater':
				return 'Crater';
			default:
				return type;
		}
	}
</script>

<svelte:head>
	<title>Flight Log | RyanFS</title>
</svelte:head>

<div class="flights-page">
	<div class="container">
		<h1>Flight Log</h1>
		<p class="subtitle">A record of all flights on VATSIM</p>

		<div class="stats-bar">
			<div class="stat">
				<span class="stat-value">{data.stats.total}</span>
				<span class="stat-label">Total Flights</span>
			</div>
			<div class="stat smooth">
				<span class="stat-value">{data.stats.smooth}</span>
				<span class="stat-label">Butter</span>
			</div>
			<div class="stat dent">
				<span class="stat-value">{data.stats.dent}</span>
				<span class="stat-label">Dents</span>
			</div>
			<div class="stat crater">
				<span class="stat-value">{data.stats.crater}</span>
				<span class="stat-label">Craters</span>
			</div>
		</div>

		{#if data.flights.length === 0}
			<div class="empty-state">
				<p>No flights logged yet.</p>
			</div>
		{:else}
			<div class="flights-list">
				{#each data.flights as flight}
					<div class="flight-card">
						<div class="flight-header">
							<span class="callsign">{flight.callsign}</span>
							<span class="landing-badge {flight.landing_type}">{getLandingLabel(flight.landing_type)}</span>
						</div>
						<div class="flight-route">
							<div class="airport">
								<span class="icao">{flight.origin}</span>
								<span class="name">{flight.originName}</span>
							</div>
							<div class="route-arrow">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
							</div>
							<div class="airport">
								<span class="icao">{flight.destination}</span>
								<span class="name">{flight.destinationName}</span>
							</div>
						</div>
						{#if flight.notes}
							<div class="flight-notes">{flight.notes}</div>
						{/if}
						<div class="flight-date">{formatDate(flight.flight_date)}</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.flights-page {
		min-height: 100vh;
		padding: 2rem;
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.5rem;
		color: #fff;
		margin: 0 0 0.5rem 0;
		text-align: center;
	}

	.subtitle {
		color: #888;
		text-align: center;
		margin: 0 0 2rem 0;
	}

	.stats-bar {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.stat {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1rem 1.5rem;
		text-align: center;
		min-width: 100px;
	}

	.stat.smooth {
		border-color: rgba(129, 199, 132, 0.3);
		background: rgba(129, 199, 132, 0.1);
	}

	.stat.dent {
		border-color: rgba(255, 183, 77, 0.3);
		background: rgba(255, 183, 77, 0.1);
	}

	.stat.crater {
		border-color: rgba(229, 115, 115, 0.3);
		background: rgba(229, 115, 115, 0.1);
	}

	.stat-value {
		display: block;
		font-size: 1.75rem;
		font-weight: 700;
		color: #fff;
	}

	.stat.smooth .stat-value {
		color: #81c784;
	}

	.stat.dent .stat-value {
		color: #ffb74d;
	}

	.stat.crater .stat-value {
		color: #e57373;
	}

	.stat-label {
		font-size: 0.85rem;
		color: #888;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #888;
	}

	.flights-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.flight-card {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 1.25rem;
	}

	.flight-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.callsign {
		font-size: 1.2rem;
		font-weight: 700;
		color: #4fc3f7;
		font-family: monospace;
	}

	.landing-badge {
		padding: 0.3rem 0.75rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.landing-badge.smooth {
		background: rgba(129, 199, 132, 0.2);
		color: #81c784;
	}

	.landing-badge.dent {
		background: rgba(255, 183, 77, 0.2);
		color: #ffb74d;
	}

	.landing-badge.crater {
		background: rgba(229, 115, 115, 0.2);
		color: #e57373;
	}

	.flight-route {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.airport {
		text-align: center;
	}

	.airport .icao {
		display: block;
		font-size: 1.1rem;
		font-weight: 600;
		color: #fff;
		font-family: monospace;
	}

	.airport .name {
		display: block;
		font-size: 0.8rem;
		color: #888;
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.route-arrow {
		color: #4fc3f7;
	}

	.flight-notes {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 6px;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		color: #aaa;
		margin-bottom: 0.75rem;
	}

	.flight-date {
		text-align: right;
		font-size: 0.8rem;
		color: #666;
	}

	@media (max-width: 600px) {
		.flights-page {
			padding: 1rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		.stats-bar {
			gap: 0.75rem;
		}

		.stat {
			padding: 0.75rem 1rem;
			min-width: 70px;
		}

		.stat-value {
			font-size: 1.25rem;
		}

		.flight-route {
			flex-direction: column;
			gap: 0.5rem;
		}

		.route-arrow {
			transform: rotate(90deg);
		}

		.airport .name {
			max-width: 200px;
		}
	}
</style>
