const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

let mode = 'development';
let plugins = [];

plugins.push(new HtmlWebpackPlugin({
	hash: true,
	minify: {
		html5: true,
		collapseWhitespace: true,
		removeComments: true
	},
	filename: 'index.html',
	template: __dirname + '/app/index.html'
}));

plugins.push(new MiniCssExtractPlugin({
	filename: 'style.css'
}));

if (process.env.NODE_ENV == 'production') {
	mode = 'production';

	plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
	plugins.push(new optimizeCSSAssetsPlugin({
		cssProcessor: require('cssnano'),
		cssProcessorOptions: {
			discardComments: {
				removeAll: true
			}
		},
		canPrint: true
	}));
}

module.exports = {
	mode,
	entry: {
		app: './app/js/builder.js',
		vendor: ['js-beautify']
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
	    splitChunks: {
	        cacheGroups: {
	            vendor: {
	                chunks: 'initial',
					name: 'vendor',
					test: 'vendor'
	            }
	        }
	    }
	},
	module: {
		rules: [
			// {
			// 	enforce: 'pre',
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	loader: 'eslint-loader',
			// },
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader'
				]
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
			},
			{
				test: /\.hbs$/,
				loader: "handlebars-loader"
			}
		]
	},
	plugins
}