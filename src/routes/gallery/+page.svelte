<script lang="ts">
	let { data } = $props();

	let selectedImage = $state<string | null>(null);

	function openLightbox(url: string) {
		selectedImage = url;
	}

	function closeLightbox() {
		selectedImage = null;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeLightbox();
		}
	}
</script>

<svelte:head>
	<title>Gallery | RyanFS</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="gallery-page">
	<div class="container">
		<h1>Gallery</h1>
		<p class="subtitle">Screenshots and photos from my flights</p>

		{#if data.images.length === 0}
			<div class="empty-state">
				<p>No photos yet. Check back soon!</p>
			</div>
		{:else}
			<div class="gallery-grid">
				{#each data.images as image}
					<button class="gallery-item" onclick={() => openLightbox(image.url)}>
						<img src={image.thumbnailUrl} alt={image.name} loading="lazy" />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

{#if selectedImage}
	<div class="lightbox" onclick={closeLightbox} role="dialog" aria-modal="true">
		<button class="lightbox-close" onclick={closeLightbox} aria-label="Close">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
		<img src={selectedImage} alt="Full size" onclick={(e) => e.stopPropagation()} />
	</div>
{/if}

<style>
	.gallery-page {
		min-height: 100vh;
		padding: 2rem;
	}

	.container {
		max-width: 1200px;
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

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #888;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.gallery-item {
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.3);
		cursor: pointer;
		padding: 0;
		transition: all 0.3s ease;
	}

	.gallery-item:hover {
		transform: scale(1.02);
		border-color: #4fc3f7;
		box-shadow: 0 8px 32px rgba(79, 195, 247, 0.2);
	}

	.gallery-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.lightbox {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.95);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 2rem;
	}

	.lightbox img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 8px;
	}

	.lightbox-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: #fff;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s ease;
	}

	.lightbox-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	@media (max-width: 600px) {
		.gallery-page {
			padding: 1rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		.gallery-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
