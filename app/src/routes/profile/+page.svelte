<script lang="ts">
	import type { PageProps } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Profile · OpenForge</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-semibold tracking-tight">Your profile</h1>
	{#if data.user}
		<Card>
			<CardHeader>
				<CardTitle>GitHub @{data.user.login}</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="m-0 text-sm text-muted-foreground">
					Contributor / reviewer aggregates will appear here (Sprint 7). Identity matches [FR-GH-02].
				</p>
			</CardContent>
		</Card>
	{:else}
		<p class="text-sm text-muted-foreground">Sign in with GitHub to see your profile.</p>
		<Button href="/auth/github">Sign in with GitHub</Button>
	{/if}
</div>
