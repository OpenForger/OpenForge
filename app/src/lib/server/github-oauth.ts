import { getGithubOAuth, getOAuthRedirectUri } from './env';

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';
const GITHUB_USER = 'https://api.github.com/user';

const DEFAULT_SCOPE = 'read:user';

export function buildAuthorizeUrl(params: {
	origin: string;
	state: string;
}): string {
	const { clientId } = getGithubOAuth();
	const redirectUri = getOAuthRedirectUri(params.origin);
	const u = new URL(GITHUB_AUTHORIZE);
	u.searchParams.set('client_id', clientId);
	u.searchParams.set('redirect_uri', redirectUri);
	u.searchParams.set('scope', DEFAULT_SCOPE);
	u.searchParams.set('state', params.state);
	u.searchParams.set('allow_signup', 'true');
	return u.toString();
}

export async function exchangeCodeForToken(code: string, origin: string): Promise<string> {
	const { clientId, clientSecret } = getGithubOAuth();
	const redirectUri = getOAuthRedirectUri(origin);
	const res = await fetch(GITHUB_TOKEN, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri
		})
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`GitHub token exchange failed: ${res.status} ${t}`);
	}
	const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
	if (data.error) {
		throw new Error(data.error_description ?? data.error);
	}
	if (!data.access_token) {
		throw new Error('No access_token from GitHub');
	}
	return data.access_token;
}

export async function fetchGithubUser(accessToken: string): Promise<{
	id: number;
	login: string;
	avatar_url: string | null;
}> {
	const res = await fetch(GITHUB_USER, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/vnd.github+json'
		}
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`GitHub user fetch failed: ${res.status} ${t}`);
	}
	return res.json() as Promise<{ id: number; login: string; avatar_url: string | null }>;
}
