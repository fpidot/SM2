// craco.config.js

const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "fs": false,
          "path": require.resolve("path-browserify"),
          "zlib": require.resolve("browserify-zlib"),
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "http": require.resolve("stream-http"),
          "os": require.resolve("os-browserify/browser"),
          "querystring": require.resolve("querystring-es3"),
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    }
  }
};
