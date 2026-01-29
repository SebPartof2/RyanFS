<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let uploading = $state(false);
	let dragOver = $state(false);
	let fileInput: HTMLInputElement;

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;

		if (e.dataTransfer?.files) {
			fileInput.files = e.dataTransfer.files;
			fileInput.form?.requestSubmit();
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}
</script>

<div class="gallery-admin">
	<div class="header">
		<h1>Gallery Management</h1>
		<p class="subtitle">Upload and manage gallery images (stored in Cloudflare R2)</p>
	</div>

	<div class="upload-section">
		<form
			method="POST"
			action="?/upload"
			enctype="multipart/form-data"
			use:enhance={() => {
				uploading = true;
				return async ({ update }) => {
					await update();
					uploading = false;
				};
			}}
		>
			<div
				class="dropzone"
				class:dragover={dragOver}
				role="button"
				tabindex="0"
				ondrop={handleDrop}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				onclick={() => fileInput.click()}
				onkeydown={(e) => e.key === 'Enter' && fileInput.click()}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="17 8 12 3 7 8"></polyline>
					<line x1="12" y1="3" x2="12" y2="15"></line>
				</svg>
				<p>Drag and drop images here, or click to select</p>
				<span class="hint">Max 10MB per image. Supports JPG, PNG, GIF, WebP</span>
				<input
					bind:this={fileInput}
					type="file"
					name="files"
					accept="image/*"
					multiple
					hidden
					onchange={(e) => e.currentTarget.form?.requestSubmit()}
				/>
			</div>
			{#if uploading}
				<div class="uploading">
					<div class="spinner"></div>
					<span>Uploading...</span>
				</div>
			{/if}
		</form>
	</div>

	<div class="images-section">
		<h2>Images ({data.images.length})</h2>

		{#if data.images.length === 0}
			<div class="empty-state">
				<p>No images uploaded yet. Upload some images above to get started.</p>
			</div>
		{:else}
			<div class="images-grid">
				{#each data.images as image}
					<div class="image-card">
						<div class="image-preview">
							<img src={image.thumbnailUrl} alt={image.name} loading="lazy" />
						</div>
						<div class="image-info">
							<span class="image-name" title={image.name}>{image.name}</span>
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									return async ({ update }) => {
										await update();
									};
								}}
							>
								<input type="hidden" name="key" value={image.key} />
								<button type="submit" class="delete-btn" title="Delete image">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="3 6 5 6 21 6"></polyline>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
									</svg>
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.gallery-admin {
		max-width: 1200px;
		margin: 0 auto;
	}

	.header {
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 1.75rem;
		color: #fff;
	}

	.subtitle {
		margin: 0;
		color: #888;
		font-size: 0.95rem;
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		color: #fff;
	}

	.upload-section {
		margin-bottom: 2rem;
	}

	.dropzone {
		border: 2px dashed rgba(79, 195, 247, 0.3);
		border-radius: 12px;
		padding: 3rem 2rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		background: rgba(0, 0, 0, 0.2);
	}

	.dropzone:hover,
	.dropzone.dragover {
		border-color: #4fc3f7;
		background: rgba(79, 195, 247, 0.1);
	}

	.dropzone svg {
		color: #4fc3f7;
		margin-bottom: 1rem;
	}

	.dropzone p {
		margin: 0 0 0.5rem 0;
		color: #e4e4e4;
		font-size: 1rem;
	}

	.dropzone .hint {
		color: #888;
		font-size: 0.85rem;
	}

	.uploading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1rem;
		color: #4fc3f7;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(79, 195, 247, 0.3);
		border-top-color: #4fc3f7;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.images-section {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 12px;
		padding: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: #888;
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.image-card {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: all 0.2s ease;
	}

	.image-card:hover {
		border-color: rgba(79, 195, 247, 0.5);
	}

	.image-preview {
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.5);
	}

	.image-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem;
		gap: 0.5rem;
	}

	.image-name {
		font-size: 0.8rem;
		color: #b0b0b0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	.delete-btn {
		background: none;
		border: none;
		color: #888;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.delete-btn:hover {
		color: #e57373;
		background: rgba(244, 67, 54, 0.2);
	}

	@media (max-width: 600px) {
		.images-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}

		.dropzone {
			padding: 2rem 1rem;
		}
	}
</style>
