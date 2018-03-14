const babelOptions = {
  "presets": ["env","react", "stage-0"]
};
const autoprefixer = require("autoprefixer");

module.exports = {
  entry: "./src/index",
  output: {
    filename: "./dist/bundle.js",
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: babelOptions
          }
        ]
      },
      {
        test: /\.json$/,
        exclude: /(node_modules)/,
        loader: "json-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".jsx", ".js", "json"]
  },
  devServer: {
    host: "localhost",
    port: 7000,
    disableHostCheck: true,
    historyApiFallback: {
      disableDotRule: true
    }
  }
};