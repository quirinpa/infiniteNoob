import {system, chalk, camelCase} from './interaction';

export const printItem = name => chalk.cyan(name);

export default class Item {
	constructor(name, description) {
		this.name = name;
		this.camelCasedName = camelCase(name);
		this.description = description;
		this.isItem = true;
	}
	print() {
		return printItem(this.name);
	}
	view() {
		system(this.description);
		return true;
	}
}
