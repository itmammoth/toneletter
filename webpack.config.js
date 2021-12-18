const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const conf = {
    mode: "development",
    devServer: {
      port: 8080,
      open: true,
      static: {
        directory: path.join(__dirname, "docs"),
        watch: true,
      },
    },

    entry: {
      toneletter: [`./src/toneletter.js`],
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].min.js",
      library: "Toneletter",
      libraryExport: "default",
      libraryTarget: "umd",
      globalObject: "this",
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
      ],
    },
  };

  if (argv.mode !== "production") {
    conf.devtool = "inline-source-map";
  }

  return conf;
};
