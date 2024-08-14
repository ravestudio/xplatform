/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    entry: "./src/index-dev.tsx",
    devtool: "inline-source-map",
    plugins: [
      new MiniCssExtractPlugin({
        filename: "components.css",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.dev.json",
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: isDevelopment
                ? "style-loader"
                : MiniCssExtractPlugin.loader,
            },
            { loader: "css-loader", options: { importLoaders: 1 } },
            //{ loader: "postcss-loader" },
            { loader: "sass-loader" },
          ],
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
      path: path.resolve(__dirname, "dist2"),
      filename: "components.js",
    },
    devServer: {
      /*open: true,*/
      static: {
        directory: path.join(__dirname, "public"),
      },

      compress: true,
      historyApiFallback: true,
      port: 9000,
    },
  };
};
