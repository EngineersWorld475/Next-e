export default {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/mock/:path*", // Mock API prefix
        destination: "/api/mock/:path*", // Keep request inside Next.js
      },
      {
        source: "/api/:path*", // When frontend calls /api/anything
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, // Proxy to backend API
      },
    ];
  },
};
