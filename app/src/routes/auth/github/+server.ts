import { randomBytes } from 'node:crypto';
import { redirect } from '@sveltejs/kit';
import { getAuthSecret, getGithubOAuth } from '$lib/server/env';
import { buildAuthorizeUrl } from '$lib/server/github-oauth';
import { OAUTH_STATE_COOKIE } from '$lib/server/session';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		getGithubOAuth();
	} catch {
		throw redirect(302, '/?error=oauth_config');
	}

	try {
		getAuthSecret();
	} catch {
		throw redirect(302, '/?error=auth_secret');
	}

	const state = randomBytes(32).toString('hex');
	cookies.set(OAUTH_STATE_COOKIE, state, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: url.protocol === 'https:',
		maxAge: 600
	});
	const location = buildAuthorizeUrl({ origin: url.origin, state });
	throw redirect(302, location);
};
