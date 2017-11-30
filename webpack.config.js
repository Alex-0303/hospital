const
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	BabelMinifyPlugin = require('babel-minify-webpack-plugin'),
	path = require('path'),
	webpack = require('webpack');

module.exports = {
	entry: {
		main: [path.resolve(__dirname, 'src/app.js')]
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				query: {compact: false}
			}, {
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					extractCSS: true
				}
			}, {
				test: /\.s?css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader", 
					use: ["css-loader", "sass-loader"]
				})
			}, {
				test: /\.(gif|png|jpg|woff2?|)$/,
				loader: 'url-loader?limit=8192&name=[name].[ext]'
			}, {
				test: /\.svg$/,
				include: [/styles[\\\/]layouts[\\\/]images/],
				loader: 'file-loader?name=[name].[ext]'
			}, {
				test: /\.svg$/,
				exclude: [/styles[\\\/]layouts[\\\/]images/],
				loader: 'svg-sprite-loader'
			}
		]
	},
	output: {
		path: path.resolve(__dirname,'dist/assets'),
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				BROWSER: JSON.stringify(true),
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new BabelMinifyPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendors',
			minChunks: module => { return module.context && module.context.indexOf('node_modules') !== -1; }
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin("[name].css"),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html')
		})
	],
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'styles': path.resolve(__dirname, './styles')
		},
		extensions: [ '.js', '.vue', '.scss' ]
	},
    "devServer": {
        contentBase: path.join(__dirname, 'dist/assets'),
        "historyApiFallback": true,
        "https": false
    }
};