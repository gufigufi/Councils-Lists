import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        // 👇 Добавлена строка для разрешения вашего хоста
        allowedHosts: ['dymacademy.xyz'],
        port: 5173,
        proxy: {
            '/api': {
                target: 'https://api.dymacademy.xyz',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api')
            }
        }
    }
});