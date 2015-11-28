import Area from './src/Area';
import DeadBody from './src/DeadBody';
import DeadMouse from './src/DeadMouse';
import Character from './src/Character';
import Container from './src/Container';

const shadystreet = new Area(
	'a shady street',
	'A dark shady street surrounds you.',
	[], [
		new DeadBody([new DeadMouse()]),
	]
);

import {println, chalk, question} from './src/interaction';

function noSuchThing() {
	println(chalk.dim('You can\'t do such a thing...'));
}

const player = new Character(question('Enter your character name:'));
println(chalk.dim('Welcome to infinity.'));
const currentArea = shadystreet.enter();
/* eslint-disable no-constant-condition */
/* eslint-disable no-loop-func */
while (true) {
	const command = question(chalk.blue(player.name + ':'));
	process.stdout.write('\u001b[1A\u001b[K');
	if (command[0] === '\/') {
		const cmd = command.substr(1).split(' ');
		switch (cmd[0]) {
		case 'sit':
			player.sit();
			break;
		case 'stand':
			player.stand();
			break;
		case 'loot':
			let foundContainer = false;
			for (let i = 0; i < currentArea.ios.length && !foundContainer; i++) {
				const io = currentArea.ios[i];
				if (io instanceof Container && io.name === cmd.slice(1).join(' ')) {
					player.loot(io);
					foundContainer = true;
				}
			}
			if (!foundContainer) noSuchThing();
			break;
		case 'drop':

			break;
		case 'inventory':
			player.inventory.print();
			break;
		default:
			noSuchThing();
			// const action = currentArea.getAction(cmd);
			// if (!action) println(chalk.red('Unknown command.'));
			// else action(character);
		}
	} else println(chalk.blue(player.name + ': ') + command);
}
