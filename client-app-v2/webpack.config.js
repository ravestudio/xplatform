/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    entry: "./src/index.tsx",
    mode: "development",
    devtool: "source-map",
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        inlineSource: ".(js|css)$",
      }),
      new MiniCssExtractPlugin({
        filename: "index.css",
      }),
    ],
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        { test: /\.(html)$/, use: ["html-loader"] },
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.module.css$/,
          use: [
            {
              loader: isDevelopment
                ? "style-loader"
                : MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
                importLoaders: 1,
                modules: {
                  namedExport: false,
                  exportLocalsConvention: "as-is",
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                },
              },
            },
          ],
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: isDevelopment
                ? "style-loader"
                : MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: isDevelopment,
              },
            },
            //{ loader: "postcss-loader" },
            { loader: "sass-loader", options: { sourceMap: isDevelopment } },
          ],
          exclude: /\.module\.css$/,
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: "url-loader?name=[name].[ext]",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "bundle.js",
    },
    devServer: {
      /*open: true,*/
      static: {
        directory: path.join(__dirname, "public"),
      },

      compress: true,
      historyApiFallback: true,
      port: 9000,

      proxy: [
        {
          context: ["/api"],
          target: "http://192.168.0.17:80",
        },
      ],
    },
  };
};
