import {system, chalk} from './interaction';

export default class GameObj {
	constructor(name, description, color = 'white') {
		this.name = name;
		this.description = description;
		this.color = color;
		this.coloredName = chalk[this.color](name);
	}
	view() {
		system(this.description.replace(this.name, this.coloredName));
	}
	print() {
		return chalk[this.color](this.name);
	}
}
