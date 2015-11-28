import {system, chalk} from './interaction';

export const printIO = name => chalk.black(name);
export default class InteractiveObject {
	constructor(name, description) {
		this.name = name;
		this.description = description.replace(name, printIO(name));
	}
	print() {
		printIO(this.name);
	}
	view() {
		system(this.description);
	}
}
