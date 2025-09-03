// // metro.config.js
// const { getDefaultConfig } = require("@react-native/metro-config");

// module.exports = getDefaultConfig(__dirname);

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
