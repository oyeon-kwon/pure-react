const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash:8].[ext]',
    clean: true,
  },
  devtool: devMode ? 'eval-source-map' : false,
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    client: {
      overlay: true,
      progress: true,
    },
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', { targets: 'defaults' }]],
                plugins: devMode ? ['react-refresh/babel'] : [],
              },
            },
          },
          {
            test: /\.css$/i,
            use: [
              devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
            ],
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10000,
              },
            },
          },
          {
            type: 'asset/resource',
            exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/, /^$/],
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          template: 'public/index.html',
        },
        !devMode
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      )
    ),
    new InterpolateHtmlPlugin({ PUBLIC_URL: '' }),
  ].concat(
    devMode ? [new ReactRefreshWebpackPlugin()] : [new MiniCssExtractPlugin()]
  ),
};