import Area from './src/Area';
import DeadBody from './src/DeadBody';
import DeadMouse from './src/DeadMouse';
import Inventory from './src/Inventory';

const shadystreet = new Area(
	'a shady street',
	'A dark shady street surrounds you.',
	[], [
		new DeadBody([new DeadMouse()]),
	]
);

let character = {
	pose: 'standing',
	inventory: new Inventory(),
};

import {println, chalk, question} from './src/interaction';

async function proceed() {
	const command = await question(chalk.red(character.name) + ':');
	process.stdout.write("\u001b[1A\u001b[K");
	if (command[0] === '\/') {
		const cmd = command.substr(1).split(' ');
		switch (cmd[0]) {
			case 'sit':
				if (character.pose === 'standing') {
					println(chalk.dim('You sat down.'));
					character.pose = 'sitting';
					break;
				}
				println(chalk.yellow('You are already sitting down.'));
				break;
			case 'stand':
				if (character.pose === 'sitting') {
					println(chalk.dim('You pull yourself up.'));
					character.pose = 'standing';
					break;
				}
				println(chalk.yellow('You are already standing up.'));
				break;
			case 'loot':
				const aio = character.currentArea.interactiveObjects;
				for (let i = 0; i < aio.length; i++) {
					const cio = aio[i];
					if (cio.name === cmd.slice(1).join(' ') && cio.inventory) {
						return cio.inventory.loot(character);
					}
				}
				break;
			case 'inventory':
				println(chalk.white('inventory') + ':', character.inventory.map(item => chalk.blue(item)).join(', '));
				break;
			default:
				const action = character.currentArea.getAction(cmd);
				if (!action) println(chalk.red('Unknown command.'));
				else action(character);
		}
	} else println(chalk.red(character.name) + ': ' + command);
}

async function game(command) {
	character.name = await question('Insert your character name:');
	character.currentArea = shadystreet.enter();
	while (true) await proceed();
};

game();
