// const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  function isDev() {
    return argv.mode === "development";
  }

  var config = {
    entry: "./src/index.js",

    output: {
      // path: path.resolve(__dirname, './distrib'),
      filename: "bundle.js"
    },

    plugins: [
      new CleanWebpackPlugin(),
      new MiniCSSExtractPlugin({
        filename: "bundle.css"
      })
    ],

    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true
            }
          }
        })
      ]
    },

    devtool: isDev() ? "cheap-module-source-map" : "source-map",

    // mode: 'production',

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  [
                    "@babel/preset-react",
                    {
                      pragma: "React.createElement",
                      pragmaFrag: "React.Fragment",
                      development: isDev()
                    }
                  ]
                ]
              }
            }
          ]
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCSSExtractPlugin.loader,
            'css-loader',  // va résoudre les imports et les url
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer()
                ]      
              }
            },
            'sass-loader'  // compile le sass vers css
          ]          
        }
      ]
    }
  };

  return config;
}; // fin module.exports
