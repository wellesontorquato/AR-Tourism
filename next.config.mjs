/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // otimiza e evita que o Next tente “otimizar demais” imagens remotas sem config
  images: {
    remotePatterns: [
      // deixe pronto para você usar imagens externas futuramente (Cloudinary, etc.)
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ]
  },

  // headers úteis (PWA + segurança básica)
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [{ key: "Content-Type", value: "application/manifest+json" }]
      },
      {
        source: "/sw.js",
        headers: [{ key: "Content-Type", value: "application/javascript" }]
      }
    ];
  }
};

export default nextConfig;
