import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Props bag plus optional `ref` for `bind:this` (shadcn-svelte pattern). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithElementRef<T> = T & { ref?: any };
