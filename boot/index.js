require('babel-polyfill');

const app = new (require('express'))();
import react from './react';
import webpack from 'webpack';
import makeConfig from './webpack';

export default babelrc => {
	const config = makeConfig(babelrc);
	const compiler = webpack(config);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath,
	}));
	app.use(require('webpack-hot-middleware')(compiler));

	app.use('/', react);

	console.log('Server initialized.');
	app.listen(8080);
};
