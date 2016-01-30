"use strict";
const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc');
try {
	const config = JSON.parse(babelrc);
	require('babel-register')(config);
	require('./boot').default(config);
} catch (err) {
	console.error('Cannot parse .babelrc.');
	console.error(err);
}
