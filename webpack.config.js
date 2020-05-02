const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    contentScript: "./src/contentScript.ts",
    background: "./src/background.ts",
  },
  devtool: "inline-source-map",
  plugins: [new CopyWebpackPlugin([{ from: "public" }])],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
};
