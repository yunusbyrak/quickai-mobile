module.exports = function (api) {
    api.cache(true);
    let plugins = [
        'react-native-worklets/plugin'
    ];

    return {
        presets: [['babel-preset-expo', { jsxImportSource: 'nativewind', reanimated: false }], 'nativewind/babel'],

        plugins,
    };
};
