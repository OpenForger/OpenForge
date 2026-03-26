import { createHmac, timingSafeEqual } from 'node:crypto';

export type SessionUser = {
	githubId: string;
	login: string;
	avatarUrl: string | null;
};

type Payload = {
	sub: string;
	login: string;
	avatar_url: string | null;
	exp: number;
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function createSessionToken(user: SessionUser, secret: string): string {
	const exp = Date.now() + THIRTY_DAYS_MS;
	const payload: Payload = {
		sub: user.githubId,
		login: user.login,
		avatar_url: user.avatarUrl,
		exp
	};
	const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
	const sig = createHmac('sha256', secret).update(body).digest('base64url');
	return `${body}.${sig}`;
}

export function parseSessionToken(token: string | undefined, secret: string): SessionUser | null {
	if (!token) return null;
	const last = token.lastIndexOf('.');
	if (last < 0) return null;
	const body = token.slice(0, last);
	const sig = token.slice(last + 1);
	const expected = createHmac('sha256', secret).update(body).digest('base64url');
	try {
		const a = Buffer.from(sig, 'utf8');
		const b = Buffer.from(expected, 'utf8');
		if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
	} catch {
		return null;
	}
	let payload: Payload;
	try {
		payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Payload;
	} catch {
		return null;
	}
	if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return null;
	if (!payload.sub || !payload.login) return null;
	return {
		githubId: payload.sub,
		login: payload.login,
		avatarUrl: payload.avatar_url ?? null
	};
}

export const SESSION_COOKIE = 'of_session';
export const OAUTH_STATE_COOKIE = 'oauth_state';
