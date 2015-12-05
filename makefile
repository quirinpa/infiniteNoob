run:
	webpack -d ./src/main.js ./static/main.js --watch &
	node server.js
