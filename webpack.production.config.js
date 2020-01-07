const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
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

const srcFiles = glob.sync('./src/index.jsx');
const entries = {};
srcFiles.forEach(entry => {
    let name = entry.replace('./src/', '').replace('.jsx', '').replace('.js', '');

    entries[name] = entry;
});
module.exports = {
    entry: entries,
    output: {
        publicPath: './',
        path: path.join(__dirname, './docs'),
        filename: '[name]_[hash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                drop_console: false,
                drop_debugger: false
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title:"Antd Editor",
            template:"public/template.html"
        })
    ]
};
