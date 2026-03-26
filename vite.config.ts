import tailwindcss from '@tailwindcss/vite';
import { config } from 'dotenv';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));

// Base template, then `.env.secret` overrides (your client id / secret live here).
config({ path: resolve(root, '.env'), quiet: true });

config({
	path: resolve(root, '.env.secret'),
	override: true,
	quiet: true
});

export default defineConfig({ plugins: [tailwindcss(), sveltekit()] });
