"use strict";
const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "3000";

loaders.push({
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader?importLoaders=1'],
    exclude: ['node_modules']
});

loaders.push({
    test: /\.less$/,
    loaders: ['style-loader', 'css-loader?importLoaders=1', 'less-loader'],
    exclude: ['node_modules']
});


const srcFiles = glob.sync('./src/**/*.+(jsx|js)');
const entries = {};
srcFiles.forEach(entry => {
    let name = entry.replace('./src/', '').replace('.jsx', '').replace('.js', '');

    entries[name] = entry;
});
// const srcFiles2 = glob.sync('./node_modules/@souche-f2e/**/*.jsx');
// srcFiles2.forEach(entry => {
//     let name = entry.replace('./node_modules/', '').replace('.jsx', '');
//
//     entries[name] = entry;
// });

// const htmls = srcFiles.map(entry => {
//     let name = entry.replace('./pages/', '').replace('.jsx', '');
//
//     return new HtmlWebpackPlugin({
//         filename: `${name}.html`,
//         template: './template.html',
//         chunks: [ name ]
//     })
// });
console.log(entries)
module.exports = {
    entry: entries,
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'public'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
      loaders
    },
    devServer: {
        contentBase: "./public",
        // do not print bundle build stats
        noInfo: true,
        // enable HMR
        hot: true,
        // embed the webpack-dev-server runtime into the bundle
        inline: true,
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: PORT,
        host: HOST,

    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title:"Antd Editor",
            template:"public/template.html"
        }),
        new DashboardPlugin()
    ]
};
