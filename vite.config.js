import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), loadVersion()],
});
