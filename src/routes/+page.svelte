<script lang="ts">
	let { data } = $props();

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
</script>

<div class="home">
	<section class="hero">
		<h1>Welcome to RyanFS</h1>
		<p>Flight Simulation Streaming</p>
	</section>

	{#if data.vatsim}
		<section class="vatsim-status">
			<h2>VATSIM Status</h2>
			{#if data.vatsim.online && 'callsign' in data.vatsim}
				<div class="flight-status live">
					<div class="live-badge">LIVE ON VATSIM</div>
					<div class="flight-info">
						<span class="callsign">{data.vatsim.callsign}</span>
						<span class="route">{data.vatsim.departure} → {data.vatsim.arrival}</span>
						<span class="route-names">{data.vatsim.departureName} → {data.vatsim.arrivalName}</span>
					</div>
					<div class="flight-details">
						<div class="detail">
							<span class="detail-value">{data.vatsim.aircraft}</span>
							<span class="detail-label">Aircraft</span>
						</div>
						<div class="detail">
							<span class="detail-value">{(data.vatsim.altitude ?? 0).toLocaleString()} ft</span>
							<span class="detail-label">Altitude</span>
						</div>
						<div class="detail">
							<span class="detail-value">{data.vatsim.groundspeed ?? 0} kts</span>
							<span class="detail-label">Ground Speed</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="flight-status offline">
					<div class="offline-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
						</svg>
					</div>
					<span class="offline-text">Not currently flying on VATSIM</span>
					<a href="https://stats.vatsim.net/stats/1864478" target="_blank" rel="noopener noreferrer" class="stats-link">
						View VATSIM Stats
					</a>
				</div>
			{/if}
		</section>
	{/if}

	<section class="landing-tracker">
		<h2>Landing Tracker</h2>
		<div class="landing-stats">
			<div class="landing-stat smooth">
				<span class="landing-count">{data.landingStats.smooth}</span>
				<span class="landing-label">Butter</span>
			</div>
			<div class="landing-stat dent">
				<span class="landing-count">{data.landingStats.dent}</span>
				<span class="landing-label">Dents</span>
			</div>
			<div class="landing-stat crater">
				<span class="landing-count">{data.landingStats.crater}</span>
				<span class="landing-label">Craters</span>
			</div>
		</div>
		<a href="/flights" class="view-all-link">View Flight Log</a>
	</section>

	<section class="schedule">
		<h2>Upcoming Streams</h2>
		{#if data.upcomingStreams.length === 0}
			<p class="no-streams">No streams scheduled yet. Check back soon!</p>
		{:else}
			<div class="stream-list">
				{#each data.upcomingStreams as stream (stream.id)}
					<a href={stream.url ?? '#'} target="_blank" rel="noopener noreferrer" class="stream-card">
						{#if stream.thumbnail}
							<img src={stream.thumbnail} alt={stream.title} class="stream-thumbnail" />
						{/if}
						<div class="stream-content">
							<div class="stream-date">{formatDate(stream.scheduled_at)}</div>
							<h3>{stream.title}</h3>
							{#if stream.description}
								<p>{stream.description}</p>
							{/if}
							<div class="stream-meta">
								<span class="platform">{stream.platform}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>

	{#if data.pastStreams.length > 0}
		<section class="past-streams">
			<h2>Past Streams</h2>
			<div class="past-stream-grid">
				{#each data.pastStreams as stream (stream.id)}
					<a href={stream.url ?? '#'} target="_blank" rel="noopener noreferrer" class="past-stream-card">
						{#if stream.thumbnail}
							<img src={stream.thumbnail} alt={stream.title} class="past-thumbnail" />
						{:else}
							<div class="past-thumbnail-placeholder">
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<polygon points="5 3 19 12 5 21 5 3"></polygon>
								</svg>
							</div>
						{/if}
						<div class="past-stream-info">
							<h4>{stream.title}</h4>
							<span class="past-date">{formatDate(stream.scheduled_at)}</span>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.home {
		width: 100%;
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.hero {
		text-align: center;
		padding: 2rem 0;
	}

	.hero h1 {
		font-size: 3rem;
		color: #fff;
		margin: 0 0 0.5rem 0;
	}

	.hero p {
		font-size: 1.25rem;
		color: #888;
		margin: 0;
	}

	.vatsim-status {
		text-align: center;
	}

	.vatsim-status h2 {
		font-size: 1.5rem;
		color: #4fc3f7;
		margin: 0 0 1.5rem 0;
	}

	.flight-status {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1.5rem;
	}

	.flight-status.live {
		border-color: rgba(76, 175, 80, 0.5);
	}

	.live-badge {
		display: inline-block;
		background: #4caf50;
		color: #fff;
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.flight-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 1.25rem;
	}

	.callsign {
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
	}

	.route {
		font-size: 1.1rem;
		color: #4fc3f7;
	}

	.route-names {
		font-size: 0.85rem;
		color: #888;
	}

	.flight-details {
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	.detail {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.detail-value {
		font-size: 1.1rem;
		font-weight: 600;
		color: #fff;
	}

	.detail-label {
		font-size: 0.8rem;
		color: #888;
		margin-top: 0.25rem;
	}

	.flight-status.offline {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.offline-icon {
		color: #555;
	}

	.offline-text {
		color: #888;
		font-size: 1rem;
	}

	.stats-link {
		color: #4fc3f7;
		text-decoration: none;
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}

	.stats-link:hover {
		text-decoration: underline;
	}

	.landing-tracker {
		text-align: center;
		margin-bottom: 2rem;
	}

	.landing-tracker h2 {
		font-size: 1.5rem;
		color: #4fc3f7;
		margin: 0 0 1rem 0;
	}

	.landing-stats {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.landing-stat {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1rem 1.5rem;
		min-width: 80px;
	}

	.landing-stat.smooth {
		border-color: rgba(129, 199, 132, 0.3);
	}

	.landing-stat.dent {
		border-color: rgba(255, 183, 77, 0.3);
	}

	.landing-stat.crater {
		border-color: rgba(229, 115, 115, 0.3);
	}

	.landing-count {
		display: block;
		font-size: 1.75rem;
		font-weight: 700;
	}

	.landing-stat.smooth .landing-count {
		color: #81c784;
	}

	.landing-stat.dent .landing-count {
		color: #ffb74d;
	}

	.landing-stat.crater .landing-count {
		color: #e57373;
	}

	.landing-label {
		font-size: 0.8rem;
		color: #888;
	}

	.view-all-link {
		color: #4fc3f7;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.view-all-link:hover {
		text-decoration: underline;
	}

	.schedule h2 {
		font-size: 1.5rem;
		color: #4fc3f7;
		margin: 0 0 1.5rem 0;
		text-align: center;
	}

	.no-streams {
		text-align: center;
		color: #888;
		padding: 2rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}

	.stream-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.stream-card {
		display: flex;
		gap: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		overflow: hidden;
		text-decoration: none;
		transition: border-color 0.2s ease, transform 0.2s ease;
	}

	.stream-card:hover {
		border-color: rgba(79, 195, 247, 0.3);
		transform: translateY(-2px);
	}

	.stream-thumbnail {
		width: 240px;
		aspect-ratio: 16/9;
		object-fit: cover;
		flex-shrink: 0;
	}

	.stream-content {
		padding: 1rem;
		flex: 1;
	}

	.stream-date {
		font-size: 0.85rem;
		color: #4fc3f7;
		margin-bottom: 0.5rem;
	}

	.stream-card h3 {
		font-size: 1.2rem;
		color: #fff;
		margin: 0 0 0.5rem 0;
	}

	.stream-card p {
		color: #aaa;
		font-size: 0.95rem;
		margin: 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.stream-meta {
		display: flex;
		gap: 1rem;
		align-items: center;
		font-size: 0.9rem;
	}

	.platform {
		color: #888;
		text-transform: capitalize;
	}

	.past-streams {
		text-align: center;
	}

	.past-streams h2 {
		font-size: 1.5rem;
		color: #4fc3f7;
		margin: 0 0 1.5rem 0;
	}

	.past-stream-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}

	.past-stream-card {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		overflow: hidden;
		text-decoration: none;
		transition: border-color 0.2s ease, transform 0.2s ease;
		display: flex;
		flex-direction: column;
	}

	.past-stream-card:hover {
		border-color: rgba(79, 195, 247, 0.3);
		transform: translateY(-2px);
	}

	.past-thumbnail {
		width: 100%;
		aspect-ratio: 16/9;
		display: block;
		object-fit: cover;
	}

	.past-thumbnail-placeholder {
		width: 100%;
		aspect-ratio: 16/9;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #555;
	}

	.past-stream-info {
		padding: 0.75rem 1rem;
	}

	.past-stream-info h4 {
		font-size: 0.9rem;
		color: #fff;
		margin: 0 0 0.35rem 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-align: left;
		line-height: 1.3;
	}

	.past-date {
		font-size: 0.8rem;
		color: #888;
		display: block;
		text-align: left;
	}

	@media (max-width: 600px) {
		.hero h1 {
			font-size: 2rem;
		}

		.hero p {
			font-size: 1rem;
		}

		.flight-details {
			gap: 1rem;
		}

		.callsign {
			font-size: 1.25rem;
		}

		.route {
			font-size: 1rem;
		}

		.route-names {
			font-size: 0.75rem;
		}

		.detail-value {
			font-size: 1rem;
		}

		.stream-card {
			flex-direction: column;
		}

		.stream-thumbnail {
			width: 100%;
			height: auto;
			aspect-ratio: 16/9;
		}

		.past-stream-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 601px) and (max-width: 800px) {
		.past-stream-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
