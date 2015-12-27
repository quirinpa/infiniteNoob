// require('babel-polyfill');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.babelrc')));
babelrc.plugins.push(['react-transform', {
	transforms: [{
		transform: 'react-transform-hmr',
		imports: ['react'],
		locals: ['module']
	}, {
		transform: 'react-transform-catch-errors',
		imports: ['react', 'redbox-react']
	}]
}]);

const hostNPort = 'localhost:8080';
module.exports = {
	devtool: 'inline-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		main: [
			'webpack-hot-middleware/client?path=http://' + hostNPort + '/__webpack_hmr',
		  './src/client.js'
		]
	},
	output: {
		filename: 'bundle.js',
    chunkFilename: '[name]-[chunkhash].js',
		path: path.resolve(__dirname, '../static/dist'),
		publicPath: 'http://' + hostNPort + '/dist/',
	},
	module: {
		loaders: [
			{ test: /\.js?$/, exclude: /node_modules/, loader: 'babel?' + JSON.stringify(babelrc) }
		]
	},
	progress: true,
	resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js']
  },
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
    }),
	],

};
