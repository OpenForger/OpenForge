// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				githubId: string;
				login: string;
				avatarUrl: string | null;
			} | null;
		}
		interface PageData {
			user: {
				githubId: string;
				login: string;
				avatarUrl: string | null;
			} | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
