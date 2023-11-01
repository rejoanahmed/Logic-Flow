/** @type {import('next').NextConfig} */
if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`
}
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
