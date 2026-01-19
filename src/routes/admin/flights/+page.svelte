<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
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

	function getTodayDate(): string {
		return new Date().toISOString().split('T')[0];
	}
</script>

<svelte:head>
	<title>Flight Log Admin | RyanFS</title>
</svelte:head>

<div class="admin-flights">
	<div class="header">
		<h1>Flight Log</h1>
		<a href="/admin" class="back-link">Back to Admin</a>
	</div>

	<div class="add-form-section">
		<h2>Add New Flight</h2>
		<form method="POST" action="?/add" use:enhance class="add-form">
			<div class="form-row">
				<div class="form-group">
					<label for="origin">Origin (ICAO)</label>
					<input type="text" id="origin" name="origin" required maxlength="4" placeholder="KJFK" />
				</div>
				<div class="form-group">
					<label for="destination">Destination (ICAO)</label>
					<input type="text" id="destination" name="destination" required maxlength="4" placeholder="KLAX" />
				</div>
				<div class="form-group">
					<label for="callsign">Callsign</label>
					<input type="text" id="callsign" name="callsign" required placeholder="DAL123" />
				</div>
			</div>
			<div class="form-row">
				<div class="form-group">
					<label for="landing_type">Landing</label>
					<select id="landing_type" name="landing_type" required>
						<option value="smooth">Butter</option>
						<option value="dent">Dent</option>
						<option value="crater">Crater</option>
					</select>
				</div>
				<div class="form-group">
					<label for="flight_date">Flight Date</label>
					<input type="date" id="flight_date" name="flight_date" value={getTodayDate()} required />
				</div>
			</div>
			<div class="form-group full-width">
				<label for="notes">Notes (optional)</label>
				<textarea id="notes" name="notes" rows="2" placeholder="Any notes about the flight..."></textarea>
			</div>
			<button type="submit" class="submit-btn">Add Flight</button>
		</form>
	</div>

	<div class="flights-section">
		<h2>All Flights ({data.flights.length})</h2>
		{#if data.flights.length === 0}
			<p class="empty">No flights logged yet.</p>
		{:else}
			<div class="flights-table">
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Callsign</th>
							<th>Route</th>
							<th>Landing</th>
							<th>Notes</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.flights as flight}
							<tr>
								<td class="date">{formatDate(flight.flight_date)}</td>
								<td class="callsign">{flight.callsign}</td>
								<td class="route">
									<span class="icao">{flight.origin}</span>
									<span class="arrow">-></span>
									<span class="icao">{flight.destination}</span>
								</td>
								<td>
									<span class="landing-badge {flight.landing_type}">{getLandingLabel(flight.landing_type)}</span>
								</td>
								<td class="notes">{flight.notes || '-'}</td>
								<td>
									<form method="POST" action="?/delete" use:enhance class="delete-form">
										<input type="hidden" name="id" value={flight.id} />
										<button type="submit" class="delete-btn">Delete</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style>
	.admin-flights {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2rem;
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

	h2 {
		font-size: 1.25rem;
		color: #4fc3f7;
		margin: 0 0 1rem 0;
	}

	.back-link {
		color: #4fc3f7;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.add-form-section {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.add-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.form-group {
		flex: 1;
		min-width: 150px;
	}

	.form-group.full-width {
		flex-basis: 100%;
	}

	label {
		display: block;
		font-size: 0.85rem;
		color: #888;
		margin-bottom: 0.4rem;
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 0.6rem 0.8rem;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		color: #fff;
		font-size: 0.95rem;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #4fc3f7;
	}

	input::placeholder,
	textarea::placeholder {
		color: #555;
	}

	select {
		cursor: pointer;
	}

	select option {
		background: #1a1a2e;
	}

	.submit-btn {
		align-self: flex-start;
		padding: 0.7rem 1.5rem;
		background: #4fc3f7;
		color: #000;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.submit-btn:hover {
		background: #81d4fa;
	}

	.flights-section {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 1.5rem;
	}

	.empty {
		color: #888;
		text-align: center;
		padding: 2rem;
	}

	.flights-table {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	th {
		color: #888;
		font-weight: 600;
		font-size: 0.85rem;
		text-transform: uppercase;
	}

	td {
		color: #ddd;
		font-size: 0.9rem;
	}

	.date {
		white-space: nowrap;
	}

	.callsign {
		font-family: monospace;
		color: #4fc3f7;
		font-weight: 600;
	}

	.route {
		font-family: monospace;
	}

	.route .icao {
		color: #fff;
	}

	.route .arrow {
		color: #555;
		margin: 0 0.3rem;
	}

	.landing-badge {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
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

	.notes {
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #888;
	}

	.delete-form {
		display: inline;
	}

	.delete-btn {
		padding: 0.3rem 0.6rem;
		background: transparent;
		border: 1px solid rgba(229, 115, 115, 0.3);
		color: #e57373;
		border-radius: 4px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.delete-btn:hover {
		background: rgba(229, 115, 115, 0.2);
		border-color: #e57373;
	}

	@media (max-width: 768px) {
		.admin-flights {
			padding: 1rem;
		}

		.form-row {
			flex-direction: column;
		}

		.form-group {
			min-width: 100%;
		}

		th,
		td {
			padding: 0.5rem;
			font-size: 0.8rem;
		}

		.notes {
			max-width: 100px;
		}
	}
</style>
