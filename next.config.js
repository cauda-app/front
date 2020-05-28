const result = require('dotenv').config();
const withImages = require('next-images');
const withSourceMaps = require('@zeit/next-source-maps')();
const withOffline = require('next-offline');
const packageJson = require('./package.json');

module.exports = withOffline(
  withSourceMaps(
    withImages({
      env: result.parsed || {},
      publicRuntimeConfig: {
        version: packageJson.version,
        goToShopThreshold: 5,
      },
      experimental: {
        modern: true,
        polyfillsOptimization: true,
      },

      webpack(config, { dev, isServer }) {
        const splitChunks =
          config.optimization && config.optimization.splitChunks;
        if (splitChunks) {
          const cacheGroups = splitChunks.cacheGroups;
          const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
          if (cacheGroups.framework) {
            cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
              test: preactModules,
            });
            cacheGroups.commons.name = 'framework';
          } else {
            cacheGroups.preact = {
              name: 'commons',
              chunks: 'all',
              test: preactModules,
            };
          }
        }

        // inject Preact DevTools
        if (dev && !isServer) {
          const entry = config.entry;
          config.entry = () =>
            entry().then((entries) => {
              entries['main.js'] = ['preact/debug'].concat(
                entries['main.js'] || []
              );
              return entries;
            });
        }

        return config;
      },
    })
  )
);
