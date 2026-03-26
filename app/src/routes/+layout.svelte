<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/shell/site-header.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	class="bg-primary text-primary-foreground focus-visible:ring-ring absolute start-4 top-4 z-50 -translate-y-[120%] rounded-md px-4 py-2 font-semibold transition-transform focus:translate-y-0 focus-visible:ring-2 focus-visible:outline-none"
	href="#main"
>
	Skip to content
</a>
<div class="flex min-h-dvh flex-col">
	<SiteHeader user={data.user} />
	<main class="mx-auto w-full max-w-6xl flex-1 px-6 py-6" id="main">
		{@render children()}
	</main>
</div>
