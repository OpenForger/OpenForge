<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		for: htmlFor,
		children,
		...restProps
	}: WithElementRef<HTMLLabelAttributes> & { children?: import("svelte").Snippet } = $props();
</script>

<label
	bind:this={ref}
	data-slot="label"
	for={htmlFor}
	class={cn(
		"flex select-none items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</label>
