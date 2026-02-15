import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Habilita la exportación estática (SSG)
  images: {
    unoptimized: true, // Requerido para 'output: export'
  },
  // Desactivar SSR para que todo corra en el cliente como pidió el usuario
  reactStrictMode: true,
  basePath: '/valentines_day_yu_2026', 
  assetPrefix: '/valentines_day_yu_2026',
};

export default nextConfig;
