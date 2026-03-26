<script lang="ts">
	import { Button } from 'bits-ui';
	import type { ComponentProps } from 'svelte';

	type RootProps = ComponentProps<typeof Button.Root>;

	let {
		class: className = '',
		variant = 'default',
		children,
		...rest
	}: RootProps & { variant?: 'default' | 'primary' } = $props();

	const merged = $derived(
		['btn', variant === 'primary' ? 'btn-primary' : '', className].filter(Boolean).join(' ')
	);
</script>

<Button.Root class={merged} {...rest}>
	{@render children?.()}
</Button.Root>
