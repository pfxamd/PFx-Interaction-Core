import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Local development and Playwright use /. GitHub Pages serves under the repository path.
  base: process.env.GITHUB_PAGES === 'true' ? '/PFx-Interaction-Core/' : '/',
});
