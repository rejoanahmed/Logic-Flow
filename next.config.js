/** @type {import('next').NextConfig} */
const nextConfig = {
  // disabling strict mode since the examples use
  // useEffect with no dependencies to ensure the function
  // is only run once and only run on the client.
  reactStrictMode: false,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ['static.ably.dev', 'lh3.googleusercontent.com/']
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil'
    })
    return config
  },
  experimental: {
    esmExternals: 'loose'
  },
  staticPageGenerationTimeout: 600,
  transpilePackages: ['@ably/spaces']
}

module.exports = nextConfig
