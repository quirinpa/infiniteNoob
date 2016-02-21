// require('babel-polyfill');
// const fs = require('fs');
// const path = require('path');
const webpack = require('webpack');
// const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.babelrc')));
const hostNPort = 'localhost:8080';

export default babelrc => ({
	devtool: 'inline-source-map',
	entry: {
		main: [
			'webpack-hot-middleware/client?path=http://' + hostNPort + '/__webpack_hmr',
			'./src/client.js'
		]
	},
	output: {
		filename: 'bundle.js',
	},
	module: {
		loaders: [
			{ test: /\.js?$/, exclude: /node_modules/, loader: 'babel?' + JSON.stringify({
				...babelrc,
				plugins: babelrc.plugins.concat([
					['react-transform', {
						transforms: [{
							transform: 'react-transform-hmr',
							imports: ['react'],
							locals: ['module']
						}, {
							transform: 'react-transform-catch-errors',
							imports: ['react', 'redbox-react']
						}]
					}]
				])
			}) }
		]
	},
	progress: true,
	resolve: {
		modulesDirectories: [/*'src', */'node_modules'],
		extensions: ['', '.js']
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.IgnorePlugin(/webpack-stats\.json$/),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			// __DEVELOPMENT__: true,
		}),
	],
});
