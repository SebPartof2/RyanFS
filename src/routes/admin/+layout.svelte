<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';

	let { children, data } = $props();

	const navItems = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/feedback', label: 'Feedback' },
		{ href: '/admin/streams', label: 'Streams' }
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
					{item.label}
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
		padding: 0.75rem 1rem;
		color: #b0b0b0;
		text-decoration: none;
		border-radius: 6px;
		transition: all 0.2s ease;
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
