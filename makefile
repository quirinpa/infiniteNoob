run:
	webpack ./src/main.js ./static/main.js --watch &
	node server.js
