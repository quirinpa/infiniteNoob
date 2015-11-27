import {println, chalk} from './interaction';
export default class InteractiveObject {
	constructor(props){
		const {name, description, actions} = props;
		this.name = name;
		this.description = description;
		const examine = {
			alias: ['examine', 'lookat', 'investigate'],
			callback: () => println(chalk.dim(description), ...this.actions.map(action => '[' + chalk.cyan(action.alias[0]) + ']'))
		};
		this.actions = [
			...(actions || []),
			examine,
		];
	}
	getAction(command) {
		for (let j = 0; j < this.actions.length; j++) {
			const cac = this.actions[j];

			for (let k = 0; k < cac.alias.length; k++) {
				if (command[0] === cac.alias[k]) {
					// console.log('found action', '\'' + command[0] + '\'', 'on this instance of', this.name);
					return cac.callback;
				}
			}
		}
		return false;
	}
}
