// If 'next' types aren't installed in the environment, fall back to a minimal local type
// to avoid the "Cannot find module 'next'" TypeScript error.
type NextConfig = Record<string, unknown>;

const nextConfig: NextConfig = {};

export default nextConfig;
