import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/floodsense-ai/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.OPENWEATHER_API_KEY': JSON.stringify(env.OPENWEATHER_API_KEY),
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(env.GOOGLE_MAPS_API_KEY),
      'process.env.TWILIO_ACCOUNT_SID': JSON.stringify(env.TWILIO_ACCOUNT_SID),
      'process.env.TWILIO_AUTH_TOKEN': JSON.stringify(env.TWILIO_AUTH_TOKEN),
      'process.env.TWILIO_PHONE_NUMBER': JSON.stringify(env.TWILIO_PHONE_NUMBER),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
