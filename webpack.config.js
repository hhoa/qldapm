const path = require('path');
const glob = require("glob");
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'my-app': glob.sync('./app/**/*(*.js|*.css|*.html|*.png|*.jpg|*.ttf)'),
        //'media': glob.sync('./media/**/*(*.jpg|*.png|*.gif)')
    },
    output: {
        filename: '[name].bundle.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                //use: ['style-loader', 'css-loader']
                use: ExtractTextPlugin.extract({
                    loader: 'css-loader',
                    options: {
                        //minimize: true
                    }
                })
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {presets: ['env']},
                }],
            },
            {
                //test: /\.(html|jpg|png|gif|eot)$/,
                test: /\.(html|jpg|png|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: [ 'file-loader?name=[path][name].[ext]' ]
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].styles.min.css'),

        new webpack.optimize.CommonsChunkPlugin({
            //names: ['web-frontend', 'admin'],
            name: 'vendor',
            /*filename: '[name].bundle.js'*/
            //chunks: ['web-frontend', 'admin'],
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
        //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
        // })
    ]
};