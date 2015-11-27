import {println, chalk} from './interaction';

export default class Area {
	constructor(name = 'The Void', description = 'You are lost, nothing for you to do here, nowhere to go.', items = [], interactiveObjects = []) {
		this.name = name;
		this.description = description;
		this.items = items;
		this.interactiveObjects = interactiveObjects;
	}
	enter(character){
		const {name, description, items, interactiveObjects} = this;
		println(chalk.dim('walked to ' + name + '\n'), description);
		interactiveObjects.forEach(io => {
			const examine = io.getAction(['examine']);
			examine(character);
		});
		if (items && items.length) println('There are various objects laying around: ', items.join(', a '));
		return this;
	}
	getAction(command) {
		const io = this.interactiveObjects;
		for (let i = 0; i < io.length; i++) {
			const cio = io[i];
			if (cio.name === command.slice(1).join(' ')) {
				const actionResult = cio.getAction(command);
				if (actionResult) return actionResult;
			}
		}
		return false;
	}
}
