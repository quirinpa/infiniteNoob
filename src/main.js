const io = require('./io');

io.question('What is your name, adventurer?', name => {
	const cName = io.color('cyan', name);
	io.log('Welcome to Infinite Winds, ' + cName + '.');
	io.processCommands(command => {
		if (command[0] === '/') {
			io.warn('Unknown command...');
		} else io.println(`${cName}: ${command}`);
	});
});

require('./mapGen');
