const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {AureliaPlugin, ModuleDependenciesPlugin} = require('aurelia-webpack-plugin');
const environment = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
const envSettings = require('./env.' + environment + '.js');

module.exports = {
    entry: {"main": "aurelia-bootstrapper"},
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js"
    },
    resolve: {
        extensions: [".js"],
        modules: ["src", "node_modules"].map(x => path.resolve(x)),
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                loaders: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [['env', {modules: false}]],
                    plugins: ['transform-class-properties', 'transform-decorators-legacy']
                }
            },
            {test: /\.(css)$/i, use: ["style-loader", "css-loader"]},
            {test: /\.(html)$/i, use: "html-loader"},
            {test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader?name=fonts/[hash].[ext]'},
            {test: /\.(png|jpeg|jpg)$/, loader: 'file-loader?name=images/[hash].[ext]'},
            {test: /\.(json)$/, loader: 'file-loader?name=locales/[hash].[ext]'}
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(require("./package.json").version),
            __SETTINGS__: JSON.stringify(envSettings.settings),
            __ENVIRONMENT__: JSON.stringify(environment)
        }),
        new webpack.ProvidePlugin({
            regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new ModuleDependenciesPlugin({ // https://github.com/aurelia/dialog/issues/254
            "aurelia-framework": ['aurelia-dialog'],
            "aurelia-dialog": ['./ai-dialog', './ai-dialog-header', './ai-dialog-body',
                './ai-dialog-footer', './attach-focus']
        }),
        new AureliaPlugin(),
        new HtmlWebpackPlugin({
            template: '!html-webpack-plugin/lib/loader!index.html',
            filename: 'index.html'
        })
    ],
};