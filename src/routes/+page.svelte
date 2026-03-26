<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div class="stack">
	<h1 style="margin: 0; font-size: 1.75rem; font-weight: 600;">OpenForge web</h1>
	<p class="muted">
		SvelteKit + <strong>bits-ui</strong> (headless, same family as shadcn-svelte) and
		<strong>CSS variables</strong> — no Tailwind. Style in <code>src/app.css</code> and scoped
		<code>&lt;style&gt;</code> blocks.
	</p>

	<div class="surface stack">
		<p class="muted" style="margin: 0">Example primitive:</p>
		<div class="cluster">
			<Button type="button" variant="primary">{#snippet children()}Primary{/snippet}</Button>
			<Button type="button">{#snippet children()}Secondary{/snippet}</Button>
		</div>
	</div>

	<p class="muted">
		Docs:
		<a href="https://svelte.dev/docs/kit">SvelteKit</a>
		·
		<a href="https://bits-ui.com">bits-ui</a>
	</p>
</div>
