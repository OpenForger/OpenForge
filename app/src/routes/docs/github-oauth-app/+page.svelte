<script lang="ts">
	import guide from '../../../../../docs/deployment/github-oauth-app.md?raw';
	import { Card, CardContent } from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>GitHub OAuth App setup · OpenForge</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-6">
	<h1 class="text-2xl font-semibold tracking-tight">GitHub OAuth App setup</h1>
	<p class="text-sm text-muted-foreground">
		Source:
		<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">docs/deployment/github-oauth-app.md</code>
		(plain text below). Open the same file in the repo for proper Markdown preview.
	</p>
	<Card>
		<CardContent class="p-0">
			<pre
				class="m-0 max-h-[min(70vh,40rem)] overflow-auto whitespace-pre-wrap rounded-lg border-0 bg-muted/30 p-4 font-mono text-xs leading-relaxed">{guide}</pre>
		</CardContent>
	</Card>
	<p class="text-sm text-muted-foreground">
		<a class="text-primary underline-offset-4 hover:underline" href="https://github.com/settings/developers"
			>GitHub Developer Settings</a
		>
		·
		<a class="text-primary underline-offset-4 hover:underline" href="/">Home</a>
	</p>
</div>
