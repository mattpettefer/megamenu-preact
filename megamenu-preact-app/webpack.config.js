const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'megamenu.js',
      library: {
        name: 'MegaMenu',
        type: 'umd',
        export: 'default',
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
    plugins: [
      // Only use HtmlWebpackPlugin in development mode
      ...(isProduction ? [] : [
        new HtmlWebpackPlugin({
          template: './src/index.html',
          inject: 'body',
        }),
      ]),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      hot: true,
    },
    // In production, don't include preact in the bundle
    // as it will be provided by WordPress
    externals: isProduction ? {
      preact: 'preact',
    } : {},
  };
};
