import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.scdn.co", "mosaic.scdn.co", "image-cdn-ak.spotifycdn.com"], // whitelist Spotify images
  },
  allowedDevOrigins: ["127.0.0.1:3000"],
};

export default nextConfig;