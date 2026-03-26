<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>Requests · OpenForge</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-semibold tracking-tight">Requests</h1>
	<p class="text-sm text-muted-foreground">
		Discovery listing — Sprint 2 (WP-1.0). Good-first filters and sort will follow FR/NFR.
	</p>
	<Card>
		<CardContent class="pt-6">
			<p class="m-0 text-sm text-muted-foreground">
				Empty state: no requests yet. Link to submit will appear here.
			</p>
		</CardContent>
	</Card>
</div>
