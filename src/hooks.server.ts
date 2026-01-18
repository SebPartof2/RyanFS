import { SvelteKitAuth } from '@auth/sveltekit';
import Discord from '@auth/sveltekit/providers/discord';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Discord({
			clientId: DISCORD_CLIENT_ID,
			clientSecret: DISCORD_CLIENT_SECRET
		})
	],
	callbacks: {
		async jwt({ token, profile }) {
			if (profile) {
				token.discordId = profile.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.discordId) {
				session.user.discordId = token.discordId as string;
			}
			return session;
		}
	},
	trustHost: true
});
