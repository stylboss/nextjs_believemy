/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      env: {
        mongodb_username: 'believemy',
        mongodb_password: 'XHF7ap58D2kfgB7a',
        mongodb_db: 'portfolio',
        NEXTAUTH_URL: 'http://localhost:3000',
      },
    };
  }
  return {
    reactStrictMode: true,
    env: {
      mongodb_username: 'believemy',
      mongodb_password: 'XHF7ap58D2kfgB7a',
      mongodb_db: 'portfolio',
      NEXTAUTH_URL: 'http://localhost:3000',
    },
  };
};

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = nextConfig;