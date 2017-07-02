const isProduction = process.env.NODE_ENV === "production";
const webpack = require("webpack");

module.exports = {
  devtool: "source-map",
  entry: {
    daypicker: "./src/components/DatetimePicker.js"
  },
  output: {
    path: `${__dirname}/dist`,
    filename: `[name]${isProduction ? ".min" : ""}.js`,
    library: "DatetimePicker",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["react", "es2015", "stage-1"],
            plugins: [
              require("babel-plugin-transform-react-remove-prop-types").default
            ]
          }
        }
      }
    ]
  }
};
