import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Habilita la exportación estática (SSG)
  images: {
    unoptimized: true, // Requerido para 'output: export'
  },
  // Desactivar SSR para que todo corra en el cliente como pidió el usuario
  reactStrictMode: true,
};

export default nextConfig;
