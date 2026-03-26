<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';

	let { data }: PageProps = $props();

	let demoTitle = $state('');

	const authError = $derived(page.url.searchParams.get('error'));
	const authErrorMessage = $derived.by(() => {
		switch (authError) {
			case 'oauth_state':
				return 'Sign-in was cancelled or the session expired. Try again.';
			case 'oauth_token':
				return 'GitHub did not return a token. Check the callback URL matches your OAuth app.';
			case 'oauth_user':
				return 'Could not load your GitHub profile. Try again.';
			case 'oauth_config':
				return 'OAuth is not configured: set GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET in web/.env.secret.';
			case 'auth_secret':
				return 'Set AUTH_SECRET in web/.env.secret (e.g. openssl rand -hex 32), save the file, then restart npm run dev.';
			default:
				return authError ? 'Sign-in failed.' : null;
		}
	});
</script>

<svelte:head>
	<title>Home · OpenForge</title>
	<meta name="description" content="OpenForge — community-driven OSS contribution platform" />
</svelte:head>

<div class="flex flex-col gap-8">
	{#if authErrorMessage}
		<Alert variant="destructive">
			<AlertDescription>{authErrorMessage}</AlertDescription>
		</Alert>
	{/if}

	<div class="flex flex-col gap-3">
		<h1 class="text-3xl font-semibold tracking-tight">OpenForge</h1>
		{#if data.user}
			<p class="m-0 text-sm text-muted-foreground">
				Signed in as <strong class="text-foreground">{data.user.login}</strong> — session cookie (30-day),
				GitHub OAuth ([M-AU-01]–[M-AU-03]).
			</p>
		{/if}
		<p class="text-sm text-muted-foreground">
			UI: <strong class="text-foreground">Tailwind CSS</strong> +
			<strong class="text-foreground">shadcn-svelte</strong> (nova). Tokens in
			<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">src/app.css</code>
			+ <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">docs/ui-ux/theming.md</code>.
		</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Component preview</CardTitle>
			<CardDescription>Primitives from the shared UI kit.</CardDescription>
		</CardHeader>
		<CardContent class="flex flex-col gap-4">
			<div class="flex flex-wrap items-center gap-2">
				<Button>Primary</Button>
				<Button variant="outline">Secondary</Button>
				<Button variant="ghost">Ghost</Button>
			</div>
			<Separator />
			<div class="flex flex-wrap gap-2">
				<Badge variant="open">Open</Badge>
				<Badge variant="in-review">In review</Badge>
				<Badge variant="merged">Merged</Badge>
				<Badge variant="blocker">Blocker</Badge>
				<Badge variant="suggestion">Suggestion</Badge>
			</div>
			<div class="flex max-w-lg flex-col gap-2">
				<Label for="demo-title">Request title (demo)</Label>
				<p class="m-0 text-xs text-muted-foreground">
					Form pattern for Sprint 2+; not wired to an API yet.
				</p>
				<Input
					id="demo-title"
					placeholder="Short descriptive title"
					bind:value={demoTitle}
				/>
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Profile timeline colours (DL-1.0)</CardTitle>
			<CardDescription>Use labels + dots; never rely on colour alone for meaning.</CardDescription>
		</CardHeader>
		<CardContent>
			<ul class="m-0 flex list-none flex-col gap-2 p-0">
				<li class="flex flex-wrap items-center gap-2 text-sm">
					<span
						class="inline-block size-2 shrink-0 rounded-full bg-[color:var(--color-data-pr-opened)]"
						aria-hidden="true"
					></span>
					<span
						>PR opened —
						<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">--data-activity-pr-opened</code
						></span
					>
				</li>
				<li class="flex flex-wrap items-center gap-2 text-sm">
					<span
						class="inline-block size-2 shrink-0 rounded-full bg-[color:var(--color-data-pr-merged)]"
						aria-hidden="true"
					></span>
					<span
						>PR merged —
						<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">--data-activity-pr-merged</code
						></span
					>
				</li>
				<li class="flex flex-wrap items-center gap-2 text-sm">
					<span
						class="inline-block size-2 shrink-0 rounded-full bg-[color:var(--color-data-review)]"
						aria-hidden="true"
					></span>
					<span
						>Review —
						<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">--data-activity-review</code></span
					>
				</li>
				<li class="flex flex-wrap items-center gap-2 text-sm">
					<span
						class="inline-block size-2 shrink-0 rounded-full bg-[color:var(--color-data-maintainer)]"
						aria-hidden="true"
					></span>
					<span
						>Maintainer —
						<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs"
							>--data-activity-maintainer</code
						></span
					>
				</li>
				<li class="flex flex-wrap items-center gap-2 text-sm">
					<span
						class="inline-block size-2 shrink-0 rounded-full bg-[color:var(--color-data-request)]"
						aria-hidden="true"
					></span>
					<span
						>Request submitted —
						<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">--data-activity-request</code></span
					>
				</li>
			</ul>
		</CardContent>
	</Card>

	<p class="text-sm text-muted-foreground">
		OAuth callback:
		<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">/auth/github/callback</code>
		·
		<a class="text-primary underline-offset-4 hover:underline" href="/docs/github-oauth-app">Setup guide</a>
	</p>
</div>
