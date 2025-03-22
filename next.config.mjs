export default {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // When frontend calls /api/anything
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, // Proxy to backend API
      },
    ];
  },
};
