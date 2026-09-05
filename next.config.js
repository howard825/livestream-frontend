/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from any domain (for thumbnails if added later)
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
