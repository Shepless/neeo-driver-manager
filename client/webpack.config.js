const path = require('path');
const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }]
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        'target': 'http://localhost:3001',
        'ws': true
      },
      '/socket.io': {
        'target': 'http://localhost:3001',
        'ws': true
      }
    },
    compress: true,
    historyApiFallback: true,
    open: true,
    // hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
  }
};
