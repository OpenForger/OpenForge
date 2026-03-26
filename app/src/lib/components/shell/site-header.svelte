<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	type User = {
		githubId: string;
		login: string;
		avatarUrl: string | null;
	};

	let {
		user = null
	}: {
		user?: User | null;
	} = $props();

	const links = [
		{ href: '/requests', label: 'Requests' },
		{ href: '/submit', label: 'Submit' },
		{ href: '/profile', label: 'Profile' }
	] as const;

	function navCurrent(href: string): 'page' | undefined {
		const p = page.url.pathname;
		if (p === href) return 'page';
		if (href !== '/' && p.startsWith(href + '/')) return 'page';
		return undefined;
	}
</script>

<header
	class="flex min-h-14 flex-wrap items-center gap-x-4 gap-y-2 border-b border-border bg-card px-6 py-2"
>
	<a
		class="mr-auto text-lg font-semibold text-foreground no-underline hover:text-primary"
		href="/"
	>
		OpenForge
	</a>
	<nav aria-label="Primary">
		<ul class="m-0 flex list-none flex-wrap items-center gap-1 gap-x-4 p-0">
			{#each links as { href, label } (href)}
				<li>
					<a
						{href}
						aria-current={navCurrent(href)}
						class="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-foreground no-underline hover:bg-muted hover:text-primary aria-[current=page]:bg-muted aria-[current=page]:text-primary"
					>
						{label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<Separator orientation="vertical" class="mx-1 hidden h-5 sm:block" decorative />
	<div class="ms-auto flex flex-wrap items-center gap-2">
		{#if user}
			<a
				href="/profile"
				class="inline-flex items-center gap-2 no-underline text-inherit hover:opacity-90"
			>
				{#if user.avatarUrl}
					<img
						src={user.avatarUrl}
						alt=""
						width="28"
						height="28"
						class="block rounded-full"
					/>
				{/if}
				<span class="text-sm font-medium text-muted-foreground">{user.login}</span>
			</a>
			<form method="POST" action="/auth/logout">
				<Button type="submit" variant="ghost" size="sm">Sign out</Button>
			</form>
		{:else}
			<Button href="/auth/github" size="sm">Sign in with GitHub</Button>
		{/if}
	</div>
</header>
