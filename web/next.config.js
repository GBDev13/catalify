/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'img.freepik.com', 's3-alpha-sig.figma.com', 'digital-catalog-images.s3.sa-east-1.amazonaws.com']
  }
}

module.exports = nextConfig
