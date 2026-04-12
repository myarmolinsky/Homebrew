const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/android\/app\/build\/.*/];

module.exports = config;
