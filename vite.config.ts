import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Fallback for any process.env access in dependencies to prevent crashes in the browser
  define: {
    'process.env': JSON.stringify({}),
  },
  server: {
    host: true
  },
  base: '/'
});
