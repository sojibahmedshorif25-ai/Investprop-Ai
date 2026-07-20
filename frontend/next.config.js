/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com', 'images.unsplash.com', 'fakestoreapi.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
