// const { CracoAliasPlugin } = require('react-app-alias');

// module.exports = {
//   plugins: [
//     {
//       plugin: CracoAliasPlugin,
//       options: {
//         source: 'tsconfig',
//         baseUrl: './src', // tsconfig.json에서 baseUrl이 './src'이므로 동일하게 맞춤
//         tsConfigPath: './tsconfig.json', // tsconfig.json을 참조하도록 변경
//       },
//     },
//   ],
// };

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({
            configFile: './tsconfig.json',  // tsconfig.json 경로 확인
          }));
          return webpackConfig;
        }
      }
    }
  ]
};