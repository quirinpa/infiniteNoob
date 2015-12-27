"use strict";
const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc');
let config;

try {
	config = JSON.parse(babelrc);
} catch (err) {
	console.error('Cannot parse .babelrc.');
	console.error(err);
}

require('babel-register')(config);
require('./server/index');
// const basePath = require('path').resolve(__dirname, 'src')
// console.log(__dirname);
// global.webpackIsomorphicTools = new (require('webpack-isomorphic-tools'))(
// 	require('./webpack/isomorphic')
// ).development(true).server('../src', () => {
	// require('./server/index');
// });
