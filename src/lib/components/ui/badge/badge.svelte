<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:ring-[3px] [&>svg]:pointer-events-none",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
				secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
				destructive: "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
				outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
				ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
				link: "text-primary underline-offset-4 hover:underline",
				/* OpenForge — request / review semantics (DL theming) */
				open: "border-border border-[color:var(--color-state-open)] bg-background text-[color:var(--color-state-open)] capitalize",
				"in-review":
					"border-primary bg-primary/10 text-primary capitalize dark:bg-primary/15",
				merged:
					"border-[color:var(--color-state-merged)] bg-[color-mix(in_oklab,var(--color-state-merged)_12%,transparent)] text-[color:var(--color-state-merged)] capitalize",
				solved:
					"border-[color:var(--color-state-solved)] bg-[color-mix(in_oklab,var(--color-state-solved)_12%,transparent)] text-[color:var(--color-state-solved)] capitalize",
				stale:
					"border-[color:var(--color-state-stale)] bg-[color-mix(in_oklab,var(--color-state-stale)_12%,transparent)] text-[color:var(--color-state-stale)] capitalize",
				closed:
					"border-border border-[color:var(--color-state-closed)] bg-background text-[color:var(--color-state-closed)] capitalize",
				blocker:
					"border-destructive/50 bg-destructive/10 text-destructive capitalize dark:bg-destructive/20",
				concern:
					"border-[color:var(--color-state-stale)] bg-[color-mix(in_oklab,var(--color-state-stale)_12%,transparent)] text-[color:var(--color-state-stale)] capitalize",
				suggestion: "border-border border-muted-foreground/40 bg-background text-muted-foreground capitalize",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
