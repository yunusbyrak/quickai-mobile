// Learn more https://docs.expo.io/guides/customizing-metro
const {
    wrapWithAudioAPIMetroConfig,
} = require('react-native-audio-api/metro-config');
const { getDefaultConfig } = require('expo/metro-config');

const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(wrapWithAudioAPIMetroConfig(config), { input: './global.css', inlineRem: 16 });
