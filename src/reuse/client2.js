const io = require('./io');

'<command> <arg1:Type> <arg2:Type> ...';

io.question('What is your name, adventurer?', name => {
	const cName = io.color('cyan', name);
	io.log('Welcome to Infinite Winds, ' + cName + '.');
	io.processCommands((text, cmd, args) => {
		if (text) return io.send(`${cName}: ${text}`);
	});
});

require('./map/index2.js');
// require('./map');
