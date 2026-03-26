/** Server-only config from process.env (populated via Vite + dotenv). */

export function getGithubOAuth(): { clientId: string; clientSecret: string } {
	const clientId = process.env.GITHUB_OAUTH_CLIENT_ID?.trim();
	const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET?.trim();
	if (!clientId || !clientSecret) {
		throw new Error(
			'Missing GITHUB_OAUTH_CLIENT_ID or GITHUB_OAUTH_CLIENT_SECRET. Add them to web/.env.secret (see .env.example).'
		);
	}
	return { clientId, clientSecret };
}

export function getAuthSecret(): string {
	const s = process.env.AUTH_SECRET?.trim();
	if (!s) {
		throw new Error(
			'Missing AUTH_SECRET. Generate with: openssl rand -hex 32 — add to web/.env.secret'
		);
	}
	return s;
}

/**
 * Must match **exactly** one "Authorization callback URL" in the GitHub OAuth App.
 * If unset, uses `{requestOrigin}/auth/github/callback` (so opening the site via
 * `127.0.0.1` vs `localhost` changes the URI — GitHub treats them as different).
 */
export function getOAuthRedirectUri(requestOrigin: string): string {
	const explicit = process.env.GITHUB_OAUTH_REDIRECT_URI?.trim();
	if (explicit) return explicit.replace(/\/$/, '');
	const origin = requestOrigin.replace(/\/$/, '');
	return `${origin}/auth/github/callback`;
}
