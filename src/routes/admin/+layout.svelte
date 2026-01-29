<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';

	let { children, data } = $props();

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/admin/streams', label: 'Streams', icon: 'streams' },
		{ href: '/admin/flights', label: 'Flight Log', icon: 'flights' },
		{ href: '/admin/gallery', label: 'Gallery', icon: 'gallery' },
		{ href: '/admin/feedback', label: 'Feedback', icon: 'feedback' }
	];
</script>

<div class="admin-layout">
	<aside class="sidebar">
		<div class="sidebar-header">
			<a href="/" class="back-link">← Back to Site</a>
			<h2>Admin Panel</h2>
		</div>
		<nav>
			{#each navItems as item}
				<a href={item.href} class:active={$page.url.pathname === item.href}>
					{#if item.icon === 'dashboard'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="3" width="7" height="7"></rect>
							<rect x="14" y="3" width="7" height="7"></rect>
							<rect x="14" y="14" width="7" height="7"></rect>
							<rect x="3" y="14" width="7" height="7"></rect>
						</svg>
					{:else if item.icon === 'streams'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polygon points="23 7 16 12 23 17 23 7"></polygon>
							<rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
						</svg>
					{:else if item.icon === 'flights'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
						</svg>
					{:else if item.icon === 'gallery'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
							<circle cx="8.5" cy="8.5" r="1.5"></circle>
							<polyline points="21 15 16 10 5 21"></polyline>
						</svg>
					{:else if item.icon === 'feedback'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						</svg>
					{/if}
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
		<div class="sidebar-footer">
			<div class="user-info">
				{#if data.session?.user?.image}
					<img src={data.session.user.image} alt="Avatar" class="avatar" />
				{/if}
				<span>{data.session?.user?.name ?? 'Admin'}</span>
			</div>
			<button onclick={() => signOut()}>Sign Out</button>
		</div>
	</aside>
	<main class="admin-content">
		{@render children()}
	</main>
</div>

<style>
	.admin-layout {
		display: flex;
		min-height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	}

	.sidebar {
		width: 250px;
		background: rgba(0, 0, 0, 0.4);
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
	}

	.sidebar-header {
		margin-bottom: 2rem;
	}

	.back-link {
		font-size: 0.85rem;
		color: #888;
		text-decoration: none;
		display: block;
		margin-bottom: 0.5rem;
	}

	.back-link:hover {
		color: #4fc3f7;
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: #4fc3f7;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	nav a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		color: #b0b0b0;
		text-decoration: none;
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	nav a svg {
		flex-shrink: 0;
	}

	nav a:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	nav a.active {
		background: rgba(79, 195, 247, 0.2);
		color: #4fc3f7;
	}

	.sidebar-footer {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 1rem;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
	}

	.user-info span {
		font-size: 0.9rem;
		color: #e4e4e4;
	}

	.sidebar-footer button {
		width: 100%;
		padding: 0.5rem;
		background: rgba(244, 67, 54, 0.2);
		border: 1px solid rgba(244, 67, 54, 0.5);
		border-radius: 6px;
		color: #e57373;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.sidebar-footer button:hover {
		background: rgba(244, 67, 54, 0.3);
	}

	.admin-content {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.admin-layout {
			flex-direction: column;
		}

		.sidebar {
			width: 100%;
			border-right: none;
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		}

		nav {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>
