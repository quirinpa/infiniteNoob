
import React from 'react';

import {
	renderToStaticMarkup,
	renderToString
} from 'react-dom/server';

import { match, RouterContext } from 'react-router';
import routes from '../src/routes';

const getHtml = renderProps => renderToStaticMarkup(
	<html>
		<head><script src="bundle.js" defer></script></head>
		<body>
			<h1>bitch</h1>
			<div id="content"
				key="provider"
				dangerouslySetInnerHTML={{__html: renderToString(
					<RouterContext  {...renderProps} />
				)}} />...
		</body>
	</html>
);

export default (req, res) => {
	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (error) return res.status(500).send(error.message);
		if (redirectLocation) return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		if (renderProps) return res.status(200).send(getHtml(renderProps));
		res.status(404).send('Not found');
	});
};
