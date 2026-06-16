/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'localhost:3000'
  ]
};

if (process.env.NEXT_PUBLIC_APP_URL) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_APP_URL);
    if (!nextConfig.allowedDevOrigins.includes(url.host)) {
      nextConfig.allowedDevOrigins.push(url.host);
    }
  } catch (e) {
    // Ignore invalid URL
  }
}

export default nextConfig;
