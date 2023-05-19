console.info("#########", "mode:", process.env.NODE_ENV, "#########");

const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

// Extra plugins
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const commonPlugins = [
  new HtmlWebPackPlugin({
    favicon: "./public/favicon.ico",
    template: "./public/index.html",
    filename: "./index.html",
  }),
  new webpack.DefinePlugin({
    "process.env.REACT_APP_CONFIG": JSON.stringify(
      process.env.REACT_APP_CONFIG
    ),
  }),
];

const commonConfig = {
  entry: {
    "Odyssee-entry-index": "src/index.js",
    "Odyssee-entry-styles": "src/styles/index.scss",
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, "src/"),
    },
  },

  module: {
    rules: [
      // JS
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["lodash"],
            presets: [
              ["@babel/preset-env", { modules: false, targets: { node: 4 } }],
            ],
          },
        },
      },
      // CSS / SASS / SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // Images
      {
        test: /\.(png|svg|jpg|gif|cur)$/,
        type: "asset",
      },
    ],
  },

  devServer: {
    open: true,
    historyApiFallback: true,
    host: "localhost",
    port: 8080,
    hot: "only",
    client: {
      logging: "info",
      overlay: false,
      progress: true,
    },
  },
};

const development = {
  mode: "development",
  devtool: "eval-cheap-source-map",
  ...commonConfig,
  output: {
    publicPath: "/",
  },

  optimization: {
    runtimeChunk: "single",
  },
  plugins: commonPlugins,
};

const production = {
  mode: "production",

  ...commonConfig,

  output: {
    chunkFilename: "[name].chunk.js",
    publicPath: "/",
  },

  performance: {
    hints: "warning",
  },

  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
      maxSize: 240000,
    },
    removeEmptyChunks: true,
    minimizer: [new TerserPlugin()],
    runtimeChunk: "single",
  },

  plugins: [
    ...commonPlugins,
    new CompressionPlugin({
      algorithm: "gzip",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      defaultSizes: "gzip",
    }),
    new LodashModuleReplacementPlugin(),
  ],
};

const config = { development, production };

console.info(config[process.env.NODE_ENV]);

// Config de Webpack
module.exports = config[process.env.NODE_ENV];
