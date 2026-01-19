<script lang="ts">
	import { page } from '$app/stores';

	let { children, data } = $props();

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/setup', label: 'Setup' },
		{ href: '/reviews', label: 'Reviews' },
		{ href: '/about', label: 'About Me' },
		{ href: '/news', label: 'News' },
		{ href: '/airports', label: 'Airports' },
		{ href: '/feedback', label: 'Feedback' }
	];

	const socials = [
		{ href: 'https://www.youtube.com/@RyanFSOfficial', label: 'YouTube', icon: 'youtube' },
		{ href: 'https://discord.gg/z3MnVshZQ7', label: 'Discord', icon: 'discord' }
	];
</script>

<svelte:head>
	<title>RyanFS - Flight Sim Streamer</title>
	<meta name="description" content="RyanFS - Flight Simulation Streaming" />
</svelte:head>

<div class="app">
	<header>
		<a href="/" class="logo">
			<span>RyanFS</span>
			<img src="/RyanFS.jpg" alt="RyanFS Logo" />
		</a>
		<nav>
			{#each navItems as item}
				<a href={item.href} class:active={$page.url.pathname === item.href}>
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="socials">
			{#each socials as social}
				<a href={social.href} target="_blank" rel="noopener noreferrer" title={social.label} class="social-link">
					{#if social.icon === 'youtube'}
						<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
							<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
						</svg>
					{:else if social.icon === 'discord'}
						<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
							<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
						</svg>
					{/if}
				</a>
			{/each}
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<div class="footer-content">
			<p>&copy; {new Date().getFullYear()} RyanFS. All rights reserved.</p>
			<a href="/admin" class="credit-link">Site Created by @SebPartof2</a>
			<div class="footer-socials">
				{#each socials as social}
					<a href={social.href} target="_blank" rel="noopener noreferrer">
						{social.label}
					</a>
				{/each}
			</div>
		</div>
	</footer>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		color: #e4e4e4;
		min-height: 100vh;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 2rem;
		background: rgba(0, 0, 0, 0.3);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		text-decoration: none;
	}

	.logo img {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		object-fit: cover;
	}

	.logo span {
		font-size: 1.6rem;
		font-weight: 700;
		color: #4fc3f7;
		letter-spacing: 2px;
	}

	nav {
		display: flex;
		gap: 1.5rem;
	}

	nav a {
		color: #b0b0b0;
		text-decoration: none;
		font-size: 0.95rem;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	nav a:hover {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.1);
	}

	nav a.active {
		color: #4fc3f7;
		background: rgba(79, 195, 247, 0.1);
	}

	.socials {
		display: flex;
		gap: 1.25rem;
	}

	.social-link {
		color: #b0b0b0;
		transition: color 0.2s ease;
	}

	.social-link:hover {
		color: #ffffff;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	footer {
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.3);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer-content p {
		color: #888;
		font-size: 0.9rem;
	}

	.footer-socials {
		display: flex;
		gap: 1.5rem;
	}

	.footer-socials a {
		color: #888;
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.2s ease;
	}

	.footer-socials a:hover {
		color: #4fc3f7;
	}

	.credit-link {
		color: #555;
		text-decoration: none;
		font-size: 0.8rem;
		transition: color 0.2s ease;
	}

	.credit-link:hover {
		color: #888;
	}

	@media (max-width: 900px) {
		header {
			flex-wrap: wrap;
			gap: 1rem;
			padding: 1rem;
		}

		.logo {
			order: 1;
		}

		.socials {
			order: 2;
		}

		nav {
			order: 3;
			width: 100%;
			justify-content: center;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		nav a {
			font-size: 0.85rem;
			padding: 0.4rem 0.8rem;
		}
	}

	@media (max-width: 600px) {
		.footer-content {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.logo img {
			width: 40px;
			height: 40px;
		}

		.logo span {
			font-size: 1.3rem;
		}
	}
</style>
