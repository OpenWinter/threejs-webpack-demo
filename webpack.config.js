const { join, resolve } = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require("webpack");
module.exports = {
  devtool: "eval-source-map",
  entry: "./src/main.js",
  output: {
    path: join(__dirname + "/dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: join(__dirname, 'static'),
    port: 8080,
    hot: true,
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, './static'),
        to: '',
        ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(jpg|png|gltf|glb)$/,
        loader: "file-loader"
      }
    ]
  }
};
