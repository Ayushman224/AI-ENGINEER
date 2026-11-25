import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' = relative asset URLs, so the build works at any sub-path (e.g. GitHub Pages /AI-ENGINEER/).
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] });
