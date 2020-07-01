const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = [
  {
    entry: './src/index.ts',
    // devtool: 'source-map',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    externals: [nodeExternals()],
    target: 'node',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'build/server')
    }
  },
  {
    entry: './src/services/ErrorQueue/index.ts',
    devtool: 'source-map',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    externals: [nodeExternals()],
    target: 'node',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'build/task')
    }
  }
];
