module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          verbose: false,
        },
      ],
      'nativewind/babel',
      require.resolve('expo-router/babel'),
    ],
  }
}
