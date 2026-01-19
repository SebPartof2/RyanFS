<script lang="ts">
	import airports from '$lib/airports.json';
	import type { Airport } from '$lib/airports';

	const airportData = airports as Record<string, Airport>;

	let searchQuery = $state('');
	let selectedAirport = $state<Airport | null>(null);
	let searchResults = $state<{ code: string; airport: Airport }[]>([]);

	function search() {
		const query = searchQuery.trim().toUpperCase();
		if (query.length < 2) {
			searchResults = [];
			selectedAirport = null;
			return;
		}

		// Direct match by code
		if (airportData[query]) {
			selectedAirport = airportData[query];
			searchResults = [];
			return;
		}

		// Search by name, IATA, ICAO, or city
		const results: { code: string; airport: Airport }[] = [];
		for (const [code, airport] of Object.entries(airportData)) {
			const matchesCode = code.includes(query) || airport.iata?.includes(query);
			const matchesName = airport.name.toUpperCase().includes(query);
			const matchesRegion = airport.region.toUpperCase().includes(query);

			if (matchesCode || matchesName || matchesRegion) {
				results.push({ code, airport });
				if (results.length >= 20) break;
			}
		}

		searchResults = results;
		selectedAirport = null;
	}

	function selectAirport(code: string, airport: Airport) {
		selectedAirport = airport;
		searchQuery = code;
		searchResults = [];
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			search();
		}
	}
</script>

<svelte:head>
	<title>Airport Lookup | RyanFS</title>
</svelte:head>

<div class="airports-page">
	<div class="container">
		<h1>Airport Lookup</h1>
		<p class="subtitle">Search by ICAO code, IATA code, airport name, or city</p>

		<div class="search-box">
			<input
				type="text"
				bind:value={searchQuery}
				onkeydown={handleKeydown}
				oninput={search}
				placeholder="Enter airport code or name..."
				class="search-input"
			/>
		</div>

		{#if searchResults.length > 0}
			<div class="search-results">
				{#each searchResults as { code, airport }}
					<button class="result-item" onclick={() => selectAirport(code, airport)}>
						<span class="result-code">{code}</span>
						<span class="result-name">{airport.name}</span>
						<span class="result-location">{airport.region}, {airport.country}</span>
					</button>
				{/each}
			</div>
		{/if}

		{#if selectedAirport}
			<div class="airport-card">
				<div class="airport-header">
					<h2>{selectedAirport.name}</h2>
					<div class="airport-codes">
						{#if selectedAirport.icao}
							<span class="code icao">{selectedAirport.icao}</span>
						{/if}
						{#if selectedAirport.iata}
							<span class="code iata">{selectedAirport.iata}</span>
						{/if}
					</div>
				</div>

				<div class="airport-details">
					<div class="detail-row">
						<span class="label">Location</span>
						<span class="value">{selectedAirport.region}, {selectedAirport.country}</span>
					</div>
					<div class="detail-row">
						<span class="label">Coordinates</span>
						<span class="value">{selectedAirport.lat.toFixed(4)}°, {selectedAirport.lon.toFixed(4)}°</span>
					</div>
				</div>

				<div class="airport-map">
					<iframe
						title="Airport location map"
						src="https://www.openstreetmap.org/export/embed.html?bbox={selectedAirport.lon - 0.1},{selectedAirport.lat - 0.05},{selectedAirport.lon + 0.1},{selectedAirport.lat + 0.05}&layer=mapnik&marker={selectedAirport.lat},{selectedAirport.lon}"
						width="100%"
						height="300"
						frameborder="0"
					></iframe>
				</div>

				{#if selectedAirport.icao}
					<div class="airport-links">
						<a
							href="https://skyvector.com/airport/{selectedAirport.icao}"
							target="_blank"
							rel="noopener noreferrer"
							class="link-btn"
						>
							SkyVector Charts
						</a>
					</div>
				{/if}
			</div>
		{/if}

		{#if !selectedAirport && searchResults.length === 0 && searchQuery.length >= 2}
			<div class="no-results">
				<p>No airports found matching "{searchQuery}"</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.airports-page {
		min-height: 100vh;
		padding: 2rem;
	}

	.container {
		max-width: 800px;
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

	.search-box {
		margin-bottom: 1rem;
	}

	.search-input {
		width: 100%;
		padding: 1rem 1.5rem;
		font-size: 1.1rem;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		color: #fff;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.search-input:focus {
		border-color: #4fc3f7;
	}

	.search-input::placeholder {
		color: #666;
	}

	.search-results {
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 1.5rem;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		color: #fff;
		cursor: pointer;
		text-align: left;
		transition: background 0.2s ease;
	}

	.result-item:last-child {
		border-bottom: none;
	}

	.result-item:hover {
		background: rgba(79, 195, 247, 0.1);
	}

	.result-code {
		font-family: monospace;
		font-size: 0.9rem;
		color: #4fc3f7;
		min-width: 50px;
	}

	.result-name {
		flex: 1;
		font-size: 0.95rem;
	}

	.result-location {
		font-size: 0.85rem;
		color: #888;
	}

	.airport-card {
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		overflow: hidden;
	}

	.airport-header {
		padding: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.airport-header h2 {
		font-size: 1.5rem;
		color: #fff;
		margin: 0 0 0.75rem 0;
	}

	.airport-codes {
		display: flex;
		gap: 0.75rem;
	}

	.code {
		padding: 0.35rem 0.75rem;
		border-radius: 4px;
		font-family: monospace;
		font-size: 0.9rem;
		font-weight: bold;
	}

	.code.icao {
		background: rgba(79, 195, 247, 0.2);
		color: #4fc3f7;
	}

	.code.iata {
		background: rgba(129, 199, 132, 0.2);
		color: #81c784;
	}

	.airport-details {
		padding: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
	}

	.detail-row .label {
		color: #888;
	}

	.detail-row .value {
		color: #fff;
		font-family: monospace;
	}

	.airport-map {
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.airport-map iframe {
		display: block;
		filter: invert(90%) hue-rotate(180deg);
	}

	.airport-links {
		padding: 1.25rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.link-btn {
		padding: 0.6rem 1.25rem;
		background: rgba(79, 195, 247, 0.15);
		border: 1px solid rgba(79, 195, 247, 0.3);
		border-radius: 6px;
		color: #4fc3f7;
		text-decoration: none;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.link-btn:hover {
		background: rgba(79, 195, 247, 0.25);
		border-color: #4fc3f7;
	}

	.no-results {
		text-align: center;
		padding: 2rem;
		color: #888;
	}

	@media (max-width: 600px) {
		.airports-page {
			padding: 1rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		.result-item {
			flex-wrap: wrap;
		}

		.result-location {
			width: 100%;
			margin-top: 0.25rem;
		}

		.airport-links {
			flex-direction: column;
		}

		.link-btn {
			text-align: center;
		}
	}
</style>
