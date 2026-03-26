import type { Handle } from '@sveltejs/kit';
import { getAuthSecret } from '$lib/server/env';
import { parseSessionToken, SESSION_COOKIE } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;
	try {
		const secret = getAuthSecret();
		event.locals.user = parseSessionToken(event.cookies.get(SESSION_COOKIE), secret);
	} catch {
		// Missing AUTH_SECRET or bad cookie — treat as logged out
	}
	return resolve(event);
};
