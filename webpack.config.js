const path = require("path");

module.exports = {
  // mode: "development",
  mode: "production",
  entry: "./src/main.js",
  output: {
    path: path.resolve("dist"),
    filename: "game.js",
    publicPath: "/dist/",
  },
  resolve: {
    extensions: [".js"],
  },
  devServer: {
    contentBase: path.join(__dirname, "."),
    compress: true,
    port: 8000,
  },
};
