import { redirect } from '@sveltejs/kit';
import { exchangeCodeForToken, fetchGithubUser } from '$lib/server/github-oauth';
import { getAuthSecret } from '$lib/server/env';
import {
	createSessionToken,
	OAUTH_STATE_COOKIE,
	SESSION_COOKIE
} from '$lib/server/session';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const stored = cookies.get(OAUTH_STATE_COOKIE);
	cookies.delete(OAUTH_STATE_COOKIE, { path: '/' });

	if (!code || !state || !stored || state !== stored) {
		throw redirect(302, '/?error=oauth_state');
	}

	const origin = url.origin;
	let accessToken: string;
	try {
		accessToken = await exchangeCodeForToken(code, origin);
	} catch {
		throw redirect(302, '/?error=oauth_token');
	}

	let gh;
	try {
		gh = await fetchGithubUser(accessToken);
	} catch {
		throw redirect(302, '/?error=oauth_user');
	}

	let secret: string;
	try {
		secret = getAuthSecret();
	} catch {
		throw redirect(302, '/?error=auth_secret');
	}

	const sessionToken = createSessionToken(
		{
			githubId: String(gh.id),
			login: gh.login,
			avatarUrl: gh.avatar_url
		},
		secret
	);

	cookies.set(SESSION_COOKIE, sessionToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 30
	});

	throw redirect(302, '/');
};
