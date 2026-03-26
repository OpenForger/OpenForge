<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	type Orient = "horizontal" | "vertical";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "horizontal" as Orient,
		decorative = false,
		"data-slot": dataSlot = "separator",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: Orient;
		decorative?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot={dataSlot}
	data-orientation={orientation}
	role={decorative ? "none" : "separator"}
	aria-orientation={decorative ? undefined : orientation}
	aria-hidden={decorative ? true : undefined}
	class={cn(
		"shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
		className
	)}
	{...restProps}
></div>
