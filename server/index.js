require('babel-polyfill');

const app = new (require('express'))();

import webpack from 'webpack';
import config from '../webpack';

const compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath,
}));
app.use(require('webpack-hot-middleware')(compiler));

import React from 'react';
import {
	renderToStaticMarkup,
	renderToString
} from 'react-dom/server';

import App from '../src/App';

const html = renderToStaticMarkup(
	<html>
		<head>
			<script src="dist/bundle.js" defer></script>
		</head>
		<body>
			<div
				id="content"
				dangerouslySetInnerHTML={
					{__html: renderToString(<App/>)}
				}>
			</div>
			...
		</body>
	</html>
);

app.get('/', (req, res, next) => {
	res.status(200).end(html);
});

app.listen(8080);

console.log('Server initialized.');
// let assets = {};
// compiler.plugin('emit', (compilation, callback) => {
// 	assets = compilation.assets;
// 	callback();
// });
// app.get('/*.js', (req, res, next) => {
// 	const file = req.path.substr(1);
// 	const content = assets[file].children[0]._value;
// 	// console.log('js request', file, content ? 200 : 404);
// 	if (!content) return res.status(404).end('content not found.');
// 	res.status(200).end(content);
// });
